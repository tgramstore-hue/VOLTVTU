'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Register.module.css';

export default function RegisterScreen() {
  const { navigate } = useApp();
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('splash-to-dash');
    }, 1200);
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

      <div className={styles.form}>
        <label className={styles.label}>Full name</label>
        <input className={styles.input} type="text" placeholder="Your full name" />
        <label className={styles.label}>Phone</label>
        <input className={styles.input} type="tel" placeholder="080 0000 0000" />
        <label className={styles.label}>Email</label>
        <input className={styles.input} type="email" placeholder="you@example.com" />
        <label className={styles.label}>Password</label>
        <input className={styles.input} type="password" placeholder="••••••••••••" />

        <button className={styles.createBtn} onClick={handleCreate} disabled={loading}>
          {loading ? <div className={styles.spinner} /> : 'Create Account'}
        </button>
        <div className={styles.terms}>By signing up you agree to our Terms</div>
      </div>
    </div>
  );
}
