'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import NetworkSelector, { PROVIDERS } from '../../components/NetworkSelector';
import styles from './Cable.module.css';

const PACKAGES = {
  dstv: [
    { id: 'dstv_yanga', name: 'DStv Yanga', sub: '85+ channels', price: 4200 },
    { id: 'dstv_confam', name: 'DStv Confam', sub: '105+ channels', price: 7400 },
    { id: 'dstv_compact', name: 'DStv Compact', sub: '130+ channels', price: 12500 },
    { id: 'dstv_compact_plus', name: 'DStv Compact Plus', sub: '145+ channels', price: 19800 },
    { id: 'dstv_premium', name: 'DStv Premium', sub: '160+ channels', price: 29500 },
  ],
  gotv: [
    { id: 'gotv_smallie', name: 'GOtv Smallie', sub: '35+ channels', price: 1300 },
    { id: 'gotv_jinja', name: 'GOtv Jinja', sub: '45+ channels', price: 2700 },
    { id: 'gotv_jolli', name: 'GOtv Jolli', sub: '65+ channels', price: 3950 },
    { id: 'gotv_max', name: 'GOtv Max', sub: '75+ channels', price: 4850 },
    { id: 'gotv_supa', name: 'GOtv Supa', sub: '85+ channels', price: 6400 },
  ],
  startimes: [
    { id: 'st_nova', name: 'Nova Bouquet', sub: 'Basic access', price: 1500 },
    { id: 'st_basic', name: 'Basic Bouquet', sub: '40+ channels', price: 2600 },
    { id: 'st_smart', name: 'Smart Bouquet', sub: '55+ channels', price: 3500 },
    { id: 'st_classic', name: 'Classic Bouquet', sub: '70+ channels', price: 4200 },
    { id: 'st_super', name: 'Super Bouquet', sub: '85+ channels', price: 6500 },
  ],
};

export default function CableScreen() {
  const { navigate, goBack, setPurchase } = useApp();
  const [provider, setProvider] = useState('dstv');
  const [iuc, setIuc] = useState('1029384756');
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES.dstv[0].id);

  const currentPackages = PACKAGES[provider] || [];
  const activePkgObj = currentPackages.find(p => p.id === selectedPkg) || currentPackages[0];

  const handleProviderSelect = (newProvider) => {
    setProvider(newProvider);
    if (PACKAGES[newProvider] && PACKAGES[newProvider].length > 0) {
      setSelectedPkg(PACKAGES[newProvider][0].id);
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg.id);
    const recipientIuc = iuc && iuc.trim().length >= 10 ? iuc.trim() : '1029384756';
    if (!iuc || iuc.trim().length < 10) {
      setIuc(recipientIuc);
    }
    const providerObj = PROVIDERS.cableProviders.find(p => p.id === provider);
    setPurchase({
      type: 'Cable TV Subscription',
      category: 'cable',
      provider: providerObj ? providerObj.label : provider.toUpperCase(),
      plan: pkg.name,
      recipient: recipientIuc,
      customerName: 'JOHN DOE OKON',
      amount: pkg.price,
      fee: 0,
      cashback: 0,
      total: pkg.price,
    });
    navigate('confirm-payment');
  };

  const handleContinue = () => {
    if (!activePkgObj || !iuc) return;
    const providerObj = PROVIDERS.cableProviders.find(p => p.id === provider);
    setPurchase({
      type: 'Cable TV Subscription',
      category: 'cable',
      provider: providerObj ? providerObj.label : provider.toUpperCase(),
      plan: activePkgObj.name,
      recipient: iuc,
      customerName: 'JOHN DOE OKON',
      amount: activePkgObj.price,
      fee: 0,
      cashback: 0,
      total: activePkgObj.price,
    });
    navigate('confirm-payment');
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Cable TV" onBack={goBack} />

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Provider</div>
          <NetworkSelector
            items={PROVIDERS.cableProviders}
            selected={provider}
            onSelect={handleProviderSelect}
            columns={3}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Smartcard / IUC Number</div>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter 10-digit number"
            value={iuc}
            onChange={(e) => setIuc(e.target.value)}
            maxLength={11}
          />
        </div>

        {iuc.length >= 10 && (
          <div className={styles.verifiedCard}>
            <div>
              <div className={styles.verifiedName}>JOHN DOE OKON</div>
              <div className={styles.verifiedStatus}>Decoder Status: Active</div>
            </div>
            <span className={styles.badge}>VERIFIED</span>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Select Package</div>
          <div className={styles.packageList}>
            {currentPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${styles.packageCard} ${selectedPkg === pkg.id ? styles.packageCardActive : ''}`}
                onClick={() => handleSelectPackage(pkg)}
              >
                <div>
                  <div className={styles.packageName}>{pkg.name}</div>
                  <div className={styles.packageSub}>{pkg.sub}</div>
                </div>
                <div className={styles.packagePrice}>₦{pkg.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.btnWrap}>
          <button
            type="button"
            className={styles.btn}
            disabled={!activePkgObj || iuc.length < 10}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
