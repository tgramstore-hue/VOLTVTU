'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './CreatePin.module.css';

function IconDelete() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function CreatePinScreen() {
  const { goBack, updateUser } = useApp();
  const [step, setStep] = useState(1);
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
        setTimeout(() => setStep(2), 250);
      }
    } else {
      if (confirmPin.length >= 4) return;
      const next = confirmPin + num;
      setConfirmPin(next);
      if (next.length === 4) {
        if (next === firstPin) {
          setSuccess(true);
          updateUser({ pin: next });
          setTimeout(() => goBack(), 1000);
        } else {
          setShake(true);
          setError('PINs do not match. Please try again.');
          setTimeout(() => {
            setShake(false);
            setConfirmPin('');
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    if (success) return;
    setError('');
    if (step === 1) {
      setFirstPin((p) => p.slice(0, -1));
    } else {
      setConfirmPin((p) => p.slice(0, -1));
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
      {/* Back button */}
      <button
        type="button"
        className={styles.backBtn}
        onClick={step === 2 ? handleResetStep : goBack}
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Title area matching EnterPin */}
      <div className={styles.titleArea}>
        <div className={styles.title}>
          {step === 1 ? 'Create Transaction PIN' : 'Confirm Transaction PIN'}
        </div>
        <div className={styles.sub}>
          {step === 1
            ? 'Enter a 4-digit PIN to secure your transactions'
            : 'Re-enter your 4-digit PIN to confirm'}
        </div>
      </div>

      {/* Success alert or PIN dots */}
      {success ? (
        <div className={styles.successCard}>
          <IconCheck />
          <span>PIN Created Successfully!</span>
        </div>
      ) : (
        <>
          <div className={`${styles.dotsRow} ${shake ? styles.shake : ''}`}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`${styles.dot} ${idx < activeDigits.length ? styles.dotFilled : ''}`}
              />
            ))}
          </div>

          {error ? <div className={styles.errorText}>{error}</div> : <div className={styles.errorSpacer} />}

          {/* Spacer to push numpad down */}
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
            <button
              type="button"
              className={styles.key}
              onClick={() => handlePress('0')}
            >
              0
            </button>
            <button
              type="button"
              className={styles.keyDelete}
              onClick={handleDelete}
              aria-label="Delete digit"
            >
              <IconDelete />
            </button>
          </div>

          {step === 2 && (
            <div className={styles.forgotRow}>
              <button
                type="button"
                className={styles.forgotBtn}
                onClick={handleResetStep}
              >
                ← Start over
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
