import React, { useState } from 'react';

import InvestApp from './Invest';

import LoanApp from './Loan';

import DepositApp from './Deposit';

import PITApp from './PIT';
// Placeholder for new tools
const BudgetTrackerApp = () => {
     return (
       <div className="p-6 bg-white rounded-lg shadow-lg text-center">
         <h2 className="text-2xl font-bold text-green-700 mb-4">Nội dung Công Cụ Quản Lý Ngân Sách Cá Nhân</h2>
         <p className="text-gray-700">Quản lý thu nhập và chi tiêu của bạn một cách hiệu quả.</p>
         <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
           Bắt đầu Quản lý Ngân sách
         </button>
       </div>
     );
   };
   
   
   const SavingsGoalApp = () => {
     return (
       <div className="p-6 bg-white rounded-lg shadow-lg text-center">
         <h2 className="text-2xl font-bold text-yellow-700 mb-4">Nội dung Công Cụ Đặt Mục Tiêu Tiết Kiệm</h2>
         <p className="text-gray-700">Đặt và theo dõi các mục tiêu tiết kiệm của bạn.</p>
         <button className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
           Đặt Mục Tiêu Tiết Kiệm
         </button>
       </div>
     );
   };
   
   const TaxEstimatorApp = () => {
     return (
       <div className="p-6 bg-white rounded-lg shadow-lg text-center">
         <h2 className="text-2xl font-bold text-blue-700 mb-4">Nội dung Công Cụ Ước Tính Thuế</h2>
         <p className="text-gray-700">Ước tính số thuế bạn cần nộp.</p>
         <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
           Ước Tính Thuế
         </button>
       </div>
     );
   };
   
   const InsuranceAdvisorApp = () => {
     return (
       <div className="p-6 bg-white rounded-lg shadow-lg text-center">
         <h2 className="text-2xl font-bold text-orange-700 mb-4">Nội dung Công Cụ Tư Vấn Bảo Hiểm</h2>
         <p className="text-gray-700">Tìm kiếm các gói bảo hiểm phù hợp với nhu cầu của bạn.</p>
         <button className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
           Tư Vấn Bảo Hiểm
         </button>
       </div>
     );
   };
   
   // New tool: Currency Converter App
   const CurrencyConverterApp = () => {
     return (
       <div className="p-6 bg-white rounded-lg shadow-lg text-center">
         <h2 className="text-2xl font-bold text-pink-700 mb-4">Nội dung Công Cụ Quy Đổi Ngoại Tệ</h2>
         <p className="text-gray-700">Chuyển đổi giữa các loại tiền tệ khác nhau với tỷ giá hối đoái cập nhật.</p>
         <button className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
           Quy Đổi Ngoại Tệ Ngay
         </button>
       </div>
     );
   };
   
   // Main App component for navigation
   const App = () => {
     // State to manage which component is currently displayed
     const [activeTool, setActiveTool] = useState('home'); // 'home', 'invest', 'loan', 'budget', 'deposit', 'pit', 'savings', 'tax', 'insurance', 'currency'
   
     const renderContent = () => {
       switch (activeTool) {
         case 'invest':
           return <InvestApp />;
         case 'loan':
           return <LoanApp />;
         case 'budget':
           return <BudgetTrackerApp />;
         case 'deposit':
           return <DepositApp />;
         case 'pit':
           return <PITApp />;
         case 'savings':
           return <SavingsGoalApp />;
         case 'tax':
           return <TaxEstimatorApp />;
         case 'insurance':
           return <InsuranceAdvisorApp />;
         case 'currency': // New case for Currency Converter
           return <CurrencyConverterApp />;
         case 'home':
         default:
           return (
             <div className="p-6 bg-white rounded-lg shadow-lg text-center">
               <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Chào mừng đến với Các Công Cụ Tài Chính của bạn</h2>
               <p className="text-lg text-gray-600 mb-6">Chọn một công cụ từ các tùy chọn dưới đây:</p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                 {/* InvestApp Card */}
                 <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-indigo-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-indigo-800 mb-3">InvestApp</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ So Sánh Vay & Không Vay Mua BĐS, Đưa ra quyết định tài chính thông minh hơn với các chỉ số tiềm năng tăng, lạm phát, lợi nhuận cho thuê, lãi vay, ...
                   </p>
                   <button
                     onClick={() => setActiveTool('invest')}
                     className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến InvestApp
                   </button>
                 </div>
   
                 {/* LoanApp Card */}
                 <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow-lg border border-teal-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-teal-800 mb-3">LoanApp</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Tính Toán Khoản Vay hỗ trợ các chỉ số Lãi thả nổi ước tính, Lãi suất và thời gian cố định, Phương pháp trả lãi
                   </p>
                   <button
                     onClick={() => setActiveTool('loan')}
                     className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến LoanApp
                   </button>
                 </div>
   
                 {/* New Tools */}
                 {/* BudgetTrackerApp Card */}
                 <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-green-800 mb-3">Budget Tracker</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Quản Lý Ngân Sách Cá Nhân - Theo dõi thu nhập và chi tiêu, giúp bạn kiểm soát tài chính hiệu quả.
                   </p>
                   <button
                     onClick={() => setActiveTool('budget')}
                     className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến Budget Tracker
                   </button>
                 </div>
   
                 {/* RetirementPlannerApp Card */}
                 <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-purple-800 mb-3">DepositApp</h3>
                   <p className="text-gray-700 text-center mb-6">
                   Công cụ tính toán tiết kiệm dựa trên số tiền gửi, lãi suất và kì hạn.
                   </p>
                   <button
                     onClick={() => setActiveTool('deposit')}
                     className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến DepositApp
                   </button>
                 </div>
   
                 {/* DebtCalculatorApp Card */}
                 <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border border-red-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-red-800 mb-3">PITApp</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Tính Personal income tax, lương Gross và Net sau khi khấu trừ gia cảnh và bảo hiểm
                   </p>
                   <button
                     onClick={() => setActiveTool('pit')}
                     className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến PITApp
                   </button>
                 </div>
   
                 {/* SavingsGoalApp Card */}
                 <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-yellow-800 mb-3">Savings Goal</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Đặt Mục Tiêu Tiết Kiệm - Đặt ra các mục tiêu tiết kiệm và theo dõi tiến độ đạt được.
                   </p>
                   <button
                     onClick={() => setActiveTool('savings')}
                     className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến Savings Goal
                   </button>
                 </div>
   
                 {/* TaxEstimatorApp Card */}
                 <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-blue-800 mb-3">Tax Estimator</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Ước Tính Thuế - Ước tính số thuế phải nộp dựa trên thu nhập và các khoản khấu trừ.
                   </p>
                   <button
                     onClick={() => setActiveTool('tax')}
                     className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến Tax Estimator
                   </button>
                 </div>
   
                 {/* InsuranceAdvisorApp Card */}
                 <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-orange-800 mb-3">Insurance Advisor</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Tư Vấn Bảo Hiểm - Đánh giá nhu cầu bảo hiểm của bạn và đề xuất các gói bảo hiểm phù hợp.
                   </p>
                   <button
                     onClick={() => setActiveTool('insurance')}
                     className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến Insurance Advisor
                   </button>
                 </div>
   
                 {/* CurrencyConverterApp Card - New Tool */}
                 <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl shadow-lg border border-pink-200 flex flex-col items-center">
                   <h3 className="text-2xl font-bold text-pink-800 mb-3">Quy Đổi Ngoại Tệ</h3>
                   <p className="text-gray-700 text-center mb-6">
                     Công Cụ Quy Đổi Ngoại Tệ - Chuyển đổi giữa các loại tiền tệ khác nhau với tỷ giá hối đoái cập nhật.
                   </p>
                   <button
                     onClick={() => setActiveTool('currency')}
                     className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 w-full sm:w-auto"
                   >
                     Đi đến Quy Đổi Ngoại Tệ
                   </button>
                 </div>
               </div>
             </div>
           );
       }
     };
   
     return (
       <div className="min-h-screen bg-gray-100 font-sans antialiased flex flex-col items-center py-10 w-full">
         {/* Tailwind CSS CDN - IMPORTANT for styling */}
         <script src="https://cdn.tailwindcss.com"></script>
         <div className="w-full px-4">
           {/* Navigation Bar */}
           <nav className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8 flex justify-between items-center flex-wrap">
             <h1 className="text-white text-3xl font-extrabold mb-2 sm:mb-0">My Financial Hub</h1>
             <div className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4">
               <button
                 onClick={() => setActiveTool('home')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'home' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 Trang Chủ
               </button>
               <button
                 onClick={() => setActiveTool('invest')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'invest' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 InvestApp
               </button>
               <button
                 onClick={() => setActiveTool('loan')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'loan' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 LoanApp
               </button>
               <button
                 onClick={() => setActiveTool('budget')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'budget' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 Quản Lý Ngân Sách
               </button>
               <button
                 onClick={() => setActiveTool('deposit')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'deposit' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 DepositApp
               </button>
               <button
                 onClick={() => setActiveTool('pit')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'pit' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 PITApp
               </button>
               <button
                 onClick={() => setActiveTool('savings')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'savings' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 Mục Tiêu Tiết Kiệm
               </button>
               <button
                 onClick={() => setActiveTool('tax')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'tax' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 Ước Tính Thuế
               </button>
               <button
                 onClick={() => setActiveTool('insurance')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'insurance' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 Tư Vấn Bảo Hiểm
               </button>
               <button
                 onClick={() => setActiveTool('currency')}
                 className={`px-4 py-2 rounded-md text-lg font-medium transition duration-300 ease-in-out
                   ${activeTool === 'currency' ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
               >
                 Quy Đổi Ngoại Tệ
               </button>
             </div>
           </nav>
   
           {/* Content Area */}
           <main className="bg-gray-50 p-8 rounded-lg shadow-xl">
             {renderContent()}
           </main>
         </div>
       </div>
     );
   };
   
   export default App;