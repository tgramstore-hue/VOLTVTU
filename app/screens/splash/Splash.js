'use client';
import styles from './Splash.module.css';
import { IconBolt } from '../../components/Icons';

export default function SplashScreen() {
  // Splash is purely visual — no auto-navigation.
  // AppContext controls when to leave splash via authLoading state.
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
