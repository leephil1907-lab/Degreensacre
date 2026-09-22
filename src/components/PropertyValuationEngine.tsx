'use client';

import { DemoBanner } from '@/components/DemoBadge';

import { useState } from 'react';

interface ValuationInput {
  propertyType: string;
  state: string;
  area: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  amenities: string[];
}

interface ValuationResult {
  estimatedValue: number;
  confidenceScore: 'high' | 'medium' | 'low';
  priceRange: {
    low: number;
    high: number;
  };
  pricePerSqm: number;
  factors: ValuationFactor[];
  marketTrend: 'rising' | 'stable' | 'declining';
  lastUpdated: string;
}

interface ValuationFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  value: string;
  description: string;
}

// Base prices per sqm by location (simplified for demo)
const locationBasePrices: Record<string, Record<string, number>> = {
  'Lagos': {
    'Lekki Phase 1': 400000,
    'Ikoyi': 600000,
    'Victoria Island': 550000,
    'Ikeja': 250000,
    'Surulere': 200000,
    'Ajah': 180000,
    'Magodo': 220000,
    'default': 200000
  },
  'Abuja': {
    'Maitama': 500000,
    'Asokoro': 450000,
    'Wuse': 350000,
    'Garki': 300000,
    'Guzape': 280000,
    'Katampe': 250000,
    'Jabi': 260000,
    'default': 250000
  },
  'Enugu': {
    'Independence Layout': 300000,
    'GRA': 280000,
    'Trans-Ekulu': 200000,
    'New Haven': 220000,
    'Ogui': 180000,
    'default': 180000
  },
  'Akwa Ibom': {
    'Shelter Afrique': 150000,
    'Osongama': 140000,
    'Uyo': 120000,
    'Eket': 100000,
    'default': 100000
  }
};

const amenityMultipliers: Record<string, number> = {
  'Swimming Pool': 1.15,
  'Gym': 1.08,
  'Smart Home': 1.10,
  'Elevator': 1.12,
  'CCTV': 1.05,
  '24/7 Security': 1.08,
  'Fiber Internet': 1.03,
  'Boys Quarter': 1.10,
  'Water Treatment': 1.05,
  'POP Ceiling': 1.03,
  'Fitted Kitchen': 1.08,
  'All Rooms Ensuite': 1.05
};

const conditionMultipliers: Record<string, number> = {
  'excellent': 1.15,
  'good': 1.0,
  'fair': 0.85,
  'poor': 0.70
};

