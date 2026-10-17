'use client';
import { useApp } from '../../context/AppContext';
import { IconX, IconCheck } from '../../components/Icons';

export default function KYCFailedScreen() {
  const { navigate } = useApp();

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '140px' }}>
      {/* Centered Top Visual */}
      <div style={{ textAlign: 'center', paddingTop: '90px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#DC2626', color: '#fff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.35)', animation: 'pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <IconX size={44} />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '20px' }}>Verification failed</div>
        <div style={{ fontSize: '15px', color: '#777', margin: '8px 40px 0' }}>
          Your selfie did not match the photo on your ID.
        </div>
      </div>

      {/* Tips Card */}
      <div style={{ padding: '0 16px', marginTop: '48px' }}>
        <div className="card" style={{ padding: '8px 18px' }}>
          <div className="fx" style={{ gap: '12px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none' }}>
              <IconCheck size={14} />
            </div>
            <span style={{ fontSize: '15px' }}>Use a clear, well-lit photo</span>
          </div>

          <div className="fx" style={{ gap: '12px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none' }}>
              <IconCheck size={14} />
            </div>
            <span style={{ fontSize: '15px' }}>Make sure the ID is not blurred</span>
          </div>

          <div className="fx" style={{ gap: '12px', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#F0B90B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flex: 'none' }}>
              <IconCheck size={14} />
            </div>
            <span style={{ fontSize: '15px' }}>Look straight at the camera</span>
          </div>
        </div>
      </div>

      {/* Stationary Bottom 2 Buttons */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button type="button" className="btn w" onClick={() => alert('Support line: WhatsApp 08000000000')}>
          Contact Support
        </button>
        <button type="button" className="btn" onClick={() => navigate('kyc-overview')}>
          Try Again
        </button>
      </div>
    </div>
  );
}
