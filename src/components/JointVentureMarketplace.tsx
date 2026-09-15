'use client';

import { useState } from 'react';

interface JVOpportunity {
  id: string;
  title: string;
  type: 'land-owner' | 'developer' | 'investor';
  location: string;
  state: string;
  description: string;
  landSize?: number;
  investmentAmount?: number;
  expectedROI?: number;
  timeline: string;
  requirements: string[];
  status: 'open' | 'in-discussion' | 'closed';
  postedDate: string;
  contactPerson: string;
}

const jvOpportunities: JVOpportunity[] = [
  {
    id: '1',
    title: '5 Acres in Lekki for Residential Development',
    type: 'land-owner',
    location: 'Lekki',
    state: 'Lagos',
    description: 'Prime 5-acre land with C of O available for joint venture residential development. Excellent location near Chevron Drive.',
    landSize: 20000,
    investmentAmount: 500000000,
    expectedROI: 35,
    timeline: '24-36 months',
    requirements: ['Experienced developer', 'Track record of similar projects', 'Minimum ₦500M capital'],
    status: 'open',
    postedDate: '2026-09-10',
    contactPerson: 'Chief Adebayo'
  },
  {
    id: '2',
    title: 'Experienced Developer Seeking Land Partners',
    type: 'developer',
    location: 'Abuja',
    state: 'FCT',
    description: 'Established developer with 15+ years experience seeking land owners for residential estate development in Abuja.',
    investmentAmount: 300000000,
    expectedROI: 40,
    timeline: '18-30 months',
    requirements: ['Land with valid title', 'Minimum 2 acres', 'Good road access'],
    status: 'open',
    postedDate: '2026-09-08',
    contactPerson: 'Engr. Okonkwo'
  },
  {
    id: '3',
    title: 'Investment Opportunity in Commercial Plaza',
    type: 'investor',
    location: 'Victoria Island',
    state: 'Lagos',
    description: 'Seeking investors for a 10-story commercial plaza development. Land secured, approvals in place.',
    investmentAmount: 2000000000,
    expectedROI: 45,
    timeline: '36-48 months',
    requirements: ['Minimum ₦200M investment', 'Long-term investment horizon', 'Accredited investor'],
    status: 'open',
    postedDate: '2026-09-05',
    contactPerson: 'Mr. Ibrahim'
  },
  {
    id: '4',
    title: '3 Acres in Enugu for Estate Development',
    type: 'land-owner',
    location: 'Independence Layout',
    state: 'Enugu',
    description: 'Well-located 3-acre land in prestigious Independence Layout. All documentation complete, ready for development.',
    landSize: 12000,
    investmentAmount: 250000000,
    expectedROI: 30,
    timeline: '18-24 months',
    requirements: ['Residential developer', 'Experience in Southeast market', 'Strong financial capacity'],
    status: 'open',
    postedDate: '2026-09-03',
    contactPerson: 'Barr. Eze'
  },
  {
    id: '5',
    title: 'Luxury Apartment Project - Seeking Equity Partner',
    type: 'developer',
    location: 'Ikoyi',
    state: 'Lagos',
    description: 'Premium 20-unit luxury apartment project in Ikoyi. 40% equity partnership available for qualified investor.',
    investmentAmount: 800000000,
    expectedROI: 50,
    timeline: '30-36 months',
    requirements: ['Minimum ₦800M equity', 'Real estate investment experience', 'Long-term partnership mindset'],
    status: 'in-discussion',
    postedDate: '2026-08-28',
    contactPerson: 'Arch. Balogun'
  },
  {
    id: '6',
    title: 'Mixed-Use Development in Uyo',
    type: 'investor',
    location: 'Uyo',
    state: 'Akwa Ibom',
    description: 'Mixed-use development (retail + residential) in rapidly growing Uyo market. Seeking strategic investors.',
    investmentAmount: 400000000,
    expectedROI: 38,
    timeline: '24-30 months',
    requirements: ['Minimum ₦100M investment', 'Interest in emerging markets', 'Patient capital'],
    status: 'open',
    postedDate: '2026-08-25',
    contactPerson: 'Dr. Udo'
  }
];

