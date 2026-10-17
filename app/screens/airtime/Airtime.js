'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import styles from './Airtime.module.css';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimeScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [network, setNetwork] = useState('mtn');
  const [phone, setPhone] = useState('08012345678');
  const [amount, setAmount] = useState('1000');

  const numAmount = Number(amount) || 0;
  const cashback = Math.round(numAmount * 0.02);

  const handleContinue = () => {
    if (!numAmount || !phone) return;
    const providerObj = PROVIDERS.networks.find(n => n.id === network);
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
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Network</div>
          <NetworkSelector
            items={PROVIDERS.networks}
            selected={network}
            onSelect={setNetwork}
            columns={4}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Phone Number</div>
          <div className={styles.inputWrap}>
            <input
              type="tel"
              className={styles.input}
              placeholder="08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Choose Amount</div>
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
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Custom Amount (₦)</div>
          <input
            type="number"
            className={styles.input}
            placeholder="Min ₦50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className={styles.cashbackCard}>
          <div>
            <div className={styles.cashbackLabel}>Instant Cash Reward</div>
            <div className={styles.cashbackValue}>+₦{cashback.toLocaleString()}.00 Cashback</div>
          </div>
          <span className={styles.cashbackBadge}>2% Back</span>
        </div>

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
