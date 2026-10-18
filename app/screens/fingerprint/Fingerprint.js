'use client';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconFingerprint } from '../../components/Icons';
import styles from './Fingerprint.module.css';

export default function FingerprintScreen() {
  const { navigate, state } = useApp();
  const [status, setStatus] = useState('waiting'); // waiting | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Automatically trigger fingerprint on mount
  useEffect(() => {
    const attemptBiometric = async () => {
      // Check if Web Authentication API is available
      if (window.PublicKeyCredential && navigator.credentials) {
        try {
          setStatus('scanning');
          // Use the Web Authentication API for biometric
          const credential = await navigator.credentials.create({
            publicKey: {
              challenge: new Uint8Array(32),
              rp: { name: 'VTUflash' },
              user: {
                id: new Uint8Array(16),
                name: state.user.email || 'user@vtuflash.com',
                displayName: state.user.name,
              },
              pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
              },
              timeout: 60000,
            },
          });
          if (credential) {
            setStatus('success');
            setTimeout(() => navigate('splash-to-dash'), 800);
          }
        } catch (err) {
          // If biometric fails or is cancelled, show PIN option
          setStatus('error');
          setErrorMsg('Biometric authentication cancelled or not available');
        }
      } else {
        // Fallback: simulate device fingerprint for demo on non-supporting browsers
        setStatus('scanning');
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => navigate('splash-to-dash'), 800);
        }, 2000);
      }
    };

    // Small delay before triggering to let the animation play
    const timer = setTimeout(attemptBiometric, 600);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {state.user.profileImage ? (
            <img
              src={state.user.profileImage}
              alt="Profile"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            state.user.initial
          )}
        </div>
        <div className={styles.welcome}>Welcome back, {state.user.name}</div>
      </div>

      <div className={styles.sensorWrap}>
        <div className={`${styles.pulse1} ${status === 'scanning' ? styles.pulseActive : ''}`} />
        <div className={`${styles.pulse2} ${status === 'scanning' ? styles.pulseActive : ''}`} />
        <div className={`${styles.sensor} ${status === 'success' ? styles.sensorSuccess : status === 'error' ? styles.sensorError : ''}`}>
          {status === 'success' ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <IconFingerprint size={84} />
          )}
        </div>
      </div>

      <div className={styles.instructions}>
        {status === 'waiting' && (
          <>
            <div className={styles.title}>Preparing sensor...</div>
            <div className={styles.subtitle}>Please wait</div>
          </>
        )}
        {status === 'scanning' && (
          <>
            <div className={styles.title}>Place your finger on the sensor</div>
            <div className={styles.subtitle}>Authenticating...</div>
          </>
        )}
        {status === 'success' && (
          <>
            <div className={styles.titleSuccess}>Authenticated!</div>
            <div className={styles.subtitle}>Unlocking your account...</div>
          </>
        )}
        {status === 'error' && (
          <>
            <div className={styles.titleError}>Authentication Failed</div>
            <div className={styles.subtitle}>{errorMsg}</div>
          </>
        )}
      </div>

      <div className={styles.bottom}>
        <button className={styles.pinBtn} onClick={() => navigate('unlock-pin')}>Use PIN instead</button>
      </div>
    </div>
  );
}
