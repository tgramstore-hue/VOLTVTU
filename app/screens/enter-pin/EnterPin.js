'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import { IconDelete } from '../../components/Icons';
import styles from './EnterPin.module.css';

export default function EnterPinScreen() {
  const { navigate, goBack, state } = useApp();
  const [pinDigits, setPinDigits] = useState('');
  const [shake, setShake] = useState(false);

  const purchase = state.pendingPurchase || { total: 1000 };

  const handlePress = (num) => {
    if (pinDigits.length >= 4) return;
    const next = pinDigits + num;
    setPinDigits(next);

    if (next.length === 4) {
      if (next === '1234') {
        setTimeout(() => {
          navigate('processing');
        }, 250);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPinDigits('');
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPinDigits(prev => prev.slice(0, -1));
  };

  return (
    <div className={styles.container}>
      <PageHeader title="" onBack={goBack} />

      <div className={styles.header}>
        <div className={styles.title}>Enter Transaction PIN</div>
        <div className={styles.sub}>
          Authorise payment of ₦{purchase.total?.toLocaleString() || '0'}.00
        </div>
      </div>

      <div className={`${styles.dotsRow} ${shake ? 'shake' : ''}`}>
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`${styles.dot} ${idx < pinDigits.length ? styles.dotFilled : ''}`}
          />
        ))}
      </div>

      <div className={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            className={styles.key}
            onClick={() => handlePress(String(n))}
          >
            {n}
          </button>
        ))}
        <div className={styles.keyGhost} />
        <button
          type="button"
          className={styles.key}
          onClick={() => handlePress('0')}
        >
          0
        </button>
        <button
          type="button"
          className={styles.key}
          onClick={handleDelete}
        >
          <IconDelete size={22} />
        </button>
      </div>
    </div>
  );
}
