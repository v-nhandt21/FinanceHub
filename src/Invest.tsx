import React, { useState } from 'react';
const InvestApp = () => {
    const [results, setResults] = useState(null);
    const [inputs, setInputs] = useState(null); // Store inputs to display in results

    // State for input fields
    const [inflationRate, setInflationRate] = useState(3); // %
    const [propertyGrowthRate, setPropertyGrowthRate] = useState(5); // %
    const [currentSavings, setCurrentSavings] = useState(1000000000); // VND
    const [loanAmount, setLoanAmount] = useState(0); // VND
    const [annualInterestRate, setAnnualInterestRate] = useState(7); // %
    const [loanType, setLoanType] = useState('mortgage'); // 'unsecured' or 'mortgage'
    const [repaymentMethod, setRepaymentMethod] = useState('annuity'); // 'annuity' or 'flat'
    const [loanTermYears, setLoanTermYears] = useState(10); // Years
    const [bankSavingsInterestRate, setBankSavingsInterestRate] = useState(5); // New: Lãi suất tiết kiệm ngân hàng hằng năm (%)
    const [monthlyRentalIncome, setMonthlyRentalIncome] = useState(0); // New: Thu nhập cho thuê BĐS hàng tháng (VND)


    // Function to handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            inflationRate: inflationRate / 100, // Convert to decimal
            propertyGrowthRate: propertyGrowthRate / 100, // Convert to decimal
            currentSavings,
            loanAmount,
            annualInterestRate: annualInterestRate / 100, // Convert to decimal
            loanType,
            repaymentMethod,
            loanTermYears,
            bankSavingsInterestRate: bankSavingsInterestRate / 100, // New: Convert to decimal
            monthlyRentalIncome // New: Pass monthly rental income
        };
        setInputs(data);
        const calculatedResults = calculateComparison(data);
        setResults(calculatedResults);
    };

    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper function to format percentage
    const formatPercentage = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    return (
        // Removed ThemeProvider and CssBaseline
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                <header className="bg-blue-600 text-white p-6 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Công Cụ So Sánh Vay & Không Vay Mua BĐS
                    </h1>
                    <p className="mt-2 text-lg opacity-90">Đưa ra quyết định tài chính thông minh hơn</p>
                </header>

                <main className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Input Form Section */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">
                            Nhập Thông Tin So Sánh
                        </h2>
                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            {/* Lạm phát đồng tiền */}
                            <div>
                                <label htmlFor="inflationRate" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Lạm phát đồng tiền hàng năm (%):
                                </label>
                                <input
                                    type="number"
                                    id="inflationRate"
                                    value={inflationRate}
                                    onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                    step="0.1"
                                />
                            </div>

                            {/* Mức tăng của BĐS */}
                            <div>
                                <label htmlFor="propertyGrowthRate" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Mức tăng BĐS hàng năm (%):
                                </label>
                                <input
                                    type="number"
                                    id="propertyGrowthRate"
                                    value={propertyGrowthRate}
                                    onChange={(e) => setPropertyGrowthRate(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                    step="0.1"
                                />
                            </div>

                            {/* Tài chính hiện có */}
                            <div>
                                <label htmlFor="currentSavings" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Tài chính hiện có (VND):
                                </label>
                                <input
                                    type="number"
                                    id="currentSavings"
                                    value={currentSavings}
                                    onChange={(e) => setCurrentSavings(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                />
                            </div>

                            {/* Số tiền vay */}
                            <div>
                                <label htmlFor="loanAmount" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Số tiền muốn vay (VND):
                                </label>
                                <input
                                    type="number"
                                    id="loanAmount"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                />
                            </div>

                            {/* Lãi suất vay hàng năm */}
                            <div>
                                <label htmlFor="annualInterestRate" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Lãi suất vay hàng năm (%):
                                </label>
                                <input
                                    type="number"
                                    id="annualInterestRate"
                                    value={annualInterestRate}
                                    onChange={(e) => setAnnualInterestRate(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                    step="0.1"
                                />
                            </div>

                            {/* Lãi suất tiết kiệm ngân hàng hằng năm */}
                            <div>
                                <label htmlFor="bankSavingsInterestRate" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Lãi suất tiết kiệm ngân hàng hàng năm (%):
                                </label>
                                <input
                                    type="number"
                                    id="bankSavingsInterestRate"
                                    value={bankSavingsInterestRate}
                                    onChange={(e) => setBankSavingsInterestRate(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                    step="0.1"
                                />
                            </div>

                            {/* Thu nhập cho thuê BĐS hàng tháng */}
                            <div>
                                <label htmlFor="monthlyRentalIncome" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Thu nhập cho thuê BĐS hàng tháng (VND):
                                </label> 
                                <input 
                                    type="number"
                                    id="monthlyRentalIncome"
                                    value={monthlyRentalIncome}
                                    onChange={(e) => setMonthlyRentalIncome(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="0"
                                    step="1000"
                                />
                            </div>


                            {/* Phương thức vay */}
                            <div>
                                <label htmlFor="loanType" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Phương thức vay:
                                </label>
                                <select
                                    id="loanType"
                                    value={loanType}
                                    onChange={(e) => setLoanType(e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                >
                                    <option value="mortgage">Thế chấp</option>
                                    <option value="unsecured">Tín chấp</option>
                                </select>
                            </div>

                            {/* Phương pháp trả lãi */}
                            <div>
                                <label htmlFor="repaymentMethod" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Phương pháp trả lãi:
                                </label>
                                <select
                                    id="repaymentMethod"
                                    value={repaymentMethod}
                                    onChange={(e) => setRepaymentMethod(e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                >
                                    <option value="annuity">Trả góp (Lãi cố định trên dư nợ giảm dần)</option>
                                    <option value="flat">Trả đều gốc + Lãi theo dư nợ ban đầu</option>
                                </select>
                            </div>

                            {/* Thời gian vay */}
                            <div>
                                <label htmlFor="loanTermYears" className="block text-gray-700 text-sm font-semibold mb-2">
                                    Thời gian vay (năm):
                                </label>
                                <input
                                    type="number"
                                    id="loanTermYears"
                                    value={loanTermYears}
                                    onChange={(e) => setLoanTermYears(parseFloat(e.target.value))}
                                    className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                                    min="1"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                So Sánh
                            </button>
                        </form>
                    </div>

                    {/* Results Display Section */}
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        {results ? (
                            <>
                                <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2 text-center">
                                    Kết Quả So Sánh
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Scenario 1: No Loan */}
                                    <div className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
                                        <h3 className="text-xl font-semibold mb-3 text-green-700">Trường hợp KHÔNG VAY</h3>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-green-800">Tài chính hiện có:</strong> {formatCurrency(inputs.currentSavings)}
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-green-800">Lãi suất tiết kiệm ngân hàng hàng năm:</strong> {formatPercentage(inputs.bankSavingsInterestRate)}
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-green-800">Giá trị tiền tiết kiệm sau {inputs.loanTermYears} năm:</strong>{' '}
                                            <span className="font-bold text-green-700">{formatCurrency(results.finalValueNoLoan)}</span>
                                            <span className="text-sm text-gray-500 block italic">(Đã điều chỉnh lạm phát)</span>
                                        </p>
                                    </div>

                                    {/* Scenario 2: With Loan */}
                                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 shadow-sm">
                                        <h3 className="text-xl font-semibold mb-3 text-purple-700">Trường hợp CÓ VAY</h3>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Số tiền vay:</strong> {formatCurrency(inputs.loanAmount)}
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Thu nhập cho thuê BĐS hàng tháng:</strong> {formatCurrency(inputs.monthlyRentalIncome)}
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Tổng tài sản ban đầu (Vay + Tự có):</strong>{' '}
                                            {formatCurrency(inputs.currentSavings + inputs.loanAmount)}
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Tổng số tiền đã trả (Gốc + Lãi):</strong>{' '}
                                            <span className="font-bold text-red-600">{formatCurrency(results.totalRepaid)}</span>
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Tổng lãi đã trả:</strong>{' '}
                                            <span className="font-bold text-red-500">{formatCurrency(results.totalInterestPaid)}</span>
                                        </p>
                                        {inputs.repaymentMethod === 'annuity' && results.monthlyPayment && (
                                            <p className="mb-2 text-gray-800">
                                                <strong className="text-purple-800">Tiền trả hàng tháng (Ước tính):</strong>{' '}
                                                <span className="font-bold text-blue-600">{formatCurrency(results.monthlyPayment)}</span>
                                            </p>
                                        )}
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Tổng thu nhập từ cho thuê (sau lạm phát):</strong>{' '}
                                            <span className="font-bold text-green-700">{formatCurrency(results.totalRentalIncomeAdjusted)}</span>
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Giá trị tài sản sau {inputs.loanTermYears} năm:</strong>{' '}
                                            <span className="font-bold text-purple-700">{formatCurrency(results.finalValueWithLoan)}</span>
                                            <span className="text-sm text-gray-500 block italic">(Đã điều chỉnh lạm phát)</span>
                                        </p>
                                        <p className="mb-2 text-gray-800">
                                            <strong className="text-purple-800">Giá trị ròng sau khi trả hết nợ (đã tính thu nhập cho thuê):</strong>{' '}
                                            <span className="font-bold text-blue-700">{formatCurrency(results.netValueAfterLoan)}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Conclusion */}
                                <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200 text-center">
                                    <h3 className="text-xl font-semibold mb-4 text-blue-800">Kết Luận So Sánh</h3>
                                    {results.gainFromBorrowing > 0 ? (
                                        <p className="text-green-700 text-lg sm:text-xl font-bold">
                                            🎉 Vay có lợi hơn không vay: Bạn có thêm{' '}
                                            <span className="text-2xl sm:text-3xl">{formatCurrency(results.gainFromBorrowing)}</span>
                                        </p>
                                    ) : (
                                        <p className="text-red-700 text-lg sm:text-xl font-bold">
                                            ⚠️ Không vay có lợi hơn vay: Bạn tiết kiệm được{' '}
                                            <span className="text-2xl sm:text-3xl">{formatCurrency(Math.abs(results.gainFromBorrowing))}</span>
                                        </p>
                                    )}
                                    <p className="text-gray-600 mt-4 italic text-sm">
                                        (Giá trị này thể hiện sự chênh lệch tài sản cuối cùng khi có vay so với khi không vay, đã tính đến lãi suất, lạm phát và thu nhập cho thuê.)
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-600 mt-8 text-lg">
                                Nhập thông tin vào biểu mẫu bên cạnh và nhấn "So Sánh" để xem kết quả.
                            </p>
                        )}
                    </div>
                </main>

                <footer className="bg-blue-600 text-white p-4 text-center text-sm opacity-90">
                    <p>Code generate with Gemini</p>
                </footer>
            </div>
        </div>
    );
};

/**
 * Calculates the comparison between borrowing and not borrowing for property investment.
 * @param {object} data - Input data from the form.
 * @param {number} data.inflationRate - Annual inflation rate (decimal, e.g., 0.03 for 3%).
 * @param {number} data.propertyGrowthRate - Annual property growth rate (decimal, e.g., 0.05 for 5%).
 * @param {number} data.currentSavings - Current available savings.
 * @param {number} data.loanAmount - Amount of money to be borrowed.
 * @param {number} data.annualInterestRate - Annual interest rate for the loan (decimal, e.g., 0.07 for 7%).
 * @param {string} data.repaymentMethod - Loan repayment method ('annuity' or 'flat').
 * @param {number} data.loanTermYears - Loan term in years.
 * @param {number} data.bankSavingsInterestRate - Annual bank savings interest rate (decimal, e.g., 0.05 for 5%).
 * @param {number} data.monthlyRentalIncome - New: Monthly property rental income.
 * @returns {object} Calculated comparison results.
 */
const calculateComparison = (data) => {
    const {
        inflationRate,
        propertyGrowthRate,
        currentSavings,
        loanAmount,
        annualInterestRate,
        repaymentMethod,
        loanTermYears,
        bankSavingsInterestRate,
        monthlyRentalIncome // New: Get monthly rental income
    } = data;

    const loanTermMonths = loanTermYears * 12;
    const monthlyInterestRate = annualInterestRate / 12;

    // --- Scenario 1: No Loan (Using only current savings for bank savings) ---
    // Calculate the real savings growth rate adjusted for inflation.
    // This represents the actual increase in purchasing power of the savings.
    const realSavingsGrowthRate = (1 + bankSavingsInterestRate) / (1 + inflationRate) - 1;

    // Calculate the final value of savings if only current savings are put into a bank account.
    const finalValueNoLoan = currentSavings * Math.pow(1 + realSavingsGrowthRate, loanTermYears);

    // --- Scenario 2: With Loan ---
    let totalInterestPaid = 0;
    let monthlyPayment = 0;
    let totalRepaid = 0;

    if (loanAmount > 0) {
        if (repaymentMethod === 'annuity') {
            // Annuity method (Dư nợ giảm dần): Fixed monthly payment, principal portion increases over time.
            // Formula for monthly payment (PMT): PMT = [P * i * (1 + i)^n] / [(1 + i)^n – 1]
            // P = principal loan amount
            // i = monthly interest rate
            // n = total number of payments
            if (monthlyInterestRate === 0) {
                // Handle zero interest rate to avoid division by zero
                monthlyPayment = loanAmount / loanTermMonths;
            } else {
                monthlyPayment =
                    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
                    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
            }

            totalRepaid = monthlyPayment * loanTermMonths;
            totalInterestPaid = totalRepaid - loanAmount;

        } else if (repaymentMethod === 'flat') {
            // Flat method (Trả đều gốc + Lãi theo dư nợ ban đầu): Fixed principal payment, interest reduces over time.
            const monthlyPrincipal = loanAmount / loanTermMonths;
            let outstandingBalance = loanAmount;

            for (let i = 0; i < loanTermMonths; i++) {
                const interestPayment = outstandingBalance * monthlyInterestRate;
                totalInterestPaid += interestPayment;
                outstandingBalance -= monthlyPrincipal; // Reduce principal consistently
            }
            totalRepaid = loanAmount + totalInterestPaid;
            // For flat method, monthly payment varies, so we don't calculate a single 'monthlyPayment' here.
            // The UI will only show total repaid.
        }
    }

    // Calculate the real property growth rate adjusted for inflation.
    // This is used for the property value in the 'With Loan' scenario.
    const realPropertyGrowthRate = (1 + propertyGrowthRate) / (1 + inflationRate) - 1;

    // Calculate the initial total investment if a loan is taken (current savings + loan amount).
    const initialInvestmentWithLoan = currentSavings + loanAmount;

    // Calculate the final value of the property purchased with the loan,
    // assuming it grows at the real property growth rate.
    const finalValueWithLoan = initialInvestmentWithLoan * Math.pow(1 + realPropertyGrowthRate, loanTermYears);

    // Calculate total rental income, adjusted for inflation
    let totalRentalIncomeAdjusted = 0;
    if (monthlyRentalIncome > 0) {
        // Assume rental income is received monthly and its real value remains constant (i.e., it increases with inflation)
        // or we can adjust it for inflation and then sum it up.
        // For simplicity, let's assume the monthly rental income is indexed to inflation.
        // The present value of an annuity (series of future payments)
        // or a simpler approach: sum up the future values of each monthly payment,
        // discounted by inflation, and then compounded by bank savings rate if saved.
        // A more straightforward approach for a high-level comparison: sum up the nominal monthly rentals
        // and then discount the total sum by the inflation over the period.

        // Simpler approach: Calculate total nominal rental income
        const totalNominalRentalIncome = monthlyRentalIncome * loanTermMonths;

        // Adjust total nominal rental income for inflation over the average period (loanTermYears / 2)
        // This is a rough approximation, more precise would be year-by-year discounting
        // Or, assume rental income keeps pace with inflation, so its real value is constant.
        // Let's assume the income is received and then immediately affected by inflation.
        // To get the real value of the total rental income over the loan term:
        // We can treat each month's rental income as growing with inflation and then sum them up.
        // Or, consider the real value of the monthly rental income: monthlyRentalIncome / (1 + inflationRate)^(year_of_income)
        // Let's use a simpler approach for now: total nominal rental income adjusted by inflation.
        // A more accurate way would be to treat each monthly rental income as a future cash flow that loses purchasing power.
        // However, for this high-level comparison, let's assume it grows with inflation (meaning its real value stays the same)
        // and contributes to the net value.

        // A common simplification is to treat rental income as a real income stream.
        // Total real rental income over the period.
        // Let's use the average real value for the period.
        // Alternatively, the income is used or saved, and its *net* effect is considered.

        // Let's model it as the sum of all monthly rental incomes, each adjusted for inflation at the point it's received.
        // Then, consider what that sum is worth at the end of the loan term.
        // A simpler way for total real value of rental income:
        // Assume rental income grows with inflation, so its purchasing power is constant.
        // Total rental income over the period, in today's money (real terms).
        totalRentalIncomeAdjusted = 0;
        // The income is received monthly. Let's assume it's saved at the bank savings rate.
        // So, it's the future value of an annuity of monthly rental incomes.
        const monthlyRentalIncomeReal = monthlyRentalIncome / (1 + inflationRate / 12); // Real value of one month's rent
        let futureValueRentalIncome = 0;

        // For simplicity and alignment with other calculations, let's assume rental income is received
        // and its *real value* is maintained (i.e., it grows with inflation).
        // Then, the total real rental income is simply the sum of all monthly payments.
        // If we want to consider the opportunity cost/gain of saving these rentals, we'd need a more complex model.
        // For now, let's calculate the total nominal rental income and then apply an average inflation adjustment.
        // Or, conceptually, the rental income is a positive cash flow that directly adds to your net worth.

        // Let's calculate the future value of monthly rental income as if it were saved at the bank savings rate,
        // and then adjust for inflation at the end.
        // This is effectively how much wealth the rental income contributes.
        let cumulativeRentalValue = 0;
        for (let m = 1; m <= loanTermMonths; m++) {
            // Future value of each monthly rental income, compounded at bank savings rate
            // and then adjusted for inflation at the end of the loan term.
            // This is complex. Let's simplify: monthly rental income as a direct offset to cost or a direct gain.
            // Its 'real' value over time: `monthlyRentalIncome / (1 + inflationRate)^(m/12)`
            // Sum of real values:
            const realValueCurrentMonthRental = monthlyRentalIncome / Math.pow(1 + inflationRate / 12, m);
            cumulativeRentalValue += realValueCurrentMonthRental;
        }
        // This cumulativeRentalValue is a 'present value' or 'real' sum of the rental income.
        // To make it comparable to 'finalValueWithLoan' (which is in future inflated terms),
        // we need to project this cumulative real value to the future.
        // If rental income increases with inflation, its real value per month is constant.
        // So, total real rental income is `monthlyRentalIncome * loanTermMonths`.
        // Then project this real sum to the future by multiplying by inflation:
        // totalRentalIncomeAdjusted = (monthlyRentalIncome * loanTermMonths) * Math.pow(1 + inflationRate, loanTermYears);

        // A more reasonable approach for a simple model: The rental income helps offset expenses or adds to assets.
        // If we assume the rental income is used to pay down the loan or saved, its contribution to the final net worth
        // needs to be considered.
        // Let's assume the **real value** of the monthly rental income is added to the net worth over time.
        // The simpler way for comparison would be to consider the *total nominal rental income*
        // and subtract it from the `totalRepaid` or add it to `netValueAfterLoan`.

        // Let's sum the *real* value of monthly rental income over the loan term
        // and then see how it impacts the final net value.
        // We need to calculate the future value of an annuity of monthly rental incomes,
        // considering inflation and bank savings rate. This becomes complicated quickly.

        // Let's assume the rental income itself grows with inflation, so its *real* value is constant month-to-month.
        // Then the total real rental income over the loan term is `monthlyRentalIncome * loanTermMonths`.
        // To get its future nominal value (comparable to `finalValueWithLoan`), we multiply by inflation.
        totalRentalIncomeAdjusted = monthlyRentalIncome * loanTermMonths; // This is nominal
        // To get its value in today's purchasing power, we would divide.
        // For comparison purposes, let's keep everything in future nominal values where possible.
        // The rental income offsets the costs. So, it effectively increases the value of the 'with loan' scenario.

        // Let's consider the total nominal rental income over the loan term
        // and add it to the final asset value before comparing.
        // This is a direct cash inflow.
        totalRentalIncomeAdjusted = 0;
        for (let i = 0; i < loanTermYears; i++) {
            // Annual rental income, adjusted for inflation year by year
            const annualRentalNominal = monthlyRentalIncome * 12;
            const rentalIncomeThisYear = annualRentalNominal * Math.pow(1 + inflationRate, i);
            totalRentalIncomeAdjusted += rentalIncomeThisYear;
        }
    }


    // Calculate the net value after repaying the loan:
    // Final property value + Total real rental income - Total amount repaid (principal + interest).
    // The `totalRentalIncomeAdjusted` is essentially the accumulated *nominal* value of the rental income.
    const netValueAfterLoan = finalValueWithLoan + totalRentalIncomeAdjusted - totalRepaid;


    // Calculate the gain/loss from borrowing compared to not borrowing.
    // A positive value means borrowing was more beneficial.
    const gainFromBorrowing = netValueAfterLoan - finalValueNoLoan;

    return {
        finalValueNoLoan,
        totalRepaid,
        totalInterestPaid,
        finalValueWithLoan,
        netValueAfterLoan,
        totalRentalIncomeAdjusted, // New: Return total adjusted rental income
        gainFromBorrowing,
        monthlyPayment: repaymentMethod === 'annuity' ? monthlyPayment : null, // Monthly payment only relevant for annuity
        loanTermMonths
    };
};

export default InvestApp;