'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-forest relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-16">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={64} height={64} className="brightness-110 drop-shadow-lg" />
          </Link>
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-ivory mb-4 leading-tight">
              {isSubmitted ? 'Check your inbox' : 'Reset your password'}
            </h1>
            <p className="text-lg text-ivory/80 leading-relaxed max-w-md">
              {isSubmitted
                ? 'We\'ve sent password reset instructions to your email. Follow the link to create a new password.'
                : 'No worries — enter your email and we\'ll send you instructions to reset your password securely.'}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-ivory/70">
            <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center text-xs font-bold text-white">1</div>
            <span className="text-sm">Enter your registered email</span>
          </div>
          <div className="flex items-center gap-3 text-ivory/70">
            <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center text-xs font-bold text-white">2</div>
            <span className="text-sm">Click the reset link in your inbox</span>
          </div>
          <div className="flex items-center gap-3 text-ivory/70">
            <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center text-xs font-bold text-white">3</div>
            <span className="text-sm">Create a strong new password</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-ivory flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <Image src="/logo-icon.png" alt="De-Greenacres" width={56} height={56} className="mx-auto" />
            </Link>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-charcoal mb-2">Forgot password?</h2>
                <p className="text-gray-600">No worries, we&apos;ll send you reset instructions</p>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                      placeholder="you@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the email address associated with your account
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-forest text-ivory py-3.5 rounded-xl font-bold text-sm hover:bg-forest-light transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-center">
                <Link href="/signin" className="text-sm text-forest font-bold hover:text-forest-light inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-charcoal mb-3">Check Your Email</h2>
                <p className="text-gray-600 mb-4">We&apos;ve sent password reset instructions to:</p>

                <div className="bg-ivory rounded-xl p-4 mb-6">
                  <p className="font-bold text-charcoal">{email}</p>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Click the link in the email to reset your password. The link will expire in 24 hours.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                  >
                    Resend Email
                  </button>
                  <Link href="/signin" className="block w-full bg-forest text-ivory py-3 rounded-xl font-bold text-sm text-center hover:bg-forest-light transition-all">
                    Back to Sign In
                  </Link>
                </div>

                <p className="mt-6 text-xs text-gray-500">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <a href="https://wa.me/2347041754800" target="_blank" rel="noopener noreferrer" className="text-forest font-semibold underline">
                    chat with us on WhatsApp
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
