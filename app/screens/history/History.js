'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import BottomNav from '../../components/BottomNav';
import { IconPhone, IconData, IconTV, IconBolt, IconPlus } from '../../components/Icons';
import styles from './History.module.css';

const ICON_MAP = {
  phone: IconPhone,
  data: IconData,
  tv: IconTV,
  bolt: IconBolt,
  plus: IconPlus,
};

export default function HistoryScreen() {
  const { state, goBack } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = state.transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'airtime') return t.type === 'airtime';
    if (filter === 'data') return t.type === 'data';
    if (filter === 'bills') return t.type === 'cable' || t.type === 'electricity' || t.type === 'exam' || t.type === 'betting';
    if (filter === 'funding') return t.type === 'funding';
    return true;
  });

  const todayList = filtered.filter(t => t.date === 'today');
  const earlierList = filtered.filter(t => t.date !== 'today');

  const renderItem = (item) => {
    const IconComp = ICON_MAP[item.icon] || IconPhone;
    const isCredit = item.amount > 0;
    return (
      <div key={item.id} className={styles.card}>
        <div className={styles.left}>
          <div className={styles.iconCircle}>
            <IconComp size={20} />
          </div>
          <div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.time}>{item.time}</div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={`${styles.amount} ${isCredit ? styles.amountGreen : ''}`}>
            {isCredit ? '+' : ''}₦{Math.abs(item.amount).toLocaleString()}.00
          </div>
          <span
            className={
              item.status === 'successful'
                ? styles.pillSuccess
                : item.status === 'pending'
                ? styles.pillPending
                : styles.pillFailed
            }
          >
            {item.status.toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Transaction History" onBack={goBack} />

      <div className={styles.filters}>
        {['all', 'airtime', 'data', 'bills', 'funding'].map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filterChip} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {todayList.length > 0 && (
        <>
          <div className={styles.groupTitle}>Today</div>
          <div className={styles.list}>
            {todayList.map(renderItem)}
          </div>
        </>
      )}

      {earlierList.length > 0 && (
        <>
          <div className={styles.groupTitle}>Earlier</div>
          <div className={styles.list}>
            {earlierList.map(renderItem)}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 60, color: '#888', fontSize: 14 }}>
          No transactions found.
        </div>
      )}
    </div>
  );
}
