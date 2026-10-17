'use client';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Splash.module.css';
import { IconBolt } from '../../components/Icons';

export default function SplashScreen({ nextScreen = 'login' }) {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(nextScreen);
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, nextScreen]);

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.logo}>
          <IconBolt size={46} />
        </div>
        <div className={styles.brand}>VTUflash</div>
        <div className={styles.tagline}>Airtime. Data. Bills. Instantly.</div>
      </div>
      <div className={styles.loaderWrap}>
        <div className={styles.loaderBar} />
      </div>
    </div>
  );
}
