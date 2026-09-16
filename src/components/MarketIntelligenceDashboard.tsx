'use client';

import { useState } from 'react';

interface MarketData {
  location: string;
  state: string;
  avgPrice: number;
  pricePerSqm: number;
  yoyGrowth: number;
  rentalYield: number;
  daysOnMarket: number;
  activeListings: number;
  soldLastQuarter: number;
  priceHistory: { month: string; price: number }[];
}

const marketData: MarketData[] = [
  {
    location: 'Lekki Phase 1',
    state: 'Lagos',
    avgPrice: 150000000,
    pricePerSqm: 400000,
    yoyGrowth: 25,
    rentalYield: 6.5,
    daysOnMarket: 45,
    activeListings: 128,
    soldLastQuarter: 32,
    priceHistory: [
      { month: 'Jan', price: 120000000 },
      { month: 'Mar', price: 128000000 },
      { month: 'May', price: 135000000 },
      { month: 'Jul', price: 142000000 },
      { month: 'Sep', price: 150000000 }
    ]
  },
  {
    location: 'Ikoyi',
    state: 'Lagos',
    avgPrice: 350000000,
    pricePerSqm: 600000,
    yoyGrowth: 20,
    rentalYield: 5.8,
    daysOnMarket: 60,
    activeListings: 85,
    soldLastQuarter: 18,
    priceHistory: [
      { month: 'Jan', price: 290000000 },
      { month: 'Mar', price: 305000000 },
      { month: 'May', price: 320000000 },
      { month: 'Jul', price: 335000000 },
      { month: 'Sep', price: 350000000 }
    ]
  },
  {
    location: 'Maitama',
    state: 'Abuja',
    avgPrice: 400000000,
    pricePerSqm: 500000,
    yoyGrowth: 22,
    rentalYield: 6.2,
    daysOnMarket: 50,
    activeListings: 95,
    soldLastQuarter: 24,
    priceHistory: [
      { month: 'Jan', price: 320000000 },
      { month: 'Mar', price: 340000000 },
      { month: 'May', price: 360000000 },
      { month: 'Jul', price: 380000000 },
      { month: 'Sep', price: 400000000 }
    ]
  },
  {
    location: 'Asokoro',
    state: 'Abuja',
    avgPrice: 280000000,
    pricePerSqm: 450000,
    yoyGrowth: 18,
    rentalYield: 6.0,
    daysOnMarket: 55,
    activeListings: 72,
    soldLastQuarter: 20,
    priceHistory: [
      { month: 'Jan', price: 230000000 },
      { month: 'Mar', price: 245000000 },
      { month: 'May', price: 255000000 },
      { month: 'Jul', price: 268000000 },
      { month: 'Sep', price: 280000000 }
    ]
  },
  {
    location: 'Independence Layout',
    state: 'Enugu',
    avgPrice: 180000000,
    pricePerSqm: 300000,
    yoyGrowth: 18,
    rentalYield: 7.2,
    daysOnMarket: 70,
    activeListings: 45,
    soldLastQuarter: 12,
    priceHistory: [
      { month: 'Jan', price: 150000000 },
      { month: 'Mar', price: 158000000 },
      { month: 'May', price: 165000000 },
      { month: 'Jul', price: 172000000 },
      { month: 'Sep', price: 180000000 }
    ]
  },
  {
    location: 'Shelter Afrique',
    state: 'Akwa Ibom',
    avgPrice: 80000000,
    pricePerSqm: 150000,
    yoyGrowth: 28,
    rentalYield: 8.5,
    daysOnMarket: 80,
    activeListings: 38,
    soldLastQuarter: 15,
    priceHistory: [
      { month: 'Jan', price: 60000000 },
      { month: 'Mar', price: 65000000 },
      { month: 'May', price: 70000000 },
      { month: 'Jul', price: 75000000 },
      { month: 'Sep', price: 80000000 }
    ]
  }
];

