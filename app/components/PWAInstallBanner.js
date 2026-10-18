'use client';
import { useState, useEffect } from 'react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already in standalone app mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (standalone) {
      setIsStandalone(true);
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('vtu_pwa_banner_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 1000 * 60 * 60 * 24) {
      // Dismissed within 24 hours, don't show
      return;
    }

    // Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
    if (isIOSDevice && isSafari && !standalone) {
      setIsIOS(true);
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSTip(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('vtu_pwa_banner_dismissed', String(Date.now()));
    } catch (e) {}
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)',
        maxWidth: '430px',
        background: '#0B0B0B',
        color: '#FFFFFF',
        borderRadius: '18px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        zIndex: 9999,
        border: '1px solid rgba(240, 185, 11, 0.4)',
        animation: 'slideDownBanner 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#F0B90B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(240, 185, 11, 0.4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="1">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Install VTUflash App
            </div>
            <div style={{ fontSize: '11px', color: '#B08A00', fontWeight: 600 }}>
              {isIOS ? 'Tap Share ➔ Add to Home Screen' : 'Install as app on your home screen'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: '#F0B90B',
              color: '#000000',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 2px 6px rgba(240, 185, 11, 0.3)',
            }}
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>

      {showIOSTip && (
        <div
          onClick={() => setShowIOSTip(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px 20px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>
              Install on iPhone / iPad
            </div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.5', marginBottom: '16px' }}>
              1. Tap the <strong>Share</strong> button at the bottom of Safari (<span style={{ fontSize: '16px' }}>⎋</span> or square with arrow).<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong> (<span style={{ fontSize: '16px' }}>⊞</span>).<br />
              3. Tap <strong>Add</strong> in the top right.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSTip(false)}
              style={{
                width: '100%',
                background: '#F0B90B',
                color: '#000',
                border: 'none',
                padding: '12px',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideDownBanner {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  );
}
