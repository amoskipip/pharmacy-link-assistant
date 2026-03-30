'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cart from '@/components/Cart';
import { useCart, CartItem } from '@/context/CartContext';
import styles from './page.module.css';

const productImages: Record<string, string> = {
  'Panadol Extra': 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop',
  'Amoxicillin 500mg': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'Omeprazole 20mg': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
  'Piriton Syrup': 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop',
  'Metformin 500mg': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
  'Eno Sachets': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'Ventolin Inhaler': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop',
  'Rehydration Salts': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop';

export default function ClientHome({
  medicines,
  settings
}: {
  medicines: any[];
  settings: Record<string, string>;
}) {
  const { addItem, itemCount, setIsCartOpen } = useCart();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [prescriptionData, setPrescriptionData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  });
  const [prescriptionStatus, setPrescriptionStatus] = useState<string | null>(null);
  const [year, setYear] = useState(2026);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleAddToCart = (medicine: any) => {
    const item: CartItem = {
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      image: productImages[medicine.name] || defaultImage
    };
    addItem(item);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('customerName', prescriptionData.customerName);
    formData.append('customerPhone', prescriptionData.customerPhone);
    formData.append('customerEmail', prescriptionData.customerEmail);
    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }

    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setPrescriptionStatus('success');
        setUploadedFile(null);
        setPrescriptionData({ customerName: '', customerPhone: '', customerEmail: '' });
      } else {
        setPrescriptionStatus('error');
      }
    } catch (error) {
      setPrescriptionStatus('error');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              {settings.logo || 'Nyagah Chemist'}
            </Link>
            <div className={styles.navLinks}>
              <Link href="#medicines" className={styles.navLink}>Medicines</Link>
              <Link href="#prescription" className={styles.navLink}>Prescriptions</Link>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
              <button className={styles.cartBtn} onClick={() => setIsCartOpen(true)}>
                🛒
                {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
              </button>
            </div>
          </div>
          <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
            <Link href="#medicines" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Medicines</Link>
            <Link href="#prescription" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Prescriptions</Link>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1>
              Your Health,{' '}
              <span className={styles.heroHighlight}>Our Priority</span>
            </h1>
            <p>
              Quality medicines and healthcare products delivered to your doorstep. 
              Trust Kenya's most reliable online pharmacy for all your health needs.
            </p>
            <div className={styles.heroButtons}>
              <a href="#medicines" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
                Browse Medicines
              </a>
              <a href="#prescription" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
                Upload Prescription
              </a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <div className={styles.heroStatValue}>50K+</div>
                <div className={styles.heroStatLabel}>Happy Customers</div>
              </div>
              <div className={styles.heroStat}>
                <div className={styles.heroStatValue}>500+</div>
                <div className={styles.heroStatLabel}>Medicines</div>
              </div>
              <div className={styles.heroStat}>
                <div className={styles.heroStatValue}>98%</div>
                <div className={styles.heroStatLabel}>Satisfaction Rate</div>
              </div>
            </div>
            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <span>🛡️</span>
                <span>Licensed Pharmacy</span>
              </div>
              <div className={styles.trustBadge}>
                <span>💊</span>
                <span>Genuine Medicines</span>
              </div>
              <div className={styles.trustBadge}>
                <span>🚚</span>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
          <div className={styles.scrollIndicator}>
            <span></span>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚚</div>
              <div className={styles.featureTitle}>Free Delivery</div>
              <div className={styles.featureText}>On all orders above KSh 2,000</div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✅</div>
              <div className={styles.featureTitle}>Genuine Medicines</div>
              <div className={styles.featureText}>100% authentic products</div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👨‍⚕️</div>
              <div className={styles.featureTitle}>Expert Advice</div>
              <div className={styles.featureText}>Professional pharmacists</div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <div className={styles.featureTitle}>Secure Payments</div>
              <div className={styles.featureText}>M-Pesa & Card accepted</div>
            </div>
          </div>
        </div>
      </section>

      <section id="medicines" className={styles.medicines}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Products</h2>
            <p className={styles.sectionSubtitle}>
              Browse our selection of quality medicines and health products
            </p>
          </div>
          <div className={styles.medicineGrid}>
            {medicines.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-light)' }}>
                No medicines available at the moment. Please check back later.
              </p>
            ) : (
              medicines.map(medicine => (
                <div key={medicine.id} className={styles.medicineCard}>
                  {medicine.requiresPrescription && (
                    <span className={styles.medicineBadge}>Rx Required</span>
                  )}
                  <div className={styles.medicineImageWrapper}>
                    <img 
                      src={productImages[medicine.name] || defaultImage} 
                      alt={medicine.name} 
                      className={styles.medicineImage}
                    />
                  </div>
                  <div className={styles.medicineInfo}>
                    <div className={styles.medicineCategory}>{medicine.category || 'Medicine'}</div>
                    <h3 className={styles.medicineName}>{medicine.name}</h3>
                    <p className={styles.medicineDescription}>
                      {medicine.description || 'Quality pharmaceutical product'}
                    </p>
                    <div className={styles.medicineFooter}>
                      <div>
                        <div className={styles.medicinePrice}>KSh {medicine.price.toFixed(0)}</div>
                        <div className={styles.medicineStock}>{medicine.stock} in stock</div>
                      </div>
                    </div>
                    <button 
                      className={styles.addToCartBtn}
                      onClick={() => handleAddToCart(medicine)}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="prescription" className={styles.prescription}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upload Your Prescription</h2>
            <p className={styles.sectionSubtitle}>
              Send us your prescription and we'll deliver your medicines to your doorstep
            </p>
          </div>
          <div className={styles.uploadCard}>
            {prescriptionStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ marginBottom: '12px', fontSize: '24px' }}>Prescription Submitted!</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
                  Our team will review your prescription and contact you shortly.
                </p>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '14px 32px' }}
                  onClick={() => setPrescriptionStatus(null)}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handlePrescriptionSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className="input"
                      required
                      value={prescriptionData.customerName}
                      onChange={e => setPrescriptionData({ ...prescriptionData, customerName: e.target.value })}
                      style={{ padding: '14px', borderRadius: '10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="input"
                      required
                      value={prescriptionData.customerPhone}
                      onChange={e => setPrescriptionData({ ...prescriptionData, customerPhone: e.target.value })}
                      style={{ padding: '14px', borderRadius: '10px' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={prescriptionData.customerEmail}
                    onChange={e => setPrescriptionData({ ...prescriptionData, customerEmail: e.target.value })}
                    style={{ padding: '14px', borderRadius: '10px' }}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                    Upload Prescription *
                  </label>
                  <div className={styles.uploadZone}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                      style={{ display: 'none' }}
                      id="prescription-file"
                    />
                    <label htmlFor="prescription-file" style={{ cursor: 'pointer' }}>
                      <div className={styles.uploadIcon}>
                        {uploadedFile ? '📎' : '📄'}
                      </div>
                      <div className={styles.uploadText}>
                        {uploadedFile ? uploadedFile.name : 'Click to upload prescription'}
                      </div>
                      <div className={styles.uploadSubtext}>
                        Supports: Images (JPG, PNG) & PDF
                      </div>
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px' }}>
                  Submit Prescription
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>{settings.logo || 'Nyagah Chemist'}</div>
              <p className={styles.footerAbout}>
                Your trusted partner in health and wellness. We provide quality medicines, 
                professional advice, and reliable service to all our customers across Kenya.
              </p>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Quick Links</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#medicines" className={styles.footerLink}>Medicines</a></li>
                <li><a href="#prescription" className={styles.footerLink}>Prescriptions</a></li>
                <li><a href="/admin" className={styles.footerLink}>Admin</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Contact</h4>
              <ul className={styles.footerLinks}>
                <li className={styles.footerLink}>{settings.phone || '+254 700 000 000'}</li>
                <li className={styles.footerLink}>{settings.email || 'info@nyagahchemist.com'}</li>
                <li className={styles.footerLink}>{settings.address || 'Nairobi, Kenya'}</li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerTitle}>Hours</h4>
              <ul className={styles.footerLinks}>
                <li className={styles.footerLink}>{settings.workingHours || 'Mon - Sat: 8AM - 8PM'}</li>
                <li className={styles.footerLink}>{settings.sundayHours || 'Sunday: 9AM - 5PM'}</li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © {year} {settings.logo || 'Nyagah Chemist'}. All rights reserved.
          </div>
        </div>
      </footer>

      <Cart />
    </>
  );
}
