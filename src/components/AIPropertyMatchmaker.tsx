'use client';

import { DemoBanner } from '@/components/DemoBadge';

import { useState } from 'react';
import { properties } from '@/data/properties';

interface UserPreferences {
  budget: { min: number; max: number };
  location: string[];
  propertyType: string[];
  bedrooms: number;
  mustHaves: string[];
  lifestyle: string;
  investmentGoal: string;
}

export default function AIPropertyMatchmaker() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: { min: 50000000, max: 200000000 },
    location: [],
    propertyType: [],
    bedrooms: 3,
    mustHaves: [],
    lifestyle: '',
    investmentGoal: ''
  });
  const [matches, setMatches] = useState<typeof properties>([]);

  const locations = ['Lagos', 'Abuja', 'Enugu', 'Akwa Ibom'];
  const propertyTypes = ['Detached Duplex', 'Semi-Detached', 'Apartment', 'Land', 'Commercial'];
  const amenities = [
    'Swimming Pool', 'Gym', 'Smart Home', '24/7 Security', 
    'Gated Estate', 'Boys Quarter', 'Fiber Internet', 'CCTV'
  ];
  const lifestyles = [
    'Family-oriented', 'Young professional', 'Luxury living', 
    'Investment focus', 'Retirement', 'Student housing'
  ];
  const goals = [
    'Primary residence', 'Rental income', 'Capital appreciation', 
    'Vacation home', 'Commercial use', 'Land banking'
  ];

  const calculateMatch = (property: typeof properties[0]) => {
    let score = 0;
    let maxScore = 0;

    // Budget match (30% weight)
    maxScore += 30;
    if (property.price >= preferences.budget.min && property.price <= preferences.budget.max) {
      score += 30;
    } else if (property.price < preferences.budget.min * 1.1 || property.price > preferences.budget.max * 0.9) {
      score += 15;
    }

    // Location match (25% weight)
    maxScore += 25;
    if (preferences.location.length === 0 || preferences.location.includes(property.state)) {
      score += 25;
    }

    // Property type match (20% weight)
    maxScore += 20;
    if (preferences.propertyType.length === 0 || preferences.propertyType.includes(property.propertyType)) {
      score += 20;
    }

    // Bedrooms match (15% weight)
    maxScore += 15;
    if (Math.abs(property.bedrooms - preferences.bedrooms) <= 1) {
      score += 15;
    } else if (Math.abs(property.bedrooms - preferences.bedrooms) <= 2) {
      score += 8;
    }

    // Amenities match (10% weight)
    maxScore += 10;
    const matchedAmenities = preferences.mustHaves.filter(a => property.features.includes(a));
    score += (matchedAmenities.length / Math.max(preferences.mustHaves.length, 1)) * 10;

    return Math.round((score / maxScore) * 100);
  };

  const findMatches = () => {
    const scoredProperties = properties.map(property => ({
      ...property,
      matchScore: calculateMatch(property)
    }));

    const sorted = scoredProperties
      .filter(p => p.matchScore >= 60)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    setMatches(sorted);
    setStep(5);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <>
      <DemoBanner description="AI Property Matchmaker — Preview with sample properties. Live AI matching will be connected to your data." />
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">AI Property Matchmaker</h2>
            <p className="text-lg text-gray-600">
              Let our AI find the perfect property match based on your preferences
            </p>
          </div>

          {/* Progress Bar */}
          {step < 5 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Step {step} of 4</span>
                <span className="text-sm font-semibold text-forest">{step * 25}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-forest to-sage transition-all duration-500"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Budget */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-charcoal mb-6">What's your budget range?</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Minimum Budget
                  </label>
                  <input
                    type="range"
                    min="10000000"
                    max="500000000"
                    step="10000000"
                    value={preferences.budget.min}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      budget: { ...preferences.budget, min: Number(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="text-lg font-bold text-forest mt-2">
                    ₦{(preferences.budget.min / 1000000).toFixed(0)}M
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Maximum Budget
                  </label>
                  <input
                    type="range"
                    min="10000000"
                    max="1000000000"
                    step="10000000"
                    value={preferences.budget.max}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      budget: { ...preferences.budget, max: Number(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="text-lg font-bold text-forest mt-2">
                    ₦{(preferences.budget.max / 1000000).toFixed(0)}M
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary w-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Type */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Where and what type of property?</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Preferred Locations (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => setPreferences({
                          ...preferences,
                          location: toggleArrayItem(preferences.location, location)
                        })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          preferences.location.includes(location)
                            ? 'border-forest bg-forest/10 text-forest'
                            : 'border-gray-200 hover:border-forest'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Property Type (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setPreferences({
                          ...preferences,
                          propertyType: toggleArrayItem(preferences.propertyType, type)
                        })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          preferences.propertyType.includes(type)
                            ? 'border-forest bg-forest/10 text-forest'
                            : 'border-gray-200 hover:border-forest'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Property specifications</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Number of Bedrooms
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        onClick={() => setPreferences({ ...preferences, bedrooms: num })}
                        className={`flex-1 p-4 rounded-lg border-2 font-bold transition-all ${
                          preferences.bedrooms === num
                            ? 'border-forest bg-forest text-white'
                            : 'border-gray-200 hover:border-forest'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Must-Have Amenities (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {amenities.map(amenity => (
                      <button
                        key={amenity}
                        onClick={() => setPreferences({
                          ...preferences,
                          mustHaves: toggleArrayItem(preferences.mustHaves, amenity)
                        })}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                          preferences.mustHaves.includes(amenity)
                            ? 'border-forest bg-forest/10 text-forest'
                            : 'border-gray-200 hover:border-forest'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Lifestyle & Goals */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Your lifestyle and goals</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Lifestyle
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {lifestyles.map(lifestyle => (
                      <button
                        key={lifestyle}
                        onClick={() => setPreferences({ ...preferences, lifestyle })}
                        className={`p-4 rounded-lg border-2 text-sm transition-all ${
                          preferences.lifestyle === lifestyle
                            ? 'border-forest bg-forest/10 text-forest'
                            : 'border-gray-200 hover:border-forest'
                        }`}
                      >
                        {lifestyle}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Investment Goal
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {goals.map(goal => (
                      <button
                        key={goal}
                        onClick={() => setPreferences({ ...preferences, investmentGoal: goal })}
                        className={`p-4 rounded-lg border-2 text-sm transition-all ${
                          preferences.investmentGoal === goal
                            ? 'border-forest bg-forest/10 text-forest'
                            : 'border-gray-200 hover:border-forest'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep(3)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={findMatches}
                    className="btn-primary flex-1"
                  >
                    Find My Matches
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && (
            <div>
              <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-charcoal mb-2">
                    We found {matches.length} properties that match your preferences!
                  </h3>
                  <p className="text-gray-600">
                    Here are your top matches based on your criteria
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.map((property: any) => (
                    <div key={property.id} className="bg-ivory rounded-xl overflow-hidden hover:shadow-medium transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-forest text-white px-3 py-1 rounded-full font-bold">
                          {property.matchScore}% Match
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-charcoal mb-2 line-clamp-2">
                          {property.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {property.area}, {property.state}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-forest">
                            ₦{(property.price / 1000000).toFixed(0)}M
                          </div>
                          <div className="text-sm text-gray-600">
                            {property.bedrooms} bed • {property.sqm} sqm
                          </div>
                        </div>
                        <a
                          href={`/properties/${property.slug}`}
                          className="btn-primary w-full block text-center"
                        >
                          View Property
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => {
                      setStep(1);
                      setMatches([]);
                    }}
                    className="btn-outline flex-1"
                  >
                    Start Over
                  </button>
                  <a
                    href="https://wa.me/2347041754800?text=Hello%20De-Greenacres,%20I%20just%20used%20the%20AI%20Property%20Matchmaker%20and%20found%20some%20great%20matches.%20Can%20you%20help%20me%20refine%20my%20search?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1"
                  >
                    Get Expert Help
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
      </>
  );
}
