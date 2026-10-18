'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IconPhone,
  IconData,
  IconTV,
  IconBolt,
  IconExam,
  IconBetting,
  IconPlus,
  IconBank,
  IconWallet,
  IconChevronLeft,
  IconDownload,
} from '../../components/Icons';
import styles from './History.module.css';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'airtime', label: 'Airtime' },
  { id: 'data', label: 'Data Bundle' },
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = ['2024', '2025', '2026'];

const ICON_MAP = {
  phone: IconPhone,
  airtime: IconPhone,
  data: IconData,
  tv: IconTV,
  cable: IconTV,
  bolt: IconBolt,
  electricity: IconBolt,
  exam: IconExam,
  betting: IconBetting,
  plus: IconPlus,
  funding: IconPlus,
  bank: IconBank,
  wallet: IconWallet,
};

export default function HistoryScreen() {
  const { state, goBack, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState('month'); // 'month' | 'year' | 'custom'
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
        return <span className={styles.pillSuccess}>SUCCESSFUL</span>;
      case 'pending':
        return <span className={styles.pillPending}>PENDING</span>;
      case 'failed':
        return <span className={styles.pillFailed}>FAILED</span>;
      case 'reversed':
        return <span className={styles.pillReversed}>REVERSED</span>;
      default:
        return <span className={styles.pillDefault}>{status.toUpperCase()}</span>;
    }
  };

  const getServiceIcon = (t) => {
    const IconComp = ICON_MAP[t.icon] || ICON_MAP[t.type] || ICON_MAP[t.category] || IconPhone;
    const isCredit = t.amount > 0;
    return (
      <div className={`${styles.iconCircle} ${isCredit ? styles.iconGreen : styles.iconYellow}`}>
        <IconComp size={20} />
      </div>
    );
  };

  const displayPeriod = `${selectedMonth.substring(0, 3)} ${selectedYear}`;

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topNav}>
        <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Go back">
          <IconChevronLeft size={22} />
        </button>
        <h1 className={styles.navTitle}>Transactions</h1>
        <button
          type="button"
          className={styles.downloadStatementBtn}
          onClick={() => navigate('download-statement')}
        >
          <IconDownload size={15} />
          <span>Statement</span>
        </button>
      </div>

      {/* Dropdown Filters Row */}
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

      {/* Period Summary Card with month/year dropdown */}
      <div className={styles.periodCard}>
        <div className={styles.periodTop}>
          <button
            type="button"
            className={styles.monthSelector}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <span className={styles.monthText}>{displayPeriod}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: showDatePicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className={styles.periodBadge}>Summary</div>
        </div>

        <div className={styles.inOutRow}>
          <div className={styles.inOutBlock}>
            <span className={styles.inOutLabel}>Inflow</span>
            <span className={styles.inAmount}>+₦{(totalInflow || 15000).toLocaleString()}.00</span>
          </div>
          <div className={styles.inOutDivider} />
          <div className={styles.inOutBlock}>
            <span className={styles.inOutLabel}>Outflow</span>
            <span className={styles.outAmount}>-₦{(totalOutflow || 23800).toLocaleString()}.00</span>
          </div>
        </div>
      </div>

      {/* Date Picker Dropdown (matching design system) */}
      {showDatePicker && (
        <div className={styles.datePickerCard}>
          <div className={styles.datePickerTabs}>
            <button
              type="button"
              className={`${styles.dateTab} ${dateMode === 'month' ? styles.dateTabActive : ''}`}
              onClick={() => setDateMode('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`${styles.dateTab} ${dateMode === 'year' ? styles.dateTabActive : ''}`}
              onClick={() => setDateMode('year')}
            >
              Year
            </button>
            <button
              type="button"
              className={`${styles.dateTab} ${dateMode === 'custom' ? styles.dateTabActive : ''}`}
              onClick={() => setDateMode('custom')}
            >
              Custom
            </button>
          </div>

          {dateMode === 'month' && (
            <div className={styles.monthGrid}>
              {MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${styles.monthChip} ${selectedMonth === m ? styles.monthChipActive : ''}`}
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowDatePicker(false);
                  }}
                >
                  {m.substring(0, 3)}
                </button>
              ))}
            </div>
          )}

          {dateMode === 'year' && (
            <div className={styles.yearGrid}>
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`${styles.yearChip} ${selectedYear === y ? styles.yearChipActive : ''}`}
                  onClick={() => {
                    setSelectedYear(y);
                    setShowDatePicker(false);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {dateMode === 'custom' && (
            <div className={styles.customRange}>
              <div className={styles.customField}>
                <label className={styles.customLabel}>From Date</label>
                <input type="date" className={styles.customInput} />
              </div>
              <div className={styles.customField}>
                <label className={styles.customLabel}>To Date</label>
                <input type="date" className={styles.customInput} />
              </div>
              <button
                type="button"
                className={styles.applyBtn}
                onClick={() => setShowDatePicker(false)}
              >
                Apply Date Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transaction List */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <span className={styles.groupTitle}>Activity Logs</span>
          <span className={styles.recordsCount}>{filtered.length} records</span>
        </div>

        <div className={styles.transactionsList}>
          {filtered.map((item) => {
            const isCredit = item.amount > 0;
            return (
              <div
                key={item.id}
                className={styles.card}
                onClick={() => setActiveReceipt(item)}
              >
                <div className={styles.left}>
                  {getServiceIcon(item)}
                  <div className={styles.txInfo}>
                    <div className={styles.txTitle}>{item.title}</div>
                    <div className={styles.subInfo}>
                      {item.recipient && <span className={styles.recipient}>{item.recipient} • </span>}
                      <span className={styles.time}>{item.time || 'Today'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.right}>
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
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>📂</div>
              <div className={styles.emptyTitle}>No matching transactions</div>
              <div className={styles.emptySub}>Try adjusting your category or status filters.</div>
            </div>
          )}
        </div>
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
              {activeReceipt.recipient && (
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Recipient</span>
                  <span className={styles.receiptVal}>{activeReceipt.recipient}</span>
                </div>
              )}
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
