'use client';
import { useApp } from '../context/AppContext';
import { IconHome, IconGrid, IconGift, IconUser } from './Icons';
import styles from './BottomNav.module.css';

const tabs = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'services', label: 'Services', Icon: IconGrid },
  { id: 'rewards', label: 'Rewards', Icon: IconGift },
  { id: 'me', label: 'Profile', Icon: IconUser },
];

export default function BottomNav() {
  const { activeTab, switchTab } = useApp();

  return (
    <nav className={styles.nav} aria-label="Bottom Navigation">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`${styles.item} ${activeTab === id ? styles.active : ''}`}
          onClick={() => switchTab(id)}
        >
          <Icon size={24} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
