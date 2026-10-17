'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconGift, IconCheck } from '../../components/Icons';
import styles from './Rewards.module.css';

export default function RewardsScreen() {
  const { state, setState } = useApp();
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const voltPoints = state.user.voltPoints || 2450;
  const cashback = state.user.cashback || 0;

  const handleCopy = () => {
    navigator.clipboard?.writeText('VOLT-ETIM-77');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    if (voltPoints <= 0) return;
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        balance: prev.user.balance + voltPoints,
        voltPoints: 0,
      },
    }));
    alert(`Successfully converted ${voltPoints.toLocaleString()} Volt Points to ₦${voltPoints.toLocaleString()}.00 in your wallet!`);
  };

  const handleClaimDaily = () => {
    if (claimed) return;
    setClaimed(true);
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        voltPoints: (prev.user.voltPoints || 0) + 100,
      },
    }));
  };

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <div className={styles.header}>
        <div className={styles.title}>Rewards &amp; Points</div>
      </div>

      {/* Volt Points Card */}
      <div className={styles.pointsCard}>
        <div className={styles.pointsTop}>
          <div>
            <div className={styles.pointsLabel}>Available Volt Points</div>
            <div className={styles.pointsValue}>{voltPoints.toLocaleString()} pts</div>
            <div className={styles.pointsCashEq}>≈ ₦{voltPoints.toLocaleString()}.00 Naira Value</div>
          </div>
          <div className="ico" style={{ background: '#F0B90B', color: '#000', width: 48, height: 48 }}>
            <IconGift size={24} />
          </div>
        </div>
        <button
          type="button"
          className={styles.redeemBtn}
          disabled={voltPoints <= 0}
          onClick={handleRedeem}
        >
          Redeem Points to Wallet Balance
        </button>
      </div>

      {/* Daily Check-in Streak */}
      <div className={styles.streakCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span className={styles.streakTitle}>Daily Login Streak</span>
          <button
            type="button"
            style={{
              background: claimed ? '#DCFCE7' : '#F0B90B',
              color: claimed ? '#15803D' : '#000',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: claimed ? 'default' : 'pointer'
            }}
            onClick={handleClaimDaily}
          >
            {claimed ? 'Claimed ✓' : 'Claim +100 pts'}
          </button>
        </div>
        <div className={styles.daysRow}>
          {[
            { day: 'M', pts: '+50', done: true },
            { day: 'T', pts: '+50', done: true },
            { day: 'W', pts: '+100', today: true },
            { day: 'T', pts: '+50' },
            { day: 'F', pts: '+50' },
            { day: 'S', pts: '+100' },
            { day: 'S', pts: '+200' },
          ].map((d, i) => (
            <div key={i} className={styles.dayItem}>
              <div className={`${styles.dayCoin} ${d.done ? styles.dayCoinActive : d.today ? styles.dayCoinToday : ''}`}>
                {d.done ? <IconCheck size={14} /> : d.pts}
              </div>
              <span className={styles.dayLabel}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Program */}
      <div className={styles.referralCard}>
        <div className={styles.refTitle}>Invite Friends, Earn ₦500</div>
        <div className={styles.refSub}>
          Share your referral code. When your friend signs up and funds their wallet with at least ₦1,000, you both get ₦500 bonus.
        </div>
        <div className={styles.codeBox}>
          <div>
            <div style={{ fontSize: 11, color: '#888' }}>Your Referral Code</div>
            <div className={styles.codeText}>VOLT-ETIM-77</div>
          </div>
          <button type="button" className={styles.copyCodeBtn} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
