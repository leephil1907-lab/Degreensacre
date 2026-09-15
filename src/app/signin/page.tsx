'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // TODO: Implement actual authentication with Supabase
    // This is a placeholder - will be connected to Supabase Auth
    setTimeout(() => {
      setIsLoading(false);
      alert('Sign in functionality will be connected to Supabase Auth. Please configure your Supabase project.');
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    
    // TODO: Implement with Supabase OAuth
    // const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Google Sign-In will be functional after configuring Supabase OAuth. See SOCIAL-AUTH-IMPLEMENTATION.md for setup instructions.');
    }, 500);
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setIsLoading(true);
    
    // TODO: Implement with Supabase OAuth
    // const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Facebook Sign-In will be functional after configuring Supabase OAuth. See SOCIAL-AUTH-IMPLEMENTATION.md for setup instructions.');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-final.png"
              alt="De-Greenacres Properties Limited"
              width={80}
              height={80}
              className="object-contain mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-charcoal">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your De-Greenacres account
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
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
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-forest border-gray-300 rounded focus:ring-forest"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <Link href="/forgot-password" className="text-sm text-forest hover:text-forest-light font-semibold">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button 
                type="button"
                onClick={handleFacebookSignIn}
                disabled={isLoading}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-forest hover:text-forest-light font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Trusted by thousands of property investors</p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>🔒 Secure Login</span>
            <span>✓ CAC Registered</span>
            <span>🛡️ Data Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
