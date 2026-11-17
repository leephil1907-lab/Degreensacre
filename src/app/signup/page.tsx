'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft,
  Building2, Home, Briefcase, CheckCircle, Shield, ShieldCheck,
} from 'lucide-react';
import AuthBrandingPanel from '@/components/AuthBrandingPanel';
import Logo from '@/components/Logo';
import { NIGERIAN_STATES } from '@/lib/validation';
import { friendlyAuthError } from '@/lib/auth-errors';

const ACCOUNT_TYPES = [
  { value: 'buyer', label: 'Buyer / Investor', icon: Home, desc: 'Find, save, and purchase verified properties' },
  { value: 'seller', label: 'Property Owner', icon: Building2, desc: 'List property you own or are authorised to manage' },
  { value: 'agent', label: 'Independent Agent / Agency', icon: Briefcase, desc: 'Submit client properties and manage your portfolio' },
];

const STEP_LABELS = ['Your Details', 'Security', 'Account Type'];

export default function SignUpPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    state: '', password: '', confirmPassword: '',
    accountType: 'buyer', agreeTerms: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleStep1Next = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await signUp(formData.email, formData.password, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        state: formData.state,
        account_type: formData.accountType,
      });
      if (result?.session) router.replace('/dashboard');
      else if (result?.requiresEmailConfirmation) router.replace('/signin?verified=pending');
      else router.replace('/signin?verified=created');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const scorePassword = () => {
    const p = formData.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const passwordScore = scorePassword();
  const strength = passwordScore <= 1
    ? { label: 'Weak', color: 'bg-red-500' }
    : passwordScore === 2
      ? { label: 'Fair', color: 'bg-amber-500' }
      : passwordScore === 3
        ? { label: 'Good', color: 'bg-sage' }
        : { label: 'Strong', color: 'bg-forest' };

  const inputClass =
    'w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none';
  const wrapperClass = (field: string) =>
    `relative rounded-xl border-2 transition-all duration-200 ${
      focusedField === field ? 'border-forest ring-4 ring-forest/10' : 'border-gray-100 hover:border-gray-200'
    }`;
  const iconColor = (field: string) => (focusedField === field ? 'text-forest' : 'text-gray-300');

  return (
    <div className="min-h-screen flex bg-ivory">
      <AuthBrandingPanel
        eyebrow={`Step ${step} of 3`}
        title={
          step === 1 ? <>Start your property<br /><span className="italic text-sage-300">journey today</span></> :
          step === 2 ? <>Secure your<br /><span className="italic text-sage-300">account</span></> :
          <>Choose how you<br /><span className="italic text-sage-300">collaborate</span></>
        }
        description={
          step === 1 ? 'Create a free De-Greenacres account to save favourite properties, track inspections, or publish verified listings.' :
          step === 2 ? 'Protected by Supabase Auth encryption. Pick a strong, unique password you do not reuse elsewhere.' :
          'Select your primary account role. You can update your profile preferences anytime from your dashboard.'
        }
        extra={step === 2 ? (
          <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
            {['Encrypted password hashing', 'Role-based account permissions', 'Email verification protection'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ) : undefined}
      />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6 md:p-10">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-forest via-sage to-forest" />

        <div className="relative z-10 w-full max-w-[460px]">
          <div className="mb-7 flex justify-center lg:hidden">
            <Logo size="md" href="/" />
          </div>

          <div className="mb-6">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sage">Create Account</p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight">Join De-Greenacres</h2>
            <p className="mt-1.5 text-sm text-gray-500">Complete your registration in three quick steps.</p>
          </div>

          {/* Animated Step Indicator */}
          <div className="mb-7">
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full bg-forest"
                initial={false}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {STEP_LABELS.map((label, idx) => {
                const s = idx + 1;
                const active = step === s;
                const done = step > s;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                      done ? 'bg-forest text-white' : active ? 'bg-forest text-white ring-4 ring-forest/15' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {done ? <CheckCircle className="h-3.5 w-3.5" /> : s}
                    </span>
                    <span className={`text-[11px] font-bold ${active || done ? 'text-charcoal' : 'text-gray-400'}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.05)] md:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="signup-first-name" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">First Name</label>
                        <div className={wrapperClass('firstName')}>
                          <User className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${iconColor('firstName')}`} />
                          <input id="signup-first-name" type="text" autoComplete="given-name" required maxLength={80} value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField('')} className={inputClass} placeholder="Chinedu" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="signup-last-name" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">Last Name</label>
                        <div className={wrapperClass('lastName')}>
                          <User className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${iconColor('lastName')}`} />
                          <input id="signup-last-name" type="text" autoComplete="family-name" required maxLength={80} value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField('')} className={inputClass} placeholder="Okafor" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">Email Address</label>
                      <div className={wrapperClass('email')}>
                        <Mail className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${iconColor('email')}`} />
                        <input id="signup-email" type="email" autoComplete="email" required maxLength={254} value={formData.email} onChange={(e) => updateField('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} className={inputClass} placeholder="you@example.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="signup-phone" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">Phone <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        <div className={wrapperClass('phone')}>
                          <Phone className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${iconColor('phone')}`} />
                          <input id="signup-phone" type="tel" autoComplete="tel" maxLength={30} value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} className={inputClass} placeholder="+234" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="signup-state" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">State <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                        <select id="signup-state" value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="w-full rounded-xl border-2 border-gray-100 bg-white px-3 py-3.5 text-sm text-charcoal transition hover:border-gray-200 focus:border-forest focus:outline-none">
                          <option value="">Select</option>
                          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s === 'FCT' ? 'Abuja (FCT)' : s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStep1Next}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:bg-forest-light hover:shadow-lg active:scale-[0.99]"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <button type="button" onClick={() => setStep(1)} className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-forest">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to details
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="signup-password" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">Password</label>
                      <div className={wrapperClass('password')}>
                        <Lock className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${iconColor('password')}`} />
                        <input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} maxLength={128} value={formData.password} onChange={(e) => updateField('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-12 text-sm text-charcoal placeholder:text-gray-300 focus:outline-none" placeholder="Min 8 characters" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-charcoal">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-2.5">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= passwordScore ? strength.color : 'bg-gray-100'}`} />
                            ))}
                          </div>
                          <p className="mt-1.5 text-[11px] text-gray-500">Strength: <span className="font-bold text-charcoal">{strength.label}</span></p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="signup-confirm-password" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-500">Confirm Password</label>
                      <div className={wrapperClass('confirmPassword')}>
                        <Lock className={`absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors ${iconColor('confirmPassword')}`} />
                        <input id="signup-confirm-password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField('')} className={inputClass} placeholder="Re-enter password" />
                      </div>
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest"><CheckCircle className="h-3.5 w-3.5" /> Passwords match</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-xl border-2 border-gray-100 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50">
                      Back
                    </button>
                    <button type="button" onClick={handleStep2Next} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-forest-light">
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <button type="button" onClick={() => setStep(2)} className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-forest">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to security
                  </button>

                  <p className="mb-4 text-sm text-gray-600">How will you primarily use De-Greenacres?</p>

                  <div className="mb-5 space-y-3">
                    {ACCOUNT_TYPES.map((type) => {
                      const selected = formData.accountType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => updateField('accountType', type.value)}
                          className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                            selected ? 'border-forest bg-forest/[0.04] shadow-sm' : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            selected ? 'bg-forest text-white' : 'bg-gray-50 text-gray-400'
                          }`}>
                            <type.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-charcoal">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.desc}</div>
                          </div>
                          {selected && <CheckCircle className="h-5 w-5 shrink-0 text-forest" />}
                        </button>
                      );
                    })}
                  </div>

                  <label className="mb-6 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField('agreeTerms', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest/20"
                    />
                    <span className="text-xs leading-5 text-gray-600">
                      I agree to the <Link href="/terms" className="font-bold text-forest underline">Terms of Service</Link> and <Link href="/privacy" className="font-bold text-forest underline">Privacy Policy</Link>.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-xl border-2 border-gray-100 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50">
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-forest-light disabled:opacity-50"
                    >
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/signin" className="font-bold text-forest hover:underline">Sign in</Link>
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-forest" />
            <span>Encrypted authentication · Secure registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
