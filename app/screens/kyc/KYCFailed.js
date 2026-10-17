'use client';
import { useApp } from '../../context/AppContext';
import { IconX } from '../../components/Icons';
import styles from './KYC.module.css';

export default function KYCFailedScreen() {
  const { navigate } = useApp();

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#DC2626',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.35)',
          animation: 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <IconX size={40} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>Verification Unsuccessful</div>
        <div style={{ fontSize: 14, color: 'var(--mut)', marginTop: 6, maxWidth: 280, marginInline: 'auto', lineHeight: 1.5 }}>
          Your ID photo was blurry or did not match your facial selfie.
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: 32, background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
        <div style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.5 }}>
          Please ensure you are in a well-lit room without glasses or hats, and that the ID card details are clearly legible.
        </div>
      </div>

      <div className={styles.btnWrap}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => navigate('kyc-overview')}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
