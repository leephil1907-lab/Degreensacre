'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Building2, CheckCircle, Eye, EyeOff, Globe2, KeyRound, Loader2,
  Lock, Save, ShieldCheck,
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '@/lib/site-settings';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

type Tab = 'company' | 'social' | 'security';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10';

export default function AdminSettingsPage() {
  const { refresh: refreshPublicSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<Tab>('company');
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Settings could not be loaded.');
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...(data.settings || {}) });
      setUpdatedAt(data.updated_at || null);
      setLoaded(true);
    } catch (loadError) {
      setLoaded(false);
      setError(loadError instanceof Error ? loadError.message : 'Settings could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const update = (field: keyof SiteSettings, value: string | number) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setNotice('');
  };

  const saveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Settings were not saved.');
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...(data.settings || {}) });
      setUpdatedAt(data.updated_at || new Date().toISOString());
      await refreshPublicSettings();
      setNotice('Settings saved. Public contact details now use the updated website settings.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Settings were not saved.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (password !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: password, confirm_password: confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Password could not be changed.');
      setPassword('');
      setConfirmPassword('');
      setNotice('Your administrator password has been changed.');
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : 'Password could not be changed.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const field = (name: keyof SiteSettings, label: string, options?: { type?: string; help?: string; placeholder?: string; full?: boolean }) => (
    <div className={options?.full ? 'md:col-span-2' : ''}>
      <label htmlFor={`setting-${name}`} className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">{label}</label>
      <input
        id={`setting-${name}`}
        type={options?.type || 'text'}
        value={String(settings[name])}
        placeholder={options?.placeholder}
        min={name === 'inspection_fee' ? 0 : undefined}
        onChange={(event) => update(name, name === 'inspection_fee' ? Number(event.target.value) : event.target.value)}
        className={inputClass}
        required={!['tagline', 'facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url'].includes(name)}
      />
      {options?.help && <p className="mt-2 text-xs text-gray-400">{options.help}</p>}
    </div>
  );

  const tabs = [
    { id: 'company' as const, label: 'Company & contact', icon: Building2 },
    { id: 'social' as const, label: 'Social links', icon: Globe2 },
    { id: 'security' as const, label: 'Admin security', icon: ShieldCheck },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">Global website configuration</p>
        <h2 className="font-display text-3xl text-charcoal">Site Settings</h2>
        <p className="mt-2 text-sm text-gray-500">Manage the company details used by public contact actions and inspection requests.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError(''); setNotice(''); }} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === tab.id ? 'bg-forest text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-charcoal'}`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {notice && <div role="status" className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />{notice}</div>}
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}{!loaded && activeTab !== 'security' && <button onClick={() => void loadSettings()} className="ml-3 font-bold underline">Retry</button>}</div>}

      {activeTab !== 'security' ? (
        <form onSubmit={saveSettings} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h3 className="font-display text-xl text-charcoal">{activeTab === 'company' ? 'Public company information' : 'Official social profiles'}</h3>
            <p className="mt-1 text-xs text-gray-500">{updatedAt ? `Last saved ${new Date(updatedAt).toLocaleString('en-NG')}` : 'No saved settings row yet. Saving will create one.'}</p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div>
          ) : (
            <div className="grid gap-5 p-6 md:grid-cols-2">
              {activeTab === 'company' ? (
                <>
                  {field('company_name', 'Registered / public company name', { full: true })}
                  {field('tagline', 'Short company description', { full: true, help: 'Shown in the public footer.' })}
                  {field('contact_email', 'Public contact email', { type: 'email' })}
                  {field('contact_phone', 'Public phone number', { type: 'tel' })}
                  {field('whatsapp_number', 'WhatsApp number', { help: 'International digits only, for example 2347041754800.' })}
                  {field('inspection_fee', 'Inspection fee (₦)', { type: 'number', help: 'Set to 0 only if inspections are free.' })}
                  <div className="md:col-span-2">
                    <label htmlFor="setting-address" className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Primary office address</label>
                    <textarea id="setting-address" value={settings.address} onChange={(event) => update('address', event.target.value)} rows={3} required className={`${inputClass} resize-y`} />
                  </div>
                </>
              ) : (
                <>
                  {field('facebook_url', 'Facebook page URL', { type: 'url', placeholder: 'https://facebook.com/…', full: true })}
                  {field('instagram_url', 'Instagram profile URL', { type: 'url', placeholder: 'https://instagram.com/…', full: true })}
                  {field('twitter_url', 'X / Twitter profile URL', { type: 'url', placeholder: 'https://x.com/…', full: true })}
                  {field('linkedin_url', 'LinkedIn page URL', { type: 'url', placeholder: 'https://linkedin.com/company/…', full: true })}
                  <p className="text-xs leading-relaxed text-gray-400 md:col-span-2">Leave unused profiles blank. Only valid HTTPS links are accepted; configured links appear in the public footer.</p>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-400">Changes are written to the site_settings database record.</p>
            <button type="submit" disabled={saving || loading || !loaded} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <form onSubmit={changePassword} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-forest/10 text-forest"><KeyRound className="h-5 w-5" /></div>
              <div><h3 className="font-display text-xl text-charcoal">Change your password</h3><p className="text-xs text-gray-500">Updates the currently signed-in Supabase account.</p></div>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="new-password" className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">New password</label>
                <div className="relative">
                  <input id="new-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">Confirm new password</label>
                <input id="confirm-new-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required className={inputClass} />
              </div>
              <p className="text-xs leading-relaxed text-gray-400">At least 8 characters with uppercase, lowercase and a number. Supabase may require a recent sign-in for sensitive account changes.</p>
              <button type="submit" disabled={passwordLoading || !password || !confirmPassword} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
                {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}{passwordLoading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <ShieldCheck className="mb-4 h-7 w-7 text-amber-700" />
            <h3 className="font-display text-xl text-charcoal">Launch security</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <li>• Use a unique password not used on another service.</li>
              <li>• Rotate any credential that ever appeared in Git history.</li>
              <li>• Grant <code>is_admin</code> only through a trusted database administrator.</li>
              <li>• Never place the Supabase service-role key in a NEXT_PUBLIC variable.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
