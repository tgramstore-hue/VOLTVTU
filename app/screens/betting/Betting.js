'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import styles from './Betting.module.css';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function BettingScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [platform, setPlatform] = useState('bet9ja');
  const [customerId, setCustomerId] = useState('9823471');
  const [amount, setAmount] = useState('1000');

  const numAmount = Number(amount) || 0;

  const handleContinue = () => {
    if (!numAmount || !customerId) return;
    const platObj = PROVIDERS.bettingPlatforms.find(b => b.id === platform);
    setPurchase({
      type: 'Betting Wallet Top-up',
      category: 'betting',
      provider: platObj ? platObj.label : platform.toUpperCase(),
      recipient: customerId,
      customerName: 'KINGSLEY O.',
      amount: numAmount,
      fee: 50,
      cashback: 0,
      total: numAmount + 50,
    });
    navigate('confirm-payment');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Betting" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Platform</div>
          <NetworkSelector
            items={PROVIDERS.bettingPlatforms}
            selected={platform}
            onSelect={setPlatform}
            columns={4}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>User ID / Account ID</div>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>

        {customerId.length >= 6 && (
          <div className={styles.verifiedCard}>
            <div>
              <div className={styles.verifiedName}>KINGSLEY O.</div>
              <div className={styles.verifiedSub}>Active Customer Account</div>
            </div>
            <span className={styles.badge}>VERIFIED</span>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Amount (₦)</div>
          <input
            type="number"
            className={styles.input}
            placeholder="Min ₦100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className={styles.chips}>
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                className={`${styles.chip} ${numAmount === val ? styles.chipActive : ''}`}
                onClick={() => setAmount(String(val))}
              >
                ₦{val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            disabled={!numAmount || customerId.length < 5}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
