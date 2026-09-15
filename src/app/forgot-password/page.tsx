'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-charcoal mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to:
            </p>
            
            <div className="bg-ivory rounded-lg p-4 mb-6">
              <p className="font-semibold text-charcoal">{email}</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-outline w-full"
              >
                Resend Email
              </button>
              
              <Link href="/signin" className="btn-primary w-full block text-center">
                Back to Sign In
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{' '}
                <Link href="/contact" className="text-forest hover:text-forest-light font-semibold">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-magenta to-plum rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl font-serif">D</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-charcoal">
            Forgot Password?
          </h2>
          <p className="mt-2 text-gray-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the email address associated with your account
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/signin" className="text-sm text-forest hover:text-forest-light font-semibold inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-soft p-6">
          <h3 className="font-bold text-charcoal mb-4">Need Help?</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-forest font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Check your email</p>
                <p className="text-gray-600">
                  We'll send reset instructions to your registered email address
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-forest font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Click the reset link</p>
                <p className="text-gray-600">
                  The link in the email will take you to a secure page to create a new password
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-forest font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Create new password</p>
                <p className="text-gray-600">
                  Choose a strong password with at least 8 characters
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Still having trouble? Our support team is here to help.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/2348065019971?text=Hello%20De-Greenacres,%20I'm%20having%20trouble%20resetting%20my%20password.%20Please%20help."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm flex-1"
              >
                WhatsApp Support
              </a>
              <Link href="/contact" className="btn-outline text-sm flex-1 text-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-amber-900 mb-1">Security Notice</p>
              <p className="text-sm text-amber-800">
                De-Greenacres will never ask for your password via email or phone. Always verify that reset emails come from our official domain.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>🔒 Secure Reset</span>
            <span>✓ Encrypted</span>
            <span>🛡️ Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
