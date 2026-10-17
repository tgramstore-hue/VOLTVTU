'use client';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/BottomNav';
import { IconShield, IconLock, IconHeadphones, IconChevronRight } from '../../components/Icons';
import styles from './Profile.module.css';

export default function ProfileScreen() {
  const { state, navigate } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        <div className={styles.avatar}>{state.user.initial}</div>
        <div>
          <div className={styles.name}>{state.user.name} Effiong</div>
          <div className={styles.phone}>{state.user.phone}</div>
          <span className={styles.tierPill}>Tier {state.user.tier} Account</span>
        </div>
      </div>

      <div className={styles.kycBanner} onClick={() => navigate('kyc-overview')}>
        <div>
          <div className={styles.kycTitle}>Upgrade to Tier 2 (KYC)</div>
          <div className={styles.kycSub}>Unlock daily limit up to ₦5,000,000</div>
        </div>
        <IconChevronRight size={18} color="#854D0E" />
      </div>

      <div className={styles.menuSection}>
        <div className={styles.menuItem} onClick={() => navigate('kyc-overview')}>
          <div className={styles.menuLeft}>
            <IconShield size={20} />
            <span>Identity & KYC Verification</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
        <div className={styles.menuItem} onClick={() => navigate('unlock-pin')}>
          <div className={styles.menuLeft}>
            <IconLock size={20} />
            <span>Security & Transaction PIN</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
        <div className={styles.menuItem} onClick={() => alert('Support line: WhatsApp 08000000000')}>
          <div className={styles.menuLeft}>
            <IconHeadphones size={20} />
            <span>Customer Support</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.logoutBtn}
        onClick={() => navigate('login')}
      >
        Log Out
      </button>

      <BottomNav />
    </div>
  );
}
