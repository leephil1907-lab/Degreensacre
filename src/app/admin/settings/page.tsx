'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Globe, Bell, Shield, Save, Loader2, CheckCircle, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

interface Settings {
  company_name: string;
  rc_number: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  inspection_fee: number;
  notify_new_user: boolean;
  notify_new_property: boolean;
  notify_new_enquiry: boolean;
  notify_payment: boolean;
}

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    company_name: 'De-Greenacres Properties Limited',
    rc_number: 'RC: 1856064',
    email: 'degreenacrespropertieslimited@gmail.com',
    phone: '08065019971',
    whatsapp: '07041754800',
    address: 'Lagos, Nigeria',
    inspection_fee: 20000,
    notify_new_user: true,
    notify_new_property: true,
    notify_new_enquiry: true,
    notify_payment: true,
  });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/signin'); return; }
    if (profile && !profile.is_admin) { router.push('/'); return; }
  }, [user, profile, router]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    if (!passwords.new || passwords.new.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    // TODO: Implement password change via Supabase auth API
    setPasswordSuccess(true);
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-forest" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-charcoal">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage platform configuration</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-sm font-semibold">
            <CheckCircle className="w-4 h-4" /> Settings saved!
          </div>
        )}
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-display text-lg text-charcoal mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-forest" /> Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Company Name</label>
            <input type="text" value={settings.company_name} onChange={(e) => setSettings({ ...settings, company_name: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">RC Number</label>
            <input type="text" value={settings.rc_number} onChange={(e) => setSettings({ ...settings, rc_number: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
            <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Phone (Customer Support)</label>
            <input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">WhatsApp Number</label>
            <input type="tel" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Inspection Fee (₦)</label>
            <input type="number" value={settings.inspection_fee} onChange={(e) => setSettings({ ...settings, inspection_fee: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Address</label>
            <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-display text-lg text-charcoal mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-forest" /> Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { key: 'notify_new_user', label: 'New user registration', desc: 'Get notified when a new user signs up' },
            { key: 'notify_new_property', label: 'New property submission', desc: 'When a seller submits a property for review' },
            { key: 'notify_new_enquiry', label: 'New enquiry', desc: 'When a buyer sends a property enquiry' },
            { key: 'notify_payment', label: 'Payment received', desc: 'When an inspection payment is processed' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-semibold text-sm text-charcoal">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(settings as any)[item.key]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-display text-lg text-charcoal mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-forest" /> Change Password
        </h3>
        {passwordError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{passwordError}</div>}
        {passwordSuccess && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">Password updated successfully!</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">New Password</label>
            <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Confirm New</label>
            <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest" />
          </div>
        </div>
        <button onClick={handlePasswordChange} className="mt-4 px-6 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Update Password
        </button>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}
      >
        {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save All Changes</>}
      </button>
    </div>
  );
}
