'use client';
import { useApp } from '../../context/AppContext';
import {
  IconNavyPhone, IconNavyData, IconNavyTV, IconNavyBetting,
  IconNavyElectricity, IconNavyEducation, IconNavyGiftCard, IconNavyMore
} from '../services/Services';
import styles from './Dashboard.module.css';

const services = [
  { icon: IconNavyPhone, label: 'Airtime', screen: 'airtime' },
  { icon: IconNavyData, label: 'Data', screen: 'data' },
  { icon: IconNavyTV, label: 'CableTV', screen: 'cable' },
  { icon: IconNavyBetting, label: 'Betting', screen: 'betting' },
  { icon: IconNavyElectricity, label: 'Electricity', screen: 'electricity' },
  { icon: IconNavyEducation, label: 'Education', screen: 'exam' },
  { icon: IconNavyGiftCard, label: 'Gift Card', screen: 'giftcard' },
  { icon: IconNavyMore, label: 'More', screen: 'services' },
];

const topBanners = [
  {
    bg: '#18191E',
    color: '#fff',
    subColor: '#aaa',
    title: 'Trade & Buy Gift Cards',
    sub: 'Amazon, Steam, Apple & Razer rates.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Trade',
    screen: 'giftcard'
  },
  {
    bg: '#0D1C13',
    color: '#fff',
    subColor: '#98d8aa',
    title: 'Airtime to Cash',
    sub: 'Convert MTN, Airtel & Glo to cash.',
    btnBg: '#22C55E',
    btnColor: '#fff',
    btnText: 'Convert',
    screen: 'services'
  },
  {
    bg: '#081B2B',
    color: '#fff',
    subColor: '#93c5fd',
    title: 'Buy Virtual Numbers',
    sub: 'USA, UK, Canada SMS verification.',
    btnBg: '#38BDF8',
    btnColor: '#000',
    btnText: 'Get Now',
    screen: 'virtual-numbers'
  },
  {
    bg: '#1C1908',
    color: '#fff',
    subColor: '#e0d890',
    title: 'Cheap SME Data Plans',
    sub: '1GB from ₦280 instant delivery.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Buy Data',
    screen: 'data'
  },
];

const bottomBanners = [
  {
    bg: '#F0B90B',
    color: '#000',
    subColor: '#3d3000',
    title: 'Invite & Earn Rewards',
    sub: 'Refer friends & earn on every purchase.',
    btnBg: '#000',
    btnColor: '#fff',
    btnText: 'Invite',
    screen: 'rewards'
  },
  {
    bg: '#0B0B0B',
    color: '#fff',
    subColor: '#bdbdbd',
    title: 'Pay Bills Instantly',
    sub: 'DStv, GOtv, Startimes & Disco tokens.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Pay',
    screen: 'cable'
  },
  {
    bg: '#fff',
    color: '#000',
    subColor: '#666',
    title: '24/7 Fast Support',
    sub: 'WhatsApp & customer support available.',
    btnBg: '#000',
    btnColor: '#fff',
    btnText: 'Chat',
    screen: 'help-support'
  },
  {
    bg: '#0B0B0B',
    color: '#fff',
    subColor: '#bdbdbd',
    title: 'Exam Result Pins',
    sub: 'WAEC, NECO & NABTEB instant tokens.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Buy',
    screen: 'exam'
  },
];

export default function DashboardScreen() {
  const { navigate, state } = useApp();
  const latestTx = state.transactions && state.transactions[0];

  return (
    <div className={styles.container}>
      {/* Top Header */}
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
              state.user.initial || 'E'
            )}
          </div>
          <span className={styles.greeting}>Hi, {state.user.name.toUpperCase()}</span>
        </div>
        <div className={styles.headerIcons}>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Support" onClick={() => navigate('help-support')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3z" />
            </svg>
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Scan QR" onClick={() => navigate('add-money')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16" />
            </svg>
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Notifications" onClick={() => navigate('notifications')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance Card (matching previous design exactly) */}
      <div className={styles.balanceSection} style={{ '--i': 1 }}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceTop}>
            <div>
              <div className={styles.balanceLabel}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z"/>
                </svg>
                Available balance
              </div>
              <div className={styles.balanceAmount}>
                ₦{state.user.balance.toLocaleString()}.00
              </div>
            </div>
            <button type="button" className={styles.addBtn} onClick={() => navigate('add-money')}>
              + Add Money
            </button>
          </div>

          <div className={styles.cashback}>
            Cashback earned today <span className={styles.cashbackVal}>+₦{state.user.cashback || '0'}.00</span>
          </div>
        </div>

        <div className={styles.transStrip}>
          <span>Last purchase: {latestTx ? latestTx.title : 'Data'}</span>
          <span className={styles.transLink} onClick={() => navigate('transactions')}>
            Transactions ›
          </span>
        </div>
      </div>

      {/* Last Transaction Card (matching reference design) */}
      {latestTx && (
        <div
          className={styles.lastTxCard}
          style={{ cursor: 'pointer', '--i': 2 }}
          onClick={() => navigate('transactions')}
        >
          <div className={styles.lastTxLeft}>
            <div className={styles.lastTxIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={latestTx.amount > 0 ? '#16A34A' : '#0D9488'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {latestTx.amount > 0 ? (
                  <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
                ) : (
                  <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
                )}
              </svg>
            </div>
            <div className={styles.lastTxInfo}>
              <div className={styles.lastTxTitle}>{latestTx.title}</div>
              <div className={styles.lastTxTime}>{latestTx.time || 'Just now'}</div>
            </div>
          </div>
          <div className={styles.lastTxRight}>
            <div className={styles.lastTxAmount}>
              {latestTx.amount > 0 ? '+' : '-'}₦{Math.abs(latestTx.amount).toLocaleString()}.00
            </div>
            <span className={styles.lastTxArrow}>›</span>
          </div>
        </div>
      )}

      {/* Top Banner Carousel (Replaces 'To Wallet, To Bank, Save, Withdraw' with matching 96px banner size) */}
      <div className={styles.carouselWrap} style={{ '--i': 3 }}>
        <div className={styles.carouselTrack}>
          {[...topBanners, topBanners[0]].map((b, i) => (
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

      {/* Top Carousel Dots */}
      <div className={styles.dots}>
        <div className={styles.dot} style={{ animation: 'd1 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd2 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd3 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd4 15s ease-in-out infinite' }} />
      </div>

      {/* Services Grid with deep Navy Blue icons & 'More' replacing Global Topup */}
      <div className={styles.servicesGrid} style={{ '--i': 4 }}>
        {services.map(({ icon: Icon, label, screen }) => (
          <div key={label} className={styles.serviceItem} onClick={() => navigate(screen)}>
            <div className={styles.serviceIcon}>
              <Icon />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Banner Carousel closer to menu tab (uniform 96px size with top carousel) */}
      <div className={styles.carouselWrap} style={{ '--i': 5 }}>
        <div className={styles.carouselTrack}>
          {[...bottomBanners, bottomBanners[0]].map((b, i) => (
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

      {/* Bottom Carousel Dots */}
      <div className={styles.dots}>
        <div className={styles.dot} style={{ animation: 'd1 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd2 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd3 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd4 15s ease-in-out infinite' }} />
      </div>
    </div>
  );
}
