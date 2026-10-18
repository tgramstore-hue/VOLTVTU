'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './History.module.css';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'airtime', label: 'Airtime' },
  { id: 'data', label: 'Data' },
  { id: 'cable', label: 'Cable TV' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'exam', label: 'Education / Exam' },
  { id: 'betting', label: 'Betting' },
  { id: 'funding', label: 'Transfers / Funding' },
];

const STATUSES = [
  { id: 'all', label: 'All Status' },
  { id: 'successful', label: 'Successful' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
  { id: 'reversed', label: 'Reversed' },
];

export default function HistoryScreen() {
  const { state, goBack, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('Oct 2026');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Filter transactions
  const filtered = state.transactions.filter((t) => {
    if (selectedCategory !== 'all') {
      if (t.category !== selectedCategory && t.type !== selectedCategory) return false;
    }
    if (selectedStatus !== 'all') {
      if (t.status !== selectedStatus) return false;
    }
    return true;
  });

  // Calculate live Inflow & Outflow
  const totalInflow = filtered
    .filter((t) => t.amount > 0 && t.status === 'successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = filtered
    .filter((t) => t.amount < 0 && t.status === 'successful')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const renderStatusPill = (status) => {
    switch (status) {
      case 'successful':
        return <span className={styles.pillSuccess}>Successful</span>;
      case 'pending':
        return <span className={styles.pillPending}>Pending</span>;
      case 'failed':
        return <span className={styles.pillFailed}>Failed</span>;
      case 'reversed':
        return <span className={styles.pillReversed}>Reversed</span>;
      default:
        return <span className={styles.pillDefault}>{status}</span>;
    }
  };

  const getDirectionIcon = (t) => {
    const isCredit = t.amount > 0;
    if (isCredit) {
      return (
        <div className={styles.circleCredit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
      );
    }
    if (t.category === 'betting') {
      return (
        <div className={styles.circleNeutral}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 6 15 10 13 14 11 14 9 10 12 6"/>
          </svg>
        </div>
      );
    }
    if (t.category === 'electricity') {
      return (
        <div className={styles.circleNeutral}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
      );
    }
    return (
      <div className={styles.circleDebit}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Top Header matching Image 1: Back + Transactions + Download */}
      <div className={styles.topNav}>
        <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className={styles.navTitle}>Transactions</h1>
        <button
          type="button"
          className={styles.downloadLink}
          onClick={() => navigate('download-statement')}
        >
          Download
        </button>
      </div>

      {/* Dropdown Filters Row: All Categories & All Status side by side */}
      <div className={styles.dropdownsRow}>
        <div className={styles.selectWrap}>
          <select
            className={styles.selectFilter}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <span className={styles.selectCaret}>▾</span>
        </div>

        <div className={styles.selectWrap}>
          <select
            className={styles.selectFilter}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <span className={styles.selectCaret}>▾</span>
        </div>
      </div>

      {/* Month, In/Out summary & Analysis badge matching Image 1 */}
      <div className={styles.periodCard}>
        <div className={styles.periodTop}>
          <div className={styles.monthSelector}>
            <span className={styles.monthText}>{selectedMonth}</span>
            <span className={styles.monthCaret}>▾</span>
          </div>

          <button
            type="button"
            className={styles.analysisBtn}
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            Analysis
          </button>
        </div>

        <div className={styles.inOutRow}>
          <span>In: <strong>₦{(totalInflow || 129845.29).toLocaleString()}</strong></span>
          <span className={styles.outText}>Out: <strong>₦{(totalOutflow || 129853.10).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Transaction List arranged exactly like Image 1 */}
      <div className={styles.transactionsList}>
        {filtered.map((item) => {
          const isCredit = item.amount > 0;
          return (
            <div
              key={item.id}
              className={styles.txRow}
              onClick={() => setActiveReceipt(item)}
            >
              <div className={styles.txLeft}>
                {getDirectionIcon(item)}
                <div className={styles.txInfo}>
                  <div className={styles.txTitle}>{item.title}</div>
                  <div className={styles.txTime}>{item.time || 'Oct 17th, 19:48:37'}</div>
                </div>
              </div>

              <div className={styles.txRight}>
                <div className={`${styles.txAmount} ${isCredit ? styles.amountGreen : styles.amountDark}`}>
                  {isCredit ? '+' : '-'}₦{Math.abs(item.amount).toLocaleString()}.00
                </div>
                <div className={styles.statusWrap}>
                  {renderStatusPill(item.status)}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            No transactions found for the selected filter.
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className={styles.receiptOverlay} onClick={() => setActiveReceipt(null)}>
          <div className={styles.receiptSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.receiptHandle} />
            <div className={styles.receiptHeader}>Transaction Receipt</div>
            <div className={styles.receiptAmountLarge}>
              {activeReceipt.amount > 0 ? '+' : '-'}₦{Math.abs(activeReceipt.amount).toLocaleString()}.00
            </div>
            <div className={styles.receiptPillRow}>
              {renderStatusPill(activeReceipt.status)}
            </div>

            <div className={styles.receiptDetails}>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Transaction</span>
                <span className={styles.receiptVal}>{activeReceipt.title}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Reference</span>
                <span className={styles.receiptVal}>{activeReceipt.ref || 'VTU-TX-849201'}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Date & Time</span>
                <span className={styles.receiptVal}>{activeReceipt.time || 'Oct 17th, 21:22:32'}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Payment Method</span>
                <span className={styles.receiptVal}>VTUflash Wallet</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setActiveReceipt(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
