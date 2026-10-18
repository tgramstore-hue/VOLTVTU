'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Register.module.css';

export default function RegisterScreen() {
  const { navigate, setState, getSupabase } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid =
    fullName.trim().length >= 3 &&
    phone.trim().length >= 10 &&
    email.trim().includes('@') &&
    loginPin.length === 6;

  const handleCreate = async (e) => {
    e?.preventDefault();
    setError('');

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (loginPin.length !== 6) {
      setError('Login Password/PIN must be exactly 6 digits (numbers only).');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: loginPin.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            login_pin: loginPin.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const userObj = data?.user;
      const userId = userObj?.id || `user_${Date.now()}`;

      // Insert profile into database
      try {
        await supabase.from('profiles').upsert({
          id: userId,
          email: email.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          wallet_balance: 0.00,
          volt_points: 100, // 100 bonus welcome points!
          kyc_level: 1,
          login_pin: loginPin.trim(),
          transaction_pin: null,
          biometrics_enabled: false,
          virtual_account_bank: null,
          virtual_account_number: null,
          virtual_account_name: null,
        });
      } catch (profileErr) {
        // Fallback gracefully if schema trigger handled profile
      }

      const userName = fullName.trim();
      const userPhone = phone.trim();
      const isEmailConfirmed = Boolean(userObj?.email_confirmed_at);

      // Remember that user has an account
      try {
        localStorage.setItem('vtu_last_user_name', userName);
        localStorage.setItem('vtu_last_user_phone', userPhone);
        localStorage.setItem('vtu_has_account', 'true');
      } catch (e) {}

      // Update app context
      setState((prev) => ({
        ...prev,
        supabaseUser: userObj,
        isAuthenticated: true,
        user: {
          ...prev.user,
          name: userName,
          phone: userPhone,
          email: email.trim(),
          avatar: null,
          balance: 0,
          cashback: 0,
          bonus: 0,
          commission: 0,
          voltPoints: 100,
          tier: 'Tier 1 Standard',
          kycLevel: 1,
          loginPin: loginPin.trim(),
          transactionPin: '',
          hasCreatedTxPin: false,
          isEmailVerified: isEmailConfirmed,
          biometricsEnabled: false,
          referralCode: `VOLT-${userName.split(' ')[0]?.toUpperCase()?.slice(0, 4) || 'USER'}-${String(Date.now()).slice(-2)}`,
          virtualAccount: {
            bank: null,
            accountNumber: null,
            accountName: null,
          },
        },
        transactions: [],
      }));

      navigate('dashboard');
    } catch (err) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <svg width="390" height="250" viewBox="0 0 390 250" className={styles.wave} aria-hidden="true">
        <path d="M0 0H390V130C380 170 340 205 270 215C220 222 190 210 150 228C90 252 40 220 0 190Z" fill="#fff" />
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

      <button className={styles.signInLink} onClick={() => navigate('login', 'back')}>Sign In</button>

      <div className={styles.headingArea}>
        <h1 className={styles.title}>Sign Up</h1>
        <div className={styles.subtitle}>Create your VTUflash account</div>
      </div>

      <form className={styles.form} onSubmit={handleCreate}>
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

        <label className={styles.label}>Full Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Etim Emmanuel"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (error) setError('');
          }}
          required
        />

        <label className={styles.label}>Phone Number</label>
        <input
          className={styles.input}
          type="tel"
          placeholder="080 1234 5678"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError('');
          }}
          required
        />

        <label className={styles.label}>Email Address</label>
        <input
          className={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className={styles.label}>Create 6-Digit Password (PIN)</label>
          <span style={{ fontSize: '11px', color: '#777', fontWeight: 600 }}>Numbers only (6 digits)</span>
        </div>
        <input
          className={styles.input}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="••••••"
          value={loginPin}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
            setLoginPin(digitsOnly);
            if (error) setError('');
          }}
          style={{ letterSpacing: '8px', fontSize: '18px', fontWeight: 800 }}
          required
        />

        <button
          type="submit"
          className={styles.createBtn}
          disabled={loading || !isFormValid}
          style={{
            opacity: (!isFormValid && !loading) ? 0.45 : 1,
            cursor: (!isFormValid && !loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? <div className={styles.spinner} /> : 'Create Account'}
        </button>
        <div className={styles.terms}>By signing up you agree to our Terms and Privacy Policy</div>
      </form>
    </div>
  );
}
