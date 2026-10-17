'use client';
import { useApp } from '../../context/AppContext';
import { IconCheck } from '../../components/Icons';
import styles from './PaymentSuccess.module.css';

export default function PaymentSuccessScreen() {
  const { navigate, state } = useApp();
  const purchase = state.pendingPurchase || {
    type: 'Airtime',
    provider: 'MTN',
    recipient: '08012345678',
    amount: 1000,
    total: 1000,
    cashback: 20,
  };

  const refNumber = 'VTU' + Math.floor(100000000 + Math.random() * 900000000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      <div className={styles.successIconWrap}>
        <div className={styles.successCircle}>
          <IconCheck size={38} />
        </div>
      </div>

      <div className={styles.title}>Payment Successful!</div>
      <div className={styles.sub}>Your transaction has been processed instantly.</div>

      <div className={styles.receiptCard}>
        <div className={styles.receiptTop}>
          <div className={styles.amount}>₦{purchase.total?.toLocaleString() || '0'}.00</div>
          <span className={styles.statusPill}>SUCCESSFUL</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Reference</span>
          <span className={styles.detailValue}>{refNumber}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Date & Time</span>
          <span className={styles.detailValue}>{dateStr}, {timeStr}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Service</span>
          <span className={styles.detailValue}>{purchase.provider} {purchase.type}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Recipient</span>
          <span className={styles.detailValue}>{purchase.recipient}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Payment Method</span>
          <span className={styles.detailValue}>Wallet Balance</span>
        </div>

        {purchase.cashback > 0 && (
          <div className={styles.cashbackBanner}>
            <span>Cashback Credited:</span>
            <span>+₦{purchase.cashback.toLocaleString()}.00</span>
          </div>
        )}
      </div>

      <div className={styles.btnGroup}>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => alert('Receipt copied to clipboard!')}
        >
          Share Receipt
        </button>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => navigate('dashboard')}
        >
          Done
        </button>
      </div>
    </div>
  );
}
