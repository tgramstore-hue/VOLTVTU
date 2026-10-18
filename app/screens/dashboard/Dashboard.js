'use client';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconNavyPhone, IconNavyData, IconNavyTV, IconNavyBetting,
  IconNavyElectricity, IconNavyEducation, IconNavyGiftCard, IconNavyMore
} from '../services/Services';
import { IconLock, IconCheck } from '../../components/Icons';
import styles from './Dashboard.module.css';

const services = [
  { icon: IconNavyPhone, label: 'Airtime', screen: 'airtime' },
  { icon: IconNavyData, label: 'Data', screen: 'data' },
  { icon: IconNavyTV, label: 'CableTV', screen: 'cable' },
  { icon: IconNavyBetting, label: 'Betting', screen: 'betting' },
  { icon: IconNavyElectricity, label: 'Electricity', screen: 'electricity' },
  { icon: IconNavyEducation, label: 'Education', screen: 'exam' },
  { icon: IconNavyGiftCard, label: 'Gift Card', screen: 'giftcard' },
  { icon: IconNavyMore, label: 'More', screen: 'services' },
];

const topBanners = [
  {
    bg: '#18191E',
    color: '#fff',
    subColor: '#aaa',
    title: 'Trade & Buy Gift Cards',
    sub: 'Amazon, Steam, Apple & Razer rates.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Trade',
    screen: 'giftcard'
  },
  {
    bg: '#0D1C13',
    color: '#fff',
    subColor: '#98d8aa',
    title: 'Airtime to Cash',
    sub: 'Convert MTN, Airtel & Glo to cash.',
    btnBg: '#22C55E',
    btnColor: '#fff',
    btnText: 'Convert',
    screen: 'services'
  },
  {
    bg: '#081B2B',
    color: '#fff',
    subColor: '#93c5fd',
    title: 'Buy Virtual Numbers',
    sub: 'USA, UK, Canada SMS verification.',
    btnBg: '#38BDF8',
    btnColor: '#000',
    btnText: 'Get Now',
    screen: 'virtual-numbers'
  },
  {
    bg: '#1C1908',
    color: '#fff',
    subColor: '#e0d890',
    title: 'Cheap SME Data Plans',
    sub: '1GB from ₦280 instant delivery.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Buy Data',
    screen: 'data'
  },
];

const bottomBanners = [
  {
    bg: '#F0B90B',
    color: '#000',
    subColor: '#3d3000',
    title: 'Invite & Earn Rewards',
    sub: 'Refer friends & earn on every purchase.',
    btnBg: '#000',
    btnColor: '#fff',
    btnText: 'Invite',
    screen: 'rewards'
  },
  {
    bg: '#0B0B0B',
    color: '#fff',
    subColor: '#bdbdbd',
    title: 'Pay Bills Instantly',
    sub: 'DStv, GOtv, Startimes & Disco tokens.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Pay',
    screen: 'cable'
  },
  {
    bg: '#fff',
    color: '#000',
    subColor: '#666',
    title: '24/7 Fast Support',
    sub: 'WhatsApp & customer support available.',
    btnBg: '#000',
    btnColor: '#fff',
    btnText: 'Chat',
    screen: 'help-support'
  },
  {
    bg: '#0B0B0B',
    color: '#fff',
    subColor: '#bdbdbd',
    title: 'Exam Result Pins',
    sub: 'WAEC, NECO & NABTEB instant tokens.',
    btnBg: '#F0B90B',
    btnColor: '#000',
    btnText: 'Buy',
    screen: 'exam'
  },
];

