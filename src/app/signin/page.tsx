'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { whatsappLink } from '@/lib/site-settings';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, MessageCircle,
} from 'lucide-react';
import AuthBrandingPanel from '@/components/AuthBrandingPanel';
import Logo from '@/components/Logo';
import { friendlyAuthError } from '@/lib/auth-errors';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { signIn } = useAuth();
  const { settings } = useSiteSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [resendState, setResendState] = useState<'' | 'sending' | 'sent' | 'error'>('');

  const requestedRedirect = searchParams.get('redirect');
  const destination = requestedRedirect?.startsWith('/') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/dashboard';
  const verificationState = searchParams.get('verified');
  const reason = searchParams.get('reason');

  const authNotice = verificationState === 'pending'
    ? 'Your account was created. Check your inbox to confirm your email before signing in.'
    : verificationState === 'confirmed'
      ? 'Your email is confirmed. You can now sign in.'
      : verificationState === 'created'
        ? 'Your account was created. Sign in with your email and password to continue.'
        : '';

  const reasonNotice = reason === 'expired'
    ? 'Your session expired. Please sign in again to continue.'
    : reason === 'auth_required'
      ? 'Please sign in to access your dashboard, saved properties, and messages.'
      : '';

  const supportHref = whatsappLink(settings, 'Hello De-Greenacres, I need help signing in');

  const resendConfirmation = async () => {
    if (!email.trim()) {
      setError('Enter the email you signed up with first.');
      return;
    }
    setResendState('sending');
    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setResendState(response.ok ? 'sent' : 'error');
    } catch {
      setResendState('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await signIn(email.trim(), password);
      let isAdmin = false;
      if (data?.user) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .maybeSingle();
        isAdmin = Boolean(profileRow?.is_admin);
      }
      const target = requestedRedirect ? destination : isAdmin ? '/admin/dashboard' : '/dashboard';
      router.replace(target);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      <AuthBrandingPanel
        eyebrow="Member Portal"
        title={<>Welcome back to<br /><span className="italic text-sage-300">De-Greenacres</span></>}
        description="Sign in to track saved listings, message property advisors, submit verified properties, and manage inspection requests."
      />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6 md:p-10">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-forest via-sage to-forest" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[440px]"
        >
          <div className="mb-7 flex justify-center lg:hidden">
            <Logo size="md" href="/" />
          </div>

          <div className="mb-6">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage">Sign In</p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight">Access your account</h2>
            <p className="mt-2 text-sm text-gray-500">Enter your credentials to continue to your workspace.</p>
          </div>

          {reasonNotice && (
            <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
              {reasonNotice}
            </div>
          )}

          {verificationState === 'pending' && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              <span>Didn&apos;t receive the email? Enter your email below and</span>
              <button
                type="button"
                onClick={resendConfirmation}
                disabled={resendState === 'sending'}
                className="font-bold underline underline-offset-2 hover:text-amber-950 disabled:opacity-50"
              >
                {resendState === 'sending' ? 'sending…' : resendState === 'sent' ? 'link sent ✓' : 'resend it'}
              </button>
              {resendState === 'error' && <span className="text-red-700">— please try again shortly.</span>}
            </div>
          )}

          {authNotice && (
            <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900">
              {authNotice}
            </div>
          )}

          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)] md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500">Email Address</label>
                <div className={`relative rounded-xl border-2 transition-all ${focusedField === 'email' ? 'border-forest ring-4 ring-forest/10' : 'border-gray-100 hover:border-gray-200'}`}>
                  <Mail className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-forest' : 'text-gray-300'}`} />
                  <input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="signin-password" className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-forest hover:underline">Forgot password?</Link>
                </div>
                <div className={`relative rounded-xl border-2 transition-all ${focusedField === 'password' ? 'border-forest ring-4 ring-forest/10' : 'border-gray-100 hover:border-gray-200'}`}>
                  <Lock className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-forest' : 'text-gray-300'}`} />
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your password"
                    className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-12 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-charcoal"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:bg-forest-light hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Need help?</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <a
              href={supportHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-gray-100 py-3 text-sm font-bold text-gray-600 transition hover:border-green-200 hover:bg-green-50/50 hover:text-green-700"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              Get support on WhatsApp
            </a>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            New to De-Greenacres?{' '}
            <Link href="/signup" className="font-bold text-forest hover:underline">Create a free account</Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            Administrator?{' '}
            <Link href="/admin/login" className="font-semibold text-forest hover:underline">Go to Admin Console sign in</Link>
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-forest" />
            <span>Encrypted connection · Protected by Supabase Auth</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-label="Loading sign in" />}>
      <SignInContent />
    </Suspense>
  );
}
