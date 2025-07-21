import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Hàm định dạng số tiền sang định dạng VND
const formatCurrencyVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const DepositApp: React.FC = () => {
  // State cho các giá trị đầu vào
  const [depositAmount, setDepositAmount] = useState<number>(1000000); // Mặc định 1 triệu VND
  const [interestRate, setInterestRate] = useState<number>(5); // Mặc định 5%
  const [depositTerm, setDepositTerm] = useState<number>(12); // Mặc định 12 tháng
  const [calculationMethod, setCalculationMethod] = useState<'compound' | 'simple'>('compound'); // Mặc định lãi kép

  // State cho kết quả tính toán
  const [calculatedInterest, setCalculatedInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]); // State cho dữ liệu biểu đồ

  // Hàm tính toán lãi suất và tạo dữ liệu biểu đồ
  const calculateInterestAndGenerateChartData = useCallback(() => {
    const rateDecimal = interestRate / 100;
    const data = [];
    let finalCalculatedInterest = 0;
    let finalTotalAmount = 0;

    // Thêm điểm dữ liệu ban đầu (tháng 0)
    data.push({
      month: 0,
      totalAmount: depositAmount,
      interestEarned: 0,
    });

    if (calculationMethod === 'simple') {
      // Tính lãi đơn
      const annualInterest = depositAmount * rateDecimal;
      for (let i = 1; i <= depositTerm; i++) {
        const interestEarnedUpToMonth = annualInterest * (i / 12);
        const totalAmountUpToMonth = depositAmount + interestEarnedUpToMonth;
        data.push({
          month: i,
          totalAmount: totalAmountUpToMonth,
          interestEarned: interestEarnedUpToMonth,
        });
      }
      finalCalculatedInterest = annualInterest * (depositTerm / 12);
      finalTotalAmount = depositAmount + finalCalculatedInterest;
    } else {
      // Tính lãi kép (phương thức hiện tại)
      const monthlyRate = rateDecimal / 12;
      let currentAmount = depositAmount;
      for (let i = 1; i <= depositTerm; i++) {
        const interestThisMonth = currentAmount * monthlyRate;
        currentAmount += interestThisMonth;
        data.push({
          month: i,
          totalAmount: currentAmount,
          interestEarned: currentAmount - depositAmount,
        });
      }
      finalCalculatedInterest = currentAmount - depositAmount;
      finalTotalAmount = currentAmount;
    }

    setCalculatedInterest(finalCalculatedInterest);
    setTotalAmount(finalTotalAmount);
    setChartData(data);
  }, [depositAmount, interestRate, depositTerm, calculationMethod]);

  // Gọi hàm tính toán mỗi khi các giá trị đầu vào thay đổi
  useEffect(() => {
    calculateInterestAndGenerateChartData();
  }, [calculateInterestAndGenerateChartData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4 font-sans w-full">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mb-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Công cụ tính toán tiết kiệm
        </h1>

        {/* Số tiền gửi */}
        <div className="mb-6">
          <label htmlFor="depositAmount" className="block text-lg font-semibold text-gray-700 mb-2">
            1. Số tiền gửi <span className="text-sm text-gray-500">(VND)</span>
          </label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Math.max(0, Math.min(10000000000, Number(e.target.value))))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
            min="0"
            max="10000000000"
            step="1000000" // Bước nhảy 1 triệu VND
          />
          <input
            type="range"
            id="depositAmountRange"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            min="0"
            max="10000000000"
            step="1000000" // Bước nhảy 1 triệu VND
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{formatCurrencyVND(0)}</span>
            <span>{formatCurrencyVND(10000000000)}</span>
          </div>
        </div>

        {/* Lãi suất gửi */}
        <div className="mb-6">
          <label htmlFor="interestRate" className="block text-lg font-semibold text-gray-700 mb-2">
            2. Lãi suất gửi <span className="text-sm text-gray-500">(%)</span>
          </label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
            min="1"
            max="20"
            step="0.1"
          />
          <input
            type="range"
            id="interestRateRange"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min="1"
            max="20"
            step="0.1"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>1%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Kỳ hạn gửi */}
        <div className="mb-8">
          <label htmlFor="depositTerm" className="block text-lg font-semibold text-gray-700 mb-2">
            3. Kỳ hạn gửi <span className="text-sm text-gray-500">(tháng)</span>
          </label>
          <input
            type="number"
            id="depositTerm"
            value={depositTerm}
            onChange={(e) => setDepositTerm(Math.max(1, Math.min(300, Number(e.target.value))))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
            min="1"
            max="300"
            step="1"
          />
          <input
            type="range"
            id="depositTermRange"
            value={depositTerm}
            onChange={(e) => setDepositTerm(Number(e.target.value))}
            min="1"
            max="300"
            step="1"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>1 tháng</span>
            <span>300 tháng</span>
          </div>
        </div>

        {/* Phương thức tính lãi */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            4. Phương thức tính lãi
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="calculationMethod"
                value="compound"
                checked={calculationMethod === 'compound'}
                onChange={() => setCalculationMethod('compound')}
              />
              <span className="ml-2 text-gray-700 text-lg">Lãi kép</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                name="calculationMethod"
                value="simple"
                checked={calculationMethod === 'simple'}
                onChange={() => setCalculationMethod('simple')}
              />
              <span className="ml-2 text-gray-700 text-lg">Lãi đơn</span>
            </label>
          </div>
        </div>

        {/* Kết quả */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-inner border border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Kết quả lãi gửi tiết kiệm</h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">Số tiền lãi nhận được:</span>
            <span className="text-blue-700 font-bold text-xl">
              {formatCurrencyVND(calculatedInterest)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Tổng số tiền nhận được khi đến hạn:</span>
            <span className="text-blue-700 font-bold text-xl">
              {formatCurrencyVND(totalAmount)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            (*) Lãi tiền gửi ước tính theo phương thức {calculationMethod === 'compound' ? 'trả lãi cuối kỳ (lãi kép)' : 'lãi đơn'}
          </p>
        </div>
      </div>

      {/* Biểu đồ tăng trưởng */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
          Biểu đồ tăng trưởng tiền tiết kiệm
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: "Kỳ hạn (tháng)", position: "insideBottom", offset: -5 }} />
            <YAxis
              tickFormatter={(value) => formatCurrencyVND(value)}
              label={{ value: "Số tiền (VND)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value: number) => formatCurrencyVND(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Tổng số tiền"
            />
            <Line
              type="monotone"
              dataKey="interestEarned"
              stroke="#82ca9d"
              name="Tiền lãi nhận được"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepositApp;
