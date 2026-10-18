'use client';
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';

const AppContext = createContext(null);

const VALID_SCREENS = [
  'splash', 'login', 'register', 'fingerprint', 'unlock-pin',
  'dashboard', 'services', 'rewards', 'profile', 'profile-info',
  'airtime', 'data', 'cable', 'electricity', 'exam', 'betting',
  'confirm-payment', 'enter-pin', 'create-pin', 'processing',
  'payment-success', 'payment-failed', 'add-money', 'transactions',
  'notifications', 'help-support', 'download-statement',
  'virtual-numbers', 'giftcard', 'kyc-overview', 'kyc-bvn-nin',
  'kyc-selfie', 'kyc-upload-id', 'kyc-processing', 'kyc-verified', 'kyc-failed',
  'security-pin'
];

const FRESH_USER = {
  name: '',
  phone: '',
  email: '',
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
  loginPin: '',
  transactionPin: '',
  hasCreatedTxPin: false,
  isEmailVerified: false,
  biometricsEnabled: false,
  referralCode: '',
  referrals: [],
  referralEarnings: 0,
  virtualAccount: {
    bank: 'Wema Bank',
    accountNumber: '',
    accountName: '',
  },
};

const INITIAL_STATE = {
  user: { ...FRESH_USER },
  transactions: [],
  pendingPurchase: null,
  supabaseUser: null,
  isAuthenticated: false,
};

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('splash');
  const [prevScreen, setPrevScreen] = useState(null);
  const [direction, setDirection] = useState('forward');
  const [activeTab, setActiveTab] = useState('home');
  const [state, setState] = useState(INITIAL_STATE);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const historyStack = useRef(['splash']);
  const supabaseRef = useRef(null);

  // Lazy init supabase client
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }, []);

  const getTabForScreen = (scr) => {
    if (['dashboard'].includes(scr)) return 'home';
    if (['services'].includes(scr)) return 'services';
    if (['rewards'].includes(scr)) return 'rewards';
    if (['profile'].includes(scr)) return 'me';
    return null;
  };

  // Check auth on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAuth = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // User is authenticated — load profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          const userName = profile?.full_name || session.user.user_metadata?.full_name || 'VTUflash User';
          const userPhone = profile?.phone || session.user.user_metadata?.phone || '';
          const userEmail = session.user.email || '';
          const isEmailConfirmed = Boolean(session.user.email_confirmed_at);
          const txPin = profile?.transaction_pin || '';
          const hasTxPin = Boolean(txPin && txPin.length === 4);
          const bioEnabled = profile?.biometrics_enabled === true;

          setState(prev => ({
            ...prev,
            supabaseUser: session.user,
            isAuthenticated: true,
            user: {
              ...prev.user,
              name: userName,
              phone: userPhone,
              email: userEmail,
              balance: profile?.wallet_balance ? Number(profile.wallet_balance) : 0,
              voltPoints: profile?.volt_points || 0,
              kycLevel: profile?.kyc_level || 1,
              tier: `Tier ${profile?.kyc_level || 1}${profile?.kyc_level === 1 ? ' Standard' : profile?.kyc_level === 2 ? '' : ' Verified'}`,
              transactionPin: txPin,
              hasCreatedTxPin: hasTxPin,
              isEmailVerified: isEmailConfirmed,
              biometricsEnabled: bioEnabled,
              referralCode: profile?.referral_code || `VOLT-${userName.split(' ')[0]?.toUpperCase()?.slice(0,4) || 'USER'}-${String(Date.now()).slice(-2)}`,
              virtualAccount: {
                bank: profile?.virtual_account_bank || 'Wema Bank',
                accountNumber: profile?.virtual_account_number || userPhone.replace(/\D/g, '').slice(-10) || '0000000000',
                accountName: profile?.virtual_account_name || `VTUFLASH / ${userName.toUpperCase()}`,
              },
            },
          }));

          // Load transactions
          const { data: txns } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(50);

          if (txns && txns.length > 0) {
            setState(prev => ({
              ...prev,
              transactions: txns.map(t => ({
                id: t.id,
                type: t.type,
                title: t.title || t.description || t.type,
                amount: Number(t.amount),
                status: t.status,
                date: new Date(t.created_at).toLocaleDateString(),
                time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon: t.type === 'funding' ? 'plus' : 'minus',
                provider: t.provider,
                phone: t.recipient || t.recipient_phone,
              })),
            }));
          }

          // Returning authenticated user: route to unlock-pin with PIN/Biometric verification
          setScreen('unlock-pin');
          historyStack.current = ['unlock-pin'];
        } else {
          // Check if previously registered on this device
          const hasAccount = localStorage.getItem('vtu_has_account') === 'true';
          const savedName = localStorage.getItem('vtu_last_user_name');
          const savedPhone = localStorage.getItem('vtu_last_user_phone');

          if (hasAccount && savedName) {
            setState(prev => ({
              ...prev,
              user: {
                ...prev.user,
                name: savedName,
                phone: savedPhone || prev.user.phone,
              },
            }));
            setScreen('unlock-pin');
            historyStack.current = ['unlock-pin'];
          } else {
            // New visitor: require sign up / login
            setScreen('login');
            historyStack.current = ['login'];
          }
        }
      } catch (err) {
        setScreen('login');
        historyStack.current = ['login'];
      } finally {
        setAuthLoading(false);
      }
    };

    // Show splash for 1.8s then check auth
    const timer = setTimeout(checkAuth, 1800);
    return () => clearTimeout(timer);
  }, [getSupabase]);

  // Listen for auth state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supabase = getSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setState(prev => ({
          ...INITIAL_STATE,
        }));
        setScreen('login');
        historyStack.current = ['login'];
        setActiveTab('home');
      }
    });

    return () => subscription?.unsubscribe();
  }, [getSupabase]);

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

  const checkEmailVerification = useCallback(async () => {
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setState(prev => ({
          ...prev,
          user: { ...prev.user, isEmailVerified: true },
        }));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [getSupabase]);

  const saveTransactionPin = useCallback(async (newPin) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        transactionPin: newPin,
        hasCreatedTxPin: true,
      },
    }));
    try {
      const supabase = getSupabase();
      if (state.supabaseUser?.id) {
        await supabase
          .from('profiles')
          .update({ transaction_pin: newPin })
          .eq('id', state.supabaseUser.id);
      }
    } catch (e) {}
  }, [getSupabase, state.supabaseUser]);

  const saveBiometrics = useCallback(async (enabled) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        biometricsEnabled: enabled,
      },
    }));
    try {
      const supabase = getSupabase();
      if (state.supabaseUser?.id) {
        await supabase
          .from('profiles')
          .update({ biometrics_enabled: enabled })
          .eq('id', state.supabaseUser.id);
      }
    } catch (e) {}
  }, [getSupabase, state.supabaseUser]);

  // Handle popstate for browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (e) => {
      let target = e.state?.screen;
      if (!target) {
        let p = window.location.pathname.replace(/^\/+/, '').split('/')[0];
        if (p === 'history') p = 'transactions';
        if (p === 'me') p = 'profile';
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

  return (
    <AppContext.Provider value={{
      screen, prevScreen, direction, activeTab,
      state, pin, pinError, authLoading,
      navigate, goBack, switchTab,
      setPin, setPinError, setPurchase, updateUser,
      checkEmailVerification, saveTransactionPin, saveBiometrics,
      setState, getSupabase,
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
