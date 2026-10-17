'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './KYC.module.css';

export default function KYCBvnNinScreen() {
  const { navigate, goBack } = useApp();
  const [docType, setDocType] = useState('bvn');
  const [number, setNumber] = useState('22345678901');

  const isValid = number.length === 11;

  return (
    <div className={styles.container}>
      <PageHeader title="Identity Number" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.toggleWrap}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${docType === 'bvn' ? styles.toggleActive : ''}`}
            onClick={() => setDocType('bvn')}
          >
            Bank Verification Number (BVN)
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${docType === 'nin' ? styles.toggleActive : ''}`}
            onClick={() => setDocType('nin')}
          >
            National Identity (NIN)
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>
            Enter 11-Digit {docType.toUpperCase()}
          </span>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. 22233344455"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={11}
          />
        </div>

        <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, background: '#fff', padding: '14px 16px', borderRadius: 18 }}>
          🔒 Your {docType.toUpperCase()} is encrypted with 256-bit bank grade security and is only used to verify your full legal identity with official databases.
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            disabled={!isValid}
            onClick={() => navigate('kyc-selfie')}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
