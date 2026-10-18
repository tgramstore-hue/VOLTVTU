import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * POST /api/paystack/create-dva
 * Creates a Paystack Dedicated Virtual Account (DVA) for the authenticated user.
 * Called once at first dashboard load if user has no virtual account yet.
 */
export async function POST(request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Paystack secret key not configured' }, { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Verify authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a real virtual account (10-digit number)
    const { data: profile } = await supabase
      .from('profiles')
      .select('virtual_account_number, virtual_account_bank, virtual_account_name, full_name, email, phone')
      .eq('id', user.id)
      .maybeSingle();

    // If they already have a proper Paystack DVA, return it
    if (profile?.virtual_account_number && profile.virtual_account_number.length === 10 && 
        profile.virtual_account_bank && profile.virtual_account_bank !== 'Wema Bank') {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        bank: profile.virtual_account_bank,
        accountNumber: profile.virtual_account_number,
        accountName: profile.virtual_account_name,
      });
    }

    const customerName = profile?.full_name || user.user_metadata?.full_name || 'VTUflash User';
    const customerEmail = profile?.email || user.email;
    const customerPhone = (profile?.phone || '').replace(/\D/g, '') || '08000000000';

    // Step 1: Create or retrieve Paystack Customer
    let paystackCustomerCode;

    // Try to fetch existing customer by email
    const fetchCustomerRes = await fetch(
      `https://api.paystack.co/customer/${encodeURIComponent(customerEmail)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (fetchCustomerRes.ok) {
      const fetchData = await fetchCustomerRes.json();
      if (fetchData.status && fetchData.data?.customer_code) {
        paystackCustomerCode = fetchData.data.customer_code;
      }
    }

    // If no existing customer, create one
    if (!paystackCustomerCode) {
      const nameParts = customerName.trim().split(' ');
      const firstName = nameParts[0] || 'VTUflash';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      const createCustomerRes = await fetch('https://api.paystack.co/customer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          first_name: firstName,
          last_name: lastName,
          phone: customerPhone.startsWith('+') ? customerPhone : `+234${customerPhone.replace(/^0/, '')}`,
        }),
      });

      const createData = await createCustomerRes.json();
      if (!createCustomerRes.ok || !createData.status) {
        return NextResponse.json(
          { error: createData.message || 'Failed to create Paystack customer' },
          { status: 400 }
        );
      }
      paystackCustomerCode = createData.data.customer_code;
    }

    // Step 2: Create Dedicated Virtual Account
    // Paystack supports: wema-bank, test-bank (sandbox), access-bank, gtbank
    const dvaRes = await fetch('https://api.paystack.co/dedicated_account', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: paystackCustomerCode,
        preferred_bank: 'wema-bank', // Wema Bank is available on most Paystack plans
      }),
    });

    const dvaData = await dvaRes.json();

    if (!dvaRes.ok || !dvaData.status) {
      // If DVA creation fails (e.g. plan restriction), return a fallback response
      return NextResponse.json(
        { error: dvaData.message || 'Failed to create virtual account. Your Paystack plan may not support DVA.' },
        { status: 400 }
      );
    }

    const dva = dvaData.data;
    const bankName = dva.bank?.name || 'Wema Bank';
    const accountNumber = dva.account_number;
    const accountName = dva.account_name || `VTUFLASH / ${customerName.toUpperCase()}`;

    // Step 3: Save to Supabase profile
    await supabase
      .from('profiles')
      .update({
        virtual_account_bank: bankName,
        virtual_account_number: accountNumber,
        virtual_account_name: accountName,
      })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      bank: bankName,
      accountNumber,
      accountName,
    });

  } catch (err) {
    console.error('DVA creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
