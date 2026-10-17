'use client';
import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { IconFingerprint, IconDelete, IconChevronLeft } from '../../components/Icons';
import styles from './UnlockPIN.module.css';

export default function UnlockPINScreen() {
  const { navigate, goBack, state } = useApp();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const correctPin = state.user?.pin || '1234';

  const addDigit = useCallback((d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === correctPin) {
          navigate('splash-to-dash');
        } else {
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin('');
          }, 500);
        }
      }, 200);
    }
  }, [pin, correctPin, navigate]);

  const removeDigit = () => setPin(p => p.slice(0, -1));

  return (
    <div className={styles.container}>
      {/* Top Back Navigation Button */}
      <div style={{ position: 'absolute', left: 16, top: 24, zIndex: 50 }}>
        <button
          type="button"
          className="bk"
          aria-label="Back"
          onClick={goBack}
        >
          <IconChevronLeft size={22} />
        </button>
      </div>

      <div className={styles.header}>
        <div className={styles.avatar}>
          {state.user?.profileImage ? (
            <img
              src={state.user.profileImage}
              alt="Avatar"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            state.user?.initial || 'E'
          )}
        </div>
        <div className={styles.welcome}>Welcome back, {state.user?.name || 'User'}</div>
        <div className={styles.subtitle}>Enter your PIN to unlock</div>

        <div className={`${styles.dots} ${shake ? styles.shake : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`${styles.dot} ${i < pin.length ? styles.filled : ''}`} />
          ))}
        </div>

        <div className={styles.keypad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} type="button" className="key" onClick={() => addDigit(String(n))}>{n}</button>
          ))}
          <button type="button" className={styles.keyGhost} onClick={() => navigate('fingerprint', 'back')}>
            <IconFingerprint size={28} />
          </button>
          <button type="button" className="key" onClick={() => addDigit('0')}>0</button>
          <button type="button" className={styles.keyGhost} onClick={removeDigit}>
            <IconDelete size={28} />
          </button>
        </div>

        <button
          type="button"
          className={styles.forgot}
          style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '26px auto 0' }}
          onClick={() => navigate('create-pin')}
        >
          Forgot PIN? Reset or Create New
        </button>
      </div>
    </div>
  );
}
