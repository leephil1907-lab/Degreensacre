'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function ListPropertyPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    propertyType: '',
    listingType: '',
    title: '',
    description: '',
    
    // Step 2: Location
    state: '',
    city: '',
    area: '',
    address: '',
    
    // Step 3: Details
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    parking: '',
    sqm: '',
    
    // Step 4: Pricing
    price: '',
    pricePeriod: '',
    negotiable: false,
    
    // Step 5: Features
    features: [] as string[],
    
    // Step 6: Images
    images: [] as File[],
    
    // Step 7: Documentation
    documentation: '',
    
    // Step 8: Contact
    name: '',
    phone: '',
    email: '',
    whatsapp: true,
  });

  const totalSteps = 8;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // TODO: Submit to backend
    alert('Property listing submitted successfully! Our team will review and publish it within 24 hours.');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleFeature = (feature: string) => {
    const features = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    updateFormData('features', features);
  };

  const propertyTypes = ['Detached Duplex', 'Semi-Detached', 'Terraced', 'Apartment', 'Land', 'Commercial'];
  const listingTypes = ['For Sale', 'For Rent', 'Short Let'];
  const states = ['Lagos', 'Abuja', 'Enugu', 'Akwa Ibom', 'Rivers', 'Oyo'];
  const documentTypes = ['C of O', 'Governor\'s Consent', 'Excision', 'Gazette', 'Deed of Assignment'];
  const commonFeatures = [
    'Swimming Pool', 'Gym', 'Smart Home', '24/7 Security', 'Gated Estate',
    'Boys Quarter', 'Fiber Internet', 'CCTV', 'Water Treatment', 'POP Ceiling',
    'Fitted Kitchen', 'All Rooms Ensuite', 'Elevator', 'Ample Parking'
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-4">List Your Property</h1>
          <p className="text-lg text-gray-600">
            Reach thousands of potential buyers and tenants across Nigeria
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
            <span className="text-sm font-semibold text-forest">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-forest h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => updateFormData('propertyType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Listing Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {listingTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => updateFormData('listingType', type)}
                      className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                        formData.listingType === type
                          ? 'border-forest bg-forest/10 text-forest'
                          : 'border-gray-200 hover:border-forest'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 5 Bedroom Detached Duplex in Lekki"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="input-field"
                  rows={5}
                  placeholder="Describe your property in detail..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Location Details</h2>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">City/LGA</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Lekki"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Area/Neighborhood</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => updateFormData('area', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Lekki Phase 1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 15 Admiralty Way"
                />
              </div>
            </div>
          )}

          {/* Step 3: Property Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Property Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData('bedrooms', e.target.value)}
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData('bathrooms', e.target.value)}
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Toilets</label>
                  <input
                    type="number"
                    value={formData.toilets}
                    onChange={(e) => updateFormData('toilets', e.target.value)}
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Parking Spaces</label>
                  <input
                    type="number"
                    value={formData.parking}
                    onChange={(e) => updateFormData('parking', e.target.value)}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Total Area (sqm)</label>
                <input
                  type="number"
                  value={formData.sqm}
                  onChange={(e) => updateFormData('sqm', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Pricing Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 150000000"
                />
              </div>

              {formData.listingType !== 'For Sale' && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Price Period</label>
                  <select
                    value={formData.pricePeriod}
                    onChange={(e) => updateFormData('pricePeriod', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select period</option>
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                  </select>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.negotiable}
                  onChange={(e) => updateFormData('negotiable', e.target.checked)}
                  className="w-4 h-4 text-forest border-gray-300 rounded focus:ring-forest"
                />
                <label htmlFor="negotiable" className="ml-2 text-sm text-gray-600">
                  Price is negotiable
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Features */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Features & Amenities</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {commonFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                      formData.features.includes(feature)
                        ? 'border-forest bg-forest/10 text-forest'
                        : 'border-gray-200 hover:border-forest'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Images */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Property Images</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 mb-4">Drag and drop images here, or click to select</p>
                <button className="btn-primary">
                  Upload Images
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Recommended: At least 5 high-quality images (minimum 1200x800px)
                </p>
              </div>
            </div>
          )}

          {/* Step 7: Documentation */}
          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Property Documentation</h2>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Title Document Type</label>
                <select
                  value={formData.documentation}
                  onChange={(e) => updateFormData('documentation', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Important Notice</p>
                    <p className="text-sm text-amber-800">
                      All properties listed on De-Greenacres undergo verification. Please ensure you have valid documentation before listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Contact Information */}
          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="input-field"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsapp"
                  checked={formData.whatsapp}
                  onChange={(e) => updateFormData('whatsapp', e.target.checked)}
                  className="w-4 h-4 text-forest border-gray-300 rounded focus:ring-forest"
                />
                <label htmlFor="whatsapp" className="ml-2 text-sm text-gray-600">
                  Allow WhatsApp inquiries
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`btn-outline ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ← Back
            </button>

            {step < totalSteps ? (
              <button onClick={handleNext} className="btn-primary">
                Next Step →
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary">
                Submit Listing
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? <Link href="/contact" className="text-forest hover:text-forest-light font-semibold">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  );
}
