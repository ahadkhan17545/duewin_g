import React, { useState } from "react";
import bankicon from "../../Assets/Bankicons/bankicon.png";
import nameicon from "../../Assets/Bankicons/nameicon.png";
import bankcardicon from "../../Assets/Bankicons/bankcardicon.png";
import phoneicon from "../../Assets/Bankicons/phoneicon.png";
import mailicon from "../../Assets/Bankicons/mailicon.png";
import hint from "../../Assets/loader/hint.png";
import ifsc from "../../Assets/Bankicons/ifsccodeicon.png"
import BankAccountHeader from "../../components/BankAccountHeader";

const BankAccountForm = () => {
  const [bankName, setBankName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const banks = [
  "Axis Bank Ltd.",
  "Bandhan Bank Ltd.",
  "CSB Bank Limited",
  "City Union Bank Ltd.",
  "DCB Bank Ltd.",
  "Dhanlaxmi Bank Ltd.",
  "Federal Bank Ltd.",
  "HDFC Bank Ltd",
  "ICICI Bank Ltd.",
  "IndusInd Bank Ltd",
  "IDFC FIRST Bank Limited",
  "Jammu & Kashmir Bank Ltd.",
  "Karnataka Bank Ltd.",
  "Karur Vysya Bank Ltd.",
  "Kotak Mahindra Bank Ltd",
  "Nainital bank Ltd.",
  "RBL Bank Ltd.",
  "South Indian Bank Ltd.",
  "Tamilnad Mercantile Bank Ltd.",
  "YES Bank Ltd.",
  "IDBI Bank Limited",
  "Coastal Local Area Bank Ltd",
  "Krishna Bhima Samruddhi LAB Ltd",
  "Au Small Finance Bank Ltd.",
  "Capital Small Finance Bank Ltd",
  "Equitas Small Finance Bank Ltd",
  "ESAF Small Finance Bank Ltd.",
  "Suryoday Small Finance Bank Ltd.",
  "Ujjivan Small Finance Bank Ltd.",
  "Utkarsh Small Finance Bank Ltd.",
  "slice Small Finance Bank Ltd.",
  "Jana Small Finance Bank Ltd",
  "Shivalik Small Finance Bank Ltd",
  "Unity Small Finance Bank Ltd",
  "Airtel Payments Bank Ltd",
  "India Post Payments Bank Ltd",
  "FINO Payments Bank Ltd",
  "Paytm Payments Bank Ltd",
  "Jio Payments Bank Ltd",
  "NSDL Payments Bank Limited",
  "Bank of Baroda",
  "Bank of India",
  "Bank of Maharashtra",
  "Canara Bank",
  "Central Bank of India",
  "Indian Bank",
  "Indian Overseas Bank",
  "Punjab & Sind Bank",
  "Punjab National Bank",
  "State Bank of India",
  "UCO Bank",
  "Union Bank of India",
  "Export-Import Bank of India",
  "National Housing Bank",
  "Small Industries Development Bank of India",
  "Assam Gramin Vikash Bank",
  "Andhra Pradesh Grameena Vikas Bank",
  "Andhra Pragathi Grameena Bank",
  "Arunachal Pradesh Rural Bank",
  "Aryavart Bank",
  "Bangiya Gramin Vikash Bank",
  "Baroda Gujarat Gramin Bank",
  "Baroda Rajasthan Kshetriya Gramin Bank",
  "Baroda UP Bank",
  "Chaitanya Godavari GB",
  "Chhattisgarh Rajya Gramin Bank",
  "Dakshin Bihar Gramin Bank",
  "Ellaquai Dehati Bank",
  "Himachal Pradesh Gramin Bank",
  "J&K Grameen Bank",
  "Jharkhand Rajya Gramin Bank",
  "Karnataka Gramin Bank",
  "Karnataka Vikas Gramin Bank",
  "Kerala Gramin Bank",
  "Madhya Pradesh Gramin Bank",
  "Madhyanchal Gramin Bank",
  "Maharashtra Gramin Bank",
  "Manipur Rural Bank",
  "Meghalaya Rural Bank",
  "Mizoram Rural Bank",
  "Nagaland Rural Bank",
  "Odisha Gramya Bank",
  "Paschim Banga Gramin Bank",
  "Prathama U.P. Gramin Bank",
  "Puduvai Bharathiar Grama Bank",
  "Punjab Gramin Bank",
  "Rajasthan Marudhara Gramin Bank",
  "Saptagiri Grameena Bank",
  "Sarva Haryana Gramin Bank",
  "Saurashtra Gramin Bank",
  "Tamil Nadu Grama Bank",
  "Telangana Grameena Bank",
  "Tripura Gramin Bank",
  "Uttar Bihar Gramin Bank",
  "Utkal Grameen Bank",
  "Uttarbanga Kshetriya Gramin Bank",
  "Vidharbha Konkan Gramin Bank",
  "Uttarakhand Gramin Bank",
];

  return (
    <div className="min-h-screen flex flex-col bg-[#333332] pb-8">
      <BankAccountHeader />
      
      <div className="mt-16 mx-auto max-w-md w-full bg-[#242424] text-white p-6 rounded-lg overflow-y-auto">
        {/* Warning Banner */}
        <div className="flex items-center gap-3 p-4 mb-8 bg-[#333332] rounded-lg">
          <img src={hint} alt="hint" className="w-7 h-7" />
          <p className="text-sm text-red-500">
            To ensure the safety of your funds, please bind your bank account
          </p>
        </div>

        {/* Bank Selection */}
        <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <img src={bankicon} alt="Bank Icon" className="w-5 h-5" />
        <label className="text-sm font-medium">Choose a bank</label>
      </div>
      <div className="relative w-full max-w-sm">
  <select
    className="w-full p-4 text-[#8f5206] font-medium rounded-lg text-left appearance-none truncate"
    style={{
      background: "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    <option value="" disabled selected>
      Please select a bank
    </option>
    {banks.map((bank, idx) => (
      <option key={idx} value={bank}>
        {bank}
      </option>
    ))}
  </select>
  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
    <svg
      className="w-4 h-4 text-[#8f5206]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>
</div>

        {/* Recipient Name */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img src={nameicon} alt="Name Icon" className="w-5 h-5" />
            <label className="text-sm font-medium">Full recipient's name</label>
          </div>
          <input
            type="text"
            placeholder="Please enter the recipient's name"
            className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>

        {/* Bank Account Number */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img src={bankcardicon} alt="Bank Card Icon" className="w-5 h-5" />
            <label className="text-sm font-medium">Bank account number</label>
          </div>
          <input
            type="text"
            placeholder="Please enter your bank account number"
            className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img src={phoneicon} alt="Phone Icon" className="w-5 h-5" />
            <label className="text-sm font-medium">Phone number</label>
          </div>
          <input
            type="tel"
            placeholder="Please enter your phone number"
            className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Mail */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img src={mailicon} alt="Mail Icon" className="w-5 h-5" />
            <label className="text-sm font-medium">Mail</label>
          </div>
          <input
            type="email"
            placeholder="Please enter your email"
            className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* IFSC Code */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img src={ifsc} alt="IFSC Code Icon" className="w-5 h-5" />
            <label className="text-sm font-medium">IFSC code</label>
          </div>
          <input
            type="text"
            placeholder="Please enter IFSC code"
            className="w-full p-4 bg-[#333332] rounded-lg text-gray-300"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          className="w-full p-2 text-xl bg-[#6f7381] text-white font-bold rounded-full mt-8 transition-colors"
          type="submit"
        >
          S a v e
        </button>
      </div>
    </div>
  );
};

export default BankAccountForm;