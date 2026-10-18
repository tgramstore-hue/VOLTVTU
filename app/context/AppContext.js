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
          const isEmailConfirmed = Boolean(
            session.user.email_confirmed_at ||
            profile?.is_email_verified ||
            (typeof window !== 'undefined' && localStorage.getItem('vtu_email_verified') === 'true')
          );
          if (isEmailConfirmed && typeof window !== 'undefined') {
            try { localStorage.setItem('vtu_email_verified', 'true'); } catch (e) {}
          }

          const savedLocalTxPin = typeof window !== 'undefined' ? (localStorage.getItem('vtu_user_tx_pin') || '') : '';
          const savedHasLocalTxPin = typeof window !== 'undefined' && localStorage.getItem('vtu_has_created_tx_pin') === 'true';
          const txPin = profile?.transaction_pin || savedLocalTxPin || '';
          const hasTxPin = Boolean((txPin && txPin.length === 4) || savedHasLocalTxPin);
          if (hasTxPin && typeof window !== 'undefined') {
            try {
              localStorage.setItem('vtu_has_created_tx_pin', 'true');
              if (txPin) localStorage.setItem('vtu_user_tx_pin', txPin);
            } catch (e) {}
          }
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
          const savedLocalTxPin = localStorage.getItem('vtu_user_tx_pin') || '';
          const savedHasLocalTxPin = localStorage.getItem('vtu_has_created_tx_pin') === 'true' || Boolean(savedLocalTxPin && savedLocalTxPin.length === 4);
          const savedEmailVerified = localStorage.getItem('vtu_email_verified') === 'true';

          if (hasAccount && savedName) {
            setState(prev => ({
              ...prev,
              user: {
                ...prev.user,
                name: savedName,
                phone: savedPhone || prev.user.phone,
                transactionPin: savedLocalTxPin,
                hasCreatedTxPin: savedHasLocalTxPin,
                isEmailVerified: savedEmailVerified,
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

  // Handle email verification links / callbacks from Supabase
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAuthCallback = async () => {
      try {
        const supabase = getSupabase();
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const tokenHash = urlParams.get('token_hash');
        const type = urlParams.get('type');

        let verifiedUser = null;

        // 1. PKCE flow code exchange (default in @supabase/ssr)
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && (data?.user || data?.session?.user)) {
            verifiedUser = data.user || data.session.user;
          }
        }
        // 2. Token hash OTP verification (magic link / email verify)
        else if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type || 'email',
          });
          if (!error && (data?.user || data?.session?.user)) {
            verifiedUser = data.user || data.session.user;
          }
        }
        // 3. Hash fragment implicit flow (#access_token=...&refresh_token=...)
        else if (window.location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (!error && (data?.user || data?.session?.user)) {
              verifiedUser = data.user || data.session.user;
            }
          }
        }

        if (verifiedUser) {
          // Clean URL params without reload
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (e) {}

          setState(prev => ({
            ...prev,
            supabaseUser: verifiedUser,
            isAuthenticated: true,
            user: { ...prev.user, isEmailVerified: true },
          }));

          // Mark in profiles table
          try {
            await supabase.from('profiles').update({ is_email_verified: true }).eq('id', verifiedUser.id);
          } catch (e) {}
        }
      } catch (err) {
        console.error('Error handling auth callback:', err);
      }
    };

    handleAuthCallback();
  }, [getSupabase]);

  // Listen for auth state changes (sign out, email confirmed, user updated)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supabase = getSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...INITIAL_STATE }));
        setScreen('login');
        historyStack.current = ['login'];
        setActiveTab('home');
      }

      // When user confirms their email, automatically update isEmailVerified
      if (
        (event === 'USER_UPDATED' || event === 'EMAIL_CONFIRMED' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') &&
        session?.user?.email_confirmed_at
      ) {
        setState(prev => ({
          ...prev,
          user: { ...prev.user, isEmailVerified: true },
        }));
        try {
          await supabase.from('profiles').update({ is_email_verified: true }).eq('id', session.user.id);
        } catch (e) {}
      }
    });

    return () => subscription?.unsubscribe();
  }, [getSupabase]);

  // Auto-recheck email verification when tab regains focus
  // (user clicks verification link in email on mobile/tab, switches back to app tab)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          const supabase = getSupabase();
          // Force refresh session to pull latest email_confirmed_at claim from server
          const { data: refreshData } = await supabase.auth.refreshSession();
          const activeUser = refreshData?.user || (await supabase.auth.getUser())?.data?.user;
          if (activeUser?.email_confirmed_at) {
            setState(prev => ({
              ...prev,
              user: { ...prev.user, isEmailVerified: true },
            }));
            try {
              await supabase.from('profiles').update({ is_email_verified: true }).eq('id', activeUser.id);
            } catch (e) {}
          }
        } catch (e) {}
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
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

      // 1. Force refresh session from server (gets fresh JWT with updated email_confirmed_at)
      let activeUser = null;
      try {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData?.user?.email_confirmed_at) {
          activeUser = refreshData.user;
        }
      } catch (e) {}

      // 2. Fallback to getUser() (fresh network call to /auth/v1/user)
      if (!activeUser) {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user?.email_confirmed_at) {
            activeUser = userData.user;
          }
        } catch (e) {}
      }

      // 3. Fallback to getSession()
      if (!activeUser) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user?.email_confirmed_at) {
            activeUser = sessionData.session.user;
          }
        } catch (e) {}
      }

      // 4. Fallback: check profiles table flag
      if (!activeUser && state.supabaseUser?.id) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_email_verified')
            .eq('id', state.supabaseUser.id)
            .maybeSingle();
          if (profile?.is_email_verified) {
            setState(prev => ({
              ...prev,
              user: { ...prev.user, isEmailVerified: true },
            }));
            return true;
          }
        } catch (e) {}
      }

      if (activeUser?.email_confirmed_at) {
        setState(prev => ({
          ...prev,
          user: { ...prev.user, isEmailVerified: true },
        }));
        try {
          await supabase.from('profiles').update({ is_email_verified: true }).eq('id', activeUser.id);
        } catch (e) {}
        return true;
      }

      return false;
    } catch (e) {
      console.error('checkEmailVerification error:', e);
      return false;
    }
  }, [getSupabase, state.supabaseUser?.id]);

  const saveTransactionPin = useCallback(async (newPin) => {
    // 1. Update local state immediately
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        transactionPin: newPin,
        hasCreatedTxPin: true,
      },
    }));

    // 2. Persist to localStorage immediately so it never shows modal again on this device
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vtu_user_tx_pin', newPin);
        localStorage.setItem('vtu_has_created_tx_pin', 'true');
        localStorage.setItem('vtu_dismissed_pin_modal', 'true');
      } catch (e) {}
    }

    // 3. Persist to Supabase profiles table
    try {
      const supabase = getSupabase();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const userId = authUser?.id || state.supabaseUser?.id;

      if (userId) {
        await supabase
          .from('profiles')
          .update({ transaction_pin: newPin })
          .eq('id', userId);
      } else if (state.user?.phone) {
        await supabase
          .from('profiles')
          .update({ transaction_pin: newPin })
          .eq('phone', state.user.phone);
      }
    } catch (e) {
      console.warn('Could not persist PIN to Supabase:', e);
    }
  }, [getSupabase, state.supabaseUser?.id, state.user?.phone]);

  // Create Paystack Dedicated Virtual Account for user
  const createVirtualAccount = useCallback(async () => {
    try {
      const res = await fetch('/api/paystack/create-dva', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.accountNumber) {
        setState(prev => ({
          ...prev,
          user: {
            ...prev.user,
            virtualAccount: {
              bank: data.bank,
              accountNumber: data.accountNumber,
              accountName: data.accountName,
            },
          },
        }));
        return data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, []);

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
      createVirtualAccount,
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
