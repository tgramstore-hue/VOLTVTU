'use client';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Processing.module.css';

export default function ProcessingScreen() {
  const { navigate, state, setState } = useApp();
  const purchase = state.pendingPurchase || {
    type: 'Airtime',
    category: 'airtime',
    provider: 'MTN',
    recipient: '08012345678',
    amount: 1000,
    fee: 0,
    cashback: 20,
    total: 1000,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Record transaction and update state
      setState(prev => {
        const newTrans = {
          id: Date.now(),
          type: purchase.category || 'airtime',
          title: `${purchase.provider} ${purchase.type || ''}`,
          amount: -purchase.total,
          status: 'successful',
          date: 'today',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: purchase.category === 'data' ? 'data' : purchase.category === 'cable' ? 'tv' : purchase.category === 'electricity' ? 'bolt' : 'phone',
        };

        return {
          ...prev,
          user: {
            ...prev.user,
            balance: Math.max(0, prev.user.balance - purchase.total),
            cashback: prev.user.cashback + (purchase.cashback || 0),
          },
          transactions: [newTrans, ...prev.transactions],
        };
      });

      navigate('payment-success');
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate, purchase, setState]);

  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrap}>
        <div className={styles.spinner} />
      </div>
      <div className={styles.title}>Processing Payment</div>
      <div className={styles.sub}>Please hold on while we confirm with the network provider...</div>
      <div className={styles.amount}>₦{purchase.total?.toLocaleString() || '0'}.00</div>
    </div>
  );
}