export default function DashboardScreen() {
  const {
    navigate, state, saveTransactionPin,
    checkEmailVerification, getSupabase, createVirtualAccount, authLoading
  } = useApp();

  // Create PIN Modal State
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [pinStep, setPinStep] = useState(1); // 1 = enter pin, 2 = confirm pin
  const [newPinVal, setNewPinVal] = useState('');
  const [confirmPinVal, setConfirmPinVal] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Email Verification Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [interceptReason, setInterceptReason] = useState('');

  const latestTx = state.transactions && state.transactions[0];
  const userEmail = state.user?.email || 'your email';
  const isEmailVerified = Boolean(state.user?.isEmailVerified);
  const hasCreatedPin = Boolean(
    state.user?.hasCreatedTxPin ||
    (state.user?.transactionPin && state.user.transactionPin.length === 4)
  );

  // On mount: check if fresh signup needs PIN modal or email notice
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Wait until auth loading is complete (profile loaded from DB)
    if (authLoading) return;

    // Check if user has not created a transaction PIN yet
    if (!hasCreatedPin) {
      const pinDismissed = sessionStorage.getItem('vtu_dismissed_pin_modal');
      if (!pinDismissed) {
        setShowCreatePinModal(true);
        return;
      }
    }

    // Check if user's email is not verified
    if (!isEmailVerified) {
      const emailDismissed = sessionStorage.getItem('vtu_dismissed_email_modal');
      if (!emailDismissed) {
        setShowEmailModal(true);
      }
    }
  }, [hasCreatedPin, isEmailVerified, authLoading]);

  // Show email verified success banner when isEmailVerified flips to true
  const [emailJustVerified, setEmailJustVerified] = useState(false);
  const prevIsEmailVerified = useRef(false);
  useEffect(() => {
    if (isEmailVerified && !prevIsEmailVerified.current) {
      setEmailJustVerified(true);
      setShowEmailModal(false);
      setTimeout(() => setEmailJustVerified(false), 4000);
    }
    prevIsEmailVerified.current = isEmailVerified;
  }, [isEmailVerified]);

  // Auto-create Paystack virtual account on first dashboard load if missing
  useEffect(() => {
    if (authLoading) return;
    if (!state.supabaseUser?.id) return;
    const va = state.user?.virtualAccount;
    // If no account number or it's a placeholder (phone-number-based, 10 digits but not from Paystack)
    const needsDVA = !va?.accountNumber || va?.bank === 'Wema Bank';
    if (needsDVA) {
      createVirtualAccount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, state.supabaseUser?.id]);


  // Activity Gate: Blocks transactions & purchases if email is unverified
  const handleProtectedAction = (targetScreen) => {
    if (!isEmailVerified) {
      setInterceptReason('You must verify your email address before making transactions, bill payments, or funding your wallet.');
      setShowEmailModal(true);
      return;
    }
    navigate(targetScreen);
  };

  // Handle Save PIN in Modal
  const handleSavePinInModal = async () => {
    setPinError('');
    if (pinStep === 1) {
      if (newPinVal.length !== 4) {
        setPinError('Transaction PIN must be exactly 4 digits.');
        return;
      }
      setPinStep(2);
    } else {
      if (confirmPinVal.length !== 4) {
        setPinError('Please enter all 4 digits to confirm.');
        return;
      }
      if (confirmPinVal !== newPinVal) {
        setPinError('PINs do not match. Please try again.');
        setConfirmPinVal('');
        return;
      }
      // Save PIN
      await saveTransactionPin(newPinVal);
      setPinSuccess(true);
      setTimeout(() => {
        setShowCreatePinModal(false);
        setPinSuccess(false);
      }, 1200);
    }
  };

  const handleDismissPinModal = () => {
    setShowCreatePinModal(false);
    try {
      sessionStorage.setItem('vtu_dismissed_pin_modal', 'true');
    } catch (e) {}
  };

  // Resend Email Verification link
  const handleResendEmail = async () => {
    setEmailResent(false);
    try {
      const supabase = getSupabase();
      if (state.user?.email) {
        await supabase.auth.resend({
          type: 'signup',
          email: state.user.email,
        });
      }
      setEmailResent(true);
      setTimeout(() => setEmailResent(false), 5000);
    } catch (e) {
      setEmailResent(true);
    }
  };

  // Check Email Verification Status manually
  const handleCheckEmailStatus = async () => {
    setCheckingEmail(true);
    const verified = await checkEmailVerification();
    setCheckingEmail(false);
    if (verified) {
      setShowEmailModal(false);
    } else {
      alert('Email not confirmed yet. Please click the link sent to ' + userEmail + ' then click this button again.');
    }
  };

  const handleDismissEmailModal = () => {
    setShowEmailModal(false);
    try {
      sessionStorage.setItem('vtu_dismissed_email_modal', 'true');
    } catch (e) {}
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.userInfo} onClick={() => navigate('profile')}>
          <div className={styles.avatar}>
            {state.user.profileImage ? (
              <img
                src={state.user.profileImage}
                alt="Profile"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              state.user.initial || 'E'
            )}
          </div>
          <span className={styles.greeting}>Hi, {(state.user.name || 'USER').toUpperCase()}</span>
        </div>
        <div className={styles.headerIcons}>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Support" onClick={() => navigate('help-support')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3z" />
            </svg>
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Scan QR" onClick={() => handleProtectedAction('add-money')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16" />
            </svg>
          </button>
          <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Notifications" onClick={() => navigate('notifications')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Email Verified Success Toast */}
      {emailJustVerified && (
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#16A34A', color: '#fff',
          padding: '12px 20px', borderRadius: '14px',
          fontSize: '14px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 20px rgba(22,163,74,0.4)',
          zIndex: 9999, animation: 'slideDown 0.3s ease',
          whiteSpace: 'nowrap',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Email verified successfully!
        </div>
      )}

      {/* Persistent Email Verification Notice Banner (if unverified) */}
      {!isEmailVerified && (
        <div className={styles.verifyBanner}>
          <div className={styles.verifyLeft}>
            <span className={styles.verifyIcon}>⚠️</span>
            <div>
              <div className={styles.verifyTitle}>Email Not Verified</div>
              <div className={styles.verifySub}>Verify your email to unlock purchases and wallet funding</div>
            </div>
          </div>
          <button
            type="button"
            className={styles.verifyBtn}
            onClick={() => {
              setInterceptReason('');
              setShowEmailModal(true);
            }}
          >
            Verify
          </button>
        </div>
      )}

      {/* Balance Card */}
      <div className={styles.balanceSection} style={{ '--i': 1 }}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceTop}>
            <div>
              <div className={styles.balanceLabel}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z"/>
                </svg>
                Available balance
              </div>
              <div className={styles.balanceAmount}>
                ₦{state.user.balance.toLocaleString()}.00
              </div>
            </div>
            <button type="button" className={styles.addBtn} onClick={() => handleProtectedAction('add-money')}>
              + Add Money
            </button>
          </div>

          <div className={styles.cashback}>
            Cashback earned today <span className={styles.cashbackVal}>+₦{state.user.cashback || '0'}.00</span>
          </div>
        </div>

        <div className={styles.transStrip}>
          <span>Last purchase: {latestTx ? latestTx.title : 'Data'}</span>
          <span className={styles.transLink} onClick={() => navigate('transactions')}>
            Transactions ›
          </span>
        </div>
      </div>

      {/* Last Transaction Card */}
      {latestTx && (
        <div
          className={styles.lastTxCard}
          style={{ cursor: 'pointer', '--i': 2 }}
          onClick={() => navigate('transactions')}
        >
          <div className={styles.lastTxLeft}>
            <div className={styles.lastTxIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={latestTx.amount > 0 ? '#16A34A' : '#0D9488'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {latestTx.amount > 0 ? (
                  <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
                ) : (
                  <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
                )}
              </svg>
            </div>
            <div className={styles.lastTxInfo}>
              <div className={styles.lastTxTitle}>{latestTx.title}</div>
              <div className={styles.lastTxTime}>{latestTx.time || 'Just now'}</div>
            </div>
          </div>
          <div className={styles.lastTxRight}>
            <div className={styles.lastTxAmount}>
              {latestTx.amount > 0 ? '+' : '-'}₦{Math.abs(latestTx.amount).toLocaleString()}.00
            </div>
            <span className={styles.lastTxArrow}>›</span>
          </div>
        </div>
      )}

      {/* Top Banner Carousel */}
      <div className={styles.carouselWrap} style={{ '--i': 3 }}>
        <div className={styles.carouselTrack}>
          {[...topBanners, topBanners[0]].map((b, i) => (
            <div key={i} className={styles.bannerSlide} style={{ background: b.bg, color: b.color }}>
              <div>
                <div className={styles.bannerTitle}>{b.title}</div>
                <div className={styles.bannerSub} style={{ color: b.subColor }}>{b.sub}</div>
              </div>
              <button
                type="button"
                className={styles.bannerBtn}
                style={{ background: b.btnBg, color: b.btnColor }}
                onClick={() => handleProtectedAction(b.screen)}
              >
                {b.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Top Carousel Dots */}
      <div className={styles.dots}>
        <div className={styles.dot} style={{ animation: 'd1 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd2 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd3 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd4 15s ease-in-out infinite' }} />
      </div>

      {/* Services Grid with deep Navy Blue icons & Activity Gate */}
      <div className={styles.servicesGrid} style={{ '--i': 4 }}>
        {services.map(({ icon: Icon, label, screen }) => (
          <div
            key={label}
            className={styles.serviceItem}
            onClick={() => handleProtectedAction(screen)}
          >
            <div className={styles.serviceIcon}>
              <Icon />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Banner Carousel */}
      <div className={styles.carouselWrap} style={{ '--i': 5 }}>
        <div className={styles.carouselTrack}>
          {[...bottomBanners, bottomBanners[0]].map((b, i) => (
            <div key={i} className={styles.bannerSlide} style={{ background: b.bg, color: b.color }}>
              <div>
                <div className={styles.bannerTitle}>{b.title}</div>
                <div className={styles.bannerSub} style={{ color: b.subColor }}>{b.sub}</div>
              </div>
              <button
                type="button"
                className={styles.bannerBtn}
                style={{ background: b.btnBg, color: b.btnColor }}
                onClick={() => handleProtectedAction(b.screen)}
              >
                {b.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Carousel Dots */}
      <div className={styles.dots}>
        <div className={styles.dot} style={{ animation: 'd1 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd2 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd3 15s ease-in-out infinite' }} />
        <div className={styles.dot} style={{ animation: 'd4 15s ease-in-out infinite' }} />
      </div>

      {/* 1. FIRST-TIME USER CREATE PIN MODAL */}
      {showCreatePinModal && (
        <div className={styles.modalOverlay} onClick={handleDismissPinModal}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconCircle}>
              <IconLock size={30} />
            </div>

            <div className={styles.modalHeading}>
              {pinSuccess
                ? 'PIN Created!'
                : pinStep === 1
                ? 'Create Transaction PIN'
                : 'Confirm Transaction PIN'}
            </div>

            <div className={styles.modalDescription}>
              {pinSuccess
                ? 'Your 4-digit transaction PIN has been successfully secured.'
                : pinStep === 1
                ? 'Create a 4-digit security PIN to authorize airtime, data purchases, and bill payments.'
                : 'Re-enter your 4-digit PIN to confirm.'}
            </div>

            {pinError && (
              <div style={{
                background: '#FEE2E2',
                color: '#B91C1C',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                width: '100%',
              }}>
                {pinError}
              </div>
            )}

            {!pinSuccess && (
              <div className={styles.pinInputRow}>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  className={styles.pinInputBox}
                  placeholder="••••"
                  value={pinStep === 1 ? newPinVal : confirmPinVal}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (pinStep === 1) setNewPinVal(val);
                    else setConfirmPinVal(val);
                    if (pinError) setPinError('');
                  }}
                  autoFocus
                />
              </div>
            )}

            {!pinSuccess ? (
              <>
                <button
                  type="button"
                  className={styles.modalActionBtn}
                  onClick={handleSavePinInModal}
                >
                  {pinStep === 1 ? 'Next: Confirm PIN' : 'Save Transaction PIN'}
                </button>
                <button
                  type="button"
                  className={styles.modalSecondaryBtn}
                  onClick={handleDismissPinModal}
                >
                  Set up later in Settings
                </button>
              </>
            ) : (
              <div style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                <IconCheck size={20} /> Saved Successfully
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. EMAIL VERIFICATION MODAL & GATE */}
      {showEmailModal && (
        <div className={styles.modalOverlay} onClick={handleDismissEmailModal}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIconCircle} style={{ background: '#FEF3C7', color: '#D97706' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>

            <div className={styles.modalHeading}>Verify Your Email</div>

            <div className={styles.modalDescription}>
              {interceptReason || (
                <>
                  A confirmation link has been sent to <strong>{userEmail}</strong>. Please check your inbox and verify your email to unlock transactions.
                </>
              )}
            </div>

            {emailResent && (
              <div style={{
                background: '#DCFCE7',
                color: '#15803D',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                width: '100%',
              }}>
                ✓ Verification link resent to your email!
              </div>
            )}

            <button
              type="button"
              className={styles.modalActionBtn}
              onClick={handleCheckEmailStatus}
              disabled={checkingEmail}
            >
              {checkingEmail ? 'Checking status...' : "I've Verified (Refresh)"}
            </button>

            <button
              type="button"
              style={{
                background: '#F3F4F6',
                color: '#111',
                border: 'none',
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={handleResendEmail}
            >
              Resend Verification Link
            </button>

            <button
              type="button"
              className={styles.modalSecondaryBtn}
              onClick={handleDismissEmailModal}
            >
              I&apos;ll check later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
