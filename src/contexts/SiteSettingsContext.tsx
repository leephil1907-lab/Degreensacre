'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '@/lib/site-settings';

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/site-settings', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Settings could not be loaded.');
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...(data.settings || {}) });
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Settings could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error('useSiteSettings must be used inside SiteSettingsProvider');
  return context;
}
