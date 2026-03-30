'use client';

import { useState, useEffect } from 'react';

interface Medicine {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string | null;
  requiresPrescription: boolean;
}

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    requiresPrescription: false
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines');
      const data = await res.json();
      setMedicines(data);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId ? `/api/medicines/${editingId}` : '/api/medicines';
    const method = editingId ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      });
      
      if (res.ok) {
        fetchMedicines();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save medicine:', error);
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingId(medicine.id);
    setFormData({
      name: medicine.name,
      description: medicine.description || '',
      price: medicine.price.toString(),
      stock: medicine.stock.toString(),
      category: medicine.category || '',
      requiresPrescription: medicine.requiresPrescription
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMedicines();
      }
    } catch (error) {
      console.error('Failed to delete medicine:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      requiresPrescription: false
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Inventory Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Medicine
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>
            {editingId ? 'Edit Medicine' : 'Add New Medicine'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Name *
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Category
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Price (KSh) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Stock *
                </label>
                <input
                  type="number"
                  className="input"
                  required
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Description
              </label>
              <textarea
                className="input"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={e => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                />
                Requires Prescription
              </label>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add'} Medicine
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : medicines.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            No medicines yet. Add your first medicine to get started.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Stock</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Prescription</th>
                <th style={{ textAlign: 'left', padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map(medicine => (
                <tr key={medicine.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{medicine.name}</td>
                  <td style={{ padding: '12px 8px' }}>{medicine.category || '-'}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                    KSh {medicine.price.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      color: medicine.stock < 10 ? 'var(--error)' : 'inherit'
                    }}>
                      {medicine.stock}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {medicine.requiresPrescription ? '✓ Yes' : 'No'}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <button 
                      onClick={() => handleEdit(medicine)}
                      style={{ marginRight: '8px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(medicine.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
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
