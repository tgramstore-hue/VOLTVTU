'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { IconGift, IconCheck, IconUser } from '../../components/Icons';
import styles from './Rewards.module.css';

const WEEK_DAYS = [
  { day: 'Mon', pts: 50, label: '+50' },
  { day: 'Tue', pts: 50, label: '+50' },
  { day: 'Wed', pts: 100, label: '+100' },
  { day: 'Thu', pts: 50, label: '+50' },
  { day: 'Fri', pts: 50, label: '+50' },
  { day: 'Sat', pts: 100, label: '+100' },
  { day: 'Sun', pts: 200, label: '+200' },
];

function getWeekMondayDateStr() {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

export default function RewardsScreen() {
  const { state, setState, getSupabase } = useApp();
  // Points & Streak first (left), Referrals second (right)
  const [activeSubTab, setActiveSubTab] = useState('points');
  const [refFilter, setRefFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Weekly streak state tracking
  const [todayIndex, setTodayIndex] = useState(0);
  const [claimedDays, setClaimedDays] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const now = new Date();
    const currentDayIdx = (now.getDay() + 6) % 7;
    setTodayIndex(currentDayIdx);

    const weekKey = getWeekMondayDateStr();
    try {
      const stored = localStorage.getItem('vtu_weekly_streak_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.weekKey === weekKey && Array.isArray(parsed?.claimedDays)) {
          setClaimedDays(parsed.claimedDays);
          return;
        }
      }
      // If new week or no record, initialize empty
      localStorage.setItem('vtu_weekly_streak_data', JSON.stringify({
        weekKey,
        claimedDays: [],
      }));
      setClaimedDays([]);
    } catch (e) {
      setClaimedDays([]);
    }
  }, []);

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

  const isTodayClaimed = claimedDays.includes(todayIndex);

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

  const handleRedeem = async () => {
    if (voltPoints <= 0) return;
    const nairaVal = voltPoints / 10;
    const newBalance = (state.user.balance || 0) + nairaVal;

    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        balance: newBalance,
        voltPoints: 0,
      },
    }));

    // Sync to Supabase if logged in
    try {
      const supabase = getSupabase();
      if (state.supabaseUser?.id) {
        await supabase
          .from('profiles')
          .update({
            wallet_balance: newBalance,
            volt_points: 0,
          })
          .eq('id', state.supabaseUser.id);
      }
    } catch (e) {}

    showToast(`Converted ${voltPoints.toLocaleString()} pts to ₦${nairaVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`);
  };

  const handleClaimDaily = async (targetDayIndex = todayIndex) => {
    if (targetDayIndex !== todayIndex) {
      if (targetDayIndex < todayIndex && !claimedDays.includes(targetDayIndex)) {
        showToast('Missed day: This bonus expired.');
      }
      return;
    }
    if (isTodayClaimed) return;

    const todayPts = WEEK_DAYS[todayIndex]?.pts || 100;
    const updatedClaimed = [...claimedDays, todayIndex];
    setClaimedDays(updatedClaimed);

    const weekKey = getWeekMondayDateStr();
    try {
      localStorage.setItem('vtu_weekly_streak_data', JSON.stringify({
        weekKey,
        claimedDays: updatedClaimed,
      }));
    } catch (e) {}

    const newPoints = (state.user?.voltPoints || 0) + todayPts;
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        voltPoints: newPoints,
      },
    }));

    // Sync to Supabase
    try {
      const supabase = getSupabase();
      if (state.supabaseUser?.id) {
        await supabase
          .from('profiles')
          .update({ volt_points: newPoints })
          .eq('id', state.supabaseUser.id);
      }
    } catch (e) {}

    showToast(`Claimed +${todayPts} Volt Points streak bonus!`);
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

      {/* Main Switcher Tabs (Points & Streak first, Referrals second) */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeSubTab === 'points' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveSubTab('points')}
        >
          <IconGift size={16} />
          <span>Points &amp; Streak</span>
        </button>
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
      </div>

      {/* TAB 1: VOLT POINTS & STREAKS SECTION */}
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
              <div className="ico" style={{ background: '#F0B90B', color: '#000', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          {/* Daily Check-in Streak with Day-of-week tracking */}
          <div className={styles.streakCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span className={styles.streakTitle}>Daily Login Streak</span>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                  {isTodayClaimed ? 'Today claimed! Come back tomorrow' : 'Check in daily to earn Volt Points'}
                </div>
              </div>
              <button
                type="button"
                style={{
                  background: isTodayClaimed ? '#16A34A' : '#F0B90B',
                  color: isTodayClaimed ? '#FFFFFF' : '#000000',
                  border: 'none',
                  padding: '7px 15px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: isTodayClaimed ? 'default' : 'pointer',
                  boxShadow: isTodayClaimed ? '0 2px 8px rgba(22, 163, 74, 0.3)' : '0 2px 8px rgba(240, 185, 11, 0.35)',
                  transition: 'transform 0.15s',
                }}
                onClick={() => handleClaimDaily(todayIndex)}
              >
                {isTodayClaimed ? 'Claimed ✓' : `Claim +${WEEK_DAYS[todayIndex]?.pts || 100} pts`}
              </button>
            </div>

            <div className={styles.daysRow}>
              {WEEK_DAYS.map((d, i) => {
                const isClaimed = claimedDays.includes(i);
                const isToday = i === todayIndex;
                const isMissed = i < todayIndex && !isClaimed;

                let coinClass = styles.dayCoin;
                if (isClaimed) {
                  coinClass = `${styles.dayCoin} ${styles.dayCoinActive}`;
                } else if (isMissed) {
                  coinClass = `${styles.dayCoin} ${styles.dayCoinMissed}`;
                } else if (isToday) {
                  coinClass = `${styles.dayCoin} ${styles.dayCoinToday}`;
                }

                return (
                  <div
                    key={i}
                    className={styles.dayItem}
                    onClick={() => isToday && !isClaimed && handleClaimDaily(i)}
                    style={{ cursor: isToday && !isClaimed ? 'pointer' : 'default' }}
                  >
                    <div className={coinClass}>
                      {isClaimed ? (
                        <IconCheck size={14} />
                      ) : isMissed ? (
                        <span style={{ fontSize: '13px', fontWeight: 900 }}>✕</span>
                      ) : (
                        d.label
                      )}
                    </div>
                    <span className={styles.dayLabel} style={{
                      fontWeight: isToday ? 800 : 500,
                      color: isToday ? '#111' : isMissed ? '#DC2626' : '#888',
                    }}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Streak explanation note */}
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              background: '#F9FAFB',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>💡</span>
              <span>
                Missed days show <strong>✕</strong>. Don&apos;t miss tomorrow to keep your bonus growing!
              </span>
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

      {/* TAB 2: MY REFERRALS SECTION */}
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
                <div className={styles.refStatLabel}>Successful</div>
                <div className={styles.refStatVal}>{completedReferrals.length}</div>
              </div>
              <div className={styles.refStatBlock}>
                <div className={styles.refStatLabel}>Cash Earned</div>
                <div className={styles.refStatVal} style={{ color: '#16A34A' }}>
                  ₦{referralEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Code Box */}
            <div className={styles.codeBox}>
              <div className={styles.codeLeft}>
                <span className={styles.codeLabel}>YOUR REFERRAL CODE</span>
                <span className={styles.codeText}>{referralCode}</span>
              </div>
              <div className={styles.codeActions}>
                <button type="button" className={styles.copyBtn} onClick={handleCopyCode}>
                  {copiedCode ? 'Copied ✓' : 'Copy'}
                </button>
                <button type="button" className={styles.shareBtn} onClick={handleShare}>
                  Share
                </button>
              </div>
            </div>

            {/* Direct Link Box */}
            <div className={styles.linkBox}>
              <div className={styles.linkTextWrapper}>
                <div className={styles.linkSubLabel}>INVITE LINK</div>
                <div className={styles.linkUrl}>{referralLink}</div>
              </div>
              <button type="button" className={styles.copyLinkBtn} onClick={handleCopyLink}>
                {copiedLink ? 'Copied ✓' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* How it Works Card */}
          <div className={styles.howItWorksCard}>
            <div className={styles.howTitle}>How Referral Program Works</div>
            <div className={styles.howSteps}>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>1</div>
                <div>
                  <div className={styles.stepHead}>Share Your Code or Link</div>
                  <div className={styles.stepDesc}>Send your referral link or code to friends, family and social media channels.</div>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>2</div>
                <div>
                  <div className={styles.stepHead}>They Sign Up &amp; Fund Wallet</div>
                  <div className={styles.stepDesc}>Your referred friend creates their account and makes their first deposit of ₦1,000+.</div>
                </div>
              </div>
              <div className={styles.stepRow}>
                <div className={styles.stepNum}>3</div>
                <div>
                  <div className={styles.stepHead}>Instant ₦500 Cash Reward</div>
                  <div className={styles.stepDesc}>₦500 is credited straight to your commission balance. Withdraw anytime to your bank account!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Referrals List Card */}
          <div className={styles.referralsListCard}>
            <div className={styles.listHeader}>
              <div className={styles.listTitle}>Referred Users</div>
              <span className={styles.listCount}>{filteredReferrals.length} Total</span>
            </div>

            {/* Filter Pills */}
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
                Completed ({completedReferrals.length})
              </button>
              <button
                type="button"
                className={`${styles.filterPill} ${refFilter === 'pending' ? styles.filterPillActive : ''}`}
                onClick={() => setRefFilter('pending')}
              >
                Pending Funding ({pendingReferrals.length})
              </button>
            </div>

            {/* Referral Rows */}
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
    </div>
  );
}
