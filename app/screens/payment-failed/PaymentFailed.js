'use client';
import { useApp } from '../../context/AppContext';
import { IconX } from '../../components/Icons';
import styles from './PaymentFailed.module.css';

export default function PaymentFailedScreen() {
  const { navigate, goBack } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.iconWrap}>
        <div className={styles.failCircle}>
          <IconX size={38} />
        </div>
      </div>

      <div className={styles.title}>Payment Failed</div>
      <div className={styles.sub}>
        We couldn&apos;t complete your transaction right now. No funds have been debited from your wallet.
      </div>

      <div className={styles.reasonCard}>
        <strong>Reason:</strong> Provider gateway connection timeout. Please check recipient details and try again.
      </div>

      <div className={styles.btnGroup}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={goBack}
        >
          Try Again
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => navigate('dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
