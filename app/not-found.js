import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: '#F5F5F5',
      fontFamily: 'Outfit, sans-serif',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Page Not Found</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>The requested resource could not be found.</p>
      <Link href="/" style={{
        background: '#F0B90B',
        color: '#000',
        padding: '10px 20px',
        borderRadius: '12px',
        fontWeight: '700',
        textDecoration: 'none',
      }}>
        Return Home
      </Link>
    </div>
  );
}
