'use client';
import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import styles from './ProfileInfo.module.css';

export default function ProfileInfoScreen() {
  const { state, goBack, updateUser, navigate } = useApp();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(state.user.name || 'Etim');
  const [email, setEmail] = useState(state.user.email || 'etim@example.com');
  const [phone, setPhone] = useState(state.user.phone || '080 0000 0000');
  const [saved, setSaved] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateUser({ profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      phone,
      initial: name.charAt(0).toUpperCase(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Personal Information" onBack={goBack} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className={styles.content}>
        {/* Avatar centered */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap} onClick={handleAvatarClick} role="button" aria-label="Upload photo">
            <div className={styles.avatarCircle}>
              {state.user.profileImage ? (
                <img src={state.user.profileImage} alt="Avatar" className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarInitial}>{state.user.initial || name.charAt(0).toUpperCase() || 'E'}</div>
              )}
            </div>
            <div className={styles.cameraBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>
          <button type="button" className={styles.changePhotoBtn} onClick={handleAvatarClick}>
            Change Profile Photo
          </button>
        </div>

        {/* Tier status card */}
        <div className={styles.tierCard}>
          <div className={styles.tierLeft}>
            <div className={styles.tierBadge}>Tier {state.user.tier || 1} Account</div>
            <div className={styles.tierLimit}>Daily Limit: ₦50,000.00</div>
          </div>
          <button
            type="button"
            className={styles.upgradeBtn}
            onClick={() => navigate('kyc-overview')}
          >
            Upgrade Tier
          </button>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Phone Number</label>
              <span className={styles.verifiedTag}>Verified</span>
            </div>
            <input
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Email Address</label>
              <span className={styles.verifiedTag}>Verified</span>
            </div>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Account ID / Volt Tag</label>
            <input
              type="text"
              className={`${styles.input} ${styles.inputDisabled}`}
              value="VTU-948210"
              readOnly
            />
          </div>

          {saved && (
            <div className={styles.successToast}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Changes saved successfully!</span>
            </div>
          )}

          <div className={styles.btnWrap}>
            <button type="submit" className={styles.btn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
