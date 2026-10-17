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
  },
  transactions: [
    { id: 1, type: 'airtime', title: 'MTN Airtime', amount: -1000, status: 'successful', date: 'today', time: '2:34 PM', icon: 'phone' },
    { id: 2, type: 'funding', title: 'Wallet Funding', amount: 5000, status: 'successful', date: 'today', time: '1:20 PM', icon: 'plus' },
    { id: 3, type: 'data', title: 'MTN Data 1GB', amount: -1000, status: 'pending', date: 'today', time: '12:05 PM', icon: 'data' },
    { id: 4, type: 'cable', title: 'DStv Standard', amount: -4500, status: 'successful', date: 'yesterday', time: '6:00 PM', icon: 'tv' },
    { id: 5, type: 'electricity', title: 'Electricity', amount: -3000, status: 'failed', date: 'yesterday', time: '3:15 PM', icon: 'bolt' },
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
