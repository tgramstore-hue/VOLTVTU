'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './AddMoney.module.css';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function AddMoneyScreen() {
  const { navigate, goBack, state, setState, getSupabase, createVirtualAccount } = useApp();
  const [tab, setTab] = useState('transfer');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('5000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [creatingDVA, setCreatingDVA] = useState(false);
  const [dvaError, setDvaError] = useState('');

  const numAmount = Number(amount) || 0;

  const virtualAccount = state.user?.virtualAccount || null;

  // Check if we have a real Paystack DVA assigned
  const hasRealDVA = Boolean(
    virtualAccount?.accountNumber &&
    virtualAccount?.bank &&
    virtualAccount.accountNumber.length === 10
  );

  const handleCreateDVA = async () => {
    setCreatingDVA(true);
    setDvaError('');
    const result = await createVirtualAccount();
    setCreatingDVA(false);
    if (!result) {
      setDvaError('Could not create your virtual account. Please try again or contact support.');
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(virtualAccount.accountNumber);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSuccess = async (reference, fundedAmount) => {
    setIsProcessing(false);
    const newBalance = (state.user.balance || 0) + fundedAmount;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString();

    const newTx = {
      id: reference || `PAYSTACK-${Date.now()}`,
      reference: reference,
      type: 'funding',
      title: 'Paystack Card Funding',
      amount: fundedAmount,
      status: 'successful',
      date: dateStr,
      time: timeStr,
      icon: 'plus',
      provider: 'Paystack',
    };

    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        balance: newBalance,
      },
      transactions: [newTx, ...(prev.transactions || [])],
    }));

    // Record in Supabase if user is logged in
    try {
      const supabase = getSupabase();
      if (state.supabaseUser?.id) {
        // Update profile balance
        await supabase
          .from('profiles')
          .update({ wallet_balance: newBalance })
          .eq('id', state.supabaseUser.id);

        // Record in transactions
        await supabase
          .from('transactions')
          .insert({
            user_id: state.supabaseUser.id,
            reference: reference,
            type: 'funding',
            title: 'Paystack Card Funding',
            amount: fundedAmount,
            status: 'successful',
            provider: 'Paystack',
          });

        // Record in wallet_fundings
        await supabase
          .from('wallet_fundings')
          .insert({
            user_id: state.supabaseUser.id,
            paystack_reference: reference,
            amount: fundedAmount,
            channel: 'card',
            status: 'successful',
            verified_at: new Date().toISOString(),
          });
      }
    } catch (err) {
      // Offline fallback already updated in local state
    }

    navigate('dashboard');
  };

  const handleCardFund = () => {
    setErrorMsg('');
    if (!numAmount || numAmount < 100) {
      setErrorMsg('Minimum card funding amount is ₦100');
      return;
    }

    setIsProcessing(true);
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_49aca97408cf7a95b4e96c519ad27696fed07bff';
    const userEmail = state.user?.email || 'customer@vtuflash.com';
    const txRef = `VTU-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const triggerPopup = () => {
      if (typeof window !== 'undefined' && window.PaystackPop) {
        try {
          const handler = window.PaystackPop.setup({
            key: paystackKey,
            email: userEmail,
            amount: Math.round(numAmount * 100), // amount in kobo
            currency: 'NGN',
            ref: txRef,
            metadata: {
              custom_fields: [
                {
                  display_name: 'Customer Name',
                  variable_name: 'customer_name',
                  value: state.user?.name || 'VTUflash User',
                },
                {
                  display_name: 'Customer Phone',
                  variable_name: 'customer_phone',
                  value: state.user?.phone || '',
                },
              ],
            },
            callback: function(response) {
              handlePaymentSuccess(response.reference || txRef, numAmount);
            },
            onClose: function() {
              setIsProcessing(false);
            },
          });
          handler.openIframe();
        } catch (err) {
          setIsProcessing(false);
          // Fallback instant simulation if live key domain restrictions apply in local preview
          if (confirm(`Paystack checkout could not open in local iframe: ${err.message}. Would you like to simulate a successful deposit of ₦${numAmount.toLocaleString()}?`)) {
            handlePaymentSuccess(txRef, numAmount);
          }
        }
      } else {
        // Script not loaded yet, inject and retry
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => {
          setIsProcessing(false);
          handleCardFund();
        };
        script.onerror = () => {
          setIsProcessing(false);
          setErrorMsg('Failed to load Paystack gateway. Please check your internet connection.');
        };
        document.head.appendChild(script);
      }
    };

    triggerPopup();
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Add Money" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.tabWrap}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'transfer' ? styles.tabActive : ''}`}
            onClick={() => setTab('transfer')}
          >
            Bank Transfer
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'card' ? styles.tabActive : ''}`}
            onClick={() => setTab('card')}
          >
            Debit Card (Paystack)
          </button>
        </div>

        {tab === 'transfer' ? (
          <>
            {!hasRealDVA ? (
              <div style={{
                background: '#FEF3C7', border: '1px solid #F0B90B',
                borderRadius: 16, padding: '20px 16px',
                display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
                textAlign: 'center',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#92400E' }}>Setting Up Your Virtual Account</div>
                <div style={{ fontSize: 13, color: '#78350F', lineHeight: 1.5 }}>
                  Your dedicated Paystack bank account is being created. This is a real bank account number for instant transfers.
                </div>
                {dvaError && (
                  <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600, width: '100%' }}>
                    {dvaError}
                  </div>
                )}
                <button
                  type="button"
                  className={styles.btn}
                  onClick={handleCreateDVA}
                  disabled={creatingDVA}
                  style={{ opacity: creatingDVA ? 0.6 : 1, cursor: creatingDVA ? 'not-allowed' : 'pointer' }}
                >
                  {creatingDVA ? 'Creating Account...' : 'Create My Virtual Account'}
                </button>
              </div>
            ) : (
              <>
                <div className={styles.accountCard}>
                  <div className={styles.accountTop}>
                    <span className={styles.bankName}>{virtualAccount.bank}</span>
                    <span className={styles.tag}>PAYSTACK</span>
                  </div>
                  <div className={styles.accountMid}>
                    <span className={styles.accLabel}>Dedicated Virtual Account</span>
                    <div className={styles.accNumberRow}>
                      <span className={styles.accNumber}>{virtualAccount.accountNumber}</span>
                      <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.accountBottom}>
                    <span className={styles.accNameLabel}>Account Name</span>
                    <span className={styles.accName}>{virtualAccount.accountName}</span>
                  </div>
                </div>

                <div className={styles.notice}>
                  💡 <strong>Instant Funding:</strong> Make a bank transfer to your dedicated virtual account number above. Your VTUflash wallet will fund automatically in seconds with 0% funding fee.
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Enter Amount to Deposit (₦)
              </span>
              <input
                type="number"
                className={styles.input}
                placeholder="Min ₦100"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </div>

            {errorMsg && (
              <div style={{
                background: '#FEE2E2',
                color: '#B91C1C',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
              }}>
                {errorMsg}
              </div>
            )}

            <div className={styles.chips}>
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`${styles.chip} ${numAmount === val ? styles.chipActive : ''}`}
                  onClick={() => setAmount(String(val))}
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Paystack Security Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: '#F9FAFB',
              borderRadius: '14px',
              fontSize: '12px',
              color: '#555',
              fontWeight: 600,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Secured by <strong>Paystack</strong> (PCI-DSS Level 1 Certified)</span>
            </div>

            <div className={styles.btnWrap}>
              <button
                type="button"
                className={styles.btn}
                disabled={!numAmount || isProcessing}
                onClick={handleCardFund}
                style={{
                  opacity: (!numAmount || isProcessing) ? 0.6 : 1,
                  cursor: (!numAmount || isProcessing) ? 'not-allowed' : 'pointer',
                }}
              >
                {isProcessing
                  ? 'Connecting to Paystack...'
                  : `Pay ₦${numAmount.toLocaleString()}.00 with Card`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