export default function PropertyValuationEngine() {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [input, setInput] = useState<ValuationInput>({
    propertyType: 'Detached Duplex',
    state: 'Lagos',
    area: 'Lekki Phase 1',
    size: 300,
    bedrooms: 4,
    bathrooms: 4,
    condition: 'good',
    amenities: []
  });
  const [result, setResult] = useState<ValuationResult | null>(null);

  const availableAmenities = [
    'Swimming Pool', 'Gym', 'Smart Home', 'Elevator', 'CCTV',
    '24/7 Security', 'Fiber Internet', 'Boys Quarter', 'Water Treatment',
    'POP Ceiling', 'Fitted Kitchen', 'All Rooms Ensuite'
  ];

  const toggleAmenity = (amenity: string) => {
    setInput(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const calculateValuation = () => {
    const statePrices = locationBasePrices[input.state] || locationBasePrices['Lagos'];
    const basePricePerSqm = statePrices[input.area] || statePrices['default'] || 200000;

    // Start with base value
    let estimatedValue = basePricePerSqm * input.size;

    // Apply condition multiplier
    const conditionMult = conditionMultipliers[input.condition];
    estimatedValue *= conditionMult;

    // Apply amenity multipliers
    let amenityMult = 1.0;
    input.amenities.forEach(amenity => {
      amenityMult *= amenityMultipliers[amenity] || 1.0;
    });
    estimatedValue *= amenityMult;

    // Apply bedroom/bathroom adjustments
    if (input.bedrooms > 4) estimatedValue *= 1.05;
    if (input.bathrooms > 4) estimatedValue *= 1.03;

    // Calculate confidence score based on data availability
    let confidenceScore: 'high' | 'medium' | 'low' = 'medium';
    if (input.state === 'Lagos' || input.state === 'Abuja') {
      confidenceScore = 'high';
    } else if (input.state === 'Enugu' || input.state === 'Akwa Ibom') {
      confidenceScore = 'medium';
    }

    // Calculate price range (±15% for high confidence, ±25% for medium, ±35% for low)
    const rangePercent = confidenceScore === 'high' ? 0.15 : confidenceScore === 'medium' ? 0.25 : 0.35;
    const priceRange = {
      low: Math.round(estimatedValue * (1 - rangePercent)),
      high: Math.round(estimatedValue * (1 + rangePercent))
    };

    // Build factors
    const factors: ValuationFactor[] = [
      {
        name: 'Location',
        impact: 'positive',
        value: `${input.area}, ${input.state}`,
        description: `Base price: ₦${basePricePerSqm.toLocaleString()}/sqm`
      },
      {
        name: 'Property Size',
        impact: 'positive',
        value: `${input.size} sqm`,
        description: 'Larger properties command premium prices'
      },
      {
        name: 'Condition',
        impact: input.condition === 'excellent' || input.condition === 'good' ? 'positive' : 'negative',
        value: input.condition.charAt(0).toUpperCase() + input.condition.slice(1),
        description: `Condition multiplier: ${(conditionMult * 100).toFixed(0)}%`
      }
    ];

    if (input.amenities.length > 0) {
      factors.push({
        name: 'Amenities',
        impact: 'positive',
        value: `${input.amenities.length} features`,
        description: `Amenity multiplier: ${(amenityMult * 100).toFixed(0)}%`
      });
    }

    setResult({
      estimatedValue: Math.round(estimatedValue),
      confidenceScore,
      priceRange,
      pricePerSqm: Math.round(estimatedValue / input.size),
      factors,
      marketTrend: 'rising',
      lastUpdated: new Date().toISOString()
    });

    setStep('result');
  };

  const resetValuation = () => {
    setStep('input');
    setResult(null);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `₦${(price / 1000000000).toFixed(2)}B`;
    }
    return `₦${(price / 1000000).toFixed(0)}M`;
  };

  return (
    <>
      <DemoBanner description="Valuation Engine — Preview estimates with demo algorithm. Live valuation model will be calibrated with transactions." />
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Property Valuation Engine</h2>
            <p className="text-lg text-gray-600">
              Get an instant estimate of your property&apos;s market value
            </p>
          </div>

          {step === 'input' ? (
            /* Input Form */
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Property Type
                  </label>
                  <select
                    value={input.propertyType}
                    onChange={(e) => setInput(prev => ({ ...prev, propertyType: e.target.value }))}
                    className="input-field"
                  >
                    <option>Detached Duplex</option>
                    <option>Semi-Detached Duplex</option>
                    <option>Terraced House</option>
                    <option>Apartment</option>
                    <option>Land</option>
                    <option>Commercial</option>
                  </select>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      State
                    </label>
                    <select
                      value={input.state}
                      onChange={(e) => setInput(prev => ({ ...prev, state: e.target.value, area: '' }))}
                      className="input-field"
                    >
                      <option>Lagos</option>
                      <option>Abuja</option>
                      <option>Enugu</option>
                      <option>Akwa Ibom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Area/Location
                    </label>
                    <select
                      value={input.area}
                      onChange={(e) => setInput(prev => ({ ...prev, area: e.target.value }))}
                      className="input-field"
                    >
                      {Object.keys(locationBasePrices[input.state] || {}).filter(k => k !== 'default').map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Size and Rooms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Size (sqm)
                    </label>
                    <input
                      type="number"
                      value={input.size}
                      onChange={(e) => setInput(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={input.bedrooms}
                      onChange={(e) => setInput(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={input.bathrooms}
                      onChange={(e) => setInput(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Property Condition
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['excellent', 'good', 'fair', 'poor'] as const).map(condition => (
                      <button
                        key={condition}
                        onClick={() => setInput(prev => ({ ...prev, condition }))}
                        className={`p-3 rounded-lg border-2 font-semibold capitalize transition-all ${
                          input.condition === condition
                            ? 'border-forest bg-forest text-white'
                            : 'border-gray-200 bg-white text-charcoal hover:border-forest'
                        }`}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Amenities & Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableAmenities.map(amenity => (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          input.amenities.includes(amenity)
                            ? 'border-forest bg-forest/10 text-forest'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-forest'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateValuation}
                  className="w-full btn-primary text-lg py-4"
                >
                  Calculate Property Value
                </button>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center">
                  This is an estimate based on market data and property characteristics. 
                  Actual market value may vary. Consult a professional for accurate valuation.
                </p>
              </div>
            </div>
          ) : (
            /* Result Display */
            result && (
              <div className="space-y-6">
                {/* Main Valuation Card */}
                <div className="bg-white rounded-2xl shadow-soft p-8">
                  <div className="text-center mb-8">
                    <div className="text-sm text-gray-600 mb-2">Estimated Market Value</div>
                    <div className="text-5xl font-bold text-forest mb-4">
                      {formatPrice(result.estimatedValue)}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory">
                      <span className={`w-2 h-2 rounded-full ${
                        result.confidenceScore === 'high' ? 'bg-green-500' :
                        result.confidenceScore === 'medium' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm font-semibold text-charcoal capitalize">
                        {result.confidenceScore} Confidence
                      </span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-ivory rounded-xl p-6 mb-6">
                    <div className="text-sm text-gray-600 mb-3 text-center">Estimated Price Range</div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Low</div>
                        <div className="text-lg font-bold text-charcoal">
                          {formatPrice(result.priceRange.low)}
                        </div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-gradient-to-r from-green-300 via-forest to-green-300 rounded-full" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">High</div>
                        <div className="text-lg font-bold text-charcoal">
                          {formatPrice(result.priceRange.high)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-600 mt-4">
                      Price per sqm: <span className="font-bold text-forest">₦{result.pricePerSqm.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Valuation Factors */}
                  <div>
                    <h3 className="text-lg font-bold text-charcoal mb-4">Valuation Factors</h3>
                    <div className="space-y-3">
                      {result.factors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            factor.impact === 'positive' ? 'bg-green-100 text-green-600' :
                            factor.impact === 'negative' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {factor.impact === 'positive' ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : factor.impact === 'negative' ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm7 0a1 1 0 012 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-charcoal">{factor.name}</div>
                            <div className="text-sm text-gray-600">{factor.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{factor.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Market Trend */}
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-charcoal mb-1">Market Trend</h3>
                      <p className="text-sm text-gray-600">Current market direction in your area</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      result.marketTrend === 'rising' ? 'bg-green-100 text-green-700' :
                      result.marketTrend === 'stable' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {result.marketTrend === 'rising' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        ) : result.marketTrend === 'stable' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        )}
                      </svg>
                      <span className="font-bold capitalize">{result.marketTrend}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={resetValuation}
                    className="btn-outline"
                  >
                    Calculate Another Property
                  </button>
                  <a
                    href={`https://wa.me/2347041754800?text=${encodeURIComponent(`Hello De-Greenacres, I just used your valuation tool and got an estimate of ${formatPrice(result.estimatedValue)} for a property in ${input.area}, ${input.state}. I'd like to discuss this further.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Get Expert Consultation
                  </a>
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <strong>Disclaimer:</strong> This valuation is an estimate based on available market data and property characteristics. 
                      Actual market value may vary based on specific conditions, negotiations, and market dynamics. 
                      For accurate valuation, consult with our certified property valuers.
                      <br /><br />
                      Last updated: {new Date(result.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
      </>
  );
}
