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
    balance: 45200,
    cashback: 1250,
    bonus: 3400,
    commission: 890,
    voltPoints: 2450,
    tier: 'Tier 2 Verified',
    bvn: '22334455667',
    nin: '11223344556',
    kycLevel: 2,
    virtualAccount: {
      bank: 'Wema Bank',
      accountNumber: '9018258821',
      accountName: 'VTUFLASH / ETIM EMMANUEL',
    },
  },
  transactions: [
    { id: 1, type: 'airtime', category: 'airtime', title: 'MTN Airtime Top-Up', amount: -1000, status: 'successful', date: 'today', time: '2:34 PM', icon: 'phone', recipient: '08012345678', ref: 'VTU-TX-849201' },
    { id: 2, type: 'funding', category: 'funding', title: 'Wallet Funding (Bank Transfer)', amount: 15000, status: 'successful', date: 'today', time: '1:20 PM', icon: 'plus', recipient: 'Moniepoint Virtual Acct', ref: 'VTU-TX-849182' },
    { id: 3, type: 'data', category: 'data', title: 'MTN 1.5GB Monthly Data', amount: -1000, status: 'pending', date: 'today', time: '12:05 PM', icon: 'data', recipient: '08012345678', ref: 'VTU-TX-849150' },
    { id: 4, type: 'cable', category: 'cable', title: 'DStv Compact Package', amount: -10500, status: 'successful', date: 'yesterday', time: '6:00 PM', icon: 'tv', recipient: 'IUC: 1029384756', ref: 'VTU-TX-848920' },
    { id: 5, type: 'electricity', category: 'electricity', title: 'IKEDC Prepaid Electricity', amount: -5000, status: 'failed', date: 'yesterday', time: '3:15 PM', icon: 'bolt', recipient: 'Meter: 0192837465', ref: 'VTU-TX-848801' },
    { id: 6, type: 'exam', category: 'exam', title: 'WAEC Result Checker PIN', amount: -3800, status: 'successful', date: 'this_week', time: 'Oct 14, 11:20 AM', icon: 'exam', recipient: 'Qty: 1 Token', ref: 'VTU-TX-847900' },
    { id: 7, type: 'betting', category: 'betting', title: 'SportyBet Account Funding', amount: -2500, status: 'reversed', date: 'this_week', time: 'Oct 13, 04:45 PM', icon: 'betting', recipient: 'User ID: 94821', ref: 'VTU-TX-847620' },
    { id: 8, type: 'data', category: 'data', title: 'Airtel 5GB Weekly Plan', amount: -1500, status: 'successful', date: 'this_month', time: 'Oct 08, 09:10 AM', icon: 'data', recipient: '09012345678', ref: 'VTU-TX-846100' },
    { id: 9, type: 'airtime', category: 'airtime', title: 'Glo ₦2,000 Airtime', amount: -2000, status: 'successful', date: 'this_month', time: 'Oct 04, 07:30 PM', icon: 'phone', recipient: '08055551234', ref: 'VTU-TX-845200' },
  ],
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
