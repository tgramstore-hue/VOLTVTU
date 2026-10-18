'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './DownloadStatement.module.css';

export default function DownloadStatementScreen() {
  const { state, goBack } = useApp();

  const [timeRange, setTimeRange] = useState('last_month');
  const [startDate, setStartDate] = useState('18 Sep, 2026');
  const [endDate, setEndDate] = useState('17 Oct, 2026');
  const [email, setEmail] = useState(state.user.email || 'w*@gmail.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('Volt Wallet - 9482103841');
  const [fileType, setFileType] = useState('PDF Document (.pdf)');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showFileTypeModal, setShowFileTypeModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTimeRangeChange = (val) => {
    setTimeRange(val);
    if (val === 'last_month') {
      setStartDate('18 Sep, 2026');
      setEndDate('17 Oct, 2026');
    } else if (val === 'last_2_months') {
      setStartDate('18 Aug, 2026');
      setEndDate('17 Oct, 2026');
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setSuccess(true);

      // Trigger text statement download
      const statementContent = `==========================================================
VTUFLASH FINANCIAL SERVICES - OFFICIAL ACCOUNT STATEMENT
==========================================================
Account Holder:   ${state.user.name.toUpperCase()}
Phone Number:     ${state.user.phone}
Account:          ${selectedAccount}
Email Address:    ${email}
Time Frame:       ${startDate} to ${endDate}
Format:           ${fileType}
Generated On:     ${new Date().toLocaleString()}
Balance:          ₦${(state.user.balance || 0).toLocaleString()}.00
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
This is an authentic statement issued by VTUflash.
==========================================================`;

      const blob = new Blob([statementContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VTUflash_Statement_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      {/* Top Header matching Image 2 */}
      <div className={styles.topNav}>
        <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className={styles.navTitle}>Download Statement</h1>
        <div style={{ width: 28 }} />
      </div>

      <form onSubmit={handleContinue} className={styles.content}>
        {/* Card 1: Time Frame */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Time Frame</div>

          <div className={styles.pillsRow}>
            <button
              type="button"
              className={`${styles.timePill} ${timeRange === 'last_month' ? styles.timePillActive : ''}`}
              onClick={() => handleTimeRangeChange('last_month')}
            >
              Last month
              {timeRange === 'last_month' && <span className={styles.checkCorner}>✓</span>}
            </button>

            <button
              type="button"
              className={`${styles.timePill} ${timeRange === 'last_2_months' ? styles.timePillActive : ''}`}
              onClick={() => handleTimeRangeChange('last_2_months')}
            >
              Last 2 months
              {timeRange === 'last_2_months' && <span className={styles.checkCorner}>✓</span>}
            </button>

            <button
              type="button"
              className={`${styles.timePill} ${timeRange === 'custom' ? styles.timePillActive : ''}`}
              onClick={() => handleTimeRangeChange('custom')}
            >
              Custom
              {timeRange === 'custom' && <span className={styles.checkCorner}>✓</span>}
            </button>
          </div>

          <div className={styles.dashedDivider} />

          <div className={styles.datesRow}>
            <div className={styles.dateBlock}>
              <span className={styles.dateLabel}>Start Date</span>
              <input
                type="text"
                className={styles.dateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.dateBlock}>
              <span className={styles.dateLabel}>End Date</span>
              <input
                type="text"
                className={styles.dateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Email</div>
          <div className={styles.cardSubtitle}>
            Your account statement will be sent to your email.
          </div>

          <div className={styles.selectRow}>
            {isEditingEmail ? (
              <input
                type="email"
                className={styles.emailEditInput}
                value={email}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setIsEditingEmail(false)}
              />
            ) : (
              <span className={styles.emailText}>{email}</span>
            )}
            <button
              type="button"
              className={styles.editBtn}
              onClick={() => setIsEditingEmail(!isEditingEmail)}
            >
              {isEditingEmail ? 'Save' : 'Edit >'}
            </button>
          </div>
        </div>

        {/* Card 3: Based On */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Based On</div>
          <div className={styles.cardSubtitle}>
            Select the account number you want to generate a statement for
          </div>

          <div
            className={styles.selectRow}
            onClick={() => setShowAccountModal(true)}
          >
            <span className={styles.selectPlaceholder}>{selectedAccount}</span>
            <span className={styles.chevron}>›</span>
          </div>
        </div>

        {/* Card 4: File Type */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>File Type</div>
          <div className={styles.cardSubtitle}>
            Select the format in which you would like to receive your account statement
          </div>

          <div
            className={styles.selectRow}
            onClick={() => setShowFileTypeModal(true)}
          >
            <span className={styles.selectPlaceholder}>{fileType}</span>
            <span className={styles.chevron}>›</span>
          </div>
        </div>

        {/* Success toast */}
        {success && (
          <div className={styles.successToast}>
            ✓ Statement generated and sent to {email}!
          </div>
        )}

        {/* Unified Yellow Continue Button */}
        <div className={styles.btnWrap}>
          <button
            type="submit"
            className={styles.btn}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Continue'}
          </button>
        </div>
      </form>

      {/* Account Select Modal */}
      {showAccountModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAccountModal(false)}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Select Account</div>
            {[
              'Volt Wallet - 9482103841',
              'Moniepoint Virtual - 8492019482',
              'Wema Bank Virtual - 0192837465',
            ].map((acc) => (
              <div
                key={acc}
                className={styles.modalOption}
                onClick={() => { setSelectedAccount(acc); setShowAccountModal(false); }}
              >
                <span>{acc}</span>
                {selectedAccount === acc && <span className={styles.modalCheck}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Type Select Modal */}
      {showFileTypeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFileTypeModal(false)}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Select File Format</div>
            {[
              'PDF Document (.pdf)',
              'Excel Spreadsheet (.csv)',
            ].map((ft) => (
              <div
                key={ft}
                className={styles.modalOption}
                onClick={() => { setFileType(ft); setShowFileTypeModal(false); }}
              >
                <span>{ft}</span>
                {fileType === ft && <span className={styles.modalCheck}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
