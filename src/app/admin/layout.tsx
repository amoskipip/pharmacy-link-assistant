import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ 
        width: '260px', 
        background: 'var(--text)', 
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ 
          padding: '0 20px 30px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px' }}>Admin Dashboard</h2>
        </div>
        
        <nav>
          <Link href="/admin" style={{ 
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            transition: 'background 0.3s ease'
          }}>
            📊 Dashboard
          </Link>
          <Link href="/admin/inventory" style={{ 
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            transition: 'background 0.3s ease'
          }}>
            💊 Inventory
          </Link>
          <Link href="/admin/prescriptions" style={{ 
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            transition: 'background 0.3s ease'
          }}>
            📄 Prescriptions
          </Link>
          <Link href="/admin/settings" style={{ 
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            transition: 'background 0.3s ease'
          }}>
            ⚙️ Settings
          </Link>
          <Link href="/" style={{ 
            display: 'block',
            padding: '12px 20px',
            color: 'white',
            marginTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            transition: 'background 0.3s ease'
          }}>
            ← Back to Site
          </Link>
        </nav>
      </aside>
      
      <main style={{ 
        flex: 1, 
        background: 'var(--secondary)',
        padding: '30px'
      }}>
        {children}
      </main>
    </div>
  );
}
