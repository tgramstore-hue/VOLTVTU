'use client';
import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { IconFingerprint, IconDelete } from '../../components/Icons';
import styles from './UnlockPIN.module.css';

const CORRECT_PIN = '1234';

export default function UnlockPINScreen() {
  const { navigate } = useApp();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const addDigit = useCallback((d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
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
  }, [pin, navigate]);

  const removeDigit = () => setPin(p => p.slice(0, -1));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>E</div>
        <div className={styles.welcome}>Welcome back, Etim</div>
        <div className={styles.subtitle}>Enter your PIN to unlock</div>

        <div className={`${styles.dots} ${shake ? styles.shake : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`${styles.dot} ${i < pin.length ? styles.filled : ''}`} />
          ))}
        </div>

        <div className={styles.keypad}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="key" onClick={() => addDigit(String(n))}>{n}</button>
          ))}
          <button className={styles.keyGhost} onClick={() => navigate('fingerprint', 'back')}>
            <IconFingerprint size={28} />
          </button>
          <button className="key" onClick={() => addDigit('0')}>0</button>
          <button className={styles.keyGhost} onClick={removeDigit}>
            <IconDelete size={28} />
          </button>
        </div>

        <a href="#" className={styles.forgot}>Forgot PIN?</a>
      </div>
    </div>
  );
}