export default function MarketIntelligenceDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<MarketData>(marketData[0]);
  const [filterState, setFilterState] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('1y');

  const filteredData = filterState === 'all' 
    ? marketData 
    : marketData.filter(d => d.state === filterState);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(2)}B`;
    }
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(0)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 20) return 'text-green-600 bg-green-50';
    if (growth > 10) return 'text-blue-600 bg-blue-50';
    return 'text-amber-600 bg-amber-50';
  };

  const getMaxPrice = (data: MarketData) => {
    return Math.max(...data.priceHistory.map(p => p.price));
  };

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Market Intelligence Dashboard</h2>
            <p className="text-lg text-gray-600">
              Real-time market data and insights for informed investment decisions
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex gap-2">
              {['all', 'Lagos', 'Abuja', 'Enugu', 'Akwa Ibom'].map(state => (
                <button
                  key={state}
                  onClick={() => setFilterState(state)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterState === state
                      ? 'bg-forest text-white'
                      : 'bg-white text-charcoal hover:bg-forest/10'
                  }`}
                >
                  {state === 'all' ? 'All States' : state}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              {['3m', '6m', '1y', '5y'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    timeRange === range
                      ? 'bg-charcoal text-white'
                      : 'bg-white text-charcoal hover:bg-gray-100'
                  }`}
                >
                  {range === '3m' ? '3 Months' : 
                   range === '6m' ? '6 Months' :
                   range === '1y' ? '1 Year' : '5 Years'}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="text-sm text-gray-600 mb-2">Total Active Listings</div>
              <div className="text-3xl font-bold text-forest">
                {filteredData.reduce((sum, d) => sum + d.activeListings, 0)}
              </div>
              <div className="text-xs text-green-600 mt-2">↑ 12% vs last month</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="text-sm text-gray-600 mb-2">Avg. Days on Market</div>
              <div className="text-3xl font-bold text-charcoal">
                {Math.round(filteredData.reduce((sum, d) => sum + d.daysOnMarket, 0) / filteredData.length)}
              </div>
              <div className="text-xs text-red-600 mt-2">↓ 5 days vs last month</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="text-sm text-gray-600 mb-2">Sold Last Quarter</div>
              <div className="text-3xl font-bold text-charcoal">
                {filteredData.reduce((sum, d) => sum + d.soldLastQuarter, 0)}
              </div>
              <div className="text-xs text-green-600 mt-2">↑ 8% vs last quarter</div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="text-sm text-gray-600 mb-2">Avg. Rental Yield</div>
              <div className="text-3xl font-bold text-forest">
                {(filteredData.reduce((sum, d) => sum + d.rentalYield, 0) / filteredData.length).toFixed(1)}%
              </div>
              <div className="text-xs text-green-600 mt-2">↑ 0.3% vs last year</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Location Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <h3 className="text-xl font-bold text-charcoal mb-4">Select Location</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredData.map((data, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLocation(data)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedLocation.location === data.location
                          ? 'bg-forest/10 border-2 border-forest'
                          : 'bg-ivory hover:bg-forest/5 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-charcoal">{data.location}</div>
                          <div className="text-sm text-gray-600">{data.state} State</div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getGrowthColor(data.yoyGrowth)}`}>
                          +{data.yoyGrowth}% YoY
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">Avg Price</div>
                          <div className="font-bold text-forest">{formatCurrency(data.avgPrice)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Per sqm</div>
                          <div className="font-bold text-charcoal">₦{(data.pricePerSqm / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Location Header */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal mb-1">{selectedLocation.location}</h3>
                    <p className="text-gray-600">{selectedLocation.state} State, Nigeria</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-forest">{formatCurrency(selectedLocation.avgPrice)}</div>
                    <div className="text-sm text-gray-600">Average Property Price</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-ivory rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Price per sqm</div>
                    <div className="text-xl font-bold text-charcoal">₦{selectedLocation.pricePerSqm.toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-ivory rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">YoY Growth</div>
                    <div className={`text-xl font-bold ${selectedLocation.yoyGrowth > 20 ? 'text-green-600' : 'text-blue-600'}`}>
                      +{selectedLocation.yoyGrowth}%
                    </div>
                  </div>
                  <div className="p-4 bg-ivory rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Rental Yield</div>
                    <div className="text-xl font-bold text-forest">{selectedLocation.rentalYield}%</div>
                  </div>
                  <div className="p-4 bg-ivory rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Days on Market</div>
                    <div className="text-xl font-bold text-charcoal">{selectedLocation.daysOnMarket}</div>
                  </div>
                </div>
              </div>

              {/* Price Trend Chart */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h4 className="text-lg font-bold text-charcoal mb-4">Price Trend (Last 12 Months)</h4>
                <div className="relative h-64">
                  <div className="absolute inset-0 flex items-end justify-between gap-2">
                    {selectedLocation.priceHistory.map((point, index) => {
                      const maxPrice = getMaxPrice(selectedLocation);
                      const height = (point.price / maxPrice) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-forest to-forest/60 rounded-t-lg transition-all hover:from-forest/80 hover:to-forest/40"
                            style={{ height: `${height}%` }}
                          >
                            <div className="text-xs text-white font-bold text-center pt-2">
                              {formatCurrency(point.price)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-2">{point.month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Market Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h4 className="text-lg font-bold text-charcoal mb-4">Market Activity</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-ivory rounded-lg">
                      <span className="text-gray-600">Active Listings</span>
                      <span className="font-bold text-forest">{selectedLocation.activeListings}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-ivory rounded-lg">
                      <span className="text-gray-600">Sold Last Quarter</span>
                      <span className="font-bold text-charcoal">{selectedLocation.soldLastQuarter}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-ivory rounded-lg">
                      <span className="text-gray-600">Avg. Days to Sell</span>
                      <span className="font-bold text-charcoal">{selectedLocation.daysOnMarket} days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-ivory rounded-lg">
                      <span className="text-gray-600">Market Status</span>
                      <span className={`font-bold ${
                        selectedLocation.daysOnMarket < 60 ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {selectedLocation.daysOnMarket < 60 ? 'Hot Market' : 'Stable'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h4 className="text-lg font-bold text-charcoal mb-4">Investment Potential</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Capital Appreciation</span>
                        <span className="font-bold text-green-600">{selectedLocation.yoyGrowth}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${Math.min(selectedLocation.yoyGrowth * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Rental Yield</span>
                        <span className="font-bold text-forest">{selectedLocation.rentalYield}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest"
                          style={{ width: `${selectedLocation.rentalYield * 10}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Market Liquidity</span>
                        <span className="font-bold text-blue-600">
                          {selectedLocation.daysOnMarket < 60 ? 'High' : 'Medium'}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${Math.max(100 - selectedLocation.daysOnMarket, 30)}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Investment Rating</div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.round((selectedLocation.yoyGrowth + selectedLocation.rentalYield) / 8)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 font-bold text-charcoal">
                          {Math.round((selectedLocation.yoyGrowth + selectedLocation.rentalYield) / 8)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-forest to-forest-600 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Ready to Invest?</h4>
                    <p className="text-white/90">
                      Get expert advice on investing in {selectedLocation.location}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/2347041754800?text=${encodeURIComponent(
                      `Hello De-Greenacres, I'm interested in investing in ${selectedLocation.location}, ${selectedLocation.state}. The market data looks promising. Please provide more information.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary bg-white text-forest hover:bg-ivory whitespace-nowrap"
                  >
                    Get Expert Advice
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
