'use client';
import { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconShield, IconLock, IconHeadphones, IconChevronRight, IconUser,
  IconBank, IconList
} from '../../components/Icons';
import styles from './Profile.module.css';

export default function ProfileScreen() {
  const { state, navigate, updateUser } = useApp();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateUser({ profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sticky Top Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', padding: '24px 0 12px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Profile &amp; Settings</h1>
      </div>

      {/* Hidden File Input for Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* User Info Card */}
      <div className={styles.userCard}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick} title="Tap to upload profile picture">
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
          <div style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#F0B90B',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}>
            📷
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className={styles.name}>{state.user.name} Effiong</div>
          <div className={styles.phone}>{state.user.phone}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{state.user.email}</div>
          <span
            className={styles.tierPill}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('kyc-overview')}
          >
            Tier {state.user.tier} · {state.user.tier === 1 ? 'Basic' : 'Verified'} Account ›
          </span>
        </div>
      </div>

      {/* KYC Upgrade Banner */}
      <div className={styles.kycBanner} onClick={() => navigate('kyc-overview')}>
        <div>
          <div className={styles.kycTitle}>
            {state.user.tier >= 2 ? 'Identity Verified (Tier 2)' : 'Upgrade to Tier 2 (KYC)'}
          </div>
          <div className={styles.kycSub}>
            {state.user.tier >= 2
              ? 'Daily limit: ₦5,000,000.00 Active'
              : 'Unlock daily limit up to ₦5,000,000 with BVN or NIN'}
          </div>
        </div>
        <IconChevronRight size={18} color="#854D0E" />
      </div>

      {/* Menu Sections */}
      <div className={styles.menuSection}>
        <div className={styles.menuItem} onClick={() => navigate('kyc-overview')}>
          <div className={styles.menuLeft}>
            <IconShield size={20} />
            <span>Identity &amp; KYC Verification</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
        <div className={styles.menuItem} onClick={() => navigate('transactions')}>
          <div className={styles.menuLeft}>
            <IconList size={20} />
            <span>Transaction History</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
        <div className={styles.menuItem} onClick={() => navigate('unlock-pin')}>
          <div className={styles.menuLeft}>
            <IconLock size={20} />
            <span>Security &amp; Transaction PIN</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
        <div className={styles.menuItem} onClick={() => navigate('add-money')}>
          <div className={styles.menuLeft}>
            <IconBank size={20} />
            <span>Bank Transfer &amp; Funding Details</span>
          </div>
          <span className={styles.menuChevron}>›</span>
        </div>
        <div className={styles.menuItem} onClick={() => alert('Support line: WhatsApp 08000000000')}>
          <div className={styles.menuLeft}>
            <IconHeadphones size={20} />
            <span>Customer Support &amp; WhatsApp</span>
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
    </div>
  );
}
