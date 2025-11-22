import React, { useState, useEffect } from 'react';

const EMICalculator = ({ propertyPrice }) => {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 80% of property price
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2); // 20% down payment
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Update loan amount when down payment changes
  useEffect(() => {
    const calculatedLoanAmount = propertyPrice - downPayment;
    setLoanAmount(calculatedLoanAmount > 0 ? calculatedLoanAmount : 0);
  }, [downPayment, propertyPrice]);

  // Calculate EMI whenever inputs change
  useEffect(() => {
    if (loanAmount > 0 && interestRate > 0 && loanTenure > 0) {
      const monthlyRate = interestRate / 12 / 100;
      const numPayments = loanTenure * 12;
      
      const emiAmount = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      const totalAmountPaid = emiAmount * numPayments;
      const totalInterestPaid = totalAmountPaid - loanAmount;
      
      setEmi(Math.round(emiAmount));
      setTotalInterest(Math.round(totalInterestPaid));
      setTotalAmount(Math.round(totalAmountPaid));
    }
  }, [loanAmount, interestRate, loanTenure]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        EMI Calculator
      </h3>
      
      <div className="space-y-4">
        {/* Property Price Display */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Price</label>
          <div className="text-lg font-semibold text-blue-600">
            {formatCurrency(propertyPrice)}
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment ({((downPayment / propertyPrice) * 100).toFixed(0)}%)
          </label>
          <input
            type="range"
            min={propertyPrice * 0.1}
            max={propertyPrice * 0.5}
            step={50000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatCurrency(propertyPrice * 0.1)}</span>
            <span className="font-medium text-gray-700">{formatCurrency(downPayment)}</span>
            <span>{formatCurrency(propertyPrice * 0.5)}</span>
          </div>
        </div>

        {/* Loan Amount Display */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
          <div className="text-lg font-semibold text-gray-800">
            {formatCurrency(loanAmount)}
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate ({interestRate}% p.a.)
          </label>
          <input
            type="range"
            min="6"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6%</span>
            <span className="font-medium text-gray-700">{interestRate}%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Tenure ({loanTenure} years)
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5 years</span>
            <span className="font-medium text-gray-700">{loanTenure} years</span>
            <span>30 years</span>
          </div>
        </div>

        {/* EMI Results */}
        <div className="border-t pt-4 space-y-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Monthly EMI</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(emi)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">Total Interest</div>
              <div className="text-sm font-semibold text-orange-600">
                {formatCurrency(totalInterest)}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">Total Amount</div>
              <div className="text-sm font-semibold text-purple-600">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Loan Breakdown Chart */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Loan Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Principal Amount</span>
              </div>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Interest Amount</span>
              </div>
              <span className="font-medium">{formatCurrency(totalInterest)}</span>
            </div>
          </div>
          
          {/* Visual Progress Bar */}
          <div className="mt-3 h-4 bg-gray-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-blue-500" 
              style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
            ></div>
            <div 
              className="bg-orange-500" 
              style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="border-t pt-4 space-y-2">
          <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
            Apply for Loan
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Get Pre-Approval
          </button>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center border-t pt-3">
          * This is an approximate calculation. Actual EMI may vary based on bank policies and credit score.
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;