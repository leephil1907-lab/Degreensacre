'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CheckCircle, Shield, Mail, ArrowRight, Lock, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* LEFT: Premium Branding Panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between" style={{ background: 'linear-gradient(160deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #788848, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #b8b898, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        {/* Top */}
        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={48} height={48} className="brightness-110 drop-shadow-lg group-hover:scale-105 transition-transform" />
            <div>
              <span className="block text-white/90 font-display text-lg leading-tight">De-Greenacres</span>
              <span className="block text-[10px] text-white/50 uppercase tracking-[0.2em]">Properties Limited</span>
            </div>
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10 px-12">
          <p className="text-sage text-xs font-bold uppercase tracking-[0.25em] mb-4">
            {isSubmitted ? 'Email Sent' : 'Password Recovery'}
          </p>
          <h1 className="font-display text-4xl xl:text-[2.75rem] text-white leading-[1.15] mb-6">
            {isSubmitted ? (
              <>Check your<br /><span className="text-sage">inbox</span></>
            ) : (
              <>Reset your<br /><span className="text-sage">password</span></>
            )}
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            {isSubmitted
              ? 'We\'ve sent password reset instructions to your email. Follow the link to create a new password.'
              : 'No worries — enter your email and we\'ll send you instructions to reset your password securely.'}
          </p>

          {/* Steps */}
          <div className="mt-10 space-y-4">
            {[
              { num: 1, text: 'Enter your registered email', done: true },
              { num: 2, text: 'Click the reset link in your inbox', done: isSubmitted },
              { num: 3, text: 'Create a strong new password', done: false },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  item.done ? 'bg-sage/30 text-white' : 'bg-white/10 text-white/40'
                }`}>
                  {item.done ? <CheckCircle className="w-4 h-4" /> : item.num}
                </div>
                <span className={`text-sm ${item.done ? 'text-white/80' : 'text-white/40'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Trust */}
        <div className="relative z-10 p-12">
          <div className="h-px bg-white/10 mb-6" />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-display text-white">CAC</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Registered</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-2xl font-display text-white">6</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">States</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display text-white">₦20K</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Inspection</p>
            </div>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-4">RC: 1856064 · de-greenacres.com</p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        {/* Sage accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-sage to-forest" />

        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo-icon.png" alt="De-Greenacres" width={44} height={44} />
              <span className="font-display text-xl text-charcoal">De-Greenacres</span>
            </Link>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <p className="text-sage text-xs font-bold uppercase tracking-[0.2em] mb-3">Forgot Password</p>
                <h2 className="font-display text-3xl md:text-[2rem] text-charcoal leading-tight mb-2">
                  Reset your password
                </h2>
                <p className="text-gray-500 text-sm">No worries, we&apos;ll send you reset instructions</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Email Address</label>
                    <div className={`relative rounded-xl border-2 transition-all ${focusedField === 'email' ? 'border-forest shadow-[0_0_0_3px_rgba(40,56,24,0.08)]' : 'border-gray-200'}`}>
                      <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${focusedField === 'email' ? 'text-forest' : 'text-gray-300'}`} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className="w-full pl-11 pr-4 py-3.5 bg-transparent rounded-xl text-sm text-charcoal placeholder:text-gray-300 focus:outline-none"
                        placeholder="you@example.com"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Enter the email address associated with your account
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #2D5016, #3a6b1e)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #283818, #2D5016)')}
                  >
                    {isLoading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Sending...</>
                    ) : (
                      <>Send Reset Instructions <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-center">
                <Link href="/signin" className="text-sm text-forest font-semibold hover:text-forest-light inline-flex items-center gap-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7 md:p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}>
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <h2 className="font-display text-2xl text-charcoal mb-3">Check Your Email</h2>
                <p className="text-gray-500 text-sm mb-5">We&apos;ve sent password reset instructions to:</p>

                <div className="bg-ivory rounded-xl p-4 mb-6 border border-gray-100">
                  <p className="font-bold text-charcoal text-sm">{email}</p>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:border-sage hover:text-forest transition-all"
                  >
                    Resend Email
                  </button>
                  <Link href="/signin" className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-all" style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}>
                    Back to Sign In
                  </Link>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <a href="https://wa.me/2347041754800" target="_blank" rel="noopener noreferrer" className="text-forest font-semibold underline">
                    chat with us on WhatsApp
                  </a>
                </p>
              </div>
            </>
          )}

          {/* Footer trust */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Shield className="w-3.5 h-3.5 text-gray-300" />
            <p className="text-[11px] text-gray-400">
              Secured by Supabase · CAC Registered RC: 1856064
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
