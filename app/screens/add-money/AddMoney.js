'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './AddMoney.module.css';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export default function AddMoneyScreen() {
  const { navigate, goBack, updateUser, setState } = useApp();
  const [tab, setTab] = useState('transfer');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('5000');

  const numAmount = Number(amount) || 0;

  const handleCopy = () => {
    navigator.clipboard?.writeText('8123456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardFund = () => {
    if (!numAmount) return;
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        balance: prev.user.balance + numAmount,
      },
      transactions: [
        {
          id: Date.now(),
          type: 'funding',
          title: 'Card Wallet Funding',
          amount: numAmount,
          status: 'successful',
          date: 'today',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: 'plus',
        },
        ...prev.transactions,
      ],
    }));
    navigate('dashboard');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Add Money" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.tabWrap}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'transfer' ? styles.tabActive : ''}`}
            onClick={() => setTab('transfer')}
          >
            Bank Transfer
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'card' ? styles.tabActive : ''}`}
            onClick={() => setTab('card')}
          >
            Debit Card
          </button>
        </div>

        {tab === 'transfer' ? (
          <>
            <div className={styles.accountCard}>
              <div className={styles.accountTop}>
                <span className={styles.bankName}>Wema Bank / Moniepoint</span>
                <span className={styles.tag}>AUTOMATED</span>
              </div>
              <div className={styles.accountMid}>
                <span className={styles.accLabel}>Virtual Account Number</span>
                <div className={styles.accNumberRow}>
                  <span className={styles.accNumber}>8123456789</span>
                  <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className={styles.accountBottom}>
                <span className={styles.accNameLabel}>Account Name</span>
                <span className={styles.accName}>VTUFLASH - ETIM EFFIONG</span>
              </div>
            </div>

            <div className={styles.notice}>
              💡 <strong>Instant Funding:</strong> Make a regular bank transfer to this dedicated virtual account number. Your VTUflash balance will reflect automatically in seconds with 0% funding fee.
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>
                Enter Amount (₦)
              </span>
              <input
                type="number"
                className={styles.input}
                placeholder="Min ₦500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

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

            <div className={styles.btnWrap}>
              <button
                type="button"
                className={styles.btn}
                disabled={!numAmount}
                onClick={handleCardFund}
              >
                Pay ₦{numAmount.toLocaleString()}.00 with Card
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
