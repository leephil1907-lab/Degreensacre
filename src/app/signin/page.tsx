'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Shield, Mail, Lock } from 'lucide-react';
import AuthBrandingPanel from '@/components/AuthBrandingPanel';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* LEFT: Premium Branding Panel */}
      <AuthBrandingPanel
        eyebrow="Welcome Back"
        title={<>Find your next<br /><span className="text-sage">place to belong</span></>}
        description="Sign in to access saved properties, track your enquiries, and discover verified listings across Nigeria."
      />

      {/* RIGHT: Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #283818 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-forest via-sage to-forest" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo-icon.png" alt="De-Greenacres" width={48} height={48} />
              <span className="font-display text-xl text-charcoal">De-Greenacres</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-sage" />
              <p className="text-sage text-[11px] font-bold uppercase tracking-[0.25em]">Sign In</p>
            </div>
            <h2 className="font-display text-[2rem] md:text-[2.25rem] text-charcoal leading-[1.15] mb-3 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed">Enter your credentials to access your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl text-sm text-red-700 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Premium Form Card */}
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-8 md:p-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-[0.18em]">Email Address</label>
                <div className={`relative rounded-xl border-2 transition-all duration-200 ${focusedField === 'email' ? 'border-forest shadow-[0_0_0_4px_rgba(40,56,24,0.06)]' : 'border-gray-100 hover:border-gray-200'}`}>
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors duration-200 ${focusedField === 'email' ? 'text-forest' : 'text-gray-300'}`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-xl text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:bg-white transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2.5 uppercase tracking-[0.18em]">Password</label>
                <div className={`relative rounded-xl border-2 transition-all duration-200 ${focusedField === 'password' ? 'border-forest shadow-[0_0_0_4px_rgba(40,56,24,0.06)]' : 'border-gray-100 hover:border-gray-200'}`}>
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors duration-200 ${focusedField === 'password' ? 'text-forest' : 'text-gray-300'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-14 py-4 bg-gray-50/50 rounded-xl text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:bg-white transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-[18px] h-[18px] rounded border-2 border-gray-200 peer-checked:border-forest peer-checked:bg-forest transition-all duration-200 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-forest font-semibold hover:text-forest-light transition-colors hover:underline underline-offset-2">
                  Forgot password?
                </Link>
              </div>

              {/* Primary CTA — visually unmistakable */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-[15px] text-white transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 group relative overflow-hidden mt-2"
                style={{ background: 'linear-gradient(135deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)', boxShadow: '0 4px 16px rgba(40,56,24,0.2), 0 2px 4px rgba(40,56,24,0.1)' }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(40,56,24,0.3), 0 4px 8px rgba(40,56,24,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(40,56,24,0.2), 0 2px 4px rgba(40,56,24,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <span className="text-[11px] text-gray-300 uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* WhatsApp Support */}
          <a
            href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20need%20help%20signing%20in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-500 hover:border-green-200 hover:text-green-700 hover:bg-green-50/50 transition-all duration-200 flex items-center justify-center gap-2.5 group"
          >
            <svg className="w-[18px] h-[18px] text-green-500 group-hover:text-green-600 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Get help on WhatsApp
          </a>

          {/* Sign up link */}
          <p className="mt-8 text-center text-[15px] text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-forest font-bold hover:text-forest-light transition-colors">
              Create one — it&apos;s free
            </Link>
          </p>

          {/* Minimal footer trust — single quiet line */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Shield className="w-3 h-3 text-gray-200" />
            <p className="text-[11px] text-gray-300">
              256-bit SSL Encrypted · Secure authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
