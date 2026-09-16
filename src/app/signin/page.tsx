'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-forest relative overflow-hidden flex-col justify-between p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-16">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={64} height={64} className="brightness-110 drop-shadow-lg" />
          </Link>
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-ivory mb-4 leading-tight">
              Welcome back to<br />De-Greenacres
            </h1>
            <p className="text-lg text-ivory/80 leading-relaxed max-w-md">
              Sign in to access your saved properties, enquiries, and Nigeria's most trusted property platform.
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-ivory/70">
            <CheckCircle className="w-5 h-5 text-sage" />
            <span className="text-sm">CAC Registered — RC: 1856064</span>
          </div>
          <div className="flex items-center gap-3 text-ivory/70">
            <CheckCircle className="w-5 h-5 text-sage" />
            <span className="text-sm">Secure login & data protection</span>
          </div>
          <div className="flex items-center gap-3 text-ivory/70">
            <CheckCircle className="w-5 h-5 text-sage" />
            <span className="text-sm">Verified property listings</span>
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

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-charcoal mb-2">Sign in to your account</h2>
            <p className="text-gray-600">Welcome back! Please enter your details</p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}
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
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
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
                className="w-full bg-forest text-ivory py-3.5 rounded-xl font-bold text-sm hover:bg-forest-light transition-all disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-forest font-bold hover:text-forest-light">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
