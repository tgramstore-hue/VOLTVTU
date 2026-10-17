'use client';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './ConfirmPayment.module.css';

export default function ConfirmPaymentScreen() {
  const { navigate, goBack, state } = useApp();
  const purchase = state.pendingPurchase || {
    type: 'Airtime Recharge',
    provider: 'MTN',
    recipient: '08012345678',
    amount: 1000,
    fee: 0,
    cashback: 20,
    total: 1000,
  };

  const handlePay = () => {
    navigate('enter-pin');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Confirm Payment" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.amountCard}>
          <div className={styles.amountLabel}>Total Payable Amount</div>
          <div className={styles.amountVal}>₦{purchase.total?.toLocaleString() || '0'}.00</div>
        </div>

        <div className={styles.detailsCard}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Transaction Type</span>
            <span className={styles.detailValue}>{purchase.type}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Provider / Network</span>
            <span className={styles.detailValue}>{purchase.provider}</span>
          </div>
          {purchase.plan && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Package / Plan</span>
              <span className={styles.detailValue}>{purchase.plan}</span>
            </div>
          )}
          {purchase.customerName && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Customer Name</span>
              <span className={styles.detailValue}>{purchase.customerName}</span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Recipient</span>
            <span className={styles.detailValue}>{purchase.recipient}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Subtotal</span>
            <span className={styles.detailValue}>₦{purchase.amount?.toLocaleString() || '0'}.00</span>
          </div>
          {purchase.fee > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Convenience Fee</span>
              <span className={styles.detailValue}>₦{purchase.fee.toLocaleString()}.00</span>
            </div>
          )}
          {purchase.cashback > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Cashback Bonus</span>
              <span className={styles.detailValue} style={{ color: '#16A34A' }}>
                +₦{purchase.cashback.toLocaleString()}.00
              </span>
            </div>
          )}
        </div>

        <div className={styles.walletInfo}>
          <span className={styles.walletLabel}>Pay via Wallet Balance</span>
          <span className={styles.walletBalance}>₦{state.user.balance.toLocaleString()}.00</span>
        </div>

        <div className={styles.btnWrap}>
          <button type="button" className={styles.btn} onClick={handlePay}>
            Pay ₦{purchase.total?.toLocaleString() || '0'}.00
          </button>
        </div>
      </div>
    </div>
  );
}
