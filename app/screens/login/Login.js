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

  const isFormValid = identifier.trim().length >= 3 && password.trim().length >= 6;

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
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
        // Clear message
        setError(signInError.message || 'Invalid login credentials. Please check and try again.');
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
            loginPin: profile?.login_pin || '123456',
            transactionPin: profile?.transaction_pin || '1234',
            virtualAccount: {
              bank: profile?.virtual_account_bank || 'Wema Bank',
              accountNumber: profile?.virtual_account_number || userPhone.replace(/\D/g, '').slice(-10) || '0000000000',
              accountName: profile?.virtual_account_name || `VTUFLASH / ${userName.toUpperCase()}`,
            },
          },
        }));

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
                title: t.title || t.type,
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
      setError(err?.message || 'Error signing in. Please check your network connection.');
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
        <div className={styles.subtitle}>Welcome back to VTUflash</div>
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

        <label className={styles.label} htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className={styles.input}
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          required
        />

        <a href="#" className={styles.forgot} onClick={(e) => { e.preventDefault(); alert('Please use your 6-digit login PIN or contact customer support.'); }}>
          Forgot password?
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
