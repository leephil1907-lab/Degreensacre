'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { friendlyAuthError } from '@/lib/auth-errors';

export default function AdminLoginPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { user, profile, loading, signIn, signOut } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user && profile?.is_admin) {
      router.replace('/admin/dashboard');
    }
  }, [loading, user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await signIn(email.trim(), password);
      if (!data?.user) {
        setError('Unable to verify your session. Please try again.');
        return;
      }

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, is_suspended')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError || !profileRow?.is_admin) {
        await signOut();
        setError('This account does not have administrator privileges. Use the standard member sign-in instead.');
        return;
      }

      if (profileRow.is_suspended) {
        await signOut();
        setError('This administrator account is currently suspended.');
        return;
      }

      router.replace('/admin/dashboard');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal via-forest-800 to-forest p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex items-center justify-between text-white">
          <Logo size="sm" onDark href="/" />
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/20">
            <ArrowLeft className="h-3.5 w-3.5" /> Public site
          </Link>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white p-7 shadow-2xl md:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-forest">
              <ShieldCheck className="h-3.5 w-3.5" /> Administration Portal
            </div>
            <h1 className="font-display text-3xl text-charcoal">Admin Sign In</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Sign in with an administrator profile to manage listings, users, invoices, and site settings.
            </p>
          </div>

          {!loading && user && profile && !profile.is_admin && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
              You are currently signed in as a non-admin member ({profile.email}). Signing in below with an admin account will switch sessions.
            </div>
          )}

          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500">
                Administrator Email
              </label>
              <div className="relative rounded-xl border-2 border-gray-100 transition focus-within:border-forest focus-within:ring-4 focus-within:ring-forest/10">
                <Mail className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@degreenacres.org"
                  className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="admin-password" className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-forest hover:underline">
                  Reset password?
                </Link>
              </div>
              <div className="relative rounded-xl border-2 border-gray-100 transition focus-within:border-forest focus-within:ring-4 focus-within:ring-forest/10">
                <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-12 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:bg-forest-light hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Verifying admin access...' : 'Sign In to Admin Console'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
            Not an administrator?{' '}
            <Link href="/signin" className="font-bold text-forest hover:underline">
              Member sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
