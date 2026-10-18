'use client';
import { useApp } from '../../context/AppContext';
import styles from './Services.module.css';

// SVG Icons styled in deep navy blue matching reference image
export function IconNavyPhone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-4.2-9.6c-.2-.2-.5-.3-.8-.3s-.6.1-.8.3l-1.4 1.4c-.4.4-.4 1 0 1.4l2.1 2.1c.4.4 1 .4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4l-1.9-2.1z"/>
    </svg>
  );
}

export function IconNavyData() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-6-8.5l-2 2h1.5v3h1v-3H13l-2-2zm2 5.5l2-2h-1.5v-3h-1v3H11l2 2z"/>
    </svg>
  );
}

export function IconNavyTV() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-11-2l6-4-6-4v8z"/>
    </svg>
  );
}

export function IconNavyBetting() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14l3-2 3 2 3-2 3 2 3-2 3 2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  );
}

export function IconNavyElectricity() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-1 10.5l-2-3.5h3v-2l2 3.5h-3v2zM9 20h6c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1z"/>
    </svg>
  );
}

export function IconNavyEducation() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    </svg>
  );
}

export function IconNavyGiftCard() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2zm-9 6H9v-2h2v2zm0-4H9V8h2v2zm4 4h-2v-2h2v2zm0-4h-2V8h2v2z"/>
    </svg>
  );
}

export function IconNavyGlobal() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A1172">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );
}

const PRIMARY_SERVICES = [
  { id: 'airtime', label: 'Airtime', icon: IconNavyPhone, screen: 'airtime' },
  { id: 'data', label: 'Data', icon: IconNavyData, screen: 'data' },
  { id: 'cable', label: 'CableTV', icon: IconNavyTV, screen: 'cable' },
  { id: 'betting', label: 'Betting', icon: IconNavyBetting, screen: 'betting' },
  { id: 'electricity', label: 'Electricity', icon: IconNavyElectricity, screen: 'electricity' },
  { id: 'education', label: 'Education', icon: IconNavyEducation, screen: 'exam' },
  { id: 'giftcard', label: 'Gift Card', icon: IconNavyGiftCard, screen: 'giftcard' },
  { id: 'global', label: 'Global Topup', icon: IconNavyGlobal, screen: 'virtual-numbers' },
];

export default function ServicesScreen() {
  const { navigate } = useApp();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>All Services</div>
      </div>

      {/* Primary 8 Services Grid matching user's reference screenshot */}
      <div className={styles.mainGridCard}>
        {PRIMARY_SERVICES.map((s) => {
          const IconComp = s.icon;
          return (
            <div
              key={s.id}
              className={styles.gridItem}
              onClick={() => navigate(s.screen)}
            >
              <div className={styles.iconBox}>
                <IconComp />
              </div>
              <span className={styles.itemLabel}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Virtual Numbers Feature Card */}
      <div
        className={styles.featureBanner}
        onClick={() => navigate('virtual-numbers')}
      >
        <div className={styles.featureLeft}>
          <div className={styles.featureBadge}>GLOBAL SMS & OTP</div>
          <div className={styles.featureTitle}>Buy Virtual Phone Numbers</div>
          <div className={styles.featureDesc}>
            Verify WhatsApp, Telegram, Google, PayPal & more with real USA, UK, Canada numbers.
          </div>
        </div>
        <button
          type="button"
          className={styles.featureBtn}
          onClick={(e) => { e.stopPropagation(); navigate('virtual-numbers'); }}
        >
          Select Country ›
        </button>
      </div>

      {/* Gift Cards Feature Card */}
      <div
        className={styles.giftCardBanner}
        onClick={() => navigate('giftcard')}
      >
        <div className={styles.featureLeft}>
          <div className={styles.giftCardBadge}>TRADE & BUY</div>
          <div className={styles.featureTitle}>Gift Cards & Vouchers</div>
          <div className={styles.featureDesc}>
            Buy or redeem Apple, Steam, Amazon & Razer Gold gift cards at unbeatable exchange rates.
          </div>
        </div>
        <button
          type="button"
          className={styles.giftCardBtn}
          onClick={(e) => { e.stopPropagation(); navigate('giftcard'); }}
        >
          View Rates ›
        </button>
      </div>

      {/* Quick Service Cards List */}
      <div className={styles.sectionHeader}>Quick Access</div>
      <div className={styles.quickList}>
        <div className={styles.quickRow} onClick={() => navigate('airtime')}>
          <div className={styles.quickLeft}>
            <div className={styles.quickIconCircle}>📞</div>
            <div>
              <div className={styles.quickTitle}>Airtime to Cash</div>
              <div className={styles.quickSub}>Convert excess airtime balance to wallet cash</div>
            </div>
          </div>
          <span className={styles.quickArrow}>›</span>
        </div>

        <div className={styles.quickRow} onClick={() => navigate('exam')}>
          <div className={styles.quickLeft}>
            <div className={styles.quickIconCircle}>🎓</div>
            <div>
              <div className={styles.quickTitle}>Exam Registration PINs</div>
              <div className={styles.quickSub}>WAEC, NECO & NABTEB result check tokens</div>
            </div>
          </div>
          <span className={styles.quickArrow}>›</span>
        </div>

        <div className={styles.quickRow} onClick={() => navigate('cable')}>
          <div className={styles.quickLeft}>
            <div className={styles.quickIconCircle}>📺</div>
            <div>
              <div className={styles.quickTitle}>Cable TV Subscriptions</div>
              <div className={styles.quickSub}>Instant activation for DStv, GOtv & Startimes</div>
            </div>
          </div>
          <span className={styles.quickArrow}>›</span>
        </div>
      </div>
    </div>
  );
}
