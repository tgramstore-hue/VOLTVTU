'use client';
import { useApp } from '../../context/AppContext';
import {
  IconHeadphones, IconScan, IconBell,
  IconWallet, IconPhone, IconData, IconTV, IconBolt,
  IconExam, IconBetting
} from '../../components/Icons';
import styles from './Dashboard.module.css';

// SVG Icons matching the reference design in navy blue style
function IconGift(props) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function IconGlobalPhone(props) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
      <path d="M9 7l3-3 3 3"/>
      <path d="M15 13l-3 3-3-3"/>
    </svg>
  );
}

const services = [
  { icon: IconPhone, label: 'Airtime', screen: 'airtime' },
  { icon: IconData, label: 'Data', screen: 'data' },
  { icon: IconTV, label: 'CableTV', screen: 'cable' },
  { icon: IconBetting, label: 'Betting', screen: 'betting' },
  { icon: IconBolt, label: 'Electricity', screen: 'electricity' },
  { icon: IconExam, label: 'Education', screen: 'exam' },
  { icon: IconGift, label: 'Gift Card', screen: 'giftcard' },
  { icon: IconGlobalPhone, label: 'Global Topup', screen: 'virtual-numbers' },
];

const banners = [
  { bg: '#F0B90B', color: '#000', subColor: '#3d3000', title: 'Invite & Earn', sub: 'Refer a friend and earn on every purchase.', btnBg: '#000', btnColor: '#fff', btnText: 'Go', screen: 'rewards' },
  { bg: '#0B0B0B', color: '#fff', subColor: '#bdbdbd', title: 'Cheap Data Bundles', sub: 'All networks, delivered instantly.', btnBg: '#F0B90B', btnColor: '#000', btnText: 'Buy', screen: 'data' },
  { bg: '#fff', color: '#000', subColor: '#666', title: 'Pay Bills Fast', sub: 'DStv, GOtv, Startimes & electricity.', btnBg: '#000', btnColor: '#fff', btnText: 'Pay', screen: 'cable' },
  { bg: '#0B0B0B', color: '#fff', subColor: '#bdbdbd', title: 'Virtual Phone Numbers', sub: 'Receive SMS verification OTPs globally.', btnBg: '#F0B90B', btnColor: '#000', btnText: 'Get', screen: 'virtual-numbers' },
];

export default function DashboardScreen() {
  const { navigate, state } = useApp();
  const latestTx = state.transactions && state.transactions[0];

  return (
    <div className={styles.container}>
      {/* Stationary Sticky Top Header */}
      <div className={styles.header}>
        <div className={styles.userInfo} onClick={() => navigate('profile')}>
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
          <span className={styles.greeting}>Hi, {state.user.name.toUpperCase()}</span>
        </div>
        <div className={styles.headerIcons}>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'default', padding: 0 }} aria-label="Support" onClick={() => navigate('help-support')}>
            <IconHeadphones size={24} />
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'default', padding: 0 }} aria-label="Scan QR" onClick={() => navigate('add-money')}>
            <IconScan size={24} />
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'default', padding: 0 }} aria-label="Notifications" onClick={() => navigate('notifications')}>
            <IconBell size={24} />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className={styles.balanceSection} style={{ '--i': 1 }}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceTop}>
            <div>
              <div className={styles.balanceLabel}>
                Wallet Balance (₦)
                <span className={styles.tierPill}>Tier {state.user.tier || 1}</span>
              </div>
              <div className={styles.balanceAmount}>
                ₦{state.user.balance.toLocaleString()}.00
              </div>
            </div>
            <button className={styles.addMoneyBtn} onClick={() => navigate('add-money')}>
              + Add Money
            </button>
          </div>

          <div className={styles.balanceDetails}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Cashback</span>
              <span className={styles.statValue}>₦{state.user.cashback}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Volt Points</span>
              <span className={styles.statValue}>{state.user.voltPoints} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transaction pill */}
      <div style={{ padding: '0 16px', marginTop: '12px', '--i': 2 }}>
        <div
          className="card"
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            cursor: 'default'
          }}
          onClick={() => navigate('transactions')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="ico" style={{ width: 40, height: 40, background: '#FFF4CC', color: '#000' }}>
              <IconWallet size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                {latestTx ? latestTx.title : 'No recent transaction'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#777', marginTop: '2px' }}>
                {latestTx ? `${latestTx.date} · ${latestTx.time}` : 'Start by recharging airtime or data'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            {latestTx && (
              <>
                <span style={{ fontSize: '14px', fontWeight: 800, color: latestTx.amount > 0 ? '#16A34A' : '#111' }}>
                  {latestTx.amount > 0 ? '+' : ''}₦{Math.abs(latestTx.amount).toLocaleString()}.00
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '8px' }}>
                  {latestTx.status.toUpperCase()}
                </span>
              </>
            )}
            {!latestTx && <span style={{ fontSize: '13px', color: '#F0B90B', fontWeight: 600 }}>History ›</span>}
          </div>
        </div>
      </div>

      {/* Feature Promo Banner (Replaces transfer/withdrawal quick actions) */}
      <div style={{ padding: '0 16px', marginTop: '14px', '--i': 3 }}>
        <div
          style={{
            background: '#0B0B0B',
            color: '#fff',
            borderRadius: '22px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            cursor: 'default',
          }}
          onClick={() => navigate('virtual-numbers')}
        >
          <div style={{ flex: 1, paddingRight: '12px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(240, 185, 11, 0.2)',
              color: '#F0B90B',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '8px',
              marginBottom: '5px'
            }}>HOT SERVICE</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
              Buy Virtual Phone Numbers
            </div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
              USA, UK, Canada & global SMS OTP verification
            </div>
          </div>
          <button
            type="button"
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '19px',
              background: '#F0B90B',
              color: '#000',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'default',
              flexShrink: 0
            }}
            onClick={(e) => { e.stopPropagation(); navigate('virtual-numbers'); }}
          >
            Get Number
          </button>
        </div>
      </div>

      {/* Services Grid matching exact reference arrangement */}
      <div className={styles.servicesGrid} style={{ '--i': 4 }}>
        {services.map(({ icon: Icon, label, screen }) => (
          <div key={label} className={styles.serviceItem} onClick={() => navigate(screen)}>
            <div className={styles.serviceIcon}><Icon size={24} /></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Banner Carousel */}
      <div className={styles.carouselWrap} style={{ '--i': 5 }}>
        <div className={styles.carouselTrack}>
          {[...banners, banners[0]].map((b, i) => (
            <div key={i} className={styles.bannerSlide} style={{ background: b.bg, color: b.color }}>
              <div>
                <div className={styles.bannerTitle}>{b.title}</div>
                <div className={styles.bannerSub} style={{ color: b.subColor }}>{b.sub}</div>
              </div>
              <button
                type="button"
                className={styles.bannerBtn}
                style={{ background: b.btnBg, color: b.btnColor }}
                onClick={() => navigate(b.screen)}
              >
                {b.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots */}
      <div className={styles.dots}>
        <div className={styles.dot} style={{ animation: 'd1 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd2 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd3 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd4 15s ease-in-out infinite' }} />
      </div>
    </div>
  );
}
