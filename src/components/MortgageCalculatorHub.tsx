'use client';

import { DemoBanner } from '@/components/DemoBadge';

import { useState } from 'react';

interface Bank {
  name: string;
  logo: string;
  minRate: number;
  maxRate: number;
  maxTenure: number;
  maxLTV: number; // Loan to Value
  minIncome: number;
  processingFee: number;
  features: string[];
}

const nigerianBanks: Bank[] = [
  {
    name: 'First Bank of Nigeria',
    logo: '🏦',
    minRate: 16,
    maxRate: 21,
    maxTenure: 20,
    maxLTV: 75,
    minIncome: 500000,
    processingFee: 1.5,
    features: ['Flexible repayment', 'Balloon payment option', 'Top-up facility']
  },
  {
    name: 'Access Bank',
    logo: '🏛️',
    minRate: 15,
    maxRate: 20,
    maxTenure: 25,
    maxLTV: 80,
    minIncome: 400000,
    processingFee: 1.0,
    features: ['Quick approval', 'Online application', 'Fixed & variable rates']
  },
  {
    name: 'GTBank',
    logo: '🏢',
    minRate: 17,
    maxRate: 22,
    maxTenure: 20,
    maxLTV: 70,
    minIncome: 600000,
    processingFee: 1.5,
    features: ['Digital platform', 'Competitive rates', 'Flexible terms']
  },
  {
    name: 'UBA',
    logo: '🏦',
    minRate: 16,
    maxRate: 21,
    maxTenure: 20,
    maxLTV: 75,
    minIncome: 500000,
    processingFee: 1.0,
    features: ['Nationwide branches', 'Quick disbursement', 'Insurance included']
  },
  {
    name: 'Zenith Bank',
    logo: '🏛️',
    minRate: 15,
    maxRate: 20,
    maxTenure: 25,
    maxLTV: 80,
    minIncome: 450000,
    processingFee: 1.0,
    features: ['Premium service', 'Long tenure', 'Competitive rates']
  },
  {
    name: 'Fidelity Bank',
    logo: '🏢',
    minRate: 17,
    maxRate: 22,
    maxTenure: 15,
    maxLTV: 70,
    minIncome: 350000,
    processingFee: 1.5,
    features: ['SME friendly', 'Fast approval', 'Flexible repayment']
  }
];

interface MortgageCalculation {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function MortgageCalculatorHub() {
  const [propertyValue, setPropertyValue] = useState<number>(50000000);
  const [downPayment, setDownPayment] = useState<number>(20);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(1000000);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const loanAmount = propertyValue * (1 - downPayment / 100);

  const calculateMortgage = (rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = loanTenure * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule (yearly)
    const amortization = [];
    let balance = loanAmount;
    
    for (let year = 1; year <= loanTenure; year++) {
      const yearStartBalance = balance;
      let yearPrincipal = 0;
      let yearInterest = 0;
      
      for (let month = 0; month < 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearInterest += interestPayment;
        yearPrincipal += principalPayment;
        balance -= principalPayment;
      }
      
      amortization.push({
        year,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.round(balance)
      });
    }

    return {
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      amortization
    };
  };

  const handleCalculate = (bank: Bank) => {
    setSelectedBank(bank);
    const avgRate = (bank.minRate + bank.maxRate) / 2;
    const result = calculateMortgage(avgRate);
    setCalculation(result);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(2)}B`;
    }
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(2)}M`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const getEligibleBanks = () => {
    return nigerianBanks.filter(bank => {
      const minDownPayment = propertyValue * (1 - bank.maxLTV / 100);
      return downPayment * propertyValue / 100 >= minDownPayment && 
             monthlyIncome >= bank.minIncome &&
             loanTenure <= bank.maxTenure;
    });
  };

  const eligibleBanks = getEligibleBanks();

