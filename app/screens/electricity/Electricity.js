'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import PromoCarousel, { ELECTRICITY_PROMOS } from '../../components/PromoCarousel';
import styles from './Electricity.module.css';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

export default function ElectricityScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [disco, setDisco] = useState('ikeja');
  const [meterType, setMeterType] = useState('prepaid');
  const [meterNo, setMeterNo] = useState('04192837461');
  const [amount, setAmount] = useState('3000');

  const numAmount = Number(amount) || 0;

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    const recipientMeter = meterNo && meterNo.trim().length >= 10 ? meterNo.trim() : '04192837461';
    if (!meterNo || meterNo.trim().length < 10) {
      setMeterNo(recipientMeter);
    }
    const discoObj = PROVIDERS.electricityProviders.find(d => d.id === disco);
    setPurchase({
      type: 'Electricity Bill',
      category: 'electricity',
      provider: discoObj ? `${discoObj.label} Electric` : disco.toUpperCase(),
      meterType: meterType.toUpperCase(),
      recipient: recipientMeter,
      customerName: 'MARY O. JOHNSON',
      address: '14 Adeniran Ogunsanya, Surulere, Lagos',
      amount: val,
      fee: 100,
      cashback: 0,
      total: val + 100,
    });
    navigate('confirm-payment');
  };

  const handleContinue = () => {
    if (!numAmount || !meterNo) return;
    const discoObj = PROVIDERS.electricityProviders.find(d => d.id === disco);
    setPurchase({
      type: 'Electricity Bill',
      category: 'electricity',
      provider: discoObj ? `${discoObj.label} Electric` : disco.toUpperCase(),
      meterType: meterType.toUpperCase(),
      recipient: meterNo,
      customerName: 'MARY O. JOHNSON',
      address: '14 Adeniran Ogunsanya, Surulere, Lagos',
      amount: numAmount,
      fee: 100,
      cashback: 0,
      total: numAmount + 100,
    });
    navigate('confirm-payment');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Electricity" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Disco</div>
          <NetworkSelector
            items={PROVIDERS.electricityProviders}
            selected={disco}
            onSelect={setDisco}
            columns={4}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Meter Type</div>
          <div className={styles.toggleWrap}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${meterType === 'prepaid' ? styles.toggleActive : ''}`}
              onClick={() => setMeterType('prepaid')}
            >
              Prepaid
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${meterType === 'postpaid' ? styles.toggleActive : ''}`}
              onClick={() => setMeterType('postpaid')}
            >
              Postpaid
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Meter Number</div>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter meter number"
            value={meterNo}
            onChange={(e) => setMeterNo(e.target.value)}
            maxLength={13}
          />
        </div>

        {meterNo.length >= 10 && (
          <div className={styles.verifiedCard}>
            <div className={styles.verifiedTop}>
              <div className={styles.verifiedName}>MARY O. JOHNSON</div>
              <span className={styles.badge}>VERIFIED</span>
            </div>
            <div className={styles.verifiedAddress}>14 Adeniran Ogunsanya, Surulere, Lagos</div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Amount (₦)</div>
          <input
            type="number"
            className={styles.input}
            placeholder="Min ₦500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className={styles.chips}>
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                className={`${styles.chip} ${numAmount === val ? styles.chipActive : ''}`}
                onClick={() => handleQuickAmount(val)}
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
            disabled={!numAmount || meterNo.length < 10}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>

        {/* Bottom Promo Carousel */}
        <div style={{ marginTop: '20px', marginBottom: '24px' }}>
          <PromoCarousel items={ELECTRICITY_PROMOS} title="Explore Other Services" />
        </div>
      </div>
    </div>
  );
}
