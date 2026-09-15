'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, ArrowRight, ArrowLeft, Building2, Home, Briefcase } from 'lucide-react';

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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    password: '',
    confirmPassword: '',
    accountType: 'buyer',
    agreeTerms: false,
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleStep1Next = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email');
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
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        state: formData.state,
        account_type: formData.accountType,
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
    if (score === 2) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-sage', width: '75%' };
    return { label: 'Strong', color: 'bg-forest', width: '100%' };
  };

  const strength = passwordStrength();

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
              Welcome to<br />De-Greenacres
            </h1>
            <p className="text-lg text-ivory/80 leading-relaxed max-w-md">
              Nigeria&apos;s trusted property platform. Join thousands of investors, buyers, and agents discovering verified properties across the nation.
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
            <span className="text-sm">Verified property listings</span>
          </div>
          <div className="flex items-center gap-3 text-ivory/70">
            <CheckCircle className="w-5 h-5 text-sage" />
            <span className="text-sm">Secure transactions & data protection</span>
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
            <h2 className="text-3xl font-bold text-charcoal mb-2">Create your account</h2>
            <p className="text-gray-600">Start discovering premium properties today</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'bg-forest text-white' : 'bg-cream text-gray-400'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded transition-all ${
                    step > s ? 'bg-forest' : 'bg-cream'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Personal Info */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-lg font-bold text-charcoal mb-1">Your details</h3>
                  <p className="text-sm text-gray-500 mb-6">Tell us about yourself</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">First Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone <span className="text-gray-400 normal-case">(optional)</span></label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                            placeholder="+234"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">State <span className="text-gray-400 normal-case">(optional)</span></label>
                        <select
                          value={formData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                        >
                          <option value="">Select</option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleStep1Next} className="w-full mt-6 bg-forest text-ivory py-3.5 rounded-xl font-bold text-sm hover:bg-forest-light transition-all flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Password */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-forest mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <h3 className="text-lg font-bold text-charcoal mb-1">Set your password</h3>
                  <p className="text-sm text-gray-500 mb-6">Create a secure password for your account</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                          placeholder="Min 8 characters"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password strength */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: strength.width }} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Strength: <span className="font-semibold">{strength.label}</span></p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                          placeholder="Re-enter password"
                        />
                      </div>
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-xs text-forest mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                      Back
                    </button>
                    <button onClick={handleStep2Next} className="flex-1 bg-forest text-ivory py-3.5 rounded-xl font-bold text-sm hover:bg-forest-light transition-all flex items-center justify-center gap-2">
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Account Type + Terms */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-forest mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <h3 className="text-lg font-bold text-charcoal mb-1">How will you use De-Greenacres?</h3>
                  <p className="text-sm text-gray-500 mb-6">This helps us personalize your experience</p>

                  <div className="space-y-3 mb-6">
                    {ACCOUNT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateField('accountType', type.value)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                          formData.accountType === type.value
                            ? 'border-forest bg-forest/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData.accountType === type.value ? 'bg-forest text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <type.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-charcoal">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField('agreeTerms', e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-forest border-gray-300 rounded focus:ring-forest"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-forest font-semibold underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-forest font-semibold underline">Privacy Policy</Link>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all">
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-forest text-ivory py-3.5 rounded-xl font-bold text-sm hover:bg-forest-light transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-forest font-bold hover:text-forest-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
