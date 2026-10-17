'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './DownloadStatement.module.css';

export default function DownloadStatementScreen() {
  const { state, goBack } = useApp();

  const [timeRange, setTimeRange] = useState('30d');
  const [startDate, setStartDate] = useState('2026-09-18');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [email, setEmail] = useState(state.user.email || 'etim@example.com');
  const [includeAddress, setIncludeAddress] = useState(true);
  const [includeSeal, setIncludeSeal] = useState(true);
  const [fileFormat, setFileFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setSuccess(true);

      // Create downloadable statement file
      const statementContent = `==========================================================
VTUFLASH FINANCIAL SERVICES - OFFICIAL ACCOUNT STATEMENT
==========================================================
Account Holder:   ${state.user.name.toUpperCase()}
Phone Number:     ${state.user.phone}
Email Address:    ${email}
${includeAddress ? `Residential Addr: ${state.user.address || 'Victoria Island, Lagos'}\n` : ''}${includeSeal ? `Account Volt Tag: VTU-948210 | KYC Verified Tier ${state.user.tier || 1}\n` : ''}Date Range:       ${timeRange === 'custom' ? `${startDate} to ${endDate}` : timeRange.toUpperCase()}
Generated On:     ${new Date().toLocaleString()}
Current Balance:  ₦${(state.user.balance || 0).toLocaleString()}.00
----------------------------------------------------------
TRANSACTION SUMMARY
----------------------------------------------------------
Date         | Ref ID         | Description             | Status     | Amount
----------------------------------------------------------
${state.transactions
  .map(
    (t) =>
      `${(t.date || 'Today').padEnd(12)} | ${(t.ref || 'VTU-TX-001').padEnd(14)} | ${t.title.padEnd(23)} | ${(t.status.toUpperCase()).padEnd(10)} | ₦${Math.abs(t.amount).toLocaleString()}`
  )
  .join('\n')}
==========================================================
This is an authentic computer-generated statement issued by VTUflash.
==========================================================`;

      const blob = new Blob([statementContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VTUflash_Statement_${state.user.name}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Download Statement" onBack={goBack} />

      <form onSubmit={handleDownload} className={styles.content}>
        {/* Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerTitle}>Account Statement of Transactions</div>
          <div className={styles.bannerSub}>
            Generate an official breakdown of all your VTU credits, debits, and bill payments.
          </div>
        </div>

        {/* Time frame selector */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>Select Time Frame</label>
          <div className={styles.rangeGrid}>
            {[
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: 'Last 3 Months' },
              { id: 'month', label: 'This Month' },
              { id: 'custom', label: 'Custom Range' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                className={`${styles.rangeChip} ${timeRange === r.id ? styles.rangeChipActive : ''}`}
                onClick={() => setTimeRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date inputs */}
        {timeRange === 'custom' && (
          <div className={styles.datesRow}>
            <div className={styles.dateField}>
              <label className={styles.inputLabel}>Start Date</label>
              <input
                type="date"
                className={styles.dateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.dateField}>
              <label className={styles.inputLabel}>End Date</label>
              <input
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Delivery email */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>Send Statement To Email</label>
          <div className={styles.inputWrap}>
            <input
              type="email"
              className={styles.input}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Options */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>Statement Preferences</label>
          <div className={styles.optionsCard}>
            <div className={styles.optionRow}>
              <div>
                <div className={styles.optionTitle}>Include Residential Address</div>
                <div className={styles.optionSub}>Based on your KYC submission</div>
              </div>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={includeAddress}
                onChange={(e) => setIncludeAddress(e.target.checked)}
              />
            </div>

            <div className={styles.optionRow}>
              <div>
                <div className={styles.optionTitle}>Official KYC Seal & Volt Tag</div>
                <div className={styles.optionSub}>Includes verification watermark</div>
              </div>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={includeSeal}
                onChange={(e) => setIncludeSeal(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Format */}
        <div className={styles.section}>
          <label className={styles.sectionTitle}>File Format</label>
          <div className={styles.formatRow}>
            <button
              type="button"
              className={`${styles.formatBtn} ${fileFormat === 'pdf' ? styles.formatBtnActive : ''}`}
              onClick={() => setFileFormat('pdf')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>PDF Document</span>
            </button>
            <button
              type="button"
              className={`${styles.formatBtn} ${fileFormat === 'csv' ? styles.formatBtnActive : ''}`}
              onClick={() => setFileFormat('csv')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
              <span>Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Success toast */}
        {success && (
          <div className={styles.successToast}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div>
              <div className={styles.toastTitle}>Statement Generated!</div>
              <div className={styles.toastSub}>Downloaded & dispatched to {email}</div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className={styles.btnWrap}>
          <button
            type="submit"
            className={styles.btn}
            disabled={isGenerating || !email}
          >
            {isGenerating ? 'Generating Statement...' : 'Download & Email Statement'}
          </button>
        </div>
      </form>
    </div>
  );
}
