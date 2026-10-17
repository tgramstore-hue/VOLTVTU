import './globals.css';
import { AppProvider } from './context/AppContext';

export const metadata = {
  title: 'VTUflash – Fast & Reliable Virtual Top-Up',
  description: 'Buy Airtime, Cheap Data Bundles, Pay Electricity Bills, Cable TV & Exam Pins Instantly.',
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
      </head>
      <body>
        <div className="app-frame">
          <AppProvider>
            {children}
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
