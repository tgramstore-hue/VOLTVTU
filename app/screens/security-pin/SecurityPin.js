'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconChevronLeft, IconLock, IconFingerprint, IconCheck, IconX } from '../../components/Icons';
import styles from './SecurityPin.module.css';

export default function SecurityPinScreen() {
  const { goBack, state, updateUser } = useApp();

  // Biometrics toggle
  const [biometrics, setBiometrics] = useState(state.user?.biometricsEnabled !== false);

  // Modals for changing PINs
  const [modalType, setModalType] = useState(null); // 'loginPin' | 'txPin' | null

  // Change PIN states
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleToggleBiometrics = () => {
    const nextVal = !biometrics;
    setBiometrics(nextVal);
    updateUser({ biometricsEnabled: nextVal });
    setSuccessToast(nextVal ? 'Biometric authentication enabled' : 'Biometric authentication disabled');
    setTimeout(() => setSuccessToast(''), 2500);
  };

  const openPinModal = (type) => {
    setModalType(type);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setErrorMsg('');
  };

  const handleSavePin = () => {
    setErrorMsg('');
    const isLogin = modalType === 'loginPin';
    const reqLen = isLogin ? 6 : 4;
    const pinName = isLogin ? 'Login PIN' : 'Transaction PIN';
    const savedPin = isLogin ? (state.user?.loginPin || '123456') : (state.user?.transactionPin || '1234');

    if (currentPin.length !== reqLen) {
      setErrorMsg(`Current ${pinName} must be ${reqLen} digits.`);
      return;
    }
    if (currentPin !== savedPin) {
      setErrorMsg(`Incorrect current ${pinName}.`);
      return;
    }
    if (newPin.length !== reqLen) {
      setErrorMsg(`New ${pinName} must be exactly ${reqLen} digits.`);
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg(`New PINs do not match.`);
      return;
    }

    if (isLogin) {
      updateUser({ loginPin: newPin });
      setSuccessToast('6-digit Login PIN updated successfully!');
    } else {
      updateUser({ transactionPin: newPin });
      setSuccessToast('4-digit Transaction PIN updated successfully!');
    }

    setModalType(null);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Go back">
          <IconChevronLeft size={22} />
        </button>
        <h1 className={styles.headerTitle}>Security &amp; PIN</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className={styles.toast}>
          <IconCheck size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Section 1: 6-Digit Login PIN */}
      <div className={styles.card}>
        <div className={styles.cardIconWrap}>
          <IconLock size={22} />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardTitle}>Login PIN (6-Digit)</div>
          <div className={styles.cardSub}>Used to sign in and unlock your VTUflash app</div>
          <div className={styles.pinIndicator}>
            <span className={styles.pinDots}>••••••</span>
            <span className={styles.pinActiveBadge}>Active (6 digits)</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.changeBtn}
          onClick={() => openPinModal('loginPin')}
        >
          Change
        </button>
      </div>

      {/* Section 2: 4-Digit Transaction PIN */}
      <div className={styles.card}>
        <div className={styles.cardIconWrap}>
          <IconLock size={22} />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardTitle}>Transaction PIN (4-Digit)</div>
          <div className={styles.cardSub}>Required to authorize airtime, data, and bill payments</div>
          <div className={styles.pinIndicator}>
            <span className={styles.pinDots}>••••</span>
            <span className={styles.pinActiveBadge}>Active (4 digits)</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.changeBtn}
          onClick={() => openPinModal('txPin')}
        >
          Change
        </button>
      </div>

      {/* Section 3: Biometric Fingerprint Authentication */}
      <div className={styles.card}>
        <div className={styles.cardIconWrap} style={{ background: '#FFF8D6', color: '#B08A00' }}>
          <IconFingerprint size={24} />
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardTitle}>Biometric Authentication</div>
          <div className={styles.cardSub}>Sign in faster using your device fingerprint sensor</div>
          <div className={styles.statusRow}>
            <span className={biometrics ? styles.badgeEnabled : styles.badgeDisabled}>
              {biometrics ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        <div
          className={`${styles.toggleSwitch} ${biometrics ? styles.toggleOn : ''}`}
          onClick={handleToggleBiometrics}
          role="switch"
          aria-checked={biometrics}
        >
          <div className={styles.toggleThumb} />
        </div>
      </div>

      {/* Change PIN Modal */}
      {modalType && (
        <div className={styles.modalOverlay} onClick={() => setModalType(null)}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                {modalType === 'loginPin' ? 'Change 6-Digit Login PIN' : 'Change 4-Digit Transaction PIN'}
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setModalType(null)}
              >
                <IconX size={20} />
              </button>
            </div>

            <div className={styles.modalSub}>
              {modalType === 'loginPin'
                ? 'Enter your current 6-digit login PIN and set a new one.'
                : 'Enter your current 4-digit transaction PIN and set a new one.'}
            </div>

            {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}

            <div className={styles.formFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.inputLabel}>
                  Current {modalType === 'loginPin' ? '6-Digit' : '4-Digit'} PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={modalType === 'loginPin' ? 6 : 4}
                  className={styles.pinInput}
                  placeholder={modalType === 'loginPin' ? '••••••' : '••••'}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.inputLabel}>
                  New {modalType === 'loginPin' ? '6-Digit' : '4-Digit'} PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={modalType === 'loginPin' ? 6 : 4}
                  className={styles.pinInput}
                  placeholder={modalType === 'loginPin' ? '••••••' : '••••'}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.inputLabel}>
                  Confirm New {modalType === 'loginPin' ? '6-Digit' : '4-Digit'} PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={modalType === 'loginPin' ? 6 : 4}
                  className={styles.pinInput}
                  placeholder={modalType === 'loginPin' ? '••••••' : '••••'}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSavePin}
            >
              Update {modalType === 'loginPin' ? 'Login PIN' : 'Transaction PIN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
