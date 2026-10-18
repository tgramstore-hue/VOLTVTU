'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import PromoCarousel, { DATA_PROMOS } from '../../components/PromoCarousel';
import styles from './Data.module.css';

const DATA_PLANS = {
  daily: [
    { id: 'd1', name: '500MB Daily Plan', validity: '1 Day', price: 150 },
    { id: 'd2', name: '1.0GB Daily Plan', validity: '1 Day', price: 300 },
    { id: 'd3', name: '2.0GB 2-Days Plan', validity: '2 Days', price: 500 },
  ],
  weekly: [
    { id: 'w1', name: '1.5GB Weekly Plan', validity: '7 Days', price: 500 },
    { id: 'w2', name: '3.0GB Weekly Plan', validity: '7 Days', price: 1000 },
    { id: 'w3', name: '5.0GB Weekly Plan', validity: '7 Days', price: 1500 },
  ],
  monthly: [
    { id: 'm1', name: '1.0GB SME Data', validity: '30 Days', price: 280 },
    { id: 'm2', name: '2.0GB SME Data', validity: '30 Days', price: 560 },
    { id: 'm3', name: '5.0GB SME Data', validity: '30 Days', price: 1400 },
    { id: 'm4', name: '10.0GB SME Data', validity: '30 Days', price: 2800 },
    { id: 'm5', name: '15.0GB SME Data', validity: '30 Days', price: 4200 },
  ],
};

export default function DataScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [network, setNetwork] = useState('mtn');
  const [phone, setPhone] = useState('08012345678');
  const [tab, setTab] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(DATA_PLANS.monthly[0].id);

  const currentPlans = DATA_PLANS[tab] || [];
  const activePlanObj = currentPlans.find(p => p.id === selectedPlan) || currentPlans[0];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.id);
    const recipientPhone = phone && phone.trim().length >= 10 ? phone.trim() : '08012345678';
    if (!phone || phone.trim().length < 10) {
      setPhone(recipientPhone);
    }
    const providerObj = PROVIDERS.networks.find(n => n.id === network);
    setPurchase({
      type: 'Data Bundle',
      category: 'data',
      provider: providerObj ? providerObj.label : network.toUpperCase(),
      network,
      plan: plan.name,
      validity: plan.validity,
      recipient: recipientPhone,
      amount: plan.price,
      fee: 0,
      cashback: Math.round(plan.price * 0.01),
      total: plan.price,
    });
    navigate('confirm-payment');
  };

  const handleContinue = () => {
    if (!activePlanObj || !phone) return;
    const providerObj = PROVIDERS.networks.find(n => n.id === network);
    setPurchase({
      type: 'Data Bundle',
      category: 'data',
      provider: providerObj ? providerObj.label : network.toUpperCase(),
      network,
      plan: activePlanObj.name,
      validity: activePlanObj.validity,
      recipient: phone,
      amount: activePlanObj.price,
      fee: 0,
      cashback: Math.round(activePlanObj.price * 0.01),
      total: activePlanObj.price,
    });
    navigate('confirm-payment');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Buy Data" onBack={goBack} />

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
          <input
            type="tel"
            className={styles.input}
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={11}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Plan</div>
          <div className={styles.tabRow}>
            {['daily', 'weekly', 'monthly'].map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.tabChip} ${tab === t ? styles.tabChipActive : ''}`}
                onClick={() => {
                  setTab(t);
                  setSelectedPlan(DATA_PLANS[t][0].id);
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.planList}>
            {currentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planCardActive : ''}`}
                onClick={() => handleSelectPlan(plan)}
              >
                <div>
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planValidity}>{plan.validity}</div>
                </div>
                <div className={styles.planPrice}>₦{plan.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            disabled={!activePlanObj || phone.length < 10}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>

        {/* Bottom Promo Carousel */}
        <div style={{ marginTop: '20px', marginBottom: '24px' }}>
          <PromoCarousel items={DATA_PROMOS} title="Explore Other Services" />
        </div>
      </div>
    </div>
  );
}
