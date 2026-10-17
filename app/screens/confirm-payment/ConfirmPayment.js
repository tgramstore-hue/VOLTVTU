'use client';
import { useApp } from '../../context/AppContext';
import { IconHome, IconCheck } from '../../components/Icons';
import styles from './ConfirmPayment.module.css';

export default function ConfirmPaymentScreen() {
  const { navigate, goBack, state } = useApp();
  const purchase = state.pendingPurchase || {
    type: 'Airtime',
    provider: 'MTN',
    recipient: '080 0000 0000',
    amount: 1000,
    fee: 0,
    cashback: 20,
    total: 1000,
  };

  const handlePay = () => {
    navigate('enter-pin');
  };

  const rows = [
    { label: 'Service',   value: purchase.type },
    { label: 'Network',   value: purchase.provider },
    purchase.plan ? { label: 'Plan', value: purchase.plan } : null,
    purchase.customerName ? { label: 'Customer', value: purchase.customerName } : null,
    { label: 'Recipient', value: purchase.recipient },
    { label: 'Fee',       value: `₦${(purchase.fee || 0).toLocaleString()}.00` },
    { label: 'Total',     value: `₦${(purchase.total || 0).toLocaleString()}` },
  ].filter(Boolean);

  return (
    <div className={styles.scrim} onClick={goBack}>
      {/* Bottom sheet panel */}
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        {/* Drag handle */}
        <div className={styles.handle} />

        <div className={styles.topLabel}>Confirm Payment</div>
        <div className={styles.amount}>₦{(purchase.total || 0).toLocaleString()}</div>

        {/* Details card */}
        <div className={styles.detailCard}>
          {rows.map((r, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.rowLabel}>{r.label}</span>
              <span className={styles.rowValue}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Wallet row */}
        <div className={styles.walletRow}>
          <div className={styles.walletLeft}>
            <div className={styles.walletIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>
              </svg>
            </div>
            <div>
              <div className={styles.walletName}>Wallet</div>
              <div className={styles.walletBal}>Balance ₦{(state.user?.balance || 0).toLocaleString()}.00</div>
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5 9-10"/>
          </svg>
        </div>

        {/* Pay button */}
        <button type="button" className={styles.payBtn} onClick={handlePay}>
          Pay ₦{(purchase.total || 0).toLocaleString()}
        </button>
      </div>
    </div>
  );
}
