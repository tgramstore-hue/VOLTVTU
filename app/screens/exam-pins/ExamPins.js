'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import styles from './ExamPins.module.css';

const EXAM_PRICES = {
  waec: { name: 'WAEC Result Checker', price: 3500 },
  neco: { name: 'NECO Result Token', price: 1200 },
  nabteb: { name: 'NABTEB Result Pin', price: 1500 },
};

export default function ExamPinsScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [examBody, setExamBody] = useState('waec');
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('08012345678');

  const selectedExam = EXAM_PRICES[examBody] || EXAM_PRICES.waec;
  const totalPrice = selectedExam.price * quantity;

  const handleContinue = () => {
    if (!phone) return;
    setPurchase({
      type: 'Exam PIN Purchase',
      category: 'exam',
      provider: selectedExam.name,
      quantity,
      recipient: phone,
      amount: totalPrice,
      fee: 0,
      cashback: 0,
      total: totalPrice,
    });
    navigate('confirm-payment');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Exam Pins" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Exam Body</div>
          <NetworkSelector
            items={PROVIDERS.examBodies}
            selected={examBody}
            onSelect={setExamBody}
            columns={3}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Quantity</div>
          <div className={styles.stepperWrap}>
            <span className={styles.stepperLabel}>Number of PINs</span>
            <div className={styles.stepperControls}>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className={styles.stepValue}>{quantity}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Recipient Phone / WhatsApp</div>
          <input
            type="tel"
            className={styles.input}
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={11}
          />
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span>Item:</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{selectedExam.name}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Unit Price:</span>
            <span>₦{selectedExam.price.toLocaleString()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Quantity:</span>
            <span>{quantity}</span>
          </div>
          <div className={styles.summaryRowTotal}>
            <span>Total Payable:</span>
            <span className={styles.totalPrice}>₦{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            disabled={phone.length < 10}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
