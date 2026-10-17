'use client';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/BottomNav';
import { IconShield, IconHeadphones, IconScan, IconBell, IconUser, IconBank, IconWallet, IconDownload, IconPhone, IconData, IconTV, IconBolt, IconExam, IconBetting, IconSwap, IconGrid, IconHome } from '../../components/Icons';
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
  { icon: IconGrid, label: 'More', screen: 'dashboard' },
];

const banners = [
  { bg: '#F0B90B', color: '#000', subColor: '#3d3000', title: 'Invite & Earn', sub: 'Refer a friend and earn on every purchase.', btnBg: '#000', btnColor: '#fff', btnText: 'Go' },
  { bg: '#0B0B0B', color: '#fff', subColor: '#bdbdbd', title: 'Cheap Data Bundles', sub: 'All networks, delivered instantly.', btnBg: '#F0B90B', btnColor: '#000', btnText: 'Buy' },
  { bg: '#fff', color: '#000', subColor: '#666', title: 'Pay Bills Fast', sub: 'DStv, GOtv, Startimes & electricity.', btnBg: '#000', btnColor: '#fff', btnText: 'Pay' },
  { bg: '#0B0B0B', color: '#fff', subColor: '#bdbdbd', title: 'Exam Pins', sub: 'WAEC, NECO & NABTEB pins instantly.', btnBg: '#F0B90B', btnColor: '#000', btnText: 'Buy' },
];

export default function DashboardScreen() {
  const { navigate, state } = useApp();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={{ '--i': 0 }}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{state.user.initial}</div>
          <span className={styles.greeting}>Hi, {state.user.name.toUpperCase()}</span>
        </div>
        <div className={styles.headerIcons}>
          <IconHeadphones size={26} />
          <IconScan size={26} />
          <IconBell size={26} />
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
        <div className={styles.transStrip}>
          <span>Last purchase: Data</span>
          <span className={styles.transLink} onClick={() => navigate('transactions')}>Transactions ›</span>
        </div>
      </div>

      {/* Reseller banner */}
      <div className={styles.resellerCard} style={{ '--i': 2 }}>
        <span>Reseller Service – Today&apos;s Sales: <b>₦0.00</b></span>
        <span>›</span>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions} style={{ '--i': 3 }}>
        {quickActions.map(({ icon: Icon, label }, i) => (
          <div key={label} className={styles.actionItem}>
            <div className={styles.actionIcon}><Icon size={24} /></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div className={styles.servicesGrid} style={{ '--i': 4 }}>
        {services.map(({ icon: Icon, label, screen }, i) => (
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
              <button className={styles.bannerBtn} style={{ background: b.btnBg, color: b.btnColor }}>{b.btnText}</button>
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

      <BottomNav />
    </div>
  );
}
