'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './Notifications.module.css';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'wallet',
    category: 'transactions',
    title: 'Wallet Funded Successfully',
    message: 'Your wallet has been credited with ₦15,000.00 via Moniepoint Bank Transfer.',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'airtime',
    category: 'transactions',
    title: 'MTN Airtime Delivered',
    message: '₦1,000.00 airtime sent to 08012345678 was successful. ₦20 cashback added.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'kyc',
    category: 'security',
    title: 'Tier 1 Limit Active',
    message: 'Your phone and email have been verified. You can now transact up to ₦50,000 daily.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    type: 'security',
    category: 'security',
    title: 'Security Alert',
    message: 'New login detected from Chrome browser on Windows.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 5,
    type: 'bonus',
    category: 'transactions',
    title: 'Volt Points Earned',
    message: 'You earned 50 Volt Points on your recent Cable TV subscription.',
    time: '3 days ago',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const { goBack } = useApp();
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setItems(items.map(item => ({ ...item, unread: false })));
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'wallet':
        return (
          <div className={`${styles.iconWrap} ${styles.iconGreen}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
          </div>
        );
      case 'airtime':
        return (
          <div className={`${styles.iconWrap} ${styles.iconYellow}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>
        );
      case 'kyc':
        return (
          <div className={`${styles.iconWrap} ${styles.iconBlue}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        );
      case 'security':
        return (
          <div className={`${styles.iconWrap} ${styles.iconRed}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${styles.iconWrap} ${styles.iconYellow}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <PageHeader title="Notifications" onBack={goBack} />
        <button type="button" className={styles.markReadBtn} onClick={markAllRead}>
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div className={styles.tabsRow}>
        {['all', 'transactions', 'security'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tabBtn} ${filter === tab ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className={styles.list}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔔</div>
            <div className={styles.emptyTitle}>No notifications</div>
            <div className={styles.emptySub}>You have no notifications in this category.</div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${item.unread ? styles.cardUnread : ''}`}
            >
              {getIcon(item.type)}
              <div className={styles.cardContent}>
                <div className={styles.titleRow}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  {item.unread && <span className={styles.unreadDot} />}
                </div>
                <div className={styles.itemMessage}>{item.message}</div>
                <div className={styles.itemTime}>{item.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
