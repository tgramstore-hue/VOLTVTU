import './globals.css';
import { AppProvider } from './context/AppContext';
import PWAInstallBanner from './components/PWAInstallBanner';

export const metadata = {
  title: 'VTUflash – Fast & Reliable Virtual Top-Up',
  description: 'Buy Airtime, Cheap Data Bundles, Pay Electricity Bills, Cable TV & Exam Pins Instantly.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VTUflash',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F0B90B',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VTUflash" />
        <script src="https://js.paystack.co/v1/inline.js" async></script>
      </head>
      <body>
        <div className="app-frame">
          <PWAInstallBanner />
          <AppProvider>
            {children}
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
