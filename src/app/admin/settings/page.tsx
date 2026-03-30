'use client';

import { useState, useEffect } from 'react';

interface Settings {
  [key: string]: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    logo: '',
    heroTitle: '',
    heroSubtitle: '',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    sundayHours: '',
    facebook: '',
    instagram: '',
    twitter: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      
      const settingsMap: Settings = {};
      data.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });
      
      setSettings(settingsMap);
      setFormData({
        logo: settingsMap.logo || '',
        heroTitle: settingsMap.heroTitle || '',
        heroSubtitle: settingsMap.heroSubtitle || '',
        phone: settingsMap.phone || '',
        email: settingsMap.email || '',
        address: settingsMap.address || '',
        workingHours: settingsMap.workingHours || '',
        sundayHours: settingsMap.sundayHours || '',
        facebook: settingsMap.facebook || '',
        instagram: settingsMap.instagram || '',
        twitter: settingsMap.twitter || ''
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const settingsArray = Object.entries(formData).map(([key, value]) => ({
        key,
        value
      }));

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray })
      });

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Website Settings</h1>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Brand Information</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Logo Text
            </label>
            <input
              type="text"
              className="input"
              value={formData.logo}
              onChange={e => setFormData({ ...formData, logo: e.target.value })}
              placeholder="Nyagah Chemist"
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Hero Section</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Hero Title
            </label>
            <input
              type="text"
              className="input"
              value={formData.heroTitle}
              onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Hero Subtitle
            </label>
            <textarea
              className="input"
              rows={3}
              value={formData.heroSubtitle}
              onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Contact Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Phone Number
              </label>
              <input
                type="tel"
                className="input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Address
            </label>
            <input
              type="text"
              className="input"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Working Hours</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Monday - Saturday
              </label>
              <input
                type="text"
                className="input"
                value={formData.workingHours}
                onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                placeholder="8:00 AM - 8:00 PM"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Sunday
              </label>
              <input
                type="text"
                className="input"
                value={formData.sundayHours}
                onChange={e => setFormData({ ...formData, sundayHours: e.target.value })}
                placeholder="9:00 AM - 5:00 PM"
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Social Media Links</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Facebook
              </label>
              <input
                type="url"
                className="input"
                value={formData.facebook}
                onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Instagram
              </label>
              <input
                type="url"
                className="input"
                value={formData.instagram}
                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Twitter
              </label>
              <input
                type="url"
                className="input"
                value={formData.twitter}
                onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
