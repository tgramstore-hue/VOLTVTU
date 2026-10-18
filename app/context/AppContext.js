'use client';
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

const VALID_SCREENS = [
  'splash', 'login', 'register', 'fingerprint', 'unlock-pin',
  'dashboard', 'services', 'rewards', 'profile', 'profile-info',
  'airtime', 'data', 'cable', 'electricity', 'exam', 'betting',
  'confirm-payment', 'enter-pin', 'create-pin', 'processing',
  'payment-success', 'payment-failed', 'add-money', 'transactions',
  'notifications', 'help-support', 'download-statement',
  'virtual-numbers', 'giftcard', 'kyc-overview', 'kyc-bvn-nin',
  'kyc-selfie', 'kyc-upload-id', 'kyc-processing', 'kyc-verified', 'kyc-failed'
];

const INITIAL_STATE = {
  user: {
    name: 'Etim Emmanuel',
    phone: '08123456789',
    email: 'etim@vtuflash.com',
    avatar: null,
    balance: 0,
    cashback: 0,
    bonus: 0,
    commission: 0,
    voltPoints: 0,
    tier: 'Tier 1 Standard',
    bvn: '',
    nin: '',
    kycLevel: 1,
    loginPin: '123456',
    transactionPin: '1234',
    biometricsEnabled: true,
    virtualAccount: {
      bank: 'Wema Bank',
      accountNumber: '9018258821',
      accountName: 'VTUFLASH / ETIM EMMANUEL',
    },
  },
  transactions: [],
  pendingPurchase: null,
};

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('splash');
  const [prevScreen, setPrevScreen] = useState(null);
  const [direction, setDirection] = useState('forward');
  const [activeTab, setActiveTab] = useState('home');
  const [state, setState] = useState(INITIAL_STATE);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const historyStack = useRef(['splash']);

  const getTabForScreen = (scr) => {
    if (['dashboard'].includes(scr)) return 'home';
    if (['services'].includes(scr)) return 'services';
    if (['rewards'].includes(scr)) return 'rewards';
    if (['profile'].includes(scr)) return 'me';
    return null;
  };

  // Sync initial route from URL or localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let path = window.location.pathname.replace(/^\/+/, '').split('/')[0];
    if (path === 'history') path = 'transactions';
    if (path === 'me') path = 'profile';

    if (path && VALID_SCREENS.includes(path)) {
      setScreen(path);
      historyStack.current = [path];
      const tab = getTabForScreen(path);
      if (tab) setActiveTab(tab);
    } else {
      const saved = localStorage.getItem('vtu_current_screen');
      if (saved && VALID_SCREENS.includes(saved) && saved !== 'splash') {
        setScreen(saved);
        historyStack.current = [saved];
        const tab = getTabForScreen(saved);
        if (tab) setActiveTab(tab);
        window.history.replaceState({ screen: saved }, '', saved === 'dashboard' ? '/' : `/${saved}`);
      }
    }

    const handlePopState = (e) => {
      let target = e.state?.screen;
      if (!target) {
        let p = window.location.pathname.replace(/^\/+/, '').split('/')[0];
        if (p === 'history') p = 'transactions';
        target = VALID_SCREENS.includes(p) ? p : 'dashboard';
      }
      setDirection('back');
      setScreen(target);
      const tab = getTabForScreen(target);
      if (tab) setActiveTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to, dir = 'forward') => {
    setDirection(dir);
    setPrevScreen(screen);
    setScreen(to);
    if (dir === 'forward') {
      historyStack.current.push(to);
    }

    const tab = getTabForScreen(to);
    if (tab) setActiveTab(tab);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vtu_current_screen', to);
        window.history.pushState({ screen: to }, '', to === 'dashboard' ? '/' : `/${to}`);
      } catch (e) {}
    }
  }, [screen]);

  const goBack = useCallback(() => {
    if (historyStack.current.length > 1) {
      historyStack.current.pop();
      const prev = historyStack.current[historyStack.current.length - 1];
      setDirection('back');
      setPrevScreen(screen);
      setScreen(prev);

      const tab = getTabForScreen(prev);
      if (tab) setActiveTab(tab);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('vtu_current_screen', prev);
          window.history.pushState({ screen: prev }, '', prev === 'dashboard' ? '/' : `/${prev}`);
        } catch (e) {}
      }
    }
  }, [screen]);

  const switchTab = useCallback((tab) => {
    const tabScreenMap = {
      home: 'dashboard',
      services: 'services',
      rewards: 'rewards',
      me: 'profile',
    };
    setActiveTab(tab);
    setDirection('tab');
    setPrevScreen(screen);
    const targetScreen = tabScreenMap[tab] || 'dashboard';
    setScreen(targetScreen);
    historyStack.current = [targetScreen];

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vtu_current_screen', targetScreen);
        window.history.pushState({ screen: targetScreen }, '', targetScreen === 'dashboard' ? '/' : `/${targetScreen}`);
      } catch (e) {}
    }
  }, [screen]);

  const setPurchase = useCallback((purchase) => {
    setState(s => ({ ...s, pendingPurchase: purchase }));
  }, []);

  const updateUser = useCallback((updates) => {
    setState(s => ({ ...s, user: { ...s.user, ...updates } }));
  }, []);

  return (
    <AppContext.Provider value={{
      screen, prevScreen, direction, activeTab,
      state, pin, pinError,
      navigate, goBack, switchTab,
      setPin, setPinError, setPurchase, updateUser,
      setState,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
