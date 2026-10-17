'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import { IconPhone, IconData, IconTV, IconBolt, IconPlus, IconExam, IconBetting } from '../../components/Icons';
import styles from './History.module.css';

const ICON_MAP = {
  phone: IconPhone,
  data: IconData,
  tv: IconTV,
  bolt: IconBolt,
  exam: IconExam || IconPhone,
  betting: IconBetting || IconPhone,
  plus: IconPlus,
};

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'airtime', label: 'Airtime' },
  { id: 'data', label: 'Data' },
  { id: 'cable', label: 'Cable TV' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'exam', label: 'Exam PINs' },
  { id: 'betting', label: 'Betting' },
  { id: 'funding', label: 'Funding' },
];

const STATUSES = [
  { id: 'all', label: 'All Status' },
  { id: 'successful', label: 'Successful' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
  { id: 'reversed', label: 'Reversed' },
];

const TIME_FRAMES = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

export default function HistoryScreen() {
  const { state, goBack, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Filter transactions
  const filtered = state.transactions.filter((t) => {
    // Category filter
    if (selectedCategory !== 'all') {
      if (t.category !== selectedCategory && t.type !== selectedCategory) return false;
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (t.status !== selectedStatus) return false;
    }

    // Timeframe filter
    if (selectedTimeframe !== 'all') {
      if (selectedTimeframe === 'today' && t.date !== 'today') return false;
      if (selectedTimeframe === 'week' && t.date !== 'today' && t.date !== 'this_week') return false;
      if (selectedTimeframe === 'month' && t.date !== 'today' && t.date !== 'this_week' && t.date !== 'this_month') return false;
    }

    return true;
  });

  // Calculate analytics
  const totalInflow = filtered
    .filter((t) => t.amount > 0 && t.status === 'successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = filtered
    .filter((t) => t.amount < 0 && t.status === 'successful')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const successCount = filtered.filter((t) => t.status === 'successful').length;
  const successRate = filtered.length > 0 ? Math.round((successCount / filtered.length) * 100) : 100;

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

  const renderItem = (item) => {
    const IconComp = ICON_MAP[item.icon] || IconPhone;
    const isCredit = item.amount > 0;

    return (
      <div
        key={item.id}
        className={styles.card}
        onClick={() => setActiveReceipt(item)}
      >
        <div className={styles.left}>
          <div className={`${styles.iconCircle} ${isCredit ? styles.iconGreen : styles.iconYellow}`}>
            <IconComp size={20} />
          </div>
          <div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.subInfo}>
              {item.recipient && <span className={styles.recipient}>{item.recipient} • </span>}
              <span className={styles.time}>{item.time}</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={`${styles.amount} ${isCredit ? styles.amountGreen : ''}`}>
            {isCredit ? '+' : ''}₦{Math.abs(item.amount).toLocaleString()}.00
          </div>
          {renderStatusPill(item.status)}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header with Statement download action */}
      <div className={styles.headerRow}>
        <PageHeader title="Transaction History" onBack={goBack} />
        <button
          type="button"
          className={styles.downloadStatementBtn}
          onClick={() => navigate('download-statement')}
          title="Download account statement"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Statement</span>
        </button>
      </div>

      {/* Analytics Card */}
      <div className={styles.analyticsCard}>
        <div className={styles.analyticsTop}>
          <div className={styles.analyticsStat}>
            <span className={styles.statLabel}>Total Inflow</span>
            <span className={styles.statGreen}>+₦{totalInflow.toLocaleString()}.00</span>
          </div>
          <div className={styles.analyticsDivider} />
          <div className={styles.analyticsStat}>
            <span className={styles.statLabel}>Total Outflow</span>
            <span className={styles.statOutflow}>-₦{totalOutflow.toLocaleString()}.00</span>
          </div>
        </div>
        <div className={styles.analyticsBottom}>
          <span>{filtered.length} Transactions</span>
          <span>{successRate}% Success Rate</span>
        </div>
      </div>

      {/* 1. Categories at top */}
      <div className={styles.filterSection}>
        <div className={styles.filterLabel}>Filter By Category</div>
        <div className={styles.horizontalScroll}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.filterChip} ${selectedCategory === cat.id ? styles.filterActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Status & Timeframe closer to categories */}
      <div className={styles.filterSection}>
        <div className={styles.filterLabel}>Status</div>
        <div className={styles.horizontalScroll}>
          {STATUSES.map((st) => (
            <button
              key={st.id}
              type="button"
              className={`${styles.filterChip} ${selectedStatus === st.id ? styles.statusActive : ''}`}
              onClick={() => setSelectedStatus(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterLabel}>Time Frame</div>
        <div className={styles.horizontalScroll}>
          {TIME_FRAMES.map((tf) => (
            <button
              key={tf.id}
              type="button"
              className={`${styles.filterChip} ${selectedTimeframe === tf.id ? styles.timeframeActive : ''}`}
              onClick={() => setSelectedTimeframe(tf.id)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <span className={styles.groupTitle}>Activity Logs</span>
          <span className={styles.recordsCount}>{filtered.length} records</span>
        </div>

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map(renderItem)}
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <div className={styles.emptyIcon}>📂</div>
            <div className={styles.emptyTitle}>No matching transactions</div>
            <div className={styles.emptySub}>Try adjusting your category, status, or time frame filters.</div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className={styles.receiptOverlay} onClick={() => setActiveReceipt(null)}>
          <div className={styles.receiptModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.receiptHandle} />
            <div className={styles.receiptTitle}>Transaction Details</div>

            <div className={styles.receiptAmount}>
              {activeReceipt.amount > 0 ? '+' : '-'}₦{Math.abs(activeReceipt.amount).toLocaleString()}.00
            </div>
            <div className={styles.receiptStatusWrap}>
              {renderStatusPill(activeReceipt.status)}
            </div>

            <div className={styles.receiptCard}>
              <div className={styles.receiptRow}>
                <span className={styles.receiptRowLabel}>Service Type</span>
                <span className={styles.receiptRowVal}>{activeReceipt.title}</span>
              </div>
              {activeReceipt.recipient && (
                <div className={styles.receiptRow}>
                  <span className={styles.receiptRowLabel}>Recipient</span>
                  <span className={styles.receiptRowVal}>{activeReceipt.recipient}</span>
                </div>
              )}
              <div className={styles.receiptRow}>
                <span className={styles.receiptRowLabel}>Transaction Ref</span>
                <span className={styles.receiptRowVal}>{activeReceipt.ref || 'VTU-TX-998201'}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptRowLabel}>Time</span>
                <span className={styles.receiptRowVal}>{activeReceipt.time}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptRowLabel}>Payment Method</span>
                <span className={styles.receiptRowVal}>VTU Wallet</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeReceiptBtn}
              onClick={() => setActiveReceipt(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
