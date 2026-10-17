'use client';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { IconCheck, IconClock } from '../../components/Icons';

export default function KYCProcessingScreen() {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('kyc-verified');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '90px' }}>
      {/* Centered Top Visual */}
      <div style={{ textAlign: 'center', paddingTop: '90px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#F0B90B', color: '#000', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(240, 185, 11, 0.35)' }}>
          <IconClock size={44} />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '20px' }}>Verification in progress</div>
        <div style={{ marginTop: '10px' }}>
          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: '#FEF3C7', color: '#92400E' }}>
            Pending
          </span>
        </div>
        <div style={{ fontSize: '14px', color: '#777', margin: '12px 40px 0' }}>
          This usually takes a few minutes. We will notify you.
        </div>
      </div>

      {/* Steps Status Card */}
      <div style={{ padding: '0 16px', marginTop: '48px' }}>
        <div className="card" style={{ padding: '8px 18px' }}>
          <div className="fx" style={{ gap: '14px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#16A34A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <IconCheck size={16} />
            </div>
            <span style={{ fontWeight: 500, flex: 1 }}>Identity submitted</span>
            <span style={{ fontSize: '13px', color: '#777' }}>Done</span>
          </div>

          <div className="fx" style={{ gap: '14px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#16A34A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <IconCheck size={16} />
            </div>
            <span style={{ fontWeight: 500, flex: 1 }}>Selfie matched</span>
            <span style={{ fontSize: '13px', color: '#777' }}>Done</span>
          </div>

          <div className="fx" style={{ gap: '14px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F0B90B', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <IconClock size={16} />
            </div>
            <span style={{ fontWeight: 500, flex: 1 }}>Final review</span>
            <span style={{ fontSize: '13px', color: '#777' }}>Pending</span>
          </div>
        </div>
      </div>

      {/* Stationary Bottom Button */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40 }}>
        <button type="button" className="btn" onClick={() => navigate('dashboard')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
