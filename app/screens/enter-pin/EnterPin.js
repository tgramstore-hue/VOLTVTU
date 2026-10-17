'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './EnterPin.module.css';

function IconDelete() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
    </svg>
  );
}

export default function EnterPinScreen() {
  const { navigate, goBack, state } = useApp();
  const [pinDigits, setPinDigits] = useState('');
  const [shake, setShake] = useState(false);

  const purchase = state.pendingPurchase || { total: 1000 };
  const correctPin = state.user?.pin || '1234';

  const handlePress = (num) => {
    if (pinDigits.length >= 4) return;
    const next = pinDigits + num;
    setPinDigits(next);
    if (next.length === 4) {
      if (next === correctPin) {
        setTimeout(() => navigate('processing'), 250);
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setPinDigits(''); }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPinDigits(prev => prev.slice(0, -1));
  };

  return (
    <div className={styles.container}>
      {/* Back button */}
      <button type="button" className={styles.backBtn} onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Title area */}
      <div className={styles.titleArea}>
        <div className={styles.title}>Enter Transaction PIN</div>
        <div className={styles.sub}>
          Authorise payment of ₦{(purchase.total || 0).toLocaleString()}.00
        </div>
      </div>

      {/* PIN dots */}
      <div className={`${styles.dotsRow} ${shake ? styles.shake : ''}`}>
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`${styles.dot} ${idx < pinDigits.length ? styles.dotFilled : ''}`}
          />
        ))}
      </div>

      {/* Spacer */}
      <div className={styles.spacer} />

      {/* Numpad */}
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
        <div />
        <button type="button" className={styles.key} onClick={() => handlePress('0')}>0</button>
        <button type="button" className={styles.keyDelete} onClick={handleDelete}>
          <IconDelete />
        </button>
      </div>

      {/* Forgot PIN */}
      <div className={styles.forgotRow}>
        <button
          type="button"
          className={styles.forgotBtn}
          onClick={() => navigate('create-pin')}
        >
          Forgot or Change PIN?
        </button>
      </div>
    </div>
  );
}
