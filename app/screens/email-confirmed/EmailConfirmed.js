'use client';
import { useApp } from '../../context/AppContext';
import styles from './EmailConfirmed.module.css';

export default function EmailConfirmedScreen() {
  const { navigate } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.iconCircle}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <div className={styles.title}>Email Verified!</div>
      <div className={styles.sub}>
        Your email address has been successfully verified. You now have access to higher account tiers and enhanced features.
      </div>

      <button
        type="button"
        className={styles.continueBtn}
        onClick={() => {
          navigate('dashboard');
        }}
      >
        Continue to Dashboard
      </button>
    </div>
  );
}
