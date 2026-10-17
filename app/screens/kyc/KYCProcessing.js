'use client';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function KYCProcessingScreen() {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('kyc-verified');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: 844,
      background: 'var(--bg)',
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '4px solid #E5E5E5',
        borderTopColor: 'var(--y)',
        animation: 'spin 0.9s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite',
        marginBottom: 24
      }} />
      <div style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>Validating Documents</div>
      <div style={{ fontSize: 14, color: 'var(--mut)', marginTop: 8, maxWidth: 280, lineHeight: 1.5 }}>
        Checking your credentials against official identity registries. This usually takes under a minute.
      </div>
    </div>
  );
}
