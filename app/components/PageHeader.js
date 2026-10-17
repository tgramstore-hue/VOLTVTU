'use client';
import { useApp } from '../context/AppContext';
import { IconChevronLeft } from './Icons';
import styles from './PageHeader.module.css';

export default function PageHeader({ title, onBack }) {
  const { goBack } = useApp();

  return (
    <div className={styles.header}>
      <button className="bk" aria-label="Back" onClick={onBack || goBack}>
        <IconChevronLeft size={22} />
      </button>
      <span className={styles.title}>{title}</span>
    </div>
  );
}
