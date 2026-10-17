'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import styles from './Airtime.module.css';

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export default function AirtimeScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [network, setNetwork] = useState('mtn');
  const [phone, setPhone] = useState('080 0000 0000');
  const [amount, setAmount] = useState('200');

  const numAmount = Number(amount) || 0;
  const cashback = Math.round(numAmount * 0.02);

  const handleContinue = () => {
    if (!numAmount || !phone) return;
    const providerObj = PROVIDERS.networks.find((n) => n.id === network);
    setPurchase({
      type: 'Airtime',
      category: 'airtime',
      provider: providerObj ? providerObj.label : network.toUpperCase(),
      network,
      recipient: phone,
      amount: numAmount,
      fee: 0,
      cashback,
      total: numAmount,
    });
    navigate('confirm-payment');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Buy Airtime" onBack={goBack} />

      <div className={styles.content}>
        {/* Network Selection */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Network</div>
          <NetworkSelector
            items={PROVIDERS.networks}
            selected={network}
            onSelect={setNetwork}
            columns={4}
          />
        </div>

        {/* Phone Number */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Phone number</div>
          <div className={styles.inputWrap}>
            <input
              type="tel"
              className={styles.input}
              placeholder="080 0000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={14}
            />
            <div className={styles.inputIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Amount</div>
          <div className={styles.amountGrid}>
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                className={`${styles.amountChip} ${numAmount === val ? styles.amountChipActive : ''}`}
                onClick={() => setAmount(String(val))}
              >
                ₦{val.toLocaleString()}
              </button>
            ))}
          </div>

          <div className={styles.customAmountWrap}>
            <span className={styles.nairaPrefix}>₦</span>
            <input
              type="number"
              className={styles.customInput}
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Cashback Card matching design */}
        <div className={styles.cashbackCard}>
          <div className={styles.cashbackIconWrap}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"/>
              <rect x="2" y="7" width="20" height="5"/>
              <line x1="12" y1="22" x2="12" y2="7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
          </div>
          <div className={styles.cashbackText}>Earn cashback on every airtime purchase</div>
        </div>

        {/* Unified Yellow Continue Button */}
        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            disabled={!numAmount || phone.length < 10}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
