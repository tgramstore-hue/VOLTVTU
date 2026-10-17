'use client';
import { useApp } from '../../context/AppContext';
import {
  IconPhone, IconData, IconTV, IconBolt, IconExam, IconBetting, IconSwap
} from '../../components/Icons';
import styles from './Services.module.css';

const CATEGORIES = [
  {
    title: 'Telecom & Internet',
    items: [
      { id: 'airtime', name: 'Airtime Recharge', desc: 'Instant 2% cashback bonus', icon: IconPhone, screen: 'airtime' },
      { id: 'data', name: 'Data Bundles', desc: 'SME & direct high-speed data', icon: IconData, screen: 'data' },
      { id: 'swap', name: 'Airtime to Cash', desc: 'Convert excess airtime to cash', icon: IconSwap, screen: 'airtime' },
    ],
  },
  {
    title: 'Bills & Utilities',
    items: [
      { id: 'cable', name: 'Cable TV', desc: 'DStv, GOtv, Startimes bouquets', icon: IconTV, screen: 'cable' },
      { id: 'electricity', name: 'Electricity Bills', desc: 'Prepaid tokens & postpaid bills', icon: IconBolt, screen: 'electricity' },
    ],
  },
  {
    title: 'Education & Testing',
    items: [
      { id: 'exam', name: 'Exam PINs', desc: 'WAEC, NECO & NABTEB tokens', icon: IconExam, screen: 'exam' },
    ],
  },
  {
    title: 'Lifestyle & Gaming',
    items: [
      { id: 'betting', name: 'Betting Top-up', desc: '8 platforms funded instantly', icon: IconBetting, screen: 'betting' },
    ],
  },
];

export default function ServicesScreen() {
  const { navigate } = useApp();

  return (
    <div className={styles.container}>
      {/* Stationary Sticky Top Header */}
      <div className={styles.header}>
        <div className={styles.title}>All Services</div>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat.title} className={styles.categorySection}>
          <div className={styles.categoryTitle}>{cat.title}</div>
          <div className={styles.grid}>
            {cat.items.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className={styles.serviceCard}
                  onClick={() => navigate(item.screen)}
                >
                  <div className={styles.iconWrap}>
                    <IconComp size={24} />
                  </div>
                  <div>
                    <div className={styles.cardName}>{item.name}</div>
                    <div className={styles.cardDesc}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
