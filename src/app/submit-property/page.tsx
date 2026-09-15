'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Upload, X, Check, Loader2,
  Home, MapPin, DollarSign, Image, FileText, CheckCircle
} from 'lucide-react';
import { NIGERIAN_STATES } from '@/lib/validation';

export default function SubmitPropertyPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    type: 'sale',
    price: '',
    price_period: '',
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    parking: '',
    sqm: '',
    address: '',
    area: '',
    lga: '',
    city: '',
    state: '',
    features: [] as string[],
    furnished: false,
    serviced: false,
    gated_estate: false,
    documentation: '',
    images: [] as File[],
  });

  const totalSteps = 5;

  const steps = [
    { number: 1, title: 'Basic Info', icon: Home },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Details', icon: DollarSign },
    { number: 4, title: 'Images', icon: Image },
    { number: 5, title: 'Review', icon: CheckCircle },
  ];

  const propertyTypes = [
    'Detached Duplex', 'Semi-Detached Duplex', 'Terrace Duplex',
    'Bungalow', 'Flat', 'Apartment', 'Penthouse', 'Mansion',
    'Commercial Building', 'Office Space', 'Shop', 'Warehouse', 'Land'
  ];

  const featureOptions = [
    'Swimming Pool', 'Gym', 'Tennis Court', '24/7 Security',
    'Fitted Kitchen', 'All Rooms Ensuite', 'Boys Quarter',
    'Gated Estate', 'Water Treatment', 'POP Ceiling',
    'Elevator', 'Smart Home', 'Ample Parking', 'Garden'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files].slice(0, 10) });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const toggleFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter(f => f !== feature)
        : [...formData.features, feature]
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create property
      const propertyResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
          toilets: parseInt(formData.toilets) || 0,
          parking: parseInt(formData.parking) || 0,
          sqm: parseInt(formData.sqm) || 0,
        }),
      });

      if (!propertyResponse.ok) {
        const errorData = await propertyResponse.json();
        throw new Error(errorData.error || 'Failed to create property');
      }

      const { property } = await propertyResponse.json();

      // Step 2: Upload images
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const imageFormData = new FormData();
          imageFormData.append('file', formData.images[i]);
          imageFormData.append('property_id', property.id);
          imageFormData.append('display_order', i.toString());
          imageFormData.append('is_primary', i === 0 ? 'true' : 'false');

          await fetch('/api/properties/upload-image', {
            method: 'POST',
            body: imageFormData,
          });
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.property_type;
      case 2:
        return formData.address && formData.area && formData.state;
      case 3:
        return formData.price;
      case 4:
        return formData.images.length > 0;
      default:
        return true;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-50">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-charcoal-900 mb-4">Property Submitted!</h1>
          <p className="text-charcoal-600 mb-6">
            Your property has been submitted for review. We'll notify you once it's approved.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-charcoal-900 mb-2">Submit Property</h1>
          <p className="text-charcoal-600">List your property on De-Greenacres</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-charcoal-100 text-charcoal-400'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-charcoal-900' : 'text-charcoal-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-charcoal-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Luxury 5 Bedroom Detached Duplex"
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  placeholder="Describe your property in detail..."
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Listing Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="short-let">Short Let</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Location Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., 15 Admiralty Way"
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g., Lekki Phase 1"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Lagos"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    LGA
                  </label>
                  <input
                    type="text"
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    placeholder="e.g., Eti-Osa"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Property Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 150000000"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {formData.type !== 'sale' && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                      Price Period
                    </label>
                    <select
                      value={formData.price_period}
                      onChange={(e) => setFormData({ ...formData, price_period: e.target.value })}
                      className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select period</option>
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Toilets
                  </label>
                  <input
                    type="number"
                    value={formData.toilets}
                    onChange={(e) => setFormData({ ...formData, toilets: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Parking
                  </label>
                  <input
                    type="number"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Size (sqm)
                </label>
                <input
                  type="number"
                  value={formData.sqm}
                  onChange={(e) => setFormData({ ...formData, sqm: e.target.value })}
                  placeholder="e.g., 450"
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.furnished}
                    onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-charcoal-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-charcoal-700">Furnished</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.serviced}
                    onChange={(e) => setFormData({ ...formData, serviced: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-charcoal-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-charcoal-700">Serviced</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.gated_estate}
                    onChange={(e) => setFormData({ ...formData, gated_estate: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-charcoal-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-charcoal-700">Gated Estate</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Features & Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {featureOptions.map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="w-4 h-4 text-green-600 border-charcoal-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-charcoal-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Property Images</h2>
              
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Upload Images * (Max 10)
                </label>
                <div className="border-2 border-dashed border-charcoal-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-charcoal-400 mx-auto mb-4" />
                  <p className="text-charcoal-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-charcoal-400">PNG, JPG up to 5MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-charcoal-700 mb-2">
                    {formData.images.length} image(s) selected
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-charcoal-900 mb-6">Review & Submit</h2>
              
              <div className="bg-ivory-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-charcoal-500">Title</p>
                  <p className="font-medium text-charcoal-900">{formData.title}</p>
                </div>

                <div>
                  <p className="text-sm text-charcoal-500">Location</p>
                  <p className="font-medium text-charcoal-900">
                    {formData.address}, {formData.area}, {formData.state}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-charcoal-500">Price</p>
                  <p className="font-medium text-charcoal-900">
                    ₦{parseInt(formData.price || '0').toLocaleString()}
                    {formData.price_period && ` / ${formData.price_period}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-charcoal-500">Property Type</p>
                  <p className="font-medium text-charcoal-900">{formData.property_type}</p>
                </div>

                <div>
                  <p className="text-sm text-charcoal-500">Images</p>
                  <p className="font-medium text-charcoal-900">{formData.images.length} images uploaded</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Your property will be reviewed by our team before being published. 
                  This usually takes 24-48 hours.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-charcoal-200">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-charcoal-600 hover:text-charcoal-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Property
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
