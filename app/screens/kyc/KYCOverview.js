'use client';
import { useApp } from '../../context/AppContext';
import { IconChevronLeft, IconShield, IconLock, IconCheck } from '../../components/Icons';

export default function KYCOverviewScreen() {
  const { navigate, goBack, state } = useApp();
  const user = state.user;

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '90px' }}>
      {/* Top Header */}
      <div className="fx" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#f5f5f5', padding: '24px 16px 12px', gap: '14px' }}>
        <button type="button" className="bk" aria-label="Back" onClick={goBack}>
          <IconChevronLeft size={22} />
        </button>
        <span style={{ fontSize: '21px', fontWeight: 600 }}>Verify Your Identity</span>
      </div>

      <div style={{ padding: '0 16px', marginTop: '10px' }}>
        {/* Tier Progress Card (black) */}
        <div className="card" style={{ padding: '18px', background: '#0B0B0B', color: '#fff' }}>
          <div className="fx sp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#bdbdbd' }}>Your level</div>
              <div style={{ fontSize: '22px', fontWeight: 600, marginTop: '4px' }}>
                Tier {user.tier} · {user.tier === 1 ? 'Basic' : user.tier === 2 ? 'Standard' : 'Premium'}
              </div>
            </div>
            <div className="ico" style={{ background: '#F0B90B', color: '#000' }}>
              <IconShield size={24} />
            </div>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: '#2a2a2a', marginTop: '16px' }}>
            <div style={{ width: user.tier === 1 ? '33%' : user.tier === 2 ? '66%' : '100%', height: '8px', borderRadius: '4px', background: '#F0B90B', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: '13px', color: '#bdbdbd', marginTop: '10px' }}>Verify to unlock higher limits</div>
        </div>

        {/* 3 Tier Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {/* Tier 1 */}
          <div className="card fx sp" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="fx" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="ico">
                <IconShield size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Tier 1 · Basic</div>
                <div style={{ fontSize: '13px', color: '#777', marginTop: '2px' }}>Phone &amp; email</div>
              </div>
            </div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRaddius: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: '#DCFCE7', color: '#15803D' }}>
              Done
            </span>
          </div>

          {/* Tier 2 */}
          <div
            className="card fx sp"
            style={{
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 0 0 2px #F0B90B, 0 6px 22px rgba(0,0,0,.07)',
              cursor: 'default'
            }}
            onClick={() => navigate('kyc-bvn-nin')}
          >
            <div className="fx" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="ico" style={{ background: '#F0B90B', color: '#000' }}>
                <IconShield size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Tier 2 · BVN or NIN</div>
                <div style={{ fontSize: '13px', color: '#777', marginTop: '2px' }}>Daily limit ₦5,000,000</div>
              </div>
            </div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: '#FEF3C7', color: '#92400E' }}>
              Next
            </span>
          </div>

          {/* Tier 3 */}
          <div className="card fx sp" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="fx" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="ico">
                <IconLock size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Tier 3 · ID &amp; selfie</div>
                <div style={{ fontSize: '13px', color: '#777', marginTop: '2px' }}>Daily limit ₦20,000,000</div>
              </div>
            </div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, background: '#F1F1F1', color: '#555' }}>
              Locked
            </span>
          </div>
        </div>
      </div>

      {/* Stationary Bottom Button */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40 }}>
        <button type="button" className="btn" onClick={() => navigate('kyc-bvn-nin')}>
          Start Verification
        </button>
      </div>
    </div>
  );
}
