'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconLogin, IconFingerprint, IconUser } from '../../components/Icons';
import styles from './Login.module.css';

export default function LoginScreen() {
  const { navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('splash-to-dash');
    }, 1200);
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

      <div className={styles.form}>
        <label className={styles.label} htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={styles.label} htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className={styles.input}
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a href="#" className={styles.forgot}>Forgot password?</a>

        <button className={styles.signInBtn} onClick={handleSignIn} disabled={loading}>
          {loading ? (
            <div className={styles.spinner} />
          ) : (
            <>
              <IconLogin size={22} />
              Sign In
            </>
          )}
        </button>
      </div>

      <div className={styles.orText}>or use your fingerprint</div>
      <div className={styles.fingerWrap}>
        <button className={styles.fingerBtn} onClick={() => navigate('fingerprint')}>
          <IconFingerprint size={26} />
        </button>
      </div>

      <div className={styles.homeBar} />
    </div>
  );
}
