'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './HelpSupport.module.css';

const FAQS = [
  {
    q: 'How fast is airtime and data delivery?',
    a: 'Airtime and data top-ups are processed automatically via direct telco API integrations and are typically delivered within 5 to 30 seconds.',
  },
  {
    q: 'What should I do if a transaction is pending or failed?',
    a: 'If a transaction is pending, please allow 2-5 minutes for telco reconciliation. If it fails, your wallet will automatically be refunded immediately. You can also contact support with your Transaction ID.',
  },
  {
    q: 'How do I upgrade my account limit (KYC)?',
    a: 'Go to Profile → KYC Verification to submit your BVN/NIN, take a selfie, and upload a valid government ID to upgrade to Tier 2 or Tier 3.',
  },
  {
    q: 'How can I reset my transaction PIN?',
    a: 'Navigate to Profile → Security & PIN. You will be able to set a new 4-digit PIN to secure all your transactions.',
  },
  {
    q: 'Are there any extra fees for funding my wallet?',
    a: 'Manual and automated bank transfers to your dedicated virtual account are 100% free with 0% funding fees.',
  },
];

export default function HelpSupportScreen() {
  const { goBack } = useApp();
  const [openFaq, setOpenFaq] = useState(0);
  const [copied, setCopied] = useState('');

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/2348012345678?text=Hello%20VTUflash%20Support,%20I%20need%20assistance.', '_blank');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Help & Support" onBack={goBack} />

      <div className={styles.content}>
        {/* Support Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerBadge}>24/7 Customer Care</div>
          <div className={styles.bannerTitle}>We are here to help you</div>
          <div className={styles.bannerSub}>Got questions or issues with a transaction? Reach out to our dedicated support team anytime.</div>
        </div>

        {/* Quick Contact Grid */}
        <div className={styles.contactGrid}>
          <div className={styles.contactCard} onClick={handleWhatsApp}>
            <div className={`${styles.contactIcon} ${styles.iconGreen}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <div className={styles.contactName}>WhatsApp</div>
            <div className={styles.contactAction}>Chat now →</div>
          </div>

          <div className={styles.contactCard} onClick={() => handleCopy('support@vtuflash.ng', 'Email')}>
            <div className={`${styles.contactIcon} ${styles.iconYellow}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className={styles.contactName}>{copied === 'Email' ? 'Copied!' : 'Email Us'}</div>
            <div className={styles.contactAction}>support@vtuflash.ng</div>
          </div>

          <div className={styles.contactCard} onClick={() => handleCopy('+2348008883527', 'Phone')}>
            <div className={`${styles.contactIcon} ${styles.iconBlue}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className={styles.contactName}>{copied === 'Phone' ? 'Copied!' : 'Call Center'}</div>
            <div className={styles.contactAction}>0800-VOLT-HELP</div>
          </div>

          <div className={styles.contactCard} onClick={handleWhatsApp}>
            <div className={`${styles.contactIcon} ${styles.iconPurple}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className={styles.contactName}>Live Agent</div>
            <div className={styles.contactAction}>Online now</div>
          </div>
        </div>

        {/* FAQs */}
        <div className={styles.faqSection}>
          <div className={styles.sectionTitle}>Frequently Asked Questions</div>
          <div className={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`${styles.faqCard} ${isOpen ? styles.faqOpen : ''}`}
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                >
                  <div className={styles.faqHeader}>
                    <span className={styles.faqQuestion}>{faq.q}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className={styles.btnWrap}>
          <button type="button" className={styles.btn} onClick={handleWhatsApp}>
            Chat with Customer Support on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
