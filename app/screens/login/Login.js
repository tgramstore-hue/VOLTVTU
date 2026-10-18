'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconLogin, IconUser } from '../../components/Icons';
import styles from './Login.module.css';

export default function LoginScreen() {
  const { navigate, setState, getSupabase } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Requires email/phone and EXACTLY 6 numeric digits
  const isFormValid = identifier.trim().length >= 3 && password.length === 6;

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (password.length !== 6) {
      setError('Password must be exactly 6 digits (numbers only).');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();
      let emailToUse = identifier.trim();

      // If user provided a phone number, attempt lookup in profiles
      if (!emailToUse.includes('@')) {
        try {
          const { data: profileByPhone } = await supabase
            .from('profiles')
            .select('email')
            .eq('phone', emailToUse)
            .maybeSingle();

          if (profileByPhone?.email) {
            emailToUse = profileByPhone.email;
          }
        } catch (lookupErr) {}
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password.trim(),
      });

      if (signInError) {
        // If login failed, check if password matches profile login_pin directly
        try {
          const { data: profileDirect } = await supabase
            .from('profiles')
            .select('*')
            .or(`email.eq.${emailToUse},phone.eq.${identifier.trim()}`)
            .maybeSingle();

          if (profileDirect && profileDirect.login_pin === password.trim()) {
            // Valid login via PIN!
            const userName = profileDirect.full_name || 'VTUflash User';
            const userPhone = profileDirect.phone || identifier;
            const userEmail = profileDirect.email || identifier;

            const txPinDirect = profileDirect.transaction_pin || '';
            const hasTxPinDirect = Boolean(txPinDirect && txPinDirect.length === 4);
            const isEmailConfirmedDirect = Boolean(profileDirect.is_email_verified);

            setState((prev) => ({
              ...prev,
              isAuthenticated: true,
              user: {
                ...prev.user,
                name: userName,
                phone: userPhone,
                email: userEmail,
                balance: profileDirect.wallet_balance ? Number(profileDirect.wallet_balance) : 0,
                voltPoints: profileDirect.volt_points || 0,
                kycLevel: profileDirect.kyc_level || 1,
                loginPin: profileDirect.login_pin,
                transactionPin: txPinDirect,
                hasCreatedTxPin: hasTxPinDirect,
                isEmailVerified: isEmailConfirmedDirect,
                biometricsEnabled: profileDirect.biometrics_enabled === true,
                virtualAccount: {
                  bank: profileDirect.virtual_account_bank || null,
                  accountNumber: profileDirect.virtual_account_number || null,
                  accountName: profileDirect.virtual_account_name || null,
                },
              },
            }));

            try {
              localStorage.setItem('vtu_last_user_name', userName);
              localStorage.setItem('vtu_last_user_phone', userPhone);
              localStorage.setItem('vtu_has_account', 'true');
            } catch (e) {}

            navigate('dashboard');
            return;
          }
        } catch (fallbackErr) {}

        setError(signInError.message || 'Invalid credentials. Password must be your 6-digit PIN.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Load user profile from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const userName = profile?.full_name || data.user.user_metadata?.full_name || 'VTUflash User';
        const userPhone = profile?.phone || data.user.user_metadata?.phone || (identifier.includes('@') ? '' : identifier);
        const userEmail = data.user.email || identifier;
        const txPin = profile?.transaction_pin || '';
        const hasTxPin = Boolean(txPin && txPin.length === 4);
        const isEmailConfirmed = Boolean(data.user.email_confirmed_at || profile?.is_email_verified);

        setState((prev) => ({
          ...prev,
          supabaseUser: data.user,
          isAuthenticated: true,
          user: {
            ...prev.user,
            name: userName,
            phone: userPhone,
            email: userEmail,
            balance: profile?.wallet_balance ? Number(profile.wallet_balance) : 0,
            voltPoints: profile?.volt_points || 0,
            kycLevel: profile?.kyc_level || 1,
            loginPin: profile?.login_pin || password.trim(),
            transactionPin: txPin,
            hasCreatedTxPin: hasTxPin,
            isEmailVerified: isEmailConfirmed,
            biometricsEnabled: profile?.biometrics_enabled === true,
            virtualAccount: {
              bank: profile?.virtual_account_bank || null,
              accountNumber: profile?.virtual_account_number || null,
              accountName: profile?.virtual_account_name || null,
            },
          },
        }));

        try {
          localStorage.setItem('vtu_last_user_name', userName);
          localStorage.setItem('vtu_last_user_phone', userPhone);
          localStorage.setItem('vtu_has_account', 'true');
        } catch (e) {}

        // Load transactions
        try {
          const { data: txns } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', data.user.id)
            .order('created_at', { ascending: false })
            .limit(50);

          if (txns && txns.length > 0) {
            setState((prev) => ({
              ...prev,
              transactions: txns.map((t) => ({
                id: t.id,
                type: t.type,
                title: t.title || t.description || t.type,
                amount: Number(t.amount),
                status: t.status,
                date: new Date(t.created_at).toLocaleDateString(),
                time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon: t.type === 'funding' ? 'plus' : 'minus',
                provider: t.provider,
                phone: t.recipient,
              })),
            }));
          }
        } catch (txnErr) {}

        navigate('dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Error signing in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <svg width="390" height="330" viewBox="0 0 390 330" className={styles.wave} aria-hidden="true">
        <path d="M0 0H390V170C380 220 340 270 270 285C220 295 190 280 150 300C90 330 40 290 0 245Z" fill="#ffffff" />
      </svg>

      {/* App Brand Header with Name */}
      <div className={styles.brandHeader}>
        <div className={styles.logoMark}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#F0B90B" stroke="#F0B90B" strokeWidth="1">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div className={styles.brandName}>
          VTU<span className={styles.brandHighlight}>flash</span>
        </div>
      </div>

      <button className={styles.signUpLink} onClick={() => navigate('register')}>
        <IconUser size={22} />
        Sign Up
      </button>

      <div className={styles.headingArea}>
        <h1 className={styles.title}>Sign In</h1>
        <div className={styles.subtitle}>Enter your email/phone and 6-digit PIN</div>
      </div>

      <form className={styles.form} onSubmit={handleSignIn}>
        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#B91C1C',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '4px',
          }}>
            {error}
          </div>
        )}

        <label className={styles.label} htmlFor="login-identifier">Email or Phone Number</label>
        <input
          id="login-identifier"
          className={styles.input}
          type="text"
          placeholder="080 1234 5678 or you@example.com"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            if (error) setError('');
          }}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className={styles.label} htmlFor="login-password">6-Digit Password (PIN)</label>
          <span style={{ fontSize: '11px', color: '#777', fontWeight: 600 }}>Numbers only (6 digits)</span>
        </div>
        <input
          id="login-password"
          className={styles.input}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="••••••"
          value={password}
          onChange={(e) => {
            // Strip any non-digit characters and limit to 6 digits
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPassword(digitsOnly);
            if (error) setError('');
          }}
          style={{ letterSpacing: '8px', fontSize: '18px', fontWeight: 800 }}
          required
        />

        <a href="#" className={styles.forgot} onClick={(e) => { e.preventDefault(); alert('Please use your 6-digit PIN or register a new account.'); }}>
          Forgot 6-digit PIN?
        </a>

        <button
          type="submit"
          className={styles.signInBtn}
          disabled={loading || !isFormValid}
          style={{
            opacity: (!isFormValid && !loading) ? 0.45 : 1,
            cursor: (!isFormValid && !loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <div className={styles.spinner} />
          ) : (
            <>
              <IconLogin size={22} />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className={styles.homeBar} />
    </div>
  );
}
