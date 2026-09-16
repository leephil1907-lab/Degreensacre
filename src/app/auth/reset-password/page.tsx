'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle, Shield, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    // Handle the token from the email link
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    if (token && type === 'recovery') {
      supabase.auth.verifyOtp({ token_hash: token, type: 'recovery' });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { label: '', color: '', segments: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', segments: score };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', segments: score };
    if (score === 3) return { label: 'Good', color: 'bg-sage', segments: score };
    return { label: 'Strong', color: 'bg-forest', segments: score };
  };
  const strength = passwordStrength();

  const inputClass = 'w-full pl-11 pr-4 py-3.5 bg-transparent rounded-xl text-sm text-charcoal placeholder:text-gray-300 focus:outline-none';
  const wrapperClass = (field: string) =>
    `relative rounded-xl border-2 transition-all ${focusedField === field ? 'border-forest shadow-[0_0_0_3px_rgba(40,56,24,0.08)]' : 'border-gray-200'}`;

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* LEFT: Branding */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between" style={{ background: 'linear-gradient(160deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #788848, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={48} height={48} className="brightness-110 drop-shadow-lg group-hover:scale-105 transition-transform" />
            <div>
              <span className="block text-white/90 font-display text-lg leading-tight">De-Greenacres</span>
              <span className="block text-[10px] text-white/50 uppercase tracking-[0.2em]">Properties Limited</span>
            </div>
          </Link>
        </div>
        <div className="relative z-10 px-12">
          <p className="text-sage text-xs font-bold uppercase tracking-[0.25em] mb-4">Password Reset</p>
          <h1 className="font-display text-4xl xl:text-[2.75rem] text-white leading-[1.15] mb-6">
            Create a new<br /><span className="text-sage">secure password</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Choose a strong password that you haven&apos;t used before. Mix uppercase, numbers, and special characters for best security.
          </p>
          <div className="mt-8 space-y-3">
            {['At least 8 characters', 'One uppercase letter', 'One number', 'One special character'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/50">
                <CheckCircle className="w-4 h-4 text-sage" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 p-12">
          <div className="h-px bg-white/10 mb-6" />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center"><p className="text-2xl font-display text-white">CAC</p><p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Registered</p></div>
            <div className="text-center border-x border-white/10"><p className="text-2xl font-display text-white">6</p><p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">States</p></div>
            <div className="text-center"><p className="text-2xl font-display text-white">₦20K</p><p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Inspection</p></div>
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-sage to-forest" />
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo-icon.png" alt="De-Greenacres" width={44} height={44} />
              <span className="font-display text-xl text-charcoal">De-Greenacres</span>
            </Link>
          </div>

          {!isSuccess ? (
            <>
              <div className="mb-8">
                <p className="text-sage text-xs font-bold uppercase tracking-[0.2em] mb-3">Set New Password</p>
                <h2 className="font-display text-3xl md:text-[2rem] text-charcoal leading-tight mb-2">New password</h2>
                <p className="text-gray-500 text-sm">Create a strong, secure password for your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">New Password</label>
                    <div className={wrapperClass('password')}>
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${focusedField === 'password' ? 'text-forest' : 'text-gray-300'}`} />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} className={`${inputClass} pr-12`} placeholder="Min 8 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-3">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.segments ? strength.color : 'bg-gray-100'}`} />
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5">Strength: <span className="font-semibold">{strength.label}</span></p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Confirm Password</label>
                    <div className={wrapperClass('confirm')}>
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${focusedField === 'confirm' ? 'text-forest' : 'text-gray-300'}`} />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField('')} className={inputClass} placeholder="Re-enter password" />
                    </div>
                    {confirmPassword && password === confirmPassword && (
                      <p className="text-xs text-forest mt-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Passwords match</p>
                    )}
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}>
                    {isLoading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Updating...</>
                    ) : (
                      <>Update Password <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-center">
                <Link href="/signin" className="text-sm text-forest font-semibold hover:text-forest-light inline-flex items-center gap-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-7 md:p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-2xl text-charcoal mb-3">Password Updated!</h2>
              <p className="text-gray-500 text-sm mb-6">Your password has been successfully changed. You can now sign in with your new password.</p>
              <Link href="/signin" className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center" style={{ background: 'linear-gradient(135deg, #283818, #2D5016)' }}>
                Sign In Now
              </Link>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            <Shield className="w-3.5 h-3.5 text-gray-300" />
            <p className="text-[11px] text-gray-400">256-bit SSL Encrypted · CAC Registered RC: 1856064</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ivory"><div className="animate-spin w-8 h-8 border-4 border-forest border-t-transparent rounded-full" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
