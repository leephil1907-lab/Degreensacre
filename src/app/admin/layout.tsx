'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Building2, Users, MessageSquare, Settings, Inbox,
  LogOut, Bell, Menu, X, ChevronRight, Mail, Star, Loader2,
  BookOpenText, ExternalLink, Receipt, ShieldCheck,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
  { name: 'Content Manager', href: '/admin/content', icon: BookOpenText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Management', href: '/admin/management', icon: ShieldCheck },
  { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { name: 'Contact Inbox', href: '/admin/messages', icon: Inbox },
  { name: 'Reviews', href: '/admin/content/reviews', icon: Star },
  { name: 'Email Center', href: '/admin/compose', icon: Mail },
  { name: 'Email Templates', href: '/admin/email-templates', icon: BookOpenText },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/signin?redirect=/admin/dashboard');
    else if (!loading && user && profile && !profile.is_admin) router.replace('/dashboard');
  }, [user, profile, loading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    setAuthError('');
    try {
      await signOut();
      router.replace('/signin');
    } catch {
      setAuthError('Sign out failed. Please try again.');
      setSigningOut(false);
    }
  };

  if (loading || !user || !profile) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div>;
  }

  if (!profile.is_admin) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-forest" /></div>;
  }

  const isActive = (href: string) => pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(`${href}/`));
  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Administrator';

  return (
    <div className="flex min-h-screen bg-[#f6f7f4]">
      {sidebarOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-charcoal text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Logo size="sm" href="/admin/dashboard" />
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X className="h-5 w-5" /></button>
        </div>

        <nav aria-label="Administration" className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Manage website</p>
          {navigation.map((item) => {
            const active = item.href === '/admin/content'
              ? pathname.startsWith('/admin/content') && pathname !== '/admin/content/reviews'
              : isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? 'bg-forest text-white shadow-lg' : 'text-white/65 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
                {active && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <Link href="/" target="_blank" className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white">
            <ExternalLink className="h-4 w-4" /> View public website
          </Link>
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-sm font-bold">{displayName.charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-white/45">{profile.email || user.email}</p>
            </div>
          </div>
          {authError && <p role="alert" className="mb-2 px-2 text-xs text-red-300">{authError}</p>}
          <button onClick={() => void handleSignOut()} disabled={signingOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50">
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open admin navigation"><Menu className="h-6 w-6" /></button>
            <div>
              <p className="font-display text-xl text-charcoal sm:text-2xl">Administration</p>
              <p className="hidden text-xs text-gray-400 sm:block">Content and operations control centre</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/messages" className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-forest" title="Open contact inbox" aria-label="Open contact inbox">
              <Bell className="h-5 w-5" />
            </Link>
            <Link href="/admin/settings" className={`rounded-xl p-2.5 transition ${pathname === '/admin/settings' ? 'bg-forest/10 text-forest' : 'text-gray-500 hover:bg-gray-100 hover:text-forest'}`} title="Site settings" aria-label="Site settings">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
