'use client';

import { useState, useEffect } from 'react';

interface Prescription {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  filePath: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch('/api/prescriptions');
      const data = await res.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/prescriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        fetchPrescriptions();
      }
    } catch (error) {
      console.error('Failed to update prescription:', error);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Prescription Management</h1>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
      ) : prescriptions.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            No prescriptions submitted yet.
          </p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(prescription => (
                <tr key={prescription.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px', fontSize: '12px' }}>
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                    {prescription.customerName}
                  </td>
                  <td style={{ padding: '12px 8px' }}>{prescription.customerPhone}</td>
                  <td style={{ padding: '12px 8px' }}>{prescription.customerEmail || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: prescription.status === 'pending' ? '#fff3cd' : 
                                  prescription.status === 'approved' ? '#d4edda' : '#f8d7da',
                      color: prescription.status === 'pending' ? '#856404' : 
                             prescription.status === 'approved' ? '#155724' : '#721c24'
                    }}>
                      {prescription.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button 
                      onClick={() => setSelectedPrescription(prescription)}
                      style={{ marginRight: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                    >
                      View
                    </button>
                    {prescription.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(prescription.id, 'approved')}
                          style={{ marginRight: '8px', background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(prescription.id, 'rejected')}
                          style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPrescription && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
        onClick={() => setSelectedPrescription(null)}
        >
          <div className="card" style={{ maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px' }}>Prescription Details</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Customer:</strong> {selectedPrescription.customerName}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Phone:</strong> {selectedPrescription.customerPhone}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Email:</strong> {selectedPrescription.customerEmail || 'Not provided'}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Submitted:</strong> {new Date(selectedPrescription.createdAt).toLocaleString()}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Status:</strong> {selectedPrescription.status}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <strong>Prescription File:</strong><br />
              <a 
                href={selectedPrescription.filePath} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'underline' }}
              >
                View Prescription
              </a>
            </div>
            
            <button className="btn btn-secondary" onClick={() => setSelectedPrescription(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
