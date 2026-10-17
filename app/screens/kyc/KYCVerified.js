'use client';
import { useApp } from '../../context/AppContext';
import { IconCheck } from '../../components/Icons';
import styles from './KYC.module.css';

export default function KYCVerifiedScreen() {
  const { navigate, updateUser } = useApp();

  const handleDone = () => {
    updateUser({ tier: 2, kycStatus: 'verified' });
    navigate('dashboard');
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#16A34A',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
          animation: 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <IconCheck size={40} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>Identity Verified!</div>
        <div style={{ fontSize: 14, color: 'var(--mut)', marginTop: 6, maxWidth: 280, marginInline: 'auto', lineHeight: 1.5 }}>
          Congratulations! You have successfully upgraded to <strong>Tier 2</strong>.
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--mut)' }}>Account Tier:</span>
          <span style={{ fontWeight: 700, color: '#111' }}>Tier 2 Verified</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--mut)' }}>Daily Limit:</span>
          <span style={{ fontWeight: 700, color: '#16A34A' }}>₦5,000,000.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span style={{ color: 'var(--mut)' }}>Status:</span>
          <span style={{ fontWeight: 700, color: '#15803D' }}>Active</span>
        </div>
      </div>

      <div className={styles.btnWrap}>
        <button
          type="button"
          className={styles.btn}
          onClick={handleDone}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