  return (
    <>
      <DemoBanner description="Mortgage Hub — Preview rates from 6 banks with sample calculations. Live bank APIs will be integrated." />
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-charcoal mb-4">Mortgage Calculator Hub</h2>
            <p className="text-lg text-gray-600">
              Compare mortgage options from top Nigerian banks and find the best deal
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <h3 className="text-xl font-bold text-charcoal mb-6">Loan Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Property Value
                    </label>
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(Number(e.target.value))}
                      className="input-field"
                      step="1000000"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {formatCurrency(propertyValue)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Down Payment (%)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">{downPayment}%</span>
                      <span className="font-bold text-forest">
                        {formatCurrency(propertyValue * downPayment / 100)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Loan Tenure (Years)
                    </label>
                    <select
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="input-field"
                    >
                      {[5, 10, 15, 20, 25].map(years => (
                        <option key={years} value={years}>{years} years</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Monthly Income
                    </label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="input-field"
                      step="50000"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {formatCurrency(monthlyIncome)}/month
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Loan Amount:</span>
                      <span className="font-bold text-charcoal">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Debt-to-Income:</span>
                      <span className={`font-bold ${
                        calculation && calculation.monthlyPayment > monthlyIncome * 0.4 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {calculation 
                          ? `${((calculation.monthlyPayment / monthlyIncome) * 100).toFixed(1)}%`
                          : '-'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Comparison */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-charcoal">
                    {showComparison ? 'Compare Banks' : 'Eligible Banks'}
                  </h3>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="text-sm text-forest hover:text-forest-600 font-semibold"
                  >
                    {showComparison ? 'Show Eligible Only' : 'Show All Banks'}
                  </button>
                </div>

                <div className="space-y-4">
                  {(showComparison ? nigerianBanks : eligibleBanks).map((bank, index) => {
                    const avgRate = (bank.minRate + bank.maxRate) / 2;
                    const preview = calculateMortgage(avgRate);
                    const isEligible = eligibleBanks.includes(bank);

                    return (
                      <div
                        key={index}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          selectedBank?.name === bank.name
                            ? 'border-forest bg-forest/5'
                            : isEligible
                            ? 'border-gray-200 hover:border-forest'
                            : 'border-gray-200 opacity-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{bank.logo}</div>
                            <div>
                              <h4 className="font-bold text-charcoal">{bank.name}</h4>
                              <div className="text-sm text-gray-600">
                                {bank.minRate}% - {bank.maxRate}% interest rate
                              </div>
                            </div>
                          </div>
                          {!isEligible && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              Not Eligible
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Monthly Payment</div>
                            <div className="text-lg font-bold text-forest">
                              {formatCurrency(preview.monthlyPayment)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Max Tenure</div>
                            <div className="text-lg font-bold text-charcoal">
                              {bank.maxTenure} years
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Max LTV</div>
                            <div className="text-lg font-bold text-charcoal">
                              {bank.maxLTV}%
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {bank.features.map((feature, i) => (
                            <span
                              key={i}
                              className="text-xs bg-ivory text-charcoal px-2 py-1 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => isEligible && handleCalculate(bank)}
                          disabled={!isEligible}
                          className={`w-full py-2 rounded-lg font-semibold transition-all ${
                            isEligible
                              ? 'btn-primary'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {selectedBank?.name === bank.name ? 'Selected' : 'Calculate with This Bank'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calculation Results */}
              {calculation && selectedBank && (
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h3 className="text-xl font-bold text-charcoal mb-6">
                    Mortgage Breakdown - {selectedBank.name}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-forest/5 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                      <div className="text-2xl font-bold text-forest">
                        {formatCurrency(calculation.monthlyPayment)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-ivory rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Total Payment</div>
                      <div className="text-2xl font-bold text-charcoal">
                        {formatCurrency(calculation.totalPayment)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-ivory rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(calculation.totalInterest)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-ivory rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Processing Fee</div>
                      <div className="text-2xl font-bold text-charcoal">
                        {formatCurrency(loanAmount * selectedBank.processingFee / 100)}
                      </div>
                    </div>
                  </div>

                  {/* Amortization Chart */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-charcoal mb-4">Amortization Schedule</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {calculation.amortization.map((year) => (
                        <div key={year.year} className="flex items-center gap-4 p-3 bg-ivory rounded-lg">
                          <div className="font-bold text-charcoal w-16">Year {year.year}</div>
                          <div className="flex-1">
                            <div className="flex gap-2 h-4 rounded-full overflow-hidden bg-gray-200">
                              <div
                                className="bg-forest"
                                style={{
                                  width: `${(year.principal / (year.principal + year.interest)) * 100}%`
                                }}
                              />
                              <div
                                className="bg-red-400"
                                style={{
                                  width: `${(year.interest / (year.principal + year.interest)) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-sm text-right w-32">
                            <div className="text-forest">P: {formatCurrency(year.principal)}</div>
                            <div className="text-red-600">I: {formatCurrency(year.interest)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-6 border-t border-gray-200">
                    <a
                      href={`https://wa.me/2347041754800?text=${encodeURIComponent(
                        `Hello De-Greenacres, I'm interested in a mortgage from ${selectedBank.name} for a property valued at ${formatCurrency(propertyValue)}. Monthly payment: ${formatCurrency(calculation.monthlyPayment)}. Please provide more information.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full"
                    >
                      Apply for This Mortgage
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
      </>
  );
}
