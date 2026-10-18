'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './GiftCard.module.css';

const CARDS = [
  { id: 'apple', name: 'Apple / iTunes', icon: '🍏', rate: 1350 },
  { id: 'steam', name: 'Steam Wallet', icon: '🎮', rate: 1420 },
  { id: 'amazon', name: 'Amazon Card', icon: '📦', rate: 1300 },
  { id: 'google', name: 'Google Play', icon: '▶️', rate: 1320 },
  { id: 'razer', name: 'Razer Gold', icon: '⚡', rate: 1450 },
  { id: 'xbox', name: 'Xbox / MS', icon: '🎯', rate: 1280 },
];

const AMOUNTS = [10, 25, 50, 100];

export default function GiftCardScreen() {
  const { goBack, setPurchase, navigate, updateUser, state } = useApp();

  const [tab, setTab] = useState('buy'); // buy | redeem
  const [selectedCard, setSelectedCard] = useState(CARDS[0]);
  const [amountUsd, setAmountUsd] = useState(25);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  const totalNaira = amountUsd * selectedCard.rate;

  const handleBuy = () => {
    setPurchase({
      type: 'Gift Card',
      category: 'giftcard',
      provider: selectedCard.name,
      recipient: `$${amountUsd} USD E-Code`,
      amount: totalNaira,
      fee: 0,
      cashback: 50,
      total: totalNaira,
    });
    navigate('confirm-payment');
  };

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!redeemCode) return;
    const payout = 25 * selectedCard.rate;
    updateUser({ balance: (state.user.balance || 0) + payout });
    setRedeemed(true);
    setTimeout(() => {
      setRedeemed(false);
      setRedeemCode('');
      navigate('dashboard');
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Gift Cards" onBack={goBack} />

      <div className={styles.content}>
        {/* Tab switch */}
        <div className={styles.tabSwitch}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'buy' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('buy')}
          >
            Buy Gift Card
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'redeem' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('redeem')}
          >
            Sell / Redeem Card
          </button>
        </div>

        {tab === 'buy' ? (
          <>
            {/* 1. Select Card Brand */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Select Card Brand</div>
              <div className={styles.cardGrid}>
                {CARDS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.brandChip} ${selectedCard.id === c.id ? styles.brandChipActive : ''}`}
                    onClick={() => setSelectedCard(c)}
                  >
                    <span className={styles.brandIcon}>{c.icon}</span>
                    <span className={styles.brandName}>{c.name}</span>
                    <span className={styles.brandRate}>₦{c.rate}/$</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Denomination */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Card Value (USD)</div>
              <div className={styles.amountGrid}>
                {AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles.amountChip} ${amountUsd === val ? styles.amountChipActive : ''}`}
                    onClick={() => setAmountUsd(val)}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary card */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Selected Card</span>
                <span className={styles.summaryVal}>{selectedCard.name} (${amountUsd} USD)</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Exchange Rate</span>
                <span className={styles.summaryVal}>₦{selectedCard.rate.toLocaleString()} / $1</span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total Amount (₦)</span>
                <span className={styles.totalAmount}>₦{totalNaira.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Unified Yellow Continue Button */}
            <div className={styles.btnWrap}>
              <button
                type="button"
                className={styles.btn}
                onClick={handleBuy}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          /* Redeem form */
          <form onSubmit={handleRedeem} className={styles.formSection}>
            <div className={styles.banner}>
              <div className={styles.bannerTitle}>Instant Cash for Your Gift Cards</div>
              <div className={styles.bannerSub}>
                Enter your card details and receive instant wallet credit at highest market payout rates.
              </div>
            </div>

            <div className={styles.section}>
              <label className={styles.sectionTitle}>Card Brand</label>
              <div className={styles.cardGrid}>
                {CARDS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.brandChip} ${selectedCard.id === c.id ? styles.brandChipActive : ''}`}
                    onClick={() => setSelectedCard(c)}
                  >
                    <span className={styles.brandIcon}>{c.icon}</span>
                    <span className={styles.brandName}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <label className={styles.sectionTitle}>Gift Card Code / PIN</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. X89K-473L-902N-8472"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                required
              />
            </div>

            <div className={styles.payoutCard}>
              <div className={styles.payoutLabel}>Current Cashout Rate</div>
              <div className={styles.payoutVal}>₦{selectedCard.rate.toLocaleString()} per $1.00 USD</div>
              <div className={styles.payoutSub}>Funds will be credited to your VTUflash wallet immediately upon verification.</div>
            </div>

            {redeemed && (
              <div className={styles.successToast}>
                ✓ Card verified! Payout credited to your wallet balance.
              </div>
            )}

            {/* Unified Yellow Continue Button */}
            <div className={styles.btnWrap}>
              <button
                type="submit"
                className={styles.btn}
                disabled={!redeemCode}
              >
                Redeem to Wallet
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
