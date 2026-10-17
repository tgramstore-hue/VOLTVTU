'use client';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './KYC.module.css';

export default function KYCOverviewScreen() {
  const { navigate, goBack } = useApp();

  return (
    <div className={styles.container}>
      <PageHeader title="KYC Verification" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.headerCard}>
          <div className={styles.headerTag}>Tier 2 Upgrade</div>
          <div className={styles.headerTitle}>Unlock Limitless Transactions</div>
          <div className={styles.headerSub}>
            Comply with CBN regulations to increase your daily spend limit to ₦5,000,000.
          </div>
        </div>

        <div className={styles.card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>What you&apos;ll need:</div>
          <div className={styles.checkItem}>
            <div className={styles.checkIcon}>✓</div>
            <span>11-digit BVN or National ID (NIN)</span>
          </div>
          <div className={styles.checkItem}>
            <div className={styles.checkIcon}>✓</div>
            <span>A quick live facial photo (Selfie)</span>
          </div>
          <div className={styles.checkItem}>
            <div className={styles.checkIcon}>✓</div>
            <span>Government-issued ID document</span>
          </div>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => navigate('kyc-bvn-nin')}
          >
            Start Verification
          </button>
        </div>
      </div>
    </div>
  );
}
