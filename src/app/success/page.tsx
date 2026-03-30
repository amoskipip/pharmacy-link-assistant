import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--secondary)'
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'var(--success)',
          color: 'white',
          fontSize: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          ✓
        </div>
        <h2 style={{ marginBottom: '16px' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
          Thank you for your order. We will process it shortly and contact you for confirmation.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
