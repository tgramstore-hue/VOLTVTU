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
  IconChevronRight,
  IconDownload,
  IconCheck,
  IconX,
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
  { num: '01', name: 'Jan', full: 'January' },
  { num: '02', name: 'Feb', full: 'February' },
  { num: '03', name: 'Mar', full: 'March' },
  { num: '04', name: 'Apr', full: 'April' },
  { num: '05', name: 'May', full: 'May' },
  { num: '06', name: 'Jun', full: 'June' },
  { num: '07', name: 'Jul', full: 'July' },
  { num: '08', name: 'Aug', full: 'August' },
  { num: '09', name: 'Sep', full: 'September' },
  { num: '10', name: 'Oct', full: 'October' },
  { num: '11', name: 'Nov', full: 'November' },
  { num: '12', name: 'Dec', full: 'December' },
];

const YEARS = ['2024', '2025', '2026'];

export default function HistoryScreen() {
  const { state, goBack, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Date selection states
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showDateModal, setShowDateModal] = useState(false);
  const [modalTab, setModalTab] = useState('month'); // 'month' | 'timeframe'
  const [timeframeDuration, setTimeframeDuration] = useState('3m'); // '3m' | '6m' | 'custom'
  const [startDate, setStartDate] = useState('Aug, 2026');
  const [endDate, setEndDate] = useState('Oct, 2026');

  // Modals for receipt
  const [selectedTx, setSelectedTx] = useState(null);
  const [showFullReceipt, setShowFullReceipt] = useState(false);

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

  const getMonthObj = (num) => MONTHS.find((m) => m.num === num) || MONTHS[9];
  const displayPeriod = `${getMonthObj(selectedMonth).name}, ${selectedYear}`;

  const renderStatus = (status) => {
    switch (status) {
      case 'successful':
        return <span className={styles.statusSuccess}>Successful</span>;
      case 'pending':
        return <span className={styles.statusPending}>Pending</span>;
      case 'failed':
        return <span className={styles.statusFailed}>Failed</span>;
      case 'reversed':
        return <span className={styles.statusReversed}>Reversed</span>;
      default:
        return <span className={styles.statusDefault}>{status}</span>;
    }
  };

  const renderRowIcon = (item) => {
    const isCredit = item.amount > 0;
    if (isCredit) {
      return (
        <div className={styles.circleInflow} aria-label="Incoming transaction">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      );
    }
    if (item.category === 'electricity') {
      return (
        <div className={styles.circleOutflow} aria-label="Electricity bill">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B08A00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
      );
    }
    if (item.category === 'betting') {
      return (
        <div className={styles.circleOutflow} aria-label="Betting funding">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B08A00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      );
    }
    return (
      <div className={styles.circleOutflow} aria-label="Outgoing transaction">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B08A00" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </div>
    );
  };

  const handleApplyDuration = (dur) => {
    setTimeframeDuration(dur);
    if (dur === '3m') {
      setStartDate('Aug, 2026');
      setEndDate('Oct, 2026');
    } else if (dur === '6m') {
      setStartDate('May, 2026');
      setEndDate('Oct, 2026');
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Go back">
          <IconChevronLeft size={22} />
        </button>
        <h1 className={styles.navTitle}>Transactions</h1>
        <button
          type="button"
          className={styles.statementBtn}
          onClick={() => navigate('download-statement')}
        >
          <IconDownload size={15} />
          <span>Statement</span>
        </button>
      </div>

      {/* Top In / Out Summary Header (exactly like Image 1) */}
      <div className={styles.summaryBar}>
        <div className={styles.periodPill} onClick={() => setShowDateModal(true)}>
          <span className={styles.periodLabel}>{displayPeriod}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className={styles.inOutStats}>
          <span className={styles.statIn}>
            In: <strong>₦{totalInflow.toLocaleString()}</strong>
          </span>
          <span className={styles.statOut}>
            Out: <strong>₦{totalOutflow.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Filters Row */}
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

      {/* Activity Section with Single Joint White Card Container (Matching Image 1) */}
      <div className={styles.activitySection}>
        <div className={styles.activityHeader}>
          <h2 className={styles.activityTitle}>Activity</h2>
          <span className={styles.recordsCount}>{filtered.length} records</span>
        </div>

        <div className={styles.jointCard}>
          {filtered.map((item, idx) => {
            const isCredit = item.amount > 0;
            return (
              <div
                key={item.id}
                className={styles.jointRow}
                style={{ animationDelay: `${idx * 40}ms` }}
                onClick={() => setSelectedTx(item)}
              >
                <div className={styles.rowLeft}>
                  {renderRowIcon(item)}
                  <div className={styles.rowInfo}>
                    <div className={styles.txTitle}>{item.title}</div>
                    <div className={styles.txTime}>{item.time || '2:34 PM'}</div>
                  </div>
                </div>

                <div className={styles.rowRight}>
                  <div className={`${styles.txAmount} ${isCredit ? styles.amountGreen : styles.amountDark}`}>
                    {isCredit ? '+' : '-'}₦{Math.abs(item.amount).toLocaleString()}.00
                  </div>
                  <div className={styles.statusWrap}>
                    {renderStatus(item.status)}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#B08A00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="6" y1="8" x2="18" y2="8" />
                  <line x1="6" y1="12" x2="14" y2="12" />
                  <line x1="6" y1="16" x2="10" y2="16" />
                </svg>
              </div>
              <div className={styles.emptyTitle}>No matching transactions</div>
              <div className={styles.emptySub}>Your transaction history will appear here once you make top-ups or pay bills.</div>
            </div>
          )}
        </div>
      </div>

      {/* Date Picker Modal (Matching Images 2 & 3 with VTUflash Yellow Design System) */}
      {showDateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDateModal(false)}>
          <div className={styles.dateModalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTopHeader}>
              <div className={styles.modalTabs}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${modalTab === 'month' ? styles.tabBtnActive : ''}`}
                  onClick={() => setModalTab('month')}
                >
                  Month
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${modalTab === 'timeframe' ? styles.tabBtnActive : ''}`}
                  onClick={() => setModalTab('timeframe')}
                >
                  Time Frame
                </button>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowDateModal(false)}
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Tab 1: Month & Year Picker (Matching Image 3) */}
            {modalTab === 'month' && (
              <div className={styles.monthPickerBody}>
                <div className={styles.wheelContainer}>
                  {/* Month column */}
                  <div className={styles.wheelCol}>
                    <div className={styles.colLabel}>Month</div>
                    <div className={styles.wheelList}>
                      {MONTHS.map((m) => (
                        <div
                          key={m.num}
                          className={`${styles.wheelItem} ${selectedMonth === m.num ? styles.wheelItemActive : ''}`}
                          onClick={() => setSelectedMonth(m.num)}
                        >
                          <span className={styles.wheelNum}>{m.num}</span>
                          <span className={styles.wheelName}>({m.name})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Year column */}
                  <div className={styles.wheelCol}>
                    <div className={styles.colLabel}>Year</div>
                    <div className={styles.wheelList}>
                      {YEARS.map((y) => (
                        <div
                          key={y}
                          className={`${styles.wheelItem} ${selectedYear === y ? styles.wheelItemActive : ''}`}
                          onClick={() => setSelectedYear(y)}
                        >
                          <span className={styles.wheelNum}>{y}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={() => setShowDateModal(false)}
                >
                  Confirm
                </button>
              </div>
            )}

            {/* Tab 2: Time Frame Picker (Matching Image 2) */}
            {modalTab === 'timeframe' && (
              <div className={styles.timeframeBody}>
                <div className={styles.fieldSection}>
                  <label className={styles.sectionLabel}>Duration</label>
                  <div className={styles.durationPills}>
                    <button
                      type="button"
                      className={`${styles.durPill} ${timeframeDuration === '3m' ? styles.durPillActive : ''}`}
                      onClick={() => handleApplyDuration('3m')}
                    >
                      Last 3 months
                    </button>
                    <button
                      type="button"
                      className={`${styles.durPill} ${timeframeDuration === '6m' ? styles.durPillActive : ''}`}
                      onClick={() => handleApplyDuration('6m')}
                    >
                      Last 6 months
                    </button>
                    <button
                      type="button"
                      className={`${styles.durPill} ${timeframeDuration === 'custom' ? styles.durPillActive : ''}`}
                      onClick={() => setTimeframeDuration('custom')}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                <div className={styles.fieldSection}>
                  <label className={styles.sectionLabel}>Start Date</label>
                  <div className={styles.dateRowSelect}>
                    <span>{startDate}</span>
                    <IconChevronRight size={18} />
                  </div>
                </div>

                <div className={styles.fieldSection}>
                  <label className={styles.sectionLabel}>End Date</label>
                  <div className={styles.dateRowSelect}>
                    <span>{endDate}</span>
                    <IconChevronRight size={18} />
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={() => setShowDateModal(false)}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Modal (Summary with "View Receipt" button) */}
      {selectedTx && !showFullReceipt && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTx(null)}>
          <div className={styles.summarySheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHandle} />
            <div className={styles.sheetHeader}>Transaction Details</div>

            <div className={styles.sheetAmount}>
              {selectedTx.amount > 0 ? '+' : '-'}₦{Math.abs(selectedTx.amount).toLocaleString()}.00
            </div>
            <div className={styles.sheetStatusWrap}>
              {renderStatus(selectedTx.status)}
            </div>

            <div className={styles.sheetDetailsCard}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Transaction</span>
                <span className={styles.detailVal}>{selectedTx.title}</span>
              </div>
              {selectedTx.recipient && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Recipient</span>
                  <span className={styles.detailVal}>{selectedTx.recipient}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Reference</span>
                <span className={styles.detailVal}>{selectedTx.ref || 'VTU-TX-849201'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Date & Time</span>
                <span className={styles.detailVal}>{selectedTx.time || 'Oct 18, 2:34 PM'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Payment Method</span>
                <span className={styles.detailVal}>VTUflash Wallet</span>
              </div>
            </div>

            <div className={styles.actionButtonsCol}>
              <button
                type="button"
                className={styles.viewReceiptBtn}
                onClick={() => setShowFullReceipt(true)}
              >
                View Receipt
              </button>

              <button
                type="button"
                className={styles.sheetDoneBtn}
                onClick={() => setSelectedTx(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Official Receipt Modal (Ready for screenshotting / download) */}
      {selectedTx && showFullReceipt && (
        <div className={styles.modalOverlay} onClick={() => setShowFullReceipt(false)}>
          <div className={styles.fullReceiptSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHandle} />

            <div className={styles.receiptCardPrintable}>
              <div className={styles.receiptTopBrand}>
                <div className={styles.receiptLogoWrap}>
                  <span className={styles.receiptLogoV}>VTU</span>
                  <span className={styles.receiptLogoFlash}>flash</span>
                </div>
                <div className={styles.receiptTitleSmall}>Transaction Receipt</div>
              </div>

              <div className={styles.receiptSuccessStamp}>
                <div className={styles.stampCircle}>
                  <IconCheck size={26} />
                </div>
                <div className={styles.stampText}>Transaction Successful</div>
              </div>

              <div className={styles.receiptTotalAmount}>
                {selectedTx.amount > 0 ? '+' : '-'}₦{Math.abs(selectedTx.amount).toLocaleString()}.00
              </div>

              <div className={styles.receiptDividerDashed} />

              <div className={styles.receiptMetaGrid}>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Service</span>
                  <span className={styles.metaVal}>{selectedTx.title}</span>
                </div>
                {selectedTx.recipient && (
                  <div className={styles.metaRow}>
                    <span className={styles.metaKey}>Recipient</span>
                    <span className={styles.metaVal}>{selectedTx.recipient}</span>
                  </div>
                )}
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Transaction Ref</span>
                  <span className={styles.metaValRef}>{selectedTx.ref || 'VTU-TX-849201'}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Date & Time</span>
                  <span className={styles.metaVal}>{selectedTx.time || 'Oct 18th, 2026, 2:34 PM'}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Payment Type</span>
                  <span className={styles.metaVal}>Wallet Debit</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>Status</span>
                  <span className={styles.metaValSuccess}>SUCCESSFUL</span>
                </div>
              </div>

              <div className={styles.receiptBarcodeWrap}>
                <div className={styles.barcodeLines} />
                <span className={styles.barcodeNumber}>VTU-849201984210</span>
              </div>
            </div>

            <div className={styles.receiptActionsRow}>
              <button
                type="button"
                className={styles.downloadReceiptBtn}
                onClick={() => {
                  alert('Receipt downloaded successfully!');
                }}
              >
                <IconDownload size={18} />
                <span>Download / Share</span>
              </button>
              <button
                type="button"
                className={styles.closeReceiptModalBtn}
                onClick={() => {
                  setShowFullReceipt(false);
                  setSelectedTx(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