export default function JointVentureMarketplace() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<JVOpportunity | null>(null);

  const filteredOpportunities = jvOpportunities.filter(opp => {
    const matchesType = filterType === 'all' || opp.type === filterType;
    const matchesState = filterState === 'all' || opp.state === filterState;
    return matchesType && matchesState;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'land-owner':
        return 'bg-green-100 text-green-700';
      case 'developer':
        return 'bg-blue-100 text-blue-700';
      case 'investor':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'land-owner':
        return 'Land Owner';
      case 'developer':
        return 'Developer';
      case 'investor':
        return 'Investor';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'in-discussion':
        return 'bg-amber-100 text-amber-700';
      case 'closed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Joint Venture Marketplace</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect land owners, developers, and investors for profitable real estate partnerships
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-forest mb-2">24</div>
              <div className="text-sm text-gray-600">Active Opportunities</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-forest mb-2">₦4.2B</div>
              <div className="text-sm text-gray-600">Total Investment Value</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-forest mb-2">38%</div>
              <div className="text-sm text-gray-600">Avg. Expected ROI</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="text-3xl font-bold text-forest mb-2">12</div>
              <div className="text-sm text-gray-600">Successful JVs</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-charcoal mb-2">Opportunity Type</label>
                <div className="flex gap-2 overflow-x-auto">
                  {['all', 'land-owner', 'developer', 'investor'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                        filterType === type
                          ? 'bg-forest text-white'
                          : 'bg-ivory text-charcoal hover:bg-forest/10'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : getTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-charcoal mb-2">Location</label>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All States</option>
                  <option value="Lagos">Lagos</option>
                  <option value="FCT">Abuja (FCT)</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Akwa Ibom">Akwa Ibom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredOpportunities.map(opportunity => (
              <div
                key={opportunity.id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow cursor-pointer"
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTypeColor(opportunity.type)}`}>
                      {getTypeLabel(opportunity.type)}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status === 'open' ? 'Open' : 
                       opportunity.status === 'in-discussion' ? 'In Discussion' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-charcoal mb-2 line-clamp-2">
                    {opportunity.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {opportunity.location}, {opportunity.state}
                    </div>
                    {opportunity.investmentAmount && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Investment: ₦{(opportunity.investmentAmount / 1000000).toFixed(0)}M
                      </div>
                    )}
                    {opportunity.expectedROI && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Expected ROI: {opportunity.expectedROI}%
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Timeline: {opportunity.timeline}
                    </div>
                  </div>

                  <button className="btn-outline w-full">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Post Opportunity CTA */}
          <div className="bg-gradient-to-br from-forest to-forest-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Have a Joint Venture Opportunity?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Whether you're a land owner, developer, or investor, post your opportunity and connect with qualified partners.
            </p>
            <a
              href="https://wa.me/2348065019971?text=Hello%20De-Greenacres,%20I%20have%20a%20joint%20venture%20opportunity%20I'd%20like%20to%20post%20on%20your%20marketplace."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-white text-forest hover:bg-ivory inline-block"
            >
              Post Your Opportunity
            </a>
          </div>

          {/* Modal for Opportunity Details */}
          {selectedOpportunity && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTypeColor(selectedOpportunity.type)}`}>
                          {getTypeLabel(selectedOpportunity.type)}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(selectedOpportunity.status)}`}>
                          {selectedOpportunity.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-charcoal">{selectedOpportunity.title}</h3>
                      <p className="text-gray-600 mt-1">
                        {selectedOpportunity.location}, {selectedOpportunity.state}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOpportunity(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-charcoal mb-2">Description</h4>
                      <p className="text-gray-700">{selectedOpportunity.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {selectedOpportunity.landSize && (
                        <div className="p-4 bg-ivory rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Land Size</div>
                          <div className="text-xl font-bold text-forest">
                            {(selectedOpportunity.landSize / 4000).toFixed(1)} acres
                          </div>
                        </div>
                      )}
                      {selectedOpportunity.investmentAmount && (
                        <div className="p-4 bg-ivory rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Investment Required</div>
                          <div className="text-xl font-bold text-forest">
                            ₦{(selectedOpportunity.investmentAmount / 1000000).toFixed(0)}M
                          </div>
                        </div>
                      )}
                      {selectedOpportunity.expectedROI && (
                        <div className="p-4 bg-ivory rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Expected ROI</div>
                          <div className="text-xl font-bold text-green-600">
                            {selectedOpportunity.expectedROI}%
                          </div>
                        </div>
                      )}
                      <div className="p-4 bg-ivory rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Timeline</div>
                        <div className="text-xl font-bold text-charcoal">
                          {selectedOpportunity.timeline}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-charcoal mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {selectedOpportunity.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Contact Person</div>
                          <div className="font-bold text-charcoal">{selectedOpportunity.contactPerson}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted: {new Date(selectedOpportunity.postedDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <a
                          href={`https://wa.me/2348065019971?text=${encodeURIComponent(
                            `Hello De-Greenacres, I'm interested in the JV opportunity: "${selectedOpportunity.title}". Please connect me with ${selectedOpportunity.contactPerson}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex-1"
                        >
                          Express Interest
                        </a>
                        <button
                          onClick={() => setSelectedOpportunity(null)}
                          className="btn-outline flex-1"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
