-- ==============================================================================
-- VTUflash – Complete Supabase PostgreSQL Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Synchronized with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT 'VTUflash User',
    email TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    cashback_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    commission_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    bonus_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    volt_points INTEGER NOT NULL DEFAULT 0,
    kyc_level INTEGER NOT NULL DEFAULT 1, -- 1 = Basic, 2 = BVN/NIN, 3 = ID + Selfie
    bvn TEXT,
    nin TEXT,
    virtual_account_bank TEXT DEFAULT 'Wema Bank',
    virtual_account_number TEXT,
    virtual_account_name TEXT,
    login_pin TEXT DEFAULT '123456',       -- 6-digit login PIN
    transaction_pin TEXT DEFAULT '1234',   -- 4-digit transaction authorization PIN
    biometrics_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Transactions Table (All Bill Payments, Airtime, Data, and Funding)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,                     -- 'airtime', 'data', 'cable', 'electricity', 'exam', 'betting', 'funding', 'transfer'
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,         -- Negative for debits (-1000), Positive for credits (+15000)
    status TEXT NOT NULL DEFAULT 'pending', -- 'successful', 'pending', 'failed', 'reversed'
    recipient TEXT,                         -- Phone number, Meter number, IUC/Smartcard, or User ID
    provider TEXT,                          -- 'MTN', 'Airtel', 'Glo', '9mobile', 'DStv', 'GOtv', 'IKEDC', etc.
    fee NUMERIC(12, 2) DEFAULT 0.00,
    cashback_earned NUMERIC(12, 2) DEFAULT 0.00,
    token TEXT,                             -- Electricity token or Exam PIN code
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Paystack Wallet Funding Sessions
CREATE TABLE IF NOT EXISTS public.wallet_fundings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    paystack_reference TEXT UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    channel TEXT DEFAULT 'card',             -- 'card', 'bank_transfer', 'ussd'
    status TEXT NOT NULL DEFAULT 'pending',  -- 'successful', 'pending', 'failed'
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. KYC Submissions & Verification Requests
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tier_requested INTEGER NOT NULL,         -- 2 or 3
    bvn TEXT,
    nin TEXT,
    id_card_type TEXT,                      -- 'nin_slip', 'passport', 'voters_card', 'drivers_license'
    id_card_url TEXT,
    selfie_url TEXT,
    status TEXT NOT NULL DEFAULT 'in_review',-- 'in_review', 'verified', 'rejected'
    rejection_reason TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Daily Login Streaks Table
CREATE TABLE IF NOT EXISTS public.daily_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    streak_count INTEGER NOT NULL DEFAULT 1,
    last_claimed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_points_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Automated Profile Creator Trigger for New Signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        phone,
        wallet_balance,
        volt_points,
        kyc_level
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'VTUflash Member'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        0.00,
        0,
        1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_fundings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Transactions Policies
CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Wallet Funding Policies
CREATE POLICY "Users can view own fundings"
    ON public.wallet_fundings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fundings"
    ON public.wallet_fundings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- KYC Verification Policies
CREATE POLICY "Users can view own KYC submissions"
    ON public.kyc_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit KYC verification"
    ON public.kyc_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily Streaks Policies
CREATE POLICY "Users can view own streak"
    ON public.daily_streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
    ON public.daily_streaks FOR ALL
    USING (auth.uid() = user_id);

-- 7. Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    referred_name TEXT NOT NULL,
    referred_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' (signed up), 'completed' (funded & rewarded)
    reward_amount NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
    reward_credited BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id);
