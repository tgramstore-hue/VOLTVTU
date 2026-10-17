'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './KYC.module.css';

export default function KYCUploadIdScreen() {
  const { navigate, goBack } = useApp();
  const [docType, setDocType] = useState('nin');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  return (
    <div className={styles.container}>
      <PageHeader title="Upload ID Document" onBack={goBack} />

      <div className={styles.content}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>
            Document Type
          </span>
          <select
            className={styles.input}
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <option value="nin">National Identity Card / Slip (NIN)</option>
            <option value="drivers">Driver&apos;s License</option>
            <option value="voters">Voter&apos;s Card (INEC)</option>
            <option value="passport">International Passport</option>
          </select>
        </div>

        <div
          className={`${styles.uploadBox} ${frontUploaded ? styles.uploadBoxActive : ''}`}
          onClick={() => setFrontUploaded(!frontUploaded)}
        >
          <div style={{ fontSize: 28 }}>{frontUploaded ? '✅' : '📄'}</div>
          <div className={styles.uploadLabel}>
            {frontUploaded ? 'Front of ID Selected' : 'Tap to Upload Front of ID'}
          </div>
          <div className={styles.uploadSub}>JPG, PNG, or PDF max 5MB</div>
        </div>

        <div
          className={`${styles.uploadBox} ${backUploaded ? styles.uploadBoxActive : ''}`}
          onClick={() => setBackUploaded(!backUploaded)}
        >
          <div style={{ fontSize: 28 }}>{backUploaded ? '✅' : '📄'}</div>
          <div className={styles.uploadLabel}>
            {backUploaded ? 'Back of ID Selected' : 'Tap to Upload Back of ID'}
          </div>
          <div className={styles.uploadSub}>Clear, readable copy</div>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => navigate('kyc-processing')}
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}
