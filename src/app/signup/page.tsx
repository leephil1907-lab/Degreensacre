'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Abuja (FCT)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

const COUNTRIES = [
  { name: 'Nigeria', flag: '🇳🇬', note: 'Primary market' },
  { name: 'Ghana', flag: '🇬🇭', note: 'West Africa' },
  { name: 'United Kingdom', flag: '🇬🇧', note: 'Diaspora investors' },
  { name: 'United States', flag: '🇺🇸', note: 'Diaspora investors' },
  { name: 'Canada', flag: '🇨🇦', note: 'Diaspora investors' },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    country: 'Nigeria',
    state: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
    if (!formData.country) {
      setError('Please select a country');
      return;
    }
    if (formData.country === 'Nigeria' && !formData.state) {
      setError('Please select your state');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }
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
        country: formData.country,
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

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo-icon.png" alt="De-Greenacres" width={72} height={72} className="mx-auto" />
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-charcoal">Create Your Account</h2>
          <p className="mt-2 text-gray-600">Join thousands of property investors across Nigeria</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                  step > s ? 'bg-forest' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Country */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-xl font-bold text-charcoal mb-2">Where are you based?</h3>
                <p className="text-sm text-gray-600 mb-6">This helps us show relevant properties.</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => updateField('country', c.name)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.country === c.name
                          ? 'border-forest bg-forest/5'
                          : 'border-gray-200 hover:border-forest/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{c.flag}</div>
                      <div className="font-semibold text-sm text-charcoal">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.note}</div>
                    </button>
                  ))}
                </div>

                {formData.country === 'Nigeria' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-charcoal mb-2">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select your state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button onClick={handleStep1Next} className="btn-primary w-full">
                  Continue
                </button>
              </motion.div>
            )}

            {/* STEP 2: Personal Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-forest mb-4">
                  ← Back
                </button>
                <h3 className="text-xl font-bold text-charcoal mb-2">Your Details</h3>
                <p className="text-sm text-gray-600 mb-6">Tell us about yourself.</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="input-field"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="input-field"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="input-field"
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="input-field"
                      placeholder="Min 8 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      className="input-field"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                  <button onClick={handleStep2Next} className="btn-primary flex-1">Continue</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Account Type */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-forest mb-4">
                  ← Back
                </button>
                <h3 className="text-xl font-bold text-charcoal mb-2">How will you use De-Greenacres?</h3>
                <p className="text-sm text-gray-600 mb-6">This helps us personalize your experience.</p>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => updateField('accountType', 'buyer')}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.accountType === 'buyer'
                        ? 'border-forest bg-forest/5'
                        : 'border-gray-200 hover:border-forest/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏠</div>
                    <div className="font-bold text-charcoal">Buyer / Investor</div>
                    <div className="text-sm text-gray-600 mt-1">Find and purchase properties</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('accountType', 'seller')}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      formData.accountType === 'seller'
                        ? 'border-forest bg-forest/5'
                        : 'border-gray-200 hover:border-forest/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">💼</div>
                    <div className="font-bold text-charcoal">Seller / Agent</div>
                    <div className="text-sm text-gray-600 mt-1">List and sell properties</div>
                  </button>
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateField('agreeTerms', e.target.checked)}
                    className="w-4 h-4 mt-1 text-forest border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-forest font-semibold">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-forest font-semibold">Privacy Policy</Link>
                  </span>
                </label>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-forest hover:text-forest-light font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
