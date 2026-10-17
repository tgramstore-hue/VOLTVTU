'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import { IconDelete, IconCheck } from '../../components/Icons';
import styles from './CreatePin.module.css';

export default function CreatePinScreen() {
  const { navigate, goBack, updateUser } = useApp();
  const [step, setStep] = useState(1); // 1 = Enter new PIN, 2 = Confirm PIN
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const activeDigits = step === 1 ? firstPin : confirmPin;

  const handlePress = (num) => {
    if (success) return;
    setError('');

    if (step === 1) {
      if (firstPin.length >= 4) return;
      const next = firstPin + num;
      setFirstPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          setStep(2);
        }, 300);
      }
    } else {
      if (confirmPin.length >= 4) return;
      const next = confirmPin + num;
      setConfirmPin(next);
      if (next.length === 4) {
        if (next === firstPin) {
          setSuccess(true);
          updateUser({ pin: next });
          setTimeout(() => {
            goBack();
          }, 1200);
        } else {
          setShake(true);
          setError('PINs do not match. Please try again.');
          setTimeout(() => {
            setShake(false);
            setConfirmPin('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    if (success) return;
    setError('');
    if (step === 1) {
      setFirstPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const handleResetStep = () => {
    setStep(1);
    setFirstPin('');
    setConfirmPin('');
    setError('');
  };

  return (
    <div className={styles.container}>
      {/* Top Header with Back Button */}
      <PageHeader
        title={step === 1 ? "Create PIN" : "Confirm PIN"}
        onBack={step === 2 ? handleResetStep : goBack}
      />

      <div className={styles.header}>
        <span className={styles.badge}>Step {step} of 2</span>
        <div className={styles.title}>
          {step === 1 ? 'Set Your 4-Digit PIN' : 'Confirm Your PIN'}
        </div>
        <div className={styles.sub}>
          {step === 1
            ? 'Choose a secure 4-digit PIN to authorize purchases and protect your VTUflash wallet.'
            : 'Re-enter the same 4 digits to confirm your security PIN.'}
        </div>
      </div>

      {success ? (
        <div className={styles.successCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <IconCheck size={20} />
            <span>PIN Created Successfully!</span>
          </div>
        </div>
      ) : (
        <>
          <div className={`${styles.dotsRow} ${shake ? 'shake' : ''}`}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`${styles.dot} ${idx < activeDigits.length ? styles.dotFilled : ''}`}
              />
            ))}
          </div>

          <div className={styles.errorText}>{error}</div>

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

          {step === 2 && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#666', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                onClick={handleResetStep}
              >
                ← Start over with a different PIN
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
