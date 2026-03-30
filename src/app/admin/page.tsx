import { prisma } from '@/lib/prisma';

async function getStats() {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    });
    const pendingPrescriptions = await prisma.prescription.count({
      where: { status: 'pending' }
    });
    const totalMedicines = await prisma.medicine.count();
    
    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingPrescriptions,
      totalMedicines
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingPrescriptions: 0,
      totalMedicines: 0
    };
  }
}

async function getRecentOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: true
      }
    });
    return orders;
  } catch (error) {
    return [];
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentOrders = await getRecentOrders();

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
            {stats.totalOrders}
          </div>
        </div>
        
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
            KSh {stats.totalRevenue.toFixed(2)}
          </div>
        </div>
        
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
            Pending Prescriptions
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)' }}>
            {stats.pendingPrescriptions}
          </div>
        </div>
        
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
            Total Medicines
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
            {stats.totalMedicines}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>
            No orders yet
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {order.id.slice(0, 8)}...
                  </td>
                  <td style={{ padding: '12px 8px' }}>{order.customerName}</td>
                  <td style={{ padding: '12px 8px' }}>{order.customerPhone}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                    KSh {order.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: order.status === 'pending' ? '#fff3cd' : '#d4edda',
                      color: order.status === 'pending' ? '#856404' : '#155724'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--text-light)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
