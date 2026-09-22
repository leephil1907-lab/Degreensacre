'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, Building2, Home, Briefcase, CheckCircle, Shield, MapPin } from 'lucide-react';
import AuthBrandingPanel from '@/components/AuthBrandingPanel';
import Logo from '@/components/Logo';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Abuja (FCT)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

const ACCOUNT_TYPES = [
  { value: 'buyer', label: 'Buyer / Investor', icon: Home, desc: 'Find and purchase properties' },
  { value: 'seller', label: 'Seller / Landlord', icon: Building2, desc: 'List your properties for sale or rent' },
  { value: 'agent', label: 'Agent / Agency', icon: Briefcase, desc: 'Manage client listings' },
];

export default function SignUpPage() {
  const router = useRouter();
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

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleStep1Next = () => {
    if (!formData.firstName || !formData.lastName) { setError('Please enter your full name'); return; }
    if (!formData.email || !formData.email.includes('@')) { setError('Please enter a valid email'); return; }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!formData.agreeTerms) { setError('Please agree to the terms and conditions'); return; }
    setIsLoading(true);
    setError('');
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName, last_name: formData.lastName,
        phone: formData.phone, state: formData.state, account_type: formData.accountType,
      });
      router.push('/signin?verified=pending');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-sage', width: '75%' };
    return { label: 'Strong', color: 'bg-forest', width: '100%' };
  };

  const strength = passwordStrength();

  const stepLabels = ['Your Details', 'Security', 'Account Type'];

  const inputClass = (field: string) =>
    `w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-xl text-sm text-charcoal placeholder:text-gray-300 focus:outline-none focus:bg-white transition-colors duration-200`;
  const wrapperClass = (field: string) =>
    `relative rounded-xl border-2 transition-all duration-200 ${focusedField === field ? 'border-forest shadow-[0_0_0_4px_rgba(40,56,24,0.06)]' : 'border-gray-100 hover:border-gray-200'}`;
  const iconColor = (field: string) => focusedField === field ? 'text-forest' : 'text-gray-300';

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* LEFT: Premium Branding Panel with Building Background */}
      <AuthBrandingPanel
        eyebrow={step === 1 ? 'Step 1 of 3' : step === 2 ? 'Step 2 of 3' : 'Step 3 of 3'}
        title={
          step === 1 ? <>Start your property<br /><span className="text-sage">journey today</span></> :
          step === 2 ? <>Secure your<br /><span className="text-sage">account</span></> :
          <>Almost<br /><span className="text-sage">there!</span></>
        }
        description={
          step === 1 ? 'Join De-Greenacres and discover verified properties across Nigeria. Buyers, investors, and agents all start here.' :
          step === 2 ? 'Your data is protected with enterprise-grade encryption. We take your security seriously.' :
          'Choose your account type and you\'re ready to explore Nigeria\'s finest verified properties.'
        }
        extra={step === 2 ? (
          <div className="mt-6 space-y-3">
            {['256-bit SSL encryption', 'Enterprise-grade data security', 'No data shared with third parties'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/50">
                <Shield className="w-4 h-4 text-sage" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        ) : undefined}
      />

      {/* RIGHT: Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #283818 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-forest via-sage to-forest" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Logo — visible on all screens, properly placed at top of sign up */}
          <div className="flex justify-center mb-8">
            <Logo size="md" href="/" />
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-sage" />
              <p className="text-sage text-[11px] font-bold uppercase tracking-[0.25em]">Create Account</p>
            </div>
            <h2 className="font-display text-[2rem] md:text-[2.25rem] text-charcoal leading-[1.15] mb-3 tracking-tight">
              Join De-Greenacres
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed">Create your free account in 3 simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step > s ? 'bg-forest text-white shadow-[0_2px_8px_rgba(40,56,24,0.25)]' : step === s ? 'text-white shadow-[0_4px_12px_rgba(40,56,24,0.3)]' : 'bg-gray-100 text-gray-400'
                  }`} style={step === s ? { background: 'linear-gradient(135deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)' } : {}}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  <span className={`text-[10px] mt-2 font-semibold uppercase tracking-wider transition-colors duration-200 ${step >= s ? 'text-forest' : 'text-gray-300'}`}>
                    {stepLabels[s - 1]}
                  </span>
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-[2px] mx-3 rounded transition-all duration-300 mt-[-18px] ${step > s ? 'bg-forest' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-7 md:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">First Name</label>
                        <div className={wrapperClass('firstName')}>
                          <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${iconColor('firstName')}`} />
                          <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField('')} className={inputClass('firstName')} placeholder="John" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Last Name</label>
                        <div className={wrapperClass('lastName')}>
                          <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${iconColor('lastName')}`} />
                          <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField('')} className={inputClass('lastName')} placeholder="Doe" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Email Address</label>
                      <div className={wrapperClass('email')}>
                        <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${iconColor('email')}`} />
                        <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} className={inputClass('email')} placeholder="you@example.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Phone <span className="text-gray-300 normal-case tracking-normal">(optional)</span></label>
                        <div className={wrapperClass('phone')}>
                          <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${iconColor('phone')}`} />
                          <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} className={inputClass('phone')} placeholder="+234" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">State <span className="text-gray-300 normal-case tracking-normal">(optional)</span></label>
                        <select value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="w-full px-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all">
                          <option value="">Select</option>
                          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleStep1Next} className="w-full mt-6 py-4 rounded-xl font-bold text-[15px] text-white transition-all duration-300 flex items-center justify-center gap-2.5 group" style={{ background: 'linear-gradient(135deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)', boxShadow: '0 4px 16px rgba(40,56,24,0.2), 0 2px 4px rgba(40,56,24,0.1)' }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(40,56,24,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(40,56,24,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Password */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-forest mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Password</label>
                      <div className={wrapperClass('password')}>
                        <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${iconColor('password')}`} />
                        <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => updateField('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} className="w-full pl-11 pr-12 py-3.5 bg-transparent rounded-xl text-sm text-charcoal placeholder:text-gray-300 focus:outline-none" placeholder="Min 8 characters" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200" tabIndex={-1}>
                          {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-3">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                                i <= (formData.password.length >= 8 ? 1 : 0) + (/[A-Z]/.test(formData.password) ? 1 : 0) + (/[0-9]/.test(formData.password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(formData.password) ? 1 : 0)
                                  ? strength.color : 'bg-gray-100'
                              }`} />
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1.5">Strength: <span className="font-semibold">{strength.label}</span></p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.15em]">Confirm Password</label>
                      <div className={wrapperClass('confirmPassword')}>
                        <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] transition-colors ${iconColor('confirmPassword')}`} />
                        <input type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField('')} className={inputClass('confirmPassword')} placeholder="Re-enter password" />
                      </div>
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-xs text-forest mt-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Passwords match</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-50 transition-all">
                      Back
                    </button>
                    <button onClick={handleStep2Next} className="flex-1 py-4 rounded-xl font-bold text-[15px] text-white transition-all duration-300 flex items-center justify-center gap-2.5 group" style={{ background: 'linear-gradient(135deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)', boxShadow: '0 4px 16px rgba(40,56,24,0.2)' }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(40,56,24,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(40,56,24,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Account Type + Terms */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-forest mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <p className="text-sm text-gray-500 mb-5">How will you use De-Greenacres?</p>

                  <div className="space-y-3 mb-6">
                    {ACCOUNT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateField('accountType', type.value)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          formData.accountType === type.value
                            ? 'border-forest bg-forest/[0.03]'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
                          formData.accountType === type.value ? 'text-white' : 'bg-gray-50 text-gray-400'
                        }`} style={formData.accountType === type.value ? { background: 'linear-gradient(135deg, #283818, #2D5016)' } : {}}>
                          <type.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-charcoal">{type.label}</div>
                          <div className="text-xs text-gray-400">{type.desc}</div>
                        </div>
                        {formData.accountType === type.value && (
                          <CheckCircle className="w-5 h-5 text-forest ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => updateField('agreeTerms', e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 text-forest focus:ring-forest/20" />
                    <span className="text-sm text-gray-500">
                      I agree to the{' '}
                      <Link href="/terms" className="text-forest font-semibold underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-forest font-semibold underline">Privacy Policy</Link>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-50 transition-all">
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 py-4 rounded-xl font-bold text-[15px] text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2.5 group"
                      style={{ background: 'linear-gradient(135deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)', boxShadow: '0 4px 16px rgba(40,56,24,0.2), 0 2px 4px rgba(40,56,24,0.1)' }}
                      onMouseOver={(e) => { if (!isLoading) { e.currentTarget.style.boxShadow = '0 6px 24px rgba(40,56,24,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                      onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(40,56,24,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {isLoading ? (
                        <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating...</>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/signin" className="text-forest font-bold hover:text-forest-light transition-colors">
              Sign in
            </Link>
          </p>

          {/* Minimal footer trust */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Shield className="w-3 h-3 text-gray-200" />
            <p className="text-[11px] text-gray-300">
              256-bit SSL Encrypted · Secure registration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
