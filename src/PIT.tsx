import React, { useState, useEffect } from 'react';

// Main PITApp component for the Gross/Net salary calculator
const PITApp = () => {
    // State variables for user inputs
    const [income, setIncome] = useState(''); // Input salary (can be Gross or Net)
    const [numDependents, setNumDependents] = useState(0); // Number of dependents
    const [insuranceContributionType, setInsuranceContributionType] = useState('official'); // 'official' or 'custom'
    const [customInsuranceSalary, setCustomInsuranceSalary] = useState(''); // Custom salary for insurance
    const [region, setRegion] = useState('I'); // Region for minimum wage

    // State variables for calculation mode and results
    const [calculationMode, setCalculationMode] = useState('grossToNet'); // 'grossToNet' or 'netToGross'
    const [calculatedGross, setCalculatedGross] = useState(null);
    const [calculatedNet, setCalculatedNet] = useState(null);
    const [socialInsurance, setSocialInsurance] = useState(null);
    const [personalIncomeTax, setPersonalIncomeTax] = useState(null);
    const [pitBreakdown, setPitBreakdown] = useState([]); // Detailed breakdown of PIT calculation
    const [calculationSteps, setCalculationSteps] = useState([]); // Detailed steps of the entire calculation
    const [error, setError] = useState('');
    const [showDetails, setShowDetails] = useState(false); // State to toggle detailed explanation

    // --- Constants based on provided regulations ---
    const LUONG_CO_SO = 2340000; // Mức lương cơ sở từ 01/07/2024
    const GIAM_TRU_BAN_THAN = 11000000; // Giảm trừ gia cảnh bản thân
    const GIAM_TRU_PHU_THUOC = 4400000; // Giảm trừ người phụ thuộc

    // Employee social insurance contribution rates
    const BHXH_RATE = 0.08; // 8%
    const BHYT_RATE = 0.015; // 1.5%
    const BHTN_RATE = 0.01; // 1%
    const TOTAL_EMPLOYEE_INSURANCE_RATE = BHXH_RATE + BHYT_RATE + BHTN_RATE; // 10.5%

    // Cap for social insurance contribution (20 times base salary)
    const MAX_INSURANCE_SALARY_CAP = 20 * LUONG_CO_SO;

    // Regional minimum wages (Mức lương tối thiểu vùng) from 01/07/2025
    const REGIONAL_MINIMUM_WAGES = {
        'I': 4960000,
        'II': 4410000,
        'III': 3860000,
        'IV': 3450000,
    };

    // Personal Income Tax (PIT) brackets (Monthly)
    const PIT_BRACKETS = [
        { min: 0, max: 5000000, rate: 0.05, deduction: 0 },
        { min: 5000000, max: 10000000, rate: 0.10, deduction: 250000 },
        { min: 10000000, max: 18000000, rate: 0.15, deduction: 750000 },
        { min: 18000000, max: 32000000, rate: 0.20, deduction: 1650000 },
        { min: 32000000, max: 52000000, rate: 0.25, deduction: 3250000 },
        { min: 52000000, max: 80000000, rate: 0.30, deduction: 5850000 },
        { min: 80000000, max: Infinity, rate: 0.35, deduction: 9850000 },
    ];

    // Helper function to format currency
    const formatCurrency = (value) => {
        if (value === null) return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    /**
     * Calculates Personal Income Tax (PIT) based on taxable income and returns breakdown.
     * @param {number} taxableIncome - The income after social insurance and deductions.
     * @returns {{pitAmount: number, breakdown: Array}} Calculated PIT amount and its breakdown.
     */
    const calculatePITWithBreakdown = (taxableIncome) => {
        let pitAmount = 0;
        const breakdown = [];
        let remainingTaxableIncome = taxableIncome;

        for (let i = 0; i < PIT_BRACKETS.length; i++) {
            const bracket = PIT_BRACKETS[i];
            const incomeInBracket = Math.min(remainingTaxableIncome, (bracket.max - bracket.min));

            if (incomeInBracket > 0) {
                const taxInBracket = incomeInBracket * bracket.rate;
                pitAmount += taxInBracket;
                breakdown.push({
                    bracket: `Bậc ${i + 1} (${formatCurrency(bracket.min)} - ${bracket.max === Infinity ? 'trở lên' : formatCurrency(bracket.max)})`,
                    income: incomeInBracket,
                    rate: bracket.rate * 100,
                    tax: taxInBracket,
                });
                remainingTaxableIncome -= incomeInBracket;
            } else {
                break; // No more income to tax
            }
        }
        return { pitAmount, breakdown };
    };

    /**
     * Calculates Gross to Net salary.
     * @param {number} grossSalary - The input Gross salary.
     * @param {number} dependents - Number of dependents.
     * @param {string} insuranceType - 'official' or 'custom'.
     * @param {number} customInsSalary - Custom salary for insurance if type is 'custom'.
     * @returns {{netSalary: number, socialInsurance: number, pit: number, pitBreakdown: Array, steps: Array}} Calculated Net salary, social insurance, PIT, PIT breakdown, and calculation steps.
     */
    const calculateGrossToNet = (grossSalary, dependents, insuranceType, customInsSalary) => {
        const steps = [];

        // 1. Calculate Social Insurance
        let salaryForInsurance = grossSalary;
        let insuranceSourceText = 'lương Gross';
        if (insuranceType === 'custom' && customInsSalary !== null && customInsSalary !== '') {
            salaryForInsurance = parseFloat(customInsSalary);
            insuranceSourceText = 'mức lương đóng bảo hiểm tùy chỉnh';
        }
        const actualInsuranceSalary = Math.min(salaryForInsurance, MAX_INSURANCE_SALARY_CAP);
        const socialInsuranceAmount = actualInsuranceSalary * TOTAL_EMPLOYEE_INSURANCE_RATE;

        steps.push(`1. Tính Bảo hiểm xã hội (BHXH, BHYT, BHTN):`);
        steps.push(`   - Mức lương đóng bảo hiểm: ${formatCurrency(salaryForInsurance)} (từ ${insuranceSourceText})`);
        steps.push(`   - Mức trần đóng bảo hiểm (20 x Lương cơ sở): ${formatCurrency(MAX_INSURANCE_SALARY_CAP)}`);
        steps.push(`   - Mức lương thực tế dùng để đóng bảo hiểm (min của 2 giá trị trên): ${formatCurrency(actualInsuranceSalary)}`);
        steps.push(`   - Tổng tỷ lệ đóng bảo hiểm (người lao động): ${TOTAL_EMPLOYEE_INSURANCE_RATE * 100}% (BHXH 8%, BHYT 1.5%, BHTN 1%)`);
        steps.push(`   - Số tiền bảo hiểm: ${formatCurrency(actualInsuranceSalary)} x ${TOTAL_EMPLOYEE_INSURANCE_RATE * 100}% = ${formatCurrency(socialInsuranceAmount)}`);


        // 2. Calculate Total Deductions
        const totalDeductions = GIAM_TRU_BAN_THAN + (dependents * GIAM_TRU_PHU_THUOC);
        steps.push(`2. Tính Tổng các khoản giảm trừ:`);
        steps.push(`   - Giảm trừ bản thân: ${formatCurrency(GIAM_TRU_BAN_THAN)}`);
        steps.push(`   - Giảm trừ người phụ thuộc (${dependents} người): ${dependents} x ${formatCurrency(GIAM_TRU_PHU_THUOC)} = ${formatCurrency(dependents * GIAM_TRU_PHU_THUOC)}`);
        steps.push(`   - Tổng giảm trừ: ${formatCurrency(GIAM_TRU_BAN_THAN)} + ${formatCurrency(dependents * GIAM_TRU_PHU_THUOC)} = ${formatCurrency(totalDeductions)}`);

        // 3. Calculate Taxable Income
        const taxableIncome = Math.max(0, grossSalary - socialInsuranceAmount - totalDeductions);
        steps.push(`3. Tính Thu nhập chịu thuế (TNCT):`);
        steps.push(`   - TNCT = Lương Gross - Bảo hiểm - Tổng giảm trừ`);
        steps.push(`   - TNCT = ${formatCurrency(grossSalary)} - ${formatCurrency(socialInsuranceAmount)} - ${formatCurrency(totalDeductions)} = ${formatCurrency(taxableIncome)}`);


        // 4. Calculate Personal Income Tax (PIT) with breakdown
        const { pitAmount, breakdown } = calculatePITWithBreakdown(taxableIncome);
        steps.push(`4. Tính Thuế thu nhập cá nhân (TNCN):`);
        if (taxableIncome <= 0) {
            steps.push(`   - Thu nhập chịu thuế <= 0, nên TNCN = 0`);
        } else {
            steps.push(`   - TNCN được tính theo biểu lũy tiến từng phần dựa trên Thu nhập chịu thuế:`);
            breakdown.forEach(item => {
                steps.push(`     - ${item.bracket}: ${formatCurrency(item.income)} x ${item.rate}% = ${formatCurrency(item.tax)}`);
            });
            steps.push(`   - Tổng TNCN: ${formatCurrency(pitAmount)}`);
        }


        // 5. Calculate Net Salary
        const netSalary = grossSalary - socialInsuranceAmount - pitAmount;
        steps.push(`5. Tính Lương Net:`);
        steps.push(`   - Lương Net = Lương Gross - Bảo hiểm - TNCN`);
        steps.push(`   - Lương Net = ${formatCurrency(grossSalary)} - ${formatCurrency(socialInsuranceAmount)} - ${formatCurrency(pitAmount)} = ${formatCurrency(netSalary)}`);


        return {
            netSalary: netSalary,
            socialInsurance: socialInsuranceAmount,
            pit: pitAmount,
            pitBreakdown: breakdown,
            steps: steps,
        };
    };

    /**
     * Calculates Net to Gross salary using an iterative approach.
     * @param {number} netSalary - The input Net salary.
     * @param {number} dependents - Number of dependents.
     * @param {string} insuranceType - 'official' or 'custom'.
     * @param {number} customInsSalary - Custom salary for insurance if type is 'custom'.
     * @returns {{grossSalary: number, socialInsurance: number, pit: number, pitBreakdown: Array, steps: Array}} Calculated Gross salary, social insurance, PIT, PIT breakdown, and calculation steps.
     */
    const calculateNetToGross = (netSalary, dependents, insuranceType, customInsSalary) => {
        let grossGuess = netSalary + GIAM_TRU_BAN_THAN + (dependents * GIAM_TRU_PHU_THUOC) + (netSalary * 0.15); // Initial guess
        let currentNet = 0;
        let socialInsuranceAmount = 0;
        let pitAmount = 0;
        let pitBreakdown = [];
        const tolerance = 1; // VND tolerance for convergence
        let steps = [];

        steps.push(`1. Ước tính Lương Gross ban đầu: ${formatCurrency(grossGuess)} (dựa trên Lương Net, giảm trừ và ước tính thuế/bảo hiểm)`);

        for (let i = 0; i < 1000; i++) { // Max 1000 iterations to prevent infinite loops
            const result = calculateGrossToNet(grossGuess, dependents, insuranceType, customInsSalary);
            currentNet = result.netSalary;
            socialInsuranceAmount = result.socialInsurance;
            pitAmount = result.pit;
            pitBreakdown = result.pitBreakdown;

            if (Math.abs(currentNet - netSalary) < tolerance) {
                steps.push(`2. Quá trình lặp hội tụ: Lương Net tính toán (${formatCurrency(currentNet)}) gần bằng Lương Net mong muốn (${formatCurrency(netSalary)}).`);
                steps.push(`   - Lương Gross cuối cùng: ${formatCurrency(grossGuess)}`);
                steps.push(`   - Bảo hiểm: ${formatCurrency(socialInsuranceAmount)}`);
                steps.push(`   - TNCN: ${formatCurrency(pitAmount)}`);
                return {
                    grossSalary: grossGuess,
                    socialInsurance: socialInsuranceAmount,
                    pit: pitAmount,
                    pitBreakdown: pitBreakdown,
                    steps: steps,
                };
            }

            // Adjust guess based on the difference
            if (currentNet < netSalary) {
                grossGuess += (netSalary - currentNet) * 1.05; // Increase guess, slightly aggressive
            } else {
                grossGuess -= (currentNet - netSalary) * 0.95; // Decrease guess, slightly conservative
            }
            steps.push(`   - Lặp ${i + 1}: Lương Gross thử nghiệm: ${formatCurrency(grossGuess)}. Lương Net tính được: ${formatCurrency(currentNet)}`);

            if (grossGuess < 0) grossGuess = 0; // Ensure gross salary doesn't go negative
        }

        setError('Không thể tìm thấy lương Gross tương ứng sau nhiều lần thử. Vui lòng kiểm tra lại số liệu.');
        return { grossSalary: null, socialInsurance: null, pit: null, pitBreakdown: [], steps: steps };
    };


    // Effect hook to perform calculation when inputs change
    useEffect(() => {
        setError(''); // Clear previous errors
        setPitBreakdown([]);
        setCalculationSteps([]);

        const incomeNum = parseFloat(income);
        const customInsSalaryNum = parseFloat(customInsuranceSalary);

        if (isNaN(incomeNum) || incomeNum < 0) {
            setCalculatedGross(null);
            setCalculatedNet(null);
            setSocialInsurance(null);
            setPersonalIncomeTax(null);
            if (income !== '') setError('Vui lòng nhập số tiền hợp lệ.');
            return;
        }

        if (insuranceContributionType === 'custom' && (isNaN(customInsSalaryNum) || customInsSalaryNum < 0)) {
            setCalculatedGross(null);
            setCalculatedNet(null);
            setSocialInsurance(null);
            setPersonalIncomeTax(null);
            if (customInsuranceSalary !== '') setError('Vui lòng nhập mức lương đóng bảo hiểm hợp lệ.');
            return;
        }

        if (incomeNum === 0 && income !== '') { // Allow empty string but not 0
             setCalculatedGross(0);
             setCalculatedNet(0);
             setSocialInsurance(0);
             setPersonalIncomeTax(0);
             setPitBreakdown([]);
             setCalculationSteps([]);
             return;
        }


        let result;
        if (calculationMode === 'grossToNet') {
            result = calculateGrossToNet(incomeNum, numDependents, insuranceContributionType, customInsSalaryNum);
            setCalculatedGross(incomeNum);
            setCalculatedNet(result.netSalary);
        } else { // netToGross
            result = calculateNetToGross(incomeNum, numDependents, insuranceContributionType, customInsSalaryNum);
            setCalculatedGross(result.grossSalary);
            setCalculatedNet(incomeNum);
        }

        setSocialInsurance(result.socialInsurance);
        setPersonalIncomeTax(result.pit);
        setPitBreakdown(result.pitBreakdown);
        setCalculationSteps(result.steps);

    }, [income, numDependents, insuranceContributionType, customInsuranceSalary, calculationMode]);


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Công Cụ Tính Lương Gross - Net
                </h1>

                {/* Calculation Mode Selection */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setCalculationMode('grossToNet')}
                        className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                            calculationMode === 'grossToNet'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        GROSS sang NET
                    </button>
                    <button
                        onClick={() => setCalculationMode('netToGross')}
                        className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                            calculationMode === 'netToGross'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        NET sang GROSS
                    </button>
                </div>

                {/* Input Section */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="income" className="block text-gray-700 text-sm font-semibold mb-2">
                            {calculationMode === 'grossToNet' ? 'Lương Gross (VNĐ):' : 'Lương Net (VNĐ):'}
                        </label>
                        <input
                            type="number"
                            id="income"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder={calculationMode === 'grossToNet' ? 'Nhập lương Gross' : 'Nhập lương Net'}
                            min="0"
                        />
                    </div>

                    <div>
                        <label htmlFor="numDependents" className="block text-gray-700 text-sm font-semibold mb-2">
                            Số người phụ thuộc:
                        </label>
                        <input
                            type="number"
                            id="numDependents"
                            value={numDependents}
                            onChange={(e) => setNumDependents(Math.max(0, parseInt(e.target.value || '0')))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Mức lương đóng bảo hiểm:
                        </label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="insuranceType"
                                    value="official"
                                    checked={insuranceContributionType === 'official'}
                                    onChange={(e) => setInsuranceContributionType(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">Trên lương chính thức</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="insuranceType"
                                    value="custom"
                                    checked={insuranceContributionType === 'custom'}
                                    onChange={(e) => setInsuranceContributionType(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">Khác</span>
                            </label>
                        </div>
                        {insuranceContributionType === 'custom' && (
                            <input
                                type="number"
                                value={customInsuranceSalary}
                                onChange={(e) => setCustomInsuranceSalary(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="Nhập mức lương đóng bảo hiểm"
                                min="0"
                            />
                        )}
                    </div>

                    <div>
                        <label htmlFor="region" className="block text-gray-700 text-sm font-semibold mb-2">
                            Vùng:
                        </label>
                        <select
                            id="region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        >
                            {Object.keys(REGIONAL_MINIMUM_WAGES).map((r) => (
                                <option key={r} value={r}>
                                    Vùng {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">Lỗi!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {(calculatedGross !== null || calculatedNet !== null) && !error && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Kết Quả Tính Toán</h2>

                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-sm">
                            <p className="text-gray-700 text-lg">
                                <span className="font-medium">Lương Gross:</span>{' '}
                                <span className="text-blue-600 font-bold">
                                    {formatCurrency(calculatedGross)}
                                </span>
                            </p>
                            <p className="text-gray-700 text-lg">
                                <span className="font-medium">Lương Net:</span>{' '}
                                <span className="text-blue-600 font-bold">
                                    {formatCurrency(calculatedNet)}
                                </span>
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Bảo hiểm xã hội (BHXH, BHYT, BHTN):</span>{' '}
                                <span className="text-gray-800 font-bold">
                                    {formatCurrency(socialInsurance)}
                                </span>
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Thuế thu nhập cá nhân (TNCN):</span>{' '}
                                <span className="text-gray-800 font-bold">
                                    {formatCurrency(personalIncomeTax)}
                                </span>
                            </p>

                            {/* Detailed PIT Breakdown */}
                            {pitBreakdown.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-blue-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Chi tiết tính Thuế TNCN:
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        {pitBreakdown.map((item, index) => (
                                            <li key={index}>
                                                {item.bracket}: {formatCurrency(item.income)} x {item.rate}% = {formatCurrency(item.tax)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Toggle for detailed calculation steps */}
                        {calculationSteps.length > 0 && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 ease-in-out shadow-sm flex items-center justify-center"
                                >
                                    {showDetails ? 'Ẩn chi tiết cách tính' : 'Hiển thị chi tiết cách tính'}
                                    <svg
                                        className={`ml-2 w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {showDetails && (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm mt-4">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                            Các bước tính toán:
                                        </h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            {calculationSteps.map((step, index) => (
                                                <li key={index} className={step.startsWith('   -') ? 'ml-4' : ''}>
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Regulations Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Thông Tin Quy Định Áp Dụng
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <span className="font-semibold">Mức lương cơ sở (từ 01/07/2024):</span>{' '}
                        <span className="font-bold text-blue-600">{formatCurrency(LUONG_CO_SO)}/tháng</span>
                    </p>
                    <p>
                        <span className="font-semibold">Giảm trừ gia cảnh bản thân:</span>{' '}
                        <span className="font-bold text-blue-600">{formatCurrency(GIAM_TRU_BAN_THAN)}/tháng</span>
                    </p>
                    <p>
                        <span className="font-semibold">Giảm trừ người phụ thuộc:</span>{' '}
                        <span className="font-bold text-blue-600">{formatCurrency(GIAM_TRU_PHU_THUOC)}/tháng</span>
                    </p>
                    <p className="font-semibold">Mức lương tối thiểu vùng (từ 01/07/2025):</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        {Object.entries(REGIONAL_MINIMUM_WAGES).map(([key, value]) => (
                            <li key={key}>
                                Vùng {key}: <span className="font-bold text-blue-600">{formatCurrency(value)}/tháng</span>
                            </li>
                        ))}
                    </ul>
                    <p className="font-semibold">Tỷ lệ đóng bảo hiểm (phần người lao động):</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>BHXH: 8%</li>
                        <li>BHYT: 1.5%</li>
                        <li>BHTN: 1%</li>
                        <li>Tổng cộng: 10.5%</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-4">
                        <span className="font-bold">Lưu ý:</span> Công cụ này sử dụng các quy định và công thức tính toán phổ biến nhất. Tuy nhiên, các trường hợp đặc biệt hoặc thay đổi quy định mới nhất có thể không được cập nhật ngay lập tức. Vui lòng tham khảo các văn bản pháp luật hiện hành để có thông tin chính xác nhất.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PITApp;
