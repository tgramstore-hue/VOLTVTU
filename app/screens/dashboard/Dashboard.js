'use client';
import { useApp } from '../../context/AppContext';
import {
  IconShield, IconHeadphones, IconScan, IconBell, IconUser, IconBank,
  IconWallet, IconDownload, IconPhone, IconData, IconTV, IconBolt,
  IconExam, IconBetting, IconSwap, IconGrid
} from '../../components/Icons';
import styles from './Dashboard.module.css';

const quickActions = [
  { icon: IconUser, label: 'To Wallet' },
  { icon: IconBank, label: 'To Bank' },
  { icon: IconWallet, label: 'Save' },
  { icon: IconDownload, label: 'Withdraw' },
];

const services = [
  { icon: IconPhone, label: 'Airtime', screen: 'airtime' },
  { icon: IconData, label: 'Data', screen: 'data' },
  { icon: IconTV, label: 'Cable TV', screen: 'cable' },
  { icon: IconBolt, label: 'Electricity', screen: 'electricity' },
  { icon: IconExam, label: 'Exam Pins', screen: 'exam' },
  { icon: IconBetting, label: 'Betting', screen: 'betting' },
  { icon: IconSwap, label: 'Airtime to Cash', screen: 'airtime' },
  { icon: IconGrid, label: 'More', screen: 'services' },
];

const banners = [
  { bg: '#F0B90B', color: '#000', subColor: '#3d3000', title: 'Invite & Earn', sub: 'Refer a friend and earn on every purchase.', btnBg: '#000', btnColor: '#fff', btnText: 'Go', screen: 'rewards' },
  { bg: '#0B0B0B', color: '#fff', subColor: '#bdbdbd', title: 'Cheap Data Bundles', sub: 'All networks, delivered instantly.', btnBg: '#F0B90B', btnColor: '#000', btnText: 'Buy', screen: 'data' },
  { bg: '#fff', color: '#000', subColor: '#666', title: 'Pay Bills Fast', sub: 'DStv, GOtv, Startimes & electricity.', btnBg: '#000', btnColor: '#fff', btnText: 'Pay', screen: 'cable' },
  { bg: '#0B0B0B', color: '#fff', subColor: '#bdbdbd', title: 'Exam Pins', sub: 'WAEC, NECO & NABTEB pins instantly.', btnBg: '#F0B90B', btnColor: '#000', btnText: 'Buy', screen: 'exam' },
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
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Support" onClick={() => alert('Support line: WhatsApp 08000000000')}>
            <IconHeadphones size={24} />
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Scan QR">
            <IconScan size={24} />
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Notifications">
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
                <IconShield size={18} />
                Available balance
              </div>
              <div className={styles.balanceAmount}>₦{state.user.balance.toLocaleString()}.00</div>
            </div>
            <button className={styles.addBtn} onClick={() => navigate('add-money')}>+ Add Money</button>
          </div>
          <div className={styles.cashback}>
            Cashback earned today <span className={styles.cashbackVal}>+₦{state.user.cashback.toLocaleString()}.00</span>
          </div>
        </div>
      </div>

      {/* Recent Transaction Card (Replaces Reseller banner) */}
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
            cursor: 'pointer'
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

      {/* Quick Actions */}
      <div className={styles.quickActions} style={{ '--i': 3 }}>
        {quickActions.map(({ icon: Icon, label }) => (
          <div key={label} className={styles.actionItem} onClick={() => label === 'Withdraw' ? alert('Withdraw feature coming soon!') : navigate('add-money')}>
            <div className={styles.actionIcon}><Icon size={24} /></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Services Grid */}
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
