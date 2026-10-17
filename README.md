# VOLTVTU (VTUflash)

A modern, high-performance Virtual Top-Up (VTU) mobile web application built with **Next.js (App Router)** and **Vanilla CSS**.

## ✨ Features

- **Auth & Biometric Unlock**: Splash screen with pop animation, sign-in with wavy header, registration, fingerprint unlock with pulsing ripple animations, and 4-digit PIN unlock with wrong-PIN shake feedback (Default PIN: `1234`).
- **Interactive Dashboard**:
  - Available balance card with shield icon & quick wallet actions
  - Reseller sales banner & daily cashback tracker
  - Quick actions: To Wallet, To Bank, Save, Withdraw
  - 8 VTU services: Airtime, Data, Cable TV, Electricity, Exam Pins, Betting, Airtime to Cash, More
  - Auto-sliding promotional carousel with synchronized indicator dots
- **Full Service Catalog**:
  - **Buy Airtime**: MTN, Airtel, Glo, 9mobile network tiles, quick amount chips, 2% cashback badge
  - **Buy Data**: Daily, Weekly, and Monthly SME data bundles
  - **Cable TV**: DStv, GOtv, Startimes with smartcard/IUC validation and bouquet selection
  - **Electricity**: Prepaid & Postpaid DISCO bill payments (Ikeja, Eko, Abuja, PH) with meter verification
  - **Exam Pins**: WAEC, NECO, and NABTEB result checker pins with quantity stepper
  - **Betting Top-up**: 8 sports betting platforms with customer ID validation
- **Complete Settlement Flow**:
  - Payment confirmation sheet with fee breakdown and cashback
  - Transaction PIN keypad authorization
  - Processing spinner simulation
  - Success receipt screen with printable/shareable breakdown
  - Error state handling with retry options
- **KYC Suite (Tier 2 Upgrade)**:
  - 7-step identity verification: BVN/NIN, live selfie with liveness oval, ID document upload, NIMC/NIBSS verification, and tier upgrade confirmation
- **Transaction History**: Filter chips (All, Airtime, Data, Bills, Funding) and status pills
- **Design System**: Brand yellow `#F0B90B`, near-black `#0B0B0B`, Outfit font, 390×844 mobile viewport, and full motion support.

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS Modules + CSS Custom Properties Design Tokens
- **Typography**: Google Font Outfit
- **State Management**: React AppContext (central reactive store)

## 🚀 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
