'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Register.module.css';

export default function RegisterScreen() {
  const { navigate, updateUser, setState } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid =
    fullName.trim().length >= 3 &&
    phone.trim().length >= 10 &&
    email.trim().includes('@') &&
    password.trim().length >= 6 &&
    loginPin.trim().length === 6;

  const handleCreate = (e) => {
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
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (loginPin.trim().length !== 6) {
      setError('Login PIN must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Create fresh new account with 0 balance, 0 transactions
      setState((prev) => ({
        ...prev,
        user: {
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          avatar: null,
          balance: 0,
          cashback: 0,
          bonus: 0,
          commission: 0,
          voltPoints: 0,
          tier: 'Tier 1 Standard',
          kycLevel: 1,
          loginPin: loginPin.trim(),
          transactionPin: '1234',
          biometricsEnabled: true,
          virtualAccount: {
            bank: 'Wema Bank',
            accountNumber: phone.trim().replace(/\D/g, '').slice(-10),
            accountName: `VTUFLASH / ${fullName.trim().toUpperCase()}`,
          },
        },
        transactions: [],
      }));

      navigate('dashboard');
    }, 1100);
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

        <label className={styles.label}>Password</label>
        <input
          className={styles.input}
          type="password"
          placeholder="Min 6 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          required
        />

        <label className={styles.label}>Create 6-Digit Login PIN</label>
        <input
          className={styles.input}
          type="password"
          inputMode="numeric"
          maxLength={6}
          placeholder="6 digits (e.g. 123456)"
          value={loginPin}
          onChange={(e) => {
            setLoginPin(e.target.value.replace(/\D/g, ''));
            if (error) setError('');
          }}
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
