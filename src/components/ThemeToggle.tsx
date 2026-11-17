'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

const emptySubscribe = () => () => {};

function getThemeSnapshot(): boolean {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return stored === 'dark' || (!stored && prefersDark);
}

function subscribeTheme(onChange: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'theme' || e.key === null) onChange();
  };
  mq.addEventListener('change', onChange);
  window.addEventListener('storage', onStorage);
  window.addEventListener('theme-change', onChange);
  return () => {
    mq.removeEventListener('change', onChange);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('theme-change', onChange);
  };
}

export default function ThemeToggle({ variant = 'default' }: { variant?: 'default' | 'forest' }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    window.dispatchEvent(new Event('theme-change'));
  };

  if (!mounted) return <div className="w-9 h-9" />;

  const base = variant === 'forest'
    ? 'w-9 h-9 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-colors'
    : 'w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors';

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={base}
    >
      {dark ? (
        <Sun className={variant === 'forest' ? 'w-4 h-4 text-yellow-300' : 'w-4 h-4 text-yellow-500'} />
      ) : (
        <Moon className={variant === 'forest' ? 'w-4 h-4 text-white' : 'w-4 h-4 text-charcoal'} />
      )}
    </button>
  );
}
