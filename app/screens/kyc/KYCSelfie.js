'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconChevronLeft, IconCheck } from '../../components/Icons';

export default function KYCSelfieScreen() {
  const { navigate, goBack } = useApp();
  const [capturing, setCapturing] = useState(false);

  const handleCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      navigate('kyc-upload-id');
    }, 700);
  };

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '90px' }}>
      {/* Top Header */}
      <div className="fx" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#f5f5f5', padding: '24px 16px 12px', gap: '14px', display: 'flex', alignItems: 'center' }}>
        <button type="button" className="bk" aria-label="Back" onClick={goBack}>
          <IconChevronLeft size={22} />
        </button>
        <span style={{ fontSize: '21px', fontWeight: 600 }}>Take a Selfie</span>
      </div>

      {/* Selfie Oval Dashed Frame */}
      <div style={{ margin: '30px auto 0', width: '240px', height: '240px', borderRadius: '50%', border: '3px dashed #F0B90B', boxSizing: 'border-box', padding: '12px' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: capturing ? '#FFFBEB' : '#e9e9e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: capturing ? '#F0B90B' : '#9a9a9a', transition: 'all 0.3s' }}>
          <svg className="ic" width="110" height="110" viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </div>
      </div>

      {/* Checklist Card */}
      <div style={{ padding: '0 16px', marginTop: '36px' }}>
        <div className="card" style={{ padding: '8px 18px' }}>
          <div className="fx" style={{ gap: '12px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none' }}>
              <IconCheck size={14} />
            </div>
            <span style={{ fontSize: '15px' }}>Find good lighting</span>
          </div>
          <div className="fx" style={{ gap: '12px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none' }}>
              <IconCheck size={14} />
            </div>
            <span style={{ fontSize: '15px' }}>Remove glasses and cap</span>
          </div>
          <div className="fx" style={{ gap: '12px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none' }}>
              <IconCheck size={14} />
            </div>
            <span style={{ fontSize: '15px' }}>Keep your face inside the circle</span>
          </div>
        </div>
      </div>

      {/* Stationary Bottom Button */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40 }}>
        <button
          type="button"
          className="btn"
          disabled={capturing}
          onClick={handleCapture}
        >
          {capturing ? 'Capturing Photo...' : 'Take Selfie'}
        </button>
      </div>
    </div>
  );
}
