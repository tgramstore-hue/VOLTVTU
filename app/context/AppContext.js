'use client';
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

const INITIAL_STATE = {
  user: {
    name: 'Etim',
    initial: 'E',
    phone: '080 0000 0000',
    email: 'etim@example.com',
    balance: 15400,
    cashback: 320,
    voltPoints: 2450,
    tier: 1,
    kycStatus: 'none', // none | pending | verified | failed
    profileImage: null,
    address: '14 Adeleke Street, Victoria Island, Lagos',
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

  const navigate = useCallback((to, dir = 'forward') => {
    setDirection(dir);
    setPrevScreen(screen);
    setScreen(to);
    if (dir === 'forward') {
      historyStack.current.push(to);
    }
    // Update active tab if screen matches a tab
    if (to === 'dashboard') setActiveTab('home');
    else if (to === 'services') setActiveTab('services');
    else if (to === 'rewards') setActiveTab('rewards');
    else if (to === 'profile') setActiveTab('me');
  }, [screen]);

  const goBack = useCallback(() => {
    if (historyStack.current.length > 1) {
      historyStack.current.pop();
      const prev = historyStack.current[historyStack.current.length - 1];
      setDirection('back');
      setPrevScreen(screen);
      setScreen(prev);
      if (prev === 'dashboard') setActiveTab('home');
      else if (prev === 'services') setActiveTab('services');
      else if (prev === 'rewards') setActiveTab('rewards');
      else if (prev === 'profile') setActiveTab('me');
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
