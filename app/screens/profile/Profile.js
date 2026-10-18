'use client';
import { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Profile.module.css';

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

const menuItems = [
  {
    id: 'personal-info',
    label: 'Personal Information',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    screen: 'profile-info',
  },
  {
    id: 'transaction-history',
    label: 'Transaction History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    screen: 'transactions',
  },
  {
    id: 'kyc',
    label: 'KYC Verification',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    screen: 'kyc-overview',
  },
  {
    id: 'security',
    label: 'Security & PIN',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    screen: 'security-pin',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    screen: 'notifications',
  },
  {
    id: 'invite',
    label: 'Invite & Earn',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M14 14h3v3m0 4h4m0-4v4"/>
      </svg>
    ),
    screen: 'rewards',
  },
  {
    id: 'help',
    label: 'Help & Support',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    screen: 'help-support',
  },
];

export default function ProfileScreen() {
  const { state, navigate, updateUser } = useApp();
  const fileInputRef = useRef(null);

  const handleAvatarClick = (e) => {
    e.stopPropagation();
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

  const handleItem = (item) => {
    if (item.screen) navigate(item.screen);
  };

  return (
    <div className={styles.container}>
      {/* Sticky header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Profile</h1>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Avatar card with camera badge on top of user profile icon */}
      <div className={styles.userCard}>
        <div
          className={styles.avatarWrap}
          onClick={handleAvatarClick}
          role="button"
          aria-label="Upload profile photo"
        >
          <div className={styles.avatarCircle}>
            {state.user.profileImage ? (
              <img
                src={state.user.profileImage}
                alt="Profile"
                className={styles.avatarImg}
              />
            ) : (
              <div className={styles.avatarInitial}>{state.user.name ? state.user.name[0].toUpperCase() : 'U'}</div>
            )}
          </div>
          <div className={styles.cameraBadge} title="Change profile photo">
            <CameraIcon />
          </div>
        </div>

        <div className={styles.userInfo} onClick={() => navigate('profile-info')}>
          <div className={styles.userNameRow}>
            <div className={styles.userName}>{state.user.name}</div>
            <span className={state.user.kycLevel === 3 ? styles.tier3 : state.user.kycLevel === 2 ? styles.tier2 : styles.tier1}>
              Tier {state.user.kycLevel || 1}
            </span>
          </div>
          <div className={styles.userPhone}>{state.user.phone || '080 0000 0000'}</div>
        </div>
      </div>

      {/* Menu list card */}
      <div className={styles.menuCard}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={styles.menuRow}
            onClick={() => handleItem(item)}
          >
            <div className={styles.menuLeft}>
              <div className={styles.menuIcon}>{item.icon}</div>
              <span className={styles.menuLabel}>{item.label}</span>
            </div>
            <ChevronRight />
          </div>
        ))}
      </div>

      {/* Logout */}
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
