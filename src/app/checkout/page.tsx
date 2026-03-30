'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        ...formData,
        totalAmount: total,
        paymentMethod,
        items: items.map(item => ({
          medicineId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        router.push('/success');
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--secondary)'
      }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--text-light)', margin: '16px 0' }}>
            Add some medicines to your cart before checking out.
          </p>
          <Link href="/" className="btn btn-primary">
            Browse Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--secondary)',
      padding: '40px 0'
    }}>
      <div className="container">
        <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Checkout</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 400px', 
          gap: '40px',
          alignItems: 'start'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px' }}>Customer Information</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="input"
                  required
                  value={formData.customerPhone}
                  onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Email (Optional)
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.customerEmail}
                  onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Delivery Address *
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  value={formData.deliveryAddress}
                  onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Notes (Optional)
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Payment Method</h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div
                  style={{
                    border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
                  <div style={{ fontWeight: 600 }}>Card Payment</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Visa / Mastercard</div>
                </div>
                
                <div
                  style={{
                    border: `2px solid ${paymentMethod === 'mpesa' ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div>
                  <div style={{ fontWeight: 600 }}>M-Pesa</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Pay with M-Pesa</div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', fontSize: '16px', padding: '16px' }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay KSh ${total.toFixed(2)}`}
              </button>
              
              <p style={{ 
                textAlign: 'center', 
                marginTop: '16px', 
                fontSize: '12px', 
                color: 'var(--text-light)' 
              }}>
                {paymentMethod === 'mpesa' 
                  ? 'You will receive an STK push on your phone to complete payment'
                  : 'You will be redirected to complete payment'
                }
              </p>
            </div>
          </form>

          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
              
              {items.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    KSh {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                paddingTop: '16px',
                fontSize: '18px',
                fontWeight: 600
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>KSh {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
