'use client';

import { useState } from 'react';

export default function InvestmentCalculator() {
  const [calculatorType, setCalculatorType] = useState<'land' | 'rental' | 'mortgage'>('land');
  
  // Land Investment Calculator
  const [landPrice, setLandPrice] = useState(50000000);
  const [developmentCost, setDevelopmentCost] = useState(30000000);
  const [appreciationRate, setAppreciationRate] = useState(15);
  const [years, setYears] = useState(5);

  // Rental Income Calculator
  const [propertyValue, setPropertyValue] = useState(100000000);
  const [monthlyRent, setMonthlyRent] = useState(500000);
  const [occupancyRate, setOccupancyRate] = useState(90);
  const [maintenancePercent, setMaintenancePercent] = useState(10);

  // Mortgage Calculator
  const [loanAmount, setLoanAmount] = useState(50000000);
  const [interestRate, setInterestRate] = useState(18);
  const [loanTerm, setLoanTerm] = useState(20);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(2)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Land Investment Calculations
  const totalInvestment = landPrice + developmentCost;
  const projectedValue = totalInvestment * Math.pow(1 + appreciationRate / 100, years);
  const profit = projectedValue - totalInvestment;
  const roi = (profit / totalInvestment) * 100;

  // Rental Calculations
  const annualRent = monthlyRent * 12;
  const effectiveRent = annualRent * (occupancyRate / 100);
  const maintenanceCost = effectiveRent * (maintenancePercent / 100);
  const netIncome = effectiveRent - maintenanceCost;
  const rentalYield = (netIncome / propertyValue) * 100;

  // Mortgage Calculations
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
      <h2 className="text-2xl font-bold text-charcoal mb-6">Investment Calculator</h2>
      
      {/* Calculator Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => setCalculatorType('land')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            calculatorType === 'land'
              ? 'bg-magenta text-white'
              : 'bg-ivory text-gray-700 hover:bg-gray-100'
          }`}
        >
          Land Investment
        </button>
        <button
          onClick={() => setCalculatorType('rental')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            calculatorType === 'rental'
              ? 'bg-magenta text-white'
              : 'bg-ivory text-gray-700 hover:bg-gray-100'
          }`}
        >
          Rental Income
        </button>
        <button
          onClick={() => setCalculatorType('mortgage')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            calculatorType === 'mortgage'
              ? 'bg-magenta text-white'
              : 'bg-ivory text-gray-700 hover:bg-gray-100'
          }`}
        >
          Mortgage
        </button>
      </div>

      {/* Land Investment Calculator */}
      {calculatorType === 'land' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Land Price (₦)
              </label>
              <input
                type="number"
                value={landPrice}
                onChange={(e) => setLandPrice(Number(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(landPrice)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Development Cost (₦)
              </label>
              <input
                type="number"
                value={developmentCost}
                onChange={(e) => setDevelopmentCost(Number(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(developmentCost)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Annual Appreciation Rate (%)
              </label>
              <input
                type="number"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(Number(e.target.value))}
                className="input-field"
                step="0.5"
              />
              <p className="text-xs text-gray-500 mt-1">Typical: 10-20% in Nigeria</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Investment Period (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="input-field"
                min="1"
                max="30"
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-ivory to-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-charcoal mb-4">Investment Projection</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-xl font-bold text-charcoal">{formatCurrency(totalInvestment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Projected Value ({years} yrs)</p>
                <p className="text-xl font-bold text-magenta">{formatCurrency(projectedValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Profit</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(profit)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ROI</p>
                <p className="text-xl font-bold text-plum">{roi.toFixed(1)}%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                * These are estimates based on historical trends and should not be considered guarantees. 
                Actual returns may vary based on market conditions, location, and other factors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rental Income Calculator */}
      {calculatorType === 'rental' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Property Value (₦)
              </label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(propertyValue)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Monthly Rent (₦)
              </label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(monthlyRent)}/month</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Occupancy Rate (%)
              </label>
              <input
                type="number"
                value={occupancyRate}
                onChange={(e) => setOccupancyRate(Number(e.target.value))}
                className="input-field"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">Typical: 85-95%</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Maintenance & Expenses (%)
              </label>
              <input
                type="number"
                value={maintenancePercent}
                onChange={(e) => setMaintenancePercent(Number(e.target.value))}
                className="input-field"
                min="0"
                max="50"
              />
              <p className="text-xs text-gray-500 mt-1">Typical: 10-20%</p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-ivory to-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-charcoal mb-4">Rental Income Analysis</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gross Annual Rent</p>
                <p className="text-xl font-bold text-charcoal">{formatCurrency(annualRent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Effective Rent (after vacancy)</p>
                <p className="text-xl font-bold text-charcoal">{formatCurrency(effectiveRent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Annual Income</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(netIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Rental Yield</p>
                <p className="text-xl font-bold text-magenta">{rentalYield.toFixed(2)}%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Monthly Net Income:</span>{' '}
                <span className="font-bold text-green-600">{formatCurrency(netIncome / 12)}</span>
              </p>
              <p className="text-xs text-gray-500 italic">
                * Estimates based on typical Nigerian rental market conditions. Actual returns depend on 
                property location, condition, and management efficiency.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mortgage Calculator */}
      {calculatorType === 'mortgage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Loan Amount (₦)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(loanAmount)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Interest Rate (% per year)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="input-field"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">Nigerian rates: 15-22%</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Loan Term (Years)
              </label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="input-field"
                min="1"
                max="30"
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-ivory to-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-charcoal mb-4">Mortgage Breakdown</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                <p className="text-2xl font-bold text-magenta">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payment</p>
                <p className="text-xl font-bold text-charcoal">{formatCurrency(totalPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Principal</p>
                <p className="text-xl font-bold text-charcoal">{formatCurrency(loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalInterest)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Annual Payment:</span>{' '}
                <span className="font-bold text-charcoal">{formatCurrency(monthlyPayment * 12)}</span>
              </p>
              <p className="text-xs text-gray-500 italic">
                * This is an estimate. Actual mortgage terms depend on lender requirements, 
                credit assessment, and prevailing market rates in Nigeria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
