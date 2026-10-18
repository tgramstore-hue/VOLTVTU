'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconLogin, IconUser } from '../../components/Icons';
import styles from './Login.module.css';

export default function LoginScreen() {
  const { navigate, updateUser } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = identifier.trim().length >= 3 && password.trim().length >= 6;

  const handleSignIn = (e) => {
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
    setTimeout(() => {
      setLoading(false);
      // Update session info
      updateUser({
        email: identifier.includes('@') ? identifier : 'user@vtuflash.com',
        phone: !identifier.includes('@') ? identifier : '08123456789',
      });
      navigate('dashboard');
    }, 900);
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
