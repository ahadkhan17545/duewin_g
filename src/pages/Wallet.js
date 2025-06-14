import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DepositIcon from "./../Assets/icondeposit.png";
import DepositHistory from "./../Assets/icondeposithistory.png";
import Withdraw from "./../Assets/iconwithdraw.png";
import WithdrawHistory from "./../Assets/iconwithdrawhistory.png";
import IconWallet from "./../Assets/iconwallet1.png";
import {
  FaPhone,
  FaEnvelope,
  FaLock,
  FaQuestionCircle,
  FaKey,
} from "react-icons/fa";
import Footer from "../components/Footer";
import WalletHeader from "../components/WalletHeader";
import { getWalletBalance } from "../api/apiServices";

function Wallet() {
  const [countdown, setCountdown] = useState(null);
  const [isGreyedOut, setIsGreyedOut] = useState(false);
  const [isThirdPartyActive, setIsThirdPartyActive] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [mainWalletBalance, setMainWalletBalance] = useState(null);
  const [thirdPartyWalletBalance, setThirdPartyWalletBalance] = useState(null);
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Function to get the token - same as your gameApi.js
  const getToken = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('token');
      }
      console.warn('localStorage not available, authentication may fail');
      return null;
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  };

  // Transfer API function - Fixed to use same token method as gameApi
  const transferFromThirdParty = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available. Please login first.');
      }

      console.log('Making transfer request with token:', token.substring(0, 20) + '...');

      const response = await fetch('https://strike.atsproduct.in/api/wallet/transfer-from-third-party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // Add any required body parameters here if needed by your API
        body: JSON.stringify({
          // Add transfer parameters as needed by your API
        })
      });

      console.log('Transfer response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Transfer API error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Transfer failed'}`);
      }

      const data = await response.json();
      console.log('Transfer API success:', data);
      return data;
    } catch (error) {
      console.error('Transfer API error:', error);
      throw error;
    }
  };

  const handleTransferClick = async () => {
    // Only allow transfer if there's money in third party wallet
    if (thirdPartyWalletBalance <= 0) {
      setError('No funds available in 3rd party wallet to transfer');
      return;
    }

    // Prevent multiple clicks during transfer
    if (transferLoading || countdown !== null) {
      return;
    }

    setTransferLoading(true);
    setCountdown(5);
    setIsGreyedOut(true);
    setError(null); // Clear any previous errors
    setTransferSuccess(false); // Reset transfer success state

    try {
      // Call the transfer API
      const transferResult = await transferFromThirdParty();

      if (transferResult.success || transferResult.status === 'success') {
        console.log('Transfer successful:', transferResult);

        // Mark transfer as successful but don't update UI yet
        setTransferSuccess(true);

      } else {
        throw new Error(transferResult.message || 'Transfer failed');
      }
    } catch (err) {
      console.error('Transfer error:', err);

      // Provide more specific error messages
      let errorMessage = 'Transfer failed. Please try again.';
      if (err.message.includes('401')) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (err.message.includes('No authentication token')) {
        errorMessage = 'Please login to continue.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Reset UI state on error
      setCountdown(null);
      setIsGreyedOut(false);
      setTransferSuccess(false);
    } finally {
      setTransferLoading(false);
    }
  };

  // Updated useEffect to handle the UI update after countdown
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsGreyedOut(false);

      // If transfer was successful, now update the UI
      if (transferSuccess) {
        const transferAmount = thirdPartyWalletBalance;
        setMainWalletBalance(prevMain => (prevMain || 0) + transferAmount);
        setThirdPartyWalletBalance(0);
        setIsThirdPartyActive(false);
        setTransferSuccess(false); // Reset the flag

        // Refresh wallet balance from server to get accurate data
        setTimeout(() => {
          fetchBalance();
        }, 1000);
      }
    }
  }, [countdown, transferSuccess, thirdPartyWalletBalance]);

  // Fetch balance from API using the centralized API service
  const fetchBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWalletBalance();

      if (data.success) {
        // Set main wallet balance
        setMainWalletBalance(data.mainWallet?.balance || 0);

        // Set third party wallet balance
        setThirdPartyWalletBalance(data.thirdPartyWallet?.balance || 0);

        // Set currency
        setCurrency(data.mainWallet?.currency || "EUR");

        // Determine if third party wallet is active based on balance
        setIsThirdPartyActive((data.thirdPartyWallet?.balance || 0) > 0);

        console.log("Wallet balance fetched successfully:", data);
      } else {
        throw new Error(data.message || "Failed to fetch wallet balance");
      }
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      setError(err.message || "Failed to fetch wallet balance");
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance on component mount
  useEffect(() => {
    fetchBalance();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const loginData = isPhoneLogin
      ? { phoneNumber, password }
      : { email, password };
    console.log("Login data:", loginData);
    console.log("Remember password:", rememberPassword);
    console.log("Verification code:", verificationCode);
    console.log("Privacy agreement accepted:", privacyAgreement);
  };

  // Calculate total balance
  const totalBalance = (mainWalletBalance || 0) + (thirdPartyWalletBalance || 0);

  // Global font style
  const timesNewRomanStyle = { fontFamily: "'Times New Roman', Times, serif" };

  // Currency symbol mapping
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "EUR":
        return "€";
      case "USD":
        return "$";
      case "INR":
        return "₹";
      default:
        return currency;
    }
  };

  return (
    <div
      className="bg-[#333332] min-h-screen flex flex-col items-center pb-20"
      style={timesNewRomanStyle}
    >
      <WalletHeader />
      <div className="text-center  w-full max-w-xs px-2 flex flex-col items-center">

        <h1 className="text-xl font-bold mt-1"></h1>
        <img src={IconWallet} alt="File Icon" className="w-9 h-9" />

        {/* Total Balance Display */}
        {loading ? (
          <p className="text-white text-2xl font-[Inter]">Loading...</p>
        ) : error && !mainWalletBalance && !thirdPartyWalletBalance ? (
          <div className="text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={fetchBalance}
              className="text-blue-400 text-xs mt-1 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-normal text-white font-[Inter]">
              {getCurrencySymbol(currency)}{totalBalance.toFixed(2)}
            </h1>
            <p className="text-white text-xs font-[Inter] tracking-wider">
              Total balance
            </p>
          </>
        )}
      </div>

      <div className="bg-[#242424] p-4 shadow-md w-full max-w-md mt-3">
        <div className="bg-[#333332] p-2 rounded-lg shadow-md">
       <div className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-4 space-x-10">
  {/* Main Wallet */}
  <div className="text-center">
    <div className="relative w-28 h-28">
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={!isThirdPartyActive ? "#c4933f" : "#666462"}
          strokeWidth="3"
          strokeDasharray="100, 100"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#f5f3f0]">
        {!isThirdPartyActive ? "100%" : "0%"}
      </div>
    </div>
    {loading ? (
      <p className="mt-2 font-semibold text-[#f5f3f0]">Loading...</p>
    ) : (
      <p className="mt-2 font-semibold text-[#f5f3f0]">
        {getCurrencySymbol(currency)}{mainWalletBalance !== null ? mainWalletBalance.toFixed(2) : "0.00"}
      </p>
    )}
    <p className="text-xs text-[#f5f3f0] tracking-wider font-sans">Main wallet</p>
  </div>

  {/* 3rd Party Wallet */}
  <div className="text-center">
    <div className="relative w-28 h-28">
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={isThirdPartyActive ? "#c4933f" : "#666462"}
          strokeWidth="3"
          strokeDasharray="100, 100"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#f5f3f0]">
        {isThirdPartyActive ? "100%" : "0%"}
      </div>
    </div>
    {loading ? (
      <p className="mt-2 font-semibold text-[#f5f3f0]">Loading...</p>
    ) : (
      <p className="mt-2 font-semibold text-[#f5f3f0]">
        {getCurrencySymbol(currency)}{thirdPartyWalletBalance !== null ? thirdPartyWalletBalance.toFixed(2) : "0.00"}
      </p>
    )}
    <p className="text-xs text-[#f5f3f0] tracking-wider font-sans">3rd party wallet</p>
  </div>
</div>


          {/* Transfer Button */}
          <button
            onClick={handleTransferClick}
            disabled={countdown !== null || transferLoading || (thirdPartyWalletBalance <= 0)}
            className={`w-full py-2 font-sm font-semibold p-4 rounded-full text-white transition-all duration-300 
              ${isGreyedOut ? "bg-[#6f7381]" : "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"} 
              ${(countdown !== null || transferLoading || (thirdPartyWalletBalance <= 0)) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {transferLoading ? (
              <span>Processing Transfer...</span>
            ) : countdown !== null ? (
              <span className="text-white">Recalling {countdown}s</span>
            ) : thirdPartyWalletBalance <= 0 ? (
              <span>No Funds to Transfer</span>
            ) : (
              <span className="text-[#8f5206]">Transfer to Main Wallet</span>
            )}
          </button>

          {/* Error Message Display */}
          {error && (mainWalletBalance !== null || thirdPartyWalletBalance !== null) && (
            <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

          {/* Reduced gap - changed from mt-4 to mt-2 */}
          <div className="grid grid-cols-4 gap-4 mt-2 text-center">
            <Link to="/deposit" className="flex flex-col items-center">
              <div>
                <img
                  src={DepositIcon}
                  alt="File Icon"
                  className="w-[70px] h-[70px]"
                />
              </div>
              <span className="text-[#a8a5a1] text-sm mt-0">Deposit</span>
            </Link>

            <Link to="/withdraw" className="flex flex-col items-center">
              <div>
                <img
                  src={Withdraw}
                  alt="File Icon"
                  className="w-[70px] h-[70px]"
                />
              </div>
              <span className="text-[#a8a5a1] text-sm mt-0">Withdraw</span>
            </Link>

            <Link to="/deposit-history" className="flex flex-col items-center">
              <div>
                <img
                  src={DepositHistory}
                  alt="File Icon"
                  className="w-[70px] h-[70px]"
                />
              </div>
              <span className="text-[#a8a5a1] text-sm mt-0">Deposit history</span>
            </Link>

            <Link to="/withdraw-history" className="flex flex-col items-center">
              <div>
                <img
                  src={WithdrawHistory}
                  alt="File Icon"
                  className="w-[70px] h-[70px]"
                />
              </div>
              <span className="text-[#a8a5a1] text-sm mt-0">Withdrawal history</span>
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Wallet;