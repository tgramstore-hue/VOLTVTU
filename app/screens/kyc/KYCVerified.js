'use client';
import { useApp } from '../../context/AppContext';
import { IconCheck } from '../../components/Icons';

export default function KYCVerifiedScreen() {
  const { navigate, updateUser } = useApp();

  const handleDone = () => {
    updateUser({ tier: 2, kycStatus: 'verified' });
    navigate('dashboard');
  };

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '90px' }}>
      {/* Centered Top Visual */}
      <div style={{ textAlign: 'center', paddingTop: '90px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#16A34A', color: '#fff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)', animation: 'pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <IconCheck size={44} />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '20px' }}>You are verified</div>
        <div style={{ fontSize: '15px', color: '#777', marginTop: '8px' }}>Tier 2 is now unlocked</div>
      </div>

      {/* Summary Card */}
      <div style={{ padding: '0 16px', marginTop: '48px' }}>
        <div className="card" style={{ padding: '8px 18px' }}>
          <div className="rw" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#777' }}>Level</span>
            <span style={{ fontWeight: 600 }}>Tier 2</span>
          </div>
          <div className="rw" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#777' }}>Daily limit</span>
            <span style={{ fontWeight: 600 }}>₦5,000,000.00</span>
          </div>
          <div className="rw" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '12px 0' }}>
            <span style={{ color: '#777' }}>Status</span>
            <span style={{ color: '#15803D', background: '#DCFCE7', padding: '3px 10px', borderRadius: '10px', fontWeight: 600, fontSize: '13px' }}>
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Stationary Bottom Button */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40 }}>
        <button type="button" className="btn" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
}
