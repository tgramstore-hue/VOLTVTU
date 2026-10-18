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
  const userPin = state.user?.transactionPin || (typeof window !== 'undefined' ? localStorage.getItem('vtu_user_tx_pin') : null);
  const hasCreatedPin = Boolean(
    (userPin && userPin.length === 4) ||
    state.user?.hasCreatedTxPin ||
    (typeof window !== 'undefined' && localStorage.getItem('vtu_has_created_tx_pin') === 'true')
  );
  const correctPin = userPin || '1234';

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

  // If user hasn't set a PIN yet, prompt them to set it up before paying
  if (!hasCreatedPin) {
    return (
      <div className={styles.container}>
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          marginTop: '60px', padding: '0 20px'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: '#FFF8D6', color: '#B08A00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>
            Set Transaction PIN
          </div>
          <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.5, marginBottom: '32px', maxWidth: '300px' }}>
            You haven&apos;t created a transaction PIN yet. Please create a 4-digit security PIN to authorize this payment of <strong>₦{(purchase.total || 0).toLocaleString()}.00</strong>.
          </div>

          <button
            type="button"
            style={{
              width: '100%', maxWidth: '320px', padding: '16px',
              borderRadius: '16px', background: '#F0B90B', color: '#000',
              fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(240,185,11,0.3)', marginBottom: '12px'
            }}
            onClick={() => navigate('create-pin')}
          >
            Create Transaction PIN
          </button>

          <button
            type="button"
            style={{
              width: '100%', maxWidth: '320px', padding: '14px',
              borderRadius: '16px', background: 'transparent', color: '#666',
              fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer'
            }}
            onClick={goBack}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

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
