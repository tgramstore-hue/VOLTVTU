'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './VirtualNumbers.module.css';

const COUNTRIES = [
  { id: 'us', name: 'United States', flag: '🇺🇸', code: '+1', price: 1500 },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', code: '+44', price: 1800 },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', code: '+1', price: 1600 },
  { id: 'ng', name: 'Nigeria', flag: '🇳🇬', code: '+234', price: 1200 },
  { id: 'gh', name: 'Ghana', flag: '🇬🇭', code: '+233', price: 1400 },
  { id: 'ke', name: 'Kenya', flag: '🇰🇪', code: '+254', price: 1400 },
  { id: 'de', name: 'Germany', flag: '🇩🇪', code: '+49', price: 2000 },
  { id: 'fr', name: 'France', flag: '🇫🇷', code: '+33', price: 2100 },
];

const SERVICES = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
  { id: 'google', name: 'Google / Gmail', icon: '🔍' },
  { id: 'paypal', name: 'PayPal', icon: '💳' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'chatgpt', name: 'OpenAI / ChatGPT', icon: '🤖' },
  { id: 'amazon', name: 'Amazon', icon: '📦' },
  { id: 'twitter', name: 'Twitter / X', icon: '🐦' },
];

export default function VirtualNumbersScreen() {
  const { state, goBack, updateUser } = useApp();

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [activeNumber, setActiveNumber] = useState(null);
  const [otpCode, setOtpCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins in sec
  const [isBuying, setIsBuying] = useState(false);
  const [copied, setCopied] = useState('');

  // Countdown timer when active number exists
  useEffect(() => {
    if (!activeNumber || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeNumber, timeLeft]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePurchase = () => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      // Deduct balance
      updateUser({ balance: (state.user.balance || 0) - selectedCountry.price });

      // Generate a realistic virtual number
      const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
      const generatedNum = `${selectedCountry.code} (646) ${randomDigits.toString().slice(0, 3)}-${randomDigits.toString().slice(3, 7)}`;
      setActiveNumber(generatedNum);
      setTimeLeft(1200);
      setOtpCode(null);
    }, 1000);
  };

  const handleSimulateOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    setOtpCode(String(randomOtp));
  };

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Virtual Numbers" onBack={goBack} />

      {!activeNumber ? (
        <div className={styles.content}>
          {/* Header Card */}
          <div className={styles.banner}>
            <div className={styles.badge}>INSTANT ACTIVATION</div>
            <div className={styles.bannerTitle}>Non-VoIP Numbers for Verification</div>
            <div className={styles.bannerSub}>
              Select your destination country and service to receive your secure SMS verification code.
            </div>
          </div>

          {/* 1. Country Selection */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>1. Select Country</div>
            <div className={styles.countryGrid}>
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.countryChip} ${selectedCountry.id === c.id ? styles.countryChipActive : ''}`}
                  onClick={() => setSelectedCountry(c)}
                >
                  <span className={styles.flag}>{c.flag}</span>
                  <span className={styles.countryName}>{c.name}</span>
                  <span className={styles.countryCode}>{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Service Selection */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>2. Select Target Service</div>
            <div className={styles.serviceGrid}>
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.serviceChip} ${selectedService.id === s.id ? styles.serviceChipActive : ''}`}
                  onClick={() => setSelectedService(s)}
                >
                  <span className={styles.serviceIcon}>{s.icon}</span>
                  <span className={styles.serviceName}>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Summary */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span>Selected Route</span>
              <span className={styles.summaryVal}>{selectedCountry.flag} {selectedCountry.name} ({selectedService.name})</span>
            </div>
            <div className={styles.summaryRow}>
              <span>SMS Session Duration</span>
              <span className={styles.summaryVal}>20 Minutes</span>
            </div>
            <div className={styles.summaryRowTotal}>
              <span>Total Price</span>
              <span className={styles.totalAmount}>₦{selectedCountry.price.toLocaleString()}.00</span>
            </div>
          </div>

          {/* Unified Yellow Continue Button */}
          <div className={styles.btnWrap}>
            <button
              type="button"
              className={styles.btn}
              disabled={isBuying}
              onClick={handlePurchase}
            >
              {isBuying ? 'Generating Virtual Number...' : 'Continue & Buy Number'}
            </button>
          </div>
        </div>
      ) : (
        /* Active Number Screen with Live OTP */
        <div className={styles.content}>
          <div className={styles.activeCard}>
            <div className={styles.activeTop}>
              <span className={styles.liveBadge}>LIVE NUMBER ACTIVE</span>
              <span className={styles.timerBadge}>⏱ {formatTimer(timeLeft)}</span>
            </div>

            <div className={styles.serviceHeader}>
              <span className={styles.flag}>{selectedCountry.flag}</span>
              <div>
                <div className={styles.activeServiceTitle}>{selectedService.name} Verification</div>
                <div className={styles.activeServiceSub}>{selectedCountry.name} Line</div>
              </div>
            </div>

            <div className={styles.numberBox}>
              <div className={styles.numberDisplay}>{activeNumber}</div>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => handleCopy(activeNumber, 'Number')}
              >
                {copied === 'Number' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* OTP Section */}
          <div className={styles.otpSection}>
            <div className={styles.otpLabel}>Incoming SMS Verification Code</div>

            {otpCode ? (
              <div className={styles.otpSuccessCard}>
                <div className={styles.otpCode}>{otpCode}</div>
                <div className={styles.otpSource}>
                  From {selectedService.name}: Your verification code is {otpCode}
                </div>
                <button
                  type="button"
                  className={styles.copyOtpBtn}
                  onClick={() => handleCopy(otpCode, 'OTP')}
                >
                  {copied === 'OTP' ? '✓ Copied to clipboard!' : 'Copy Verification Code'}
                </button>
              </div>
            ) : (
              <div className={styles.otpWaitingCard}>
                <div className={styles.pulseDot} />
                <div className={styles.waitingText}>Waiting for SMS from {selectedService.name}...</div>
                <div className={styles.waitingSub}>
                  Paste {activeNumber} into your {selectedService.name} app to request code.
                </div>
                <button
                  type="button"
                  className={styles.simulateBtn}
                  onClick={handleSimulateOtp}
                >
                  ⚡ Simulate Incoming SMS
                </button>
              </div>
            )}
          </div>

          {/* Done / Reset */}
          <div className={styles.btnWrap}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => setActiveNumber(null)}
            >
              Buy Another Number
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
