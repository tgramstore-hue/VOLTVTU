'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconGift, IconCheck, IconUser } from '../../components/Icons';
import styles from './Rewards.module.css';

export default function RewardsScreen() {
  const { state, setState } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('referrals'); // Default to referrals or points
  const [refFilter, setRefFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const voltPoints = state.user?.voltPoints || 0;
  const referralCode = state.user?.referralCode || 'VOLT-ETIM-77';
  const referrals = state.user?.referrals || [];
  const referralEarnings = state.user?.referralEarnings || 0;
  const referralLink = `https://vtuflash.com/register?ref=${referralCode}`;

  const completedReferrals = referrals.filter(r => r.status === 'completed');
  const pendingReferrals = referrals.filter(r => r.status !== 'completed');

  const filteredReferrals = refFilter === 'completed'
    ? completedReferrals
    : refFilter === 'pending'
    ? pendingReferrals
    : referrals;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralCode);
    }
    setCopiedCode(true);
    showToast(`Referral code ${referralCode} copied!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
    }
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = () => {
    const shareData = {
      title: 'Join VTUflash - Earn ₦500 Bonus',
      text: `Sign up on VTUflash using my referral code ${referralCode} and get an instant ₦500 welcome bonus on your first wallet funding!`,
      url: referralLink,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleRedeem = () => {
    if (voltPoints <= 0) return;
    const nairaVal = voltPoints / 10;
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        balance: (prev.user.balance || 0) + nairaVal,
        voltPoints: 0,
      },
    }));
    showToast(`Converted ${voltPoints.toLocaleString()} pts to ₦${nairaVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`);
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
    showToast('Claimed +100 Volt Points streak bonus!');
  };

  return (
    <div className={styles.container}>
      {/* Sticky Top Header */}
      <div className={styles.header}>
        <div className={styles.title}>Rewards &amp; Referrals</div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <IconCheck size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Switcher Tabs */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeSubTab === 'referrals' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveSubTab('referrals')}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>My Referrals ({referrals.length})</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeSubTab === 'points' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveSubTab('points')}
        >
          <IconGift size={16} />
          <span>Points &amp; Streak</span>
        </button>
      </div>

      {/* TAB 1: MY REFERRALS SECTION */}
      {activeSubTab === 'referrals' && (
        <div className={styles.tabContent}>
          {/* Hero Referral Card */}
          <div className={styles.referralCard}>
            <div className={styles.refHeroBadge}>EARN ₦500 PER FRIEND</div>
            <div className={styles.refTitle}>Invite Friends &amp; Earn ₦500 Cash</div>
            <div className={styles.refSub}>
              Share your personal referral code or invite link. When someone registers and funds their wallet with ₦1,000 or more, you both get ₦500 credited automatically.
            </div>

            {/* 3 Referral Stats Cards */}
            <div className={styles.refStatsGrid}>
              <div className={styles.refStatBlock}>
                <div className={styles.refStatLabel}>Total Referrals</div>
                <div className={styles.refStatVal}>{referrals.length}</div>
              </div>
              <div className={styles.refStatBlock}>
                <div className={styles.refStatLabel}>Total Earned</div>
                <div className={styles.refStatValGreen}>₦{referralEarnings.toLocaleString()}.00</div>
              </div>
              <div className={styles.refStatBlock}>
                <div className={styles.refStatLabel}>Pending First Funding</div>
                <div className={styles.refStatValAmber}>{pendingReferrals.length}</div>
              </div>
            </div>

            {/* Referral Code Box */}
            <div className={styles.codeBox}>
              <div>
                <div className={styles.codeSubLabel}>YOUR UNIQUE REFERRAL CODE</div>
                <div className={styles.codeText}>{referralCode}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className={styles.copyCodeBtn} onClick={handleCopyCode}>
                  {copiedCode ? 'Copied ✓' : 'Copy Code'}
                </button>
                <button type="button" className={styles.shareBtn} onClick={handleShare}>
                  Share
                </button>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className={styles.linkBox}>
              <div className={styles.linkTextWrapper}>
                <div className={styles.linkSubLabel}>DIRECT REFERRAL LINK</div>
                <div className={styles.linkUrl}>{referralLink}</div>
              </div>
              <button type="button" className={styles.copyLinkBtn} onClick={handleCopyLink}>
                {copiedLink ? 'Copied ✓' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* How Referrals Work */}
          <div className={styles.howItWorksCard}>
            <div className={styles.howTitle}>How Referral Bonus Works</div>
            <div className={styles.howSteps}>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>1</div>
                <div>
                  <div className={styles.stepHead}>Share Your Link / Code</div>
                  <div className={styles.stepDesc}>Send your link to friends via WhatsApp, SMS, or social media.</div>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>2</div>
                <div>
                  <div className={styles.stepHead}>Friend Signs Up &amp; Funds</div>
                  <div className={styles.stepDesc}>They register on VTUflash and make a first wallet funding of ₦1,000+.</div>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>3</div>
                <div>
                  <div className={styles.stepHead}>Instant ₦500 Wallet Credit</div>
                  <div className={styles.stepDesc}>You receive ₦500 directly in your main wallet balance to withdraw or use.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Referrals List Section */}
          <div className={styles.referralListCard}>
            <div className={styles.referralListHeader}>
              <div className={styles.listSectionTitle}>Referred Users List</div>
              <div className={styles.filterPills}>
                <button
                  type="button"
                  className={`${styles.filterPill} ${refFilter === 'all' ? styles.filterPillActive : ''}`}
                  onClick={() => setRefFilter('all')}
                >
                  All ({referrals.length})
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${refFilter === 'completed' ? styles.filterPillActive : ''}`}
                  onClick={() => setRefFilter('completed')}
                >
                  Paid ({completedReferrals.length})
                </button>
                <button
                  type="button"
                  className={`${styles.filterPill} ${refFilter === 'pending' ? styles.filterPillActive : ''}`}
                  onClick={() => setRefFilter('pending')}
                >
                  Pending ({pendingReferrals.length})
                </button>
              </div>
            </div>

            {filteredReferrals.length > 0 ? (
              <div className={styles.refUserList}>
                {filteredReferrals.map((ref, idx) => (
                  <div key={idx} className={styles.refUserRow}>
                    <div className={styles.refUserLeft}>
                      <div className={styles.refAvatar}>
                        <IconUser size={18} />
                      </div>
                      <div>
                        <div className={styles.refUserName}>{ref.name || 'VTU Member'}</div>
                        <div className={styles.refUserPhone}>{ref.phone || ref.email || 'Registered user'}</div>
                        <div className={styles.refUserDate}>{ref.date || 'Recently registered'}</div>
                      </div>
                    </div>
                    <div className={styles.refUserRight}>
                      <span className={ref.status === 'completed' ? styles.statusBadgeDone : styles.statusBadgePending}>
                        {ref.status === 'completed' ? '₦500 Credited ✓' : 'Awaiting ₦1k Funding'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyReferralBox}>
                <div className={styles.emptyRefIcon}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B08A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className={styles.emptyRefTitle}>
                  {refFilter === 'all' ? 'No referrals yet' : `No ${refFilter} referrals`}
                </div>
                <div className={styles.emptyRefSub}>
                  {refFilter === 'all'
                    ? 'Start inviting friends using your referral code or link. As soon as they register, they will appear here and you will earn ₦500 when they fund their wallet!'
                    : `You do not have any referrals under the "${refFilter}" filter right now.`}
                </div>
                <button type="button" className={styles.inviteNowBtn} onClick={handleShare}>
                  Invite Friends Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VOLT POINTS & STREAKS SECTION */}
      {activeSubTab === 'points' && (
        <div className={styles.tabContent}>
          {/* Volt Points Card */}
          <div className={styles.pointsCard}>
            <div className={styles.pointsTop}>
              <div>
                <div className={styles.pointsLabel}>Available Volt Points</div>
                <div className={styles.pointsValue}>{voltPoints.toLocaleString()} pts</div>
                <div className={styles.pointsCashEq}>
                  ≈ ₦{(voltPoints / 10).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Naira Value
                </div>
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
              style={{
                opacity: voltPoints <= 0 ? 0.45 : 1,
                cursor: voltPoints <= 0 ? 'not-allowed' : 'pointer',
              }}
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
                  background: claimed ? '#16A34A' : '#F0B90B',
                  color: claimed ? '#FFFFFF' : '#000000',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: claimed ? 'default' : 'pointer',
                  boxShadow: claimed ? '0 2px 8px rgba(22, 163, 74, 0.3)' : '0 2px 8px rgba(240, 185, 11, 0.3)',
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

          {/* Quick Referral Jump Card */}
          <div className={styles.quickJumpCard} onClick={() => setActiveSubTab('referrals')}>
            <div className={styles.quickJumpLeft}>
              <div className={styles.quickJumpIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B08A00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className={styles.quickJumpTitle}>Invite Friends &amp; Earn ₦500</div>
                <div className={styles.quickJumpSub}>Check your referrals, codes &amp; earnings</div>
              </div>
            </div>
            <div className={styles.quickJumpArrow}>›</div>
          </div>
        </div>
      )}
    </div>
  );
}
