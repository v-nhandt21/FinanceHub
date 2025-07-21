import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Main LoanApp component for the loan calculator
function LoanApp() {
  // State variables for user inputs
  const [loanAmount, setLoanAmount] = useState(''); // Desired loan amount
  const [annualInterestRate, setAnnualInterestRate] = useState(''); // Annual interest rate (used for simple loan or initial fixed rate)
  const [fixedInterestRate, setFixedInterestRate] = useState(''); // Fixed interest rate
  const [fixedRatePeriodYears, setFixedRatePeriodYears] = useState(''); // Fixed interest rate period in years
  const [floatingInterestRate, setFloatingInterestRate] = useState(''); // Estimated floating interest rate
  const [loanTermYears, setLoanTermYears] = useState(''); // Loan term in years
  const [paymentMethod, setPaymentMethod] = useState('annuity'); // Payment method: 'annuity' or 'flat'

  // State variables for calculated results
  const [monthlyPayment, setMonthlyPayment] = useState(0); // Calculated monthly payment (initial payment)
  const [totalInterestPaid, setTotalInterestPaid] = useState(0); // Total interest paid over the loan term
  const [totalAmountPaid, setTotalAmountPaid] = useState(0); // Total amount paid (principal + interest)
  const [paymentSchedule, setPaymentSchedule] = useState([]); // Detailed payment schedule for each month
  const [error, setError] = useState(''); // Error message for invalid inputs

  // Effect hook to recalculate payments whenever inputs change
  useEffect(() => {
    calculateLoanPayments();
  }, [loanAmount, annualInterestRate, fixedInterestRate, fixedRatePeriodYears, floatingInterestRate, loanTermYears, paymentMethod]);

  // Function to calculate loan payments based on inputs
  const calculateLoanPayments = () => {
    // Clear previous errors and results
    setError('');
    setMonthlyPayment(0);
    setTotalInterestPaid(0);
    setTotalAmountPaid(0);
    setPaymentSchedule([]);

    // Parse input values as numbers
    const P = parseFloat(loanAmount); // Principal loan amount
    const yearsTotal = parseFloat(loanTermYears); // Total loan term in years

    // Input validation for core fields
    if (isNaN(P) || P <= 0) {
      setError('Số tiền muốn vay phải là số dương.');
      return;
    }
    if (isNaN(yearsTotal) || yearsTotal <= 0) {
      setError('Thời gian vay phải là số dương.');
      return;
    }

    const annualRateFixed = parseFloat(fixedInterestRate);
    const yearsFixed = parseFloat(fixedRatePeriodYears);
    const annualRateFloating = parseFloat(floatingInterestRate);

    // Input validation for new fields
    if (isNaN(annualRateFixed) || annualRateFixed < 0) {
      setError('Lãi suất cố định phải là số không âm.');
      return;
    }
    if (isNaN(yearsFixed) || yearsFixed < 0 || yearsFixed > yearsTotal) {
      setError('Thời gian lãi suất cố định phải là số không âm và không lớn hơn tổng thời gian vay.');
      return;
    }
    if (isNaN(annualRateFloating) || annualRateFloating < 0) {
      setError('Lãi thả nổi ước tính phải là số không âm.');
      return;
    }

    const nTotal = yearsTotal * 12; // Total number of months
    const nFixed = yearsFixed * 12; // Number of fixed rate months
    const nFloating = nTotal - nFixed; // Number of floating rate months

    let schedule = [];
    let currentBalance = P;
    let totalInterest = 0;
    let initialMonthlyPayment = 0; // To store the first monthly payment for display

    if (paymentMethod === 'annuity') {
      // Annuity method (Dư nợ giảm dần)
      const rFixed = annualRateFixed / 100 / 12;
      const rFloating = annualRateFloating / 100 / 12;

      // Calculate payments for the fixed rate period
      if (nFixed > 0) {
        let M_fixed;
        if (rFixed === 0) {
          M_fixed = P / nTotal;
        } else {
          // Payment is calculated over the *total* loan term, but with the fixed rate
          M_fixed = P * (rFixed * Math.pow(1 + rFixed, nTotal)) / (Math.pow(1 + rFixed, nTotal) - 1);
        }
        initialMonthlyPayment = M_fixed; // Set the initial payment for display

        for (let i = 1; i <= nFixed; i++) {
          const interestForMonth = currentBalance * rFixed;
          const principalForMonth = M_fixed - interestForMonth;
          currentBalance -= principalForMonth;
          if (currentBalance < 0) currentBalance = 0; // Prevent negative balance
          totalInterest += interestForMonth;

          schedule.push({
            month: i,
            principal: principalForMonth,
            interest: interestForMonth,
            totalPayment: M_fixed,
            remainingBalance: currentBalance,
            rateType: 'Cố định'
          });
        }
      }

      // Calculate payments for the floating rate period
      if (nFloating > 0) {
        const P_remaining = currentBalance; // Remaining balance after fixed period

        let M_floating;
        if (rFloating === 0) {
          M_floating = P_remaining / nFloating;
        } else {
          // Payment is calculated for the remaining balance over the remaining term
          M_floating = P_remaining * (rFloating * Math.pow(1 + rFloating, nFloating)) / (Math.pow(1 + rFloating, nFloating) - 1);
        }

        if (nFixed === 0) { // If there was no fixed period, the initial payment is the floating one
          initialMonthlyPayment = M_floating;
        }

        for (let i = nFixed + 1; i <= nTotal; i++) {
          const interestForMonth = currentBalance * rFloating;
          const principalForMonth = M_floating - interestForMonth;
          currentBalance -= principalForMonth;
          if (currentBalance < 0) currentBalance = 0; // Prevent negative balance
          totalInterest += interestForMonth;

          schedule.push({
            month: i,
            principal: principalForMonth,
            interest: interestForMonth,
            totalPayment: M_floating,
            remainingBalance: currentBalance,
            rateType: 'Thả nổi'
          });
        }
      }

    } else if (paymentMethod === 'flat') {
      // Flat method (Trả đều gốc + Lãi theo dư nợ ban đầu)
      const fixedPrincipalPerMonth = P / nTotal;

      // Fixed Rate Period
      if (nFixed > 0) {
        const fixedInterestPerMonth_fixed = (P * annualRateFixed / 100) / 12;
        const calculatedMonthlyPayment_fixed = fixedPrincipalPerMonth + fixedInterestPerMonth_fixed;
        initialMonthlyPayment = calculatedMonthlyPayment_fixed; // Set initial payment

        for (let i = 1; i <= nFixed; i++) {
          currentBalance -= fixedPrincipalPerMonth;
          if (currentBalance < 0) currentBalance = 0;
          totalInterest += fixedInterestPerMonth_fixed;

          schedule.push({
            month: i,
            principal: fixedPrincipalPerMonth,
            interest: fixedInterestPerMonth_fixed,
            totalPayment: calculatedMonthlyPayment_fixed,
            remainingBalance: currentBalance,
            rateType: 'Cố định'
          });
        }
      }

      // Floating Rate Period
      if (nFloating > 0) {
        const fixedInterestPerMonth_floating = (P * annualRateFloating / 100) / 12;
        const calculatedMonthlyPayment_floating = fixedPrincipalPerMonth + fixedInterestPerMonth_floating;

        if (nFixed === 0) { // If no fixed period, initial payment is floating one
          initialMonthlyPayment = calculatedMonthlyPayment_floating;
        }

        for (let i = nFixed + 1; i <= nTotal; i++) {
          currentBalance -= fixedPrincipalPerMonth;
          if (currentBalance < 0) currentBalance = 0;
          totalInterest += fixedInterestPerMonth_floating;

          schedule.push({
            month: i,
            principal: fixedPrincipalPerMonth,
            interest: fixedInterestPerMonth_floating,
            totalPayment: calculatedMonthlyPayment_floating,
            remainingBalance: currentBalance,
            rateType: 'Thả nổi'
          });
        }
      }
    }

    // Update state with calculated results
    setMonthlyPayment(initialMonthlyPayment);
    setTotalInterestPaid(totalInterest);
    setTotalAmountPaid(P + totalInterest);
    setPaymentSchedule(schedule);
  };

  // Helper function to format numbers as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 font-inter text-gray-800 flex flex-col items-center">
      {/* Main container now uses a grid layout for 3 columns on large screens */}
      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Changed max-w-7xl to max-w-full */}

        {/* Column 1: Input Form and Calculation Results */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-6">
              Công Cụ Tính Toán Khoản Vay
            </h1>

            {/* Input Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Loan Amount Input */}
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền muốn vay (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="loanAmount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Ví dụ: 500,000,000"
                  min="0"
                />
              </div>

              {/* Loan Term Input */}
              <div>
                <label htmlFor="loanTermYears" className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian vay (năm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="loanTermYears"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value)}
                  placeholder="Ví dụ: 10"
                  min="1"
                />
              </div>

              {/* Fixed Interest Rate Input */}
              <div>
                <label htmlFor="fixedInterestRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Lãi suất cố định (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="fixedInterestRate"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={fixedInterestRate}
                  onChange={(e) => setFixedInterestRate(e.target.value)}
                  placeholder="Ví dụ: 7.0"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Fixed Rate Period Input */}
              <div>
                <label htmlFor="fixedRatePeriodYears" className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian lãi suất cố định (năm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="fixedRatePeriodYears"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={fixedRatePeriodYears}
                  onChange={(e) => setFixedRatePeriodYears(e.target.value)}
                  placeholder="Ví dụ: 3"
                  min="0"
                />
              </div>

              {/* Estimated Floating Interest Rate Input */}
              <div>
                <label htmlFor="floatingInterestRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Lãi thả nổi ước tính (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="floatingInterestRate"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  value={floatingInterestRate}
                  onChange={(e) => setFloatingInterestRate(e.target.value)}
                  placeholder="Ví dụ: 9.0"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương pháp trả lãi <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="annuity"
                      checked={paymentMethod === 'annuity'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Trả góp (Annuity - Dư nợ giảm dần)</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="flat"
                      checked={paymentMethod === 'flat'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Trả đều gốc + Lãi theo dư nợ ban đầu (Flat)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Lỗi!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
          </div>

          {/* Calculation Results Section */}
          {monthlyPayment > 0 && (
            <div className="bg-blue-50 p-6 rounded-xl shadow-inner w-full">
              <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Kết Quả Tính Toán</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">Trả hàng tháng (Ban đầu)</p>
                  <p className="text-xl font-semibold text-blue-600">{formatCurrency(monthlyPayment)}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">Tổng lãi phải trả</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(totalInterestPaid)}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">Tổng số tiền đã trả</p>
                  <p className="text-xl font-semibold text-green-600">{formatCurrency(totalAmountPaid)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Chart Visualization */}
        {paymentSchedule.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full lg:col-span-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Biểu Đồ Thanh Toán Hàng Tháng</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={paymentSchedule}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="month"
                  label={{ value: "Tháng", position: "insideBottom", offset: 0, fill: '#4a5568' }}
                  tick={{ fill: '#4a5568' }}
                  axisLine={{ stroke: '#cbd5e0' }}
                  tickLine={{ stroke: '#cbd5e0' }}
                />
                <YAxis
                  label={{ value: "Số tiền (VND)", angle: -90, position: "insideLeft", fill: '#4a5568' }}
                  tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                  tick={{ fill: '#4a5568' }}
                  axisLine={{ stroke: '#cbd5e0' }}
                  tickLine={{ stroke: '#cbd5e0' }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Tháng ${label}`}
                  contentStyle={{ borderRadius: '8px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="principal"
                  stroke="#4299e1"
                  strokeWidth={2}
                  name="Gốc"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="interest"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Lãi"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalPayment"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Tổng trả"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Column 3: Payment Schedule Table */}
        {paymentSchedule.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full overflow-x-auto lg:col-span-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Lịch Trả Nợ Chi Tiết</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Tháng
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gốc (VND)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lãi (VND)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng trả (VND)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dư nợ còn lại (VND)
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    Loại lãi suất
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentSchedule.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(item.principal)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(item.interest)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(item.totalPayment)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(item.remainingBalance)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.rateType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanApp;
