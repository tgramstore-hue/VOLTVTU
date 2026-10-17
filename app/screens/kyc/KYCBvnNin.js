'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconChevronLeft, IconLock, IconCheck } from '../../components/Icons';

export default function KYCBvnNinScreen() {
  const { navigate, goBack } = useApp();
  const [docType, setDocType] = useState('bvn');
  const [value, setValue] = useState('');
  const [agreed, setAgreed] = useState(true);

  const isValid = value.length === 11 && agreed;

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '90px' }}>
      {/* Top Header */}
      <div className="fx" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#f5f5f5', padding: '24px 16px 12px', gap: '14px', display: 'flex', alignItems: 'center' }}>
        <button type="button" className="bk" aria-label="Back" onClick={goBack}>
          <IconChevronLeft size={22} />
        </button>
        <span style={{ fontSize: '21px', fontWeight: 600 }}>BVN or NIN</span>
      </div>

      <div style={{ padding: '0 16px', marginTop: '10px' }}>
        {/* Toggle Chips */}
        <div className="g" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            className={`chip ${docType === 'bvn' ? 'on' : ''}`}
            onClick={() => { setDocType('bvn'); setValue(''); }}
          >
            BVN
          </button>
          <button
            type="button"
            className={`chip ${docType === 'nin' ? 'on' : ''}`}
            onClick={() => { setDocType('nin'); setValue(''); }}
          >
            NIN
          </button>
        </div>

        <div className="lab" style={{ fontSize: '14px', color: '#666', margin: '18px 0 8px 6px' }}>
          Enter your 11-digit {docType.toUpperCase()}
        </div>

        <input
          className="in"
          type="text"
          placeholder="00000000000"
          value={value}
          maxLength={11}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
        />

        {/* Security Note Card */}
        <div className="card fx" style={{ gap: '12px', padding: '14px 16px', marginTop: '18px', fontSize: '14px', color: '#444', lineHeight: 1.5, display: 'flex', alignItems: 'center' }}>
          <IconLock size={22} />
          <span>Your details are used only to verify your identity and are kept secure.</span>
        </div>

        {/* Consent Checkbox */}
        <div
          className="fx"
          style={{ gap: '12px', marginTop: '22px', display: 'flex', alignItems: 'center', cursor: 'default' }}
          onClick={() => setAgreed(!agreed)}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: agreed ? '#F0B90B' : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none', transition: 'background 0.2s' }}>
            {agreed && <IconCheck size={16} />}
          </div>
          <span style={{ fontSize: '14px', color: '#444' }}>I agree to the verification terms</span>
        </div>
      </div>

      {/* Stationary Bottom Button */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40 }}>
        <button
          type="button"
          className="btn"
          disabled={!isValid}
          style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
          onClick={() => navigate('kyc-selfie')}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
