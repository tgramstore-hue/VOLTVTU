'use client';
import { useApp } from '../../context/AppContext';
import { IconFingerprint } from '../../components/Icons';
import styles from './Fingerprint.module.css';

export default function FingerprintScreen() {
  const { navigate, state } = useApp();

  const handleUnlock = () => {
    navigate('splash-to-dash');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>{state.user.initial}</div>
        <div className={styles.welcome}>Welcome back, {state.user.name}</div>
      </div>

      <div className={styles.sensorWrap} onClick={handleUnlock}>
        <div className={styles.pulse1} />
        <div className={styles.pulse2} />
        <div className={styles.sensor}>
          <IconFingerprint size={84} />
        </div>
      </div>

      <div className={styles.instructions}>
        <div className={styles.title}>Touch the fingerprint sensor</div>
        <div className={styles.subtitle}>to unlock the app</div>
      </div>

      <div className={styles.bottom}>
        <button className="btn w" onClick={() => navigate('unlock-pin')}>Use PIN instead</button>
      </div>
    </div>
  );
}
