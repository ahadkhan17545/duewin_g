import React, { useEffect, useState } from "react";
import wcard from "../../Assets/wcard.png";
import SafeHeader from "./Safeheader";
import { Link } from "react-router-dom";
import apiServices from "../../api/apiServices";
import CommanHeader from "../../components/CommanHeader";

const FinancialCard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showTransferInPopup, setShowTransferInPopup] = useState(false);
  const [transferAmount, setTransferAmount] = useState(100);
  const [error, setError] = useState(false);
  const [vaultStatus, setVaultStatus] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [bettingBalance, setBettingBalance] = useState(null);
  const fetchVaultStatus = async () => {
    let data = await apiServices.getVaultStatus();
    setVaultStatus(data);
  };
  const maxTransferLimit =
    bettingBalance?.total_bet_amount - bettingBalance?.actual_deposit_amount;

  const fetchTransactionHistory = async () => {
    let data = await apiServices.getTransactionHistory();
    setTransactionHistory(data?.transactions);
  };
  useEffect(() => {
    fetchVaultStatus();
    fetchTransactionHistory();
    fetchBettingBalance();
  }, []);

  const handleTransferOutClick = () => {
    setShowPopup(true);
  };

  const handleTransferInClick = () => {
    setShowTransferInPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setShowTransferInPopup(false);
    setError(false);
  };

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxTransferLimit) {
      setTransferAmount(value);
      setError(false);
    } else {
      setTransferAmount(maxTransferLimit);
      setError(true);
    }
  };

  const handleSliderChange = (e) => {
    const amount = parseInt(e.target.value) || 0;
    setTransferAmount(amount);
    if (amount > vaultStatus?.vaultBalance) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleAllClick = () => {
    setTransferAmount(vaultStatus?.walletBalance);
    setError(false);
  };

  const handleMultiplierClick = (multiplier) => {
    const newAmount = transferAmount * multiplier;
    setTransferAmount(newAmount);
    if (newAmount > vaultStatus?.walletBalance) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleTransferOut = async () => {
    try {
      const data = await apiServices.withdrawVault({ amount: transferAmount });
      if (data?.success === true) {
        fetchVaultStatus();
        setShowPopup(false);
        setTransferAmount(1);
        fetchTransactionHistory();
      }
    } catch (error) {
      console.error("Transfer out failed:", error);
      // Optionally show user feedback
    }
  };

  const handleTransferIn = async () => {
    try {
      const data = await apiServices.vaultDeposit({ amount: transferAmount });
      if (data?.success === true) {
        fetchVaultStatus();
        setShowTransferInPopup(false);
        setTransferAmount(1);
        fetchTransactionHistory();
      }
    } catch (error) {
      console.error("Transfer in failed:", error);
      // Optionally show user feedback
    }
  };
  const fetchBettingBalance = async () => {
    let data = await apiServices.getBettingBalance();
    setBettingBalance(data?.data);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#242424] shadow-sm p-4 relative">
      <CommanHeader title="Safe" />
      <div className="text-center mb-2 mt-10 bg-[#333332] rounded-lg w-[40%] mx-auto">
        <p className="text-rose-500 text-sm">
          Interest rate {vaultStatus?.currentInterestRate}%
        </p>
      </div>

      <div className="rounded-lg text-white relative">
        <div className="h-40 relative">
          <img
            src={wcard}
            alt="Card background"
            className="w-full h-[82%] object-cover rounded-lg"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-yellow-400 w-4 h-4 rounded-md flex items-center justify-center">
              <span className="text-yellow-800">₹</span>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-white bg-opacity-20 px-3 py-1 border-[#8f5206]  rounded-lg flex items-center">
              <span className="mr-1"></span>
              <span className="text-xs text-[#8f5206] ">
                Financial security
              </span>
            </div>
          </div>
          <div className="absolute top-10 left-4">
            <h2 className="text-2xl font-bold text-[#8f5206]">
              ₹{vaultStatus?.vaultBalance}
            </h2>
          </div>
          <div className="absolute pb-6 left-4 text-xs text-[#8f5206] mt-[-3.5rem]">
            <span className="text-sm font-normal">
              24-hour estimated revenue{" "}
            </span>
            <span className="text-lg font-bold">₹0.20</span>
          </div>
        </div>
      </div>

      <div className="bg-[#333332] rounded-lg pt-5 pb-1 pr-3 pl-3 mb-2 text-white -mt-4">
        <div className="flex justify-between mb-1">
          <div className="text-center flex-1">
            <p className="text-rose-500 font-medium text-lg">
              ₹{vaultStatus?.totalInterestEarned}
            </p>
            <p className="text-gray-400 text-sm">Generated revenue</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-white font-medium text-lg">₹0.00</p>
            <p className="text-gray-400 text-sm">Accumulated revenue</p>
          </div>
        </div>
        <div className=" mb-3">
          <div className="border border-gray-600 rounded-full px-6 py-0.5 text-xs text-gray-300 inline-block">
            My interest rate {vaultStatus?.currentInterestRate}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-[40px] mb-2">
          {" "}
          {/* or any height you want */}
          <button
            className="border border-[#8f5206] text-[#8f5206] px-6 py-1 rounded-md font-medium bg-transparent w-full h-full"
            onClick={handleTransferOutClick}
          >
            Transfer Out
          </button>
          <button
            className="bg-gradient-to-r from-[#FAE59F] to-[#c4933f] text-[#8f5206] px-6 py-1 rounded-md font-medium flex items-center justify-center w-full h-full"
            onClick={handleTransferInClick}
          >
            Transfer In
          </button>
        </div>

        <div className="flex items-center justify-center text-xs text-gray-400 ">
          <span className="text-rose-400 mr-2">ⓘ</span>
          <span>
            Funds are safe and secure, and can be transferred at any time
          </span>
        </div>
        <div className="text-center">
          <Link to="/about-safe" className="text-gray-400 text-sm">
            Learn about safes »
          </Link>
        </div>
      </div>

      {/* Updated Historical Records Section */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-semibold">Historical records</h3>
        {transactionHistory.slice(0, 10)?.map((record, index) => (
          <div key={index} className="bg-[#333332] rounded-lg p-4 text-white">
            <div className="flex justify-between items-center mb-3">
              <button
                className={`${record?.type == "deposit" ? "bg-green-500" : "bg-orange-500"} text-white px-3 py-1 rounded-md text-sm font-medium`}
                style={{ textTransform: "capitalize" }}
              >
                {record?.type == "deposit" ? "Transfer In" : "Transfer Out"}
              </button>
              <span
                className={`${record?.type == "deposit" ? "text-green-500" : "text-red-500"} text-lg font-bold`}
              >
                {record?.type == "deposit" ? "+" : "-"}₹{record.amount}
              </span>
            </div>
            <div className="mt-4 bg-[#2a2a2a] p-5 rounded-lg shadow-lg">
              <div className="text-gray-400 text-sm space-y-3">
                <div className="flex justify-between">
                  <span>Daily interest rate</span>
                  <span>{record.interestRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payout income</span>
                  <span>{record.payout}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-3 text-gray-400 text-xs">
              <span>{record.orderNo}</span>
              <span>{record.date}</span>
            </div>
          </div>
        ))}
      </div>

      <Link to="/VIPHistory">
        <button className="w-full border border-gray-300 rounded-full py-3 text-center text-[#8f5206] font-medium mt-4">
          All history
        </button>
      </Link>

      {/* Transfer Out Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-[#242424] rounded-lg p-4 w-full max-w-[400px] mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Transfer Out</h3>
              <button onClick={handleCancel} className="text-gray-500">
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm">Each amount</span>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={handleAmountChange}
                  className="w-20 text-right border border-gray-300 rounded-md px-2 py-1 text-gray-800 bg-gray-100"
                  disabled
                />
              </div>
              <input
                type="range"
                min="0"
                max={vaultStatus?.vaultBalance}
                value={transferAmount}
                onChange={handleSliderChange}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{transferAmount}</span>
                <span>{vaultStatus?.vaultBalance}</span>
              </div>
            </div>
            {error && (
              <div className="flex items-center text-red-500 text-xs mb-2">
                <span className="mr-1">⚠</span>
                <span>Insufficient amount available</span>
              </div>
            )}
            <div className="text-sm text-white space-y-2">
              <div className="flex justify-between">
                <span>Amount available</span>
                <span>₹{vaultStatus?.vaultBalance}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount transferred</span>
                <span className="text-red-500">
                  ₹{transferAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Daily interest rate</span>
                <span>{vaultStatus?.currentInterestRate * 100}</span>
              </div>
              <div className="flex justify-between">
                <span>Income</span>
                <span>₹0.00</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleTransferOut}
                className="w-full bg-green-500 text-white py-2 rounded-md font-medium"
                disabled={error}
              >
                Transfer Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer In Popup */}
      {showTransferInPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-[#242424] rounded-t-lg w-full max-w-[400px] overflow-hidden">
            <div className="bg-[#333332] py-3 px-4 flex justify-between">
              <h3 className="text-lg font-semibold text-white">Transfer In</h3>
              <button onClick={handleCancel} className="text-gray-500">
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Each amount</span>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={handleAmountChange}
                  max={maxTransferLimit}
                  className="w-20 text-right border border-gray-300 rounded-md px-2 py-1 text-gray-800"
                />
                <button
                  onClick={handleAllClick}
                  className="text-blue-500 text-sm font-medium"
                >
                  ALL
                </button>
              </div>
              {error && (
                <div className="flex items-center text-red-500 text-xs mb-2">
                  <span className="mr-1">⚠</span>
                  <span>Insufficient amount available</span>
                </div>
              )}
              <div className="text-right text-xs text-gray-400">
                Max: {maxTransferLimit.toFixed(2)}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: "2X", multiplier: 2, highlight: true },
                  { label: "5X", multiplier: 5 },
                  { label: "10X", multiplier: 10 },
                  { label: "50X", multiplier: 50 },
                  { label: "100X", multiplier: 100 },
                  { label: "200X", multiplier: 200 },
                  { label: "500X", multiplier: 500 },
                  { label: "1000X", multiplier: 1000 },
                ].map((btn, index) => (
                  <button
                    key={index}
                    onClick={() => handleMultiplierClick(btn.multiplier)}
                    className={`py-1 px-2 rounded-md text-sm font-medium ${
                      btn.highlight
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <div className="text-sm text-white space-y-1">
                <div className="flex justify-between">
                  <span>Amount available</span>
                  <span>{vaultStatus?.walletBalance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount transferred</span>
                  <span className="text-red-500">{transferAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>24-hour estimated revenue</span>
                  <span>
                    {(
                      (transferAmount *
                        (vaultStatus?.currentInterestRate * 100)) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-[#333332] py-3 px-4">
              <button
                onClick={handleTransferIn}
                className="w-full bg-[#242424] text-white py-2 rounded-md font-medium"
                disabled={error}
              >
                Transfer In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialCard;
