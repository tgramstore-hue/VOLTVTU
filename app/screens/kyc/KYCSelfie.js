'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import { IconShield } from '../../components/Icons';
import styles from './KYC.module.css';

export default function KYCSelfieScreen() {
  const { navigate, goBack } = useApp();
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
    setTimeout(() => {
      navigate('kyc-upload-id');
    }, 600);
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Facial Verification" onBack={goBack} />

      <div className={styles.content}>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>Take a Clear Selfie</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
            Ensure your face is well-lit and fits within the oval outline.
          </div>
        </div>

        <div className={styles.selfieFrame}>
          <div style={{ fontSize: 52 }}>{captured ? '📸' : '👤'}</div>
          <div className={styles.selfieHint}>
            {captured ? 'Selfie Captured!' : 'Center face here'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: '#666' }}>
          <IconShield size={16} />
          <span>Liveness detection active</span>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            onClick={handleCapture}
          >
            {captured ? 'Processing...' : 'Capture Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
