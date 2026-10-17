'use client';
import { useApp } from '../context/AppContext';
import { IconHome, IconGift, IconList, IconHeadphones, IconUser } from './Icons';
import styles from './BottomNav.module.css';

const tabs = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'rewards', label: 'Rewards', Icon: IconGift },
  { id: 'history', label: 'History', Icon: IconList },
  { id: 'support', label: 'Support', Icon: IconHeadphones },
  { id: 'me', label: 'Me', Icon: IconUser },
];

export default function BottomNav() {
  const { activeTab, switchTab } = useApp();

  return (
    <div className={styles.nav}>
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`${styles.item} ${activeTab === id ? styles.active : ''}`}
          onClick={() => switchTab(id)}
        >
          <Icon size={24} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
