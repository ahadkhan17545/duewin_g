import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WithdrawHeader from "../../components/WithdrawHeader";
import apiServices from "../../api/apiServices";
import wcard from "../../Assets/wcard.png";
import redwallet from "../../Assets/redwallet.png";
import tpay from "../../Assets/gamesimage/Tpay.png";
import add from "../../Assets/Newicons/add.png";
import copyicon from "../../Assets/finalicons/deposit-copy-icon.png";
import wallet from "../../Assets/finalicons/chotawallet.png";
import refresh from "../../Assets/finalicons/refresh.png";
import bankcard from "../../Assets/finalicons/bankcardicon2.png";
import realtimecounticon from "../../Assets/realtimecounticon.png";
import emailiconn from "../../Assets/loginicons/emailiconn.png";
import { CiBank } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";
import { formatDate } from "../../utils/formatters";
import CommanHeader from "../../components/CommanHeader";
const BankCard = ({ bank, isSelected, onSelect, onDelete }) => {
  const maskAccountNumber = (accNum) => {
    if (!accNum || accNum.length < 8) return accNum;
    return `${accNum.slice(0, 6)}****${accNum.slice(-4)}`;
  };

  return (
    <div
      className={`bg-[#333332] text-white p-4 rounded-xl flex items-center justify-between mb-2 cursor-pointer ${
        isSelected ? "ring-2 ring-yellow-500" : ""
      }`}
      onClick={() => onSelect(bank.id)}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(bank.id)}
          className="w-5 h-5 accent-yellow-500"
        />
        <CiBank className="w-6 h-6 text-yellow-400" />
        <div>
          <div className="text-xs text-gray-400">{bank.bank_name}</div>
          <div className="text-base font-semibold">
            {maskAccountNumber(bank.account_number)}
          </div>
        </div>
        <FaTrash
          style={{ position: "absolute", right: "30px" }}
          className="text-red-500 text-lg cursor-pointer hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bank.id);
          }}
        />
      </div>
    </div>
  );
};

const USDTCard = ({ data, isSelected, onSelect, onDelete }) => {
  return (
    <div
      className={`bg-[#333332] text-white p-4 rounded-xl flex items-center justify-between mb-2 cursor-pointer ${
        isSelected ? "ring-2 ring-yellow-500" : ""
      }`}
      onClick={() => onSelect(data.id)}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(data.id)}
          className="w-5 h-5 accent-yellow-500"
        />
        <CiWallet className="w-6 h-6 text-yellow-400" />
        <div>
          <div className="text-xs text-gray-400">{data.address}</div>
          <div className="text-base font-semibold">{data.network}</div>
        </div>
        <FaTrash
          style={{ position: "absolute", right: "30px" }}
          className="text-red-500 text-lg cursor-pointer hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(data.id);
          }}
        />
      </div>
    </div>
  );
};

const getPaymentOptions = ({
  bettingBalance,
  bankAmount,
  setBankAmount,
  handleBankWithdraw,
  handleUsdtWithdraw,
  setUsdtInrAmount,
  setUsdtTokenAmount,
  usdtTokenAmount,
  usdtInrAmount,
  balance,
  selectedUSDTid,
  selectedBankId,
  withDrawLimit,
  handleInrChange,
  handleUsdtChange,
  USDT_TO_INR,
}) => [
  {
    name: <span style={{ color: "#8f5206", fontSize: "16px" }}>BANK CARD</span>,
    img: (isSelected) => (isSelected ? bankcard : redwallet),
    content: (
      <div className="bg-[#333332] text-white p-4 rounded-xl">
        {/* Amount Input */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Link to="/BankAccountForm">
            <div className="p-4 rounded-lg cursor-pointer">
              <img src={add} alt="add" className="h-12 w-12" />
            </div>
          </Link>
          <p className="text-gray-400 text-sm">Add a bank account number</p>
        </div>
        <div className="bg-neutral-800 rounded-b-lg p-3 flex items-center gap-2 mb-4">
          <span className="text-amber-500">₹</span>
          <input
            type="number"
            placeholder="Please enter the amount"
            value={bankAmount}
            onChange={(e) => setBankAmount(e.target.value)}
            className="bg-transparent w-full outline-none text-white placeholder-gray-400"
            min="0"
          />
        </div>
        {(Number(bankAmount) >
          Number(balance - (bettingBalance?.remaining_requirement || 0)) ||
          Number(bankAmount) < Number(withDrawLimit?.bank?.min || 0) ||
          Number(bankAmount) > Number(withDrawLimit?.bank?.max || Infinity)) &&
          (Number(bankAmount) >
          Number(balance - (bettingBalance?.remaining_requirement || 0)) ? (
            <p className="text-red-500 text-xs mb-3">
              Amount exceeds your withdrawable balance of ₹
              {Number(
                bankAmount -
                  (balance - (bettingBalance?.remaining_requirement || 0))
              ).toFixed(2)}
            </p>
          ) : (
            <p className="text-red-500 text-xs mb-3">
              Min amount should be ₹
              {Number(withDrawLimit?.bank?.min || 0).toFixed(2)} and max ₹
              {Number(withDrawLimit?.bank?.max || 0).toFixed(2)}
            </p>
          ))}

        {/* Balance Info */}
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Withdrawable balance</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">
              ₹
              {Number(balance - bettingBalance?.remaining_requirement).toFixed(
                2
              )}
            </span>
            <button
              onClick={() =>
                setBankAmount(balance - bettingBalance?.remaining_requirement)
              }
              className="text-amber-500 border border-amber-500 rounded px-2 py-0.5 text-xs hover:bg-amber-500 hover:text-black transition-colors"
            >
              All
            </button>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-6">
          <span className="text-gray-400">Withdrawal amount received</span>
          <span className="text-orange-200">
            ₹{bankAmount ? bankAmount : "0.0"}
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBankWithdraw}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black text-base font-semibold transition"
          disabled={
            Number(bankAmount) >
              Number(balance - bettingBalance?.remaining_requirement) ||
            !selectedBankId ||
            Number(bankAmount) < Number(withDrawLimit?.bank?.min || 0) ||
            Number(bankAmount) > Number(withDrawLimit?.bank?.max || Infinity)
          }
        >
          Withdraw
        </button>
        {bankAmount > 0 && selectedBankId == null && (
          <p className="text-red-500 text-xs mb-3 mt-2">
            Please select a bank.
          </p>
        )}
      </div>
    ),
  },
  {
    name: <span style={{ color: "#8f5206", fontSize: "16px" }}>USDT</span>,
    img: (isSelected) => (isSelected ? tpay : tpay),
    content: (
      <div className="bg-[#333332] p-4 rounded-xl ">
        <Link to="/AddUSDT">
          <div className="border-2 border-dashed border-zinc-700 rounded-lg h-[120px] flex items-center justify-center flex-col w-full cursor-pointer mb-4">
            <div className="p-4 rounded-lg cursor-pointer text-center">
              <img src={add} alt="add" className="h-12 w-12" />
              <p className="text-[#666462] text-xs mt-4 -ml-2">Add Address</p>
            </div>
          </div>
        </Link>
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <img src={tpay} className="w-6 h-6" alt="USDT" />
          <span className="text-white font-medium text-base">
            Select amount of USDT
          </span>
        </div>

        {/* INR Amount Input */}
        <div className="bg-neutral-800 p-3 rounded mb-3">
          <div className="flex items-center gap-2 text-amber-500 font-medium">
            <span className="text-lg">₹</span>
            <span>Please enter withdrawal amc (INR)</span>
          </div>
          <input
            type="number"
            value={usdtInrAmount}
            onChange={handleInrChange}
            className="bg-transparent w-full mt-2 outline-none text-white placeholder-gray-400"
            placeholder="INR amount"
            min="0"
          />
        </div>

        {/* USDT Token Amount Input */}
        <div className="bg-neutral-800 p-3 rounded mb-4">
          <div className="flex items-center gap-2 text-amber-500 font-medium">
            <img src={tpay} className="w-5 h-5" alt="Tether" />
            <span>Please enter UDST amount</span>
          </div>
          <input
            type="number"
            value={usdtTokenAmount}
            onChange={handleUsdtChange}
            className="bg-transparent w-full mt-2 outline-none text-white placeholder-gray-400"
            placeholder="USDT amount"
            min="0"
          />
        </div>

        {(Number(usdtInrAmount) >
          Number(balance - (bettingBalance?.remaining_requirement || 0)) ||
          Number(usdtInrAmount) < Number(withDrawLimit?.usdt?.min || 0) ||
          Number(usdtInrAmount) >
            Number(withDrawLimit?.usdt?.max || Infinity)) &&
          (Number(usdtInrAmount) >
          Number(balance - (bettingBalance?.remaining_requirement || 0)) ? (
            <p className="text-red-500 text-xs mb-3">
              Amount exceeds your withdrawable balance of ₹
              {Number(
                usdtInrAmount -
                  (balance - (bettingBalance?.remaining_requirement || 0))
              ).toFixed(2)}
            </p>
          ) : (
            <p className="text-red-500 text-xs mb-3">
              Min amount should be ₹
              {Number(withDrawLimit?.usdt?.min || 0).toFixed(2)} and max ₹
              {Number(withDrawLimit?.usdt?.max || 0).toFixed(2)}
            </p>
          ))}

        {/* Balance Info */}
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">
            Withdrawable balance{" "}
            <span className="text-amber-500">
              ₹
              {Number(balance - bettingBalance?.remaining_requirement).toFixed(
                2
              )}
            </span>
          </span>
          <button
            onClick={() => {
              setUsdtInrAmount(
                balance -
                  (bettingBalance?.remaining_requirement || 0).toFixed(2)
              );
              setUsdtTokenAmount(
                (
                  (balance - (bettingBalance?.remaining_requirement || 0)) /
                  USDT_TO_INR
                ).toFixed(2)
              );
            }}
            className="text-amber-500 border border-amber-500 rounded px-2 py-0.5 text-xs hover:bg-amber-500 hover:text-black transition"
          >
            All
          </button>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleUsdtWithdraw}
          className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-full text-base font-semibold"
          disabled={
            !usdtInrAmount ||
            selectedUSDTid == null ||
            Number(usdtInrAmount) >
              Number(balance - (bettingBalance?.remaining_requirement || 0)) ||
            Number(usdtInrAmount) < Number(withDrawLimit?.usdt?.min || 0) ||
            Number(usdtInrAmount) > Number(withDrawLimit?.usdt?.max || Infinity)
          }
        >
          Withdraw
        </button>
        {usdtInrAmount > 0 && selectedUSDTid == null && (
          <p className="text-red-500 text-xs mb-3 mt-2">
            Please select a USDT.
          </p>
        )}
      </div>
    ),
  },
];

const Withdraw = () => {
  const [selected, setSelected] = useState(0);
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(566.88);
  const [isLoading, setIsLoading] = useState(false);
  const [bankAccounts, setBankAccount] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [selectedUSDTid, setSelectedUSDTid] = useState(null);
  const [usdtData, setUsdtData] = useState([]);
  const [withdrawHistory, setWithDrawHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [bettingBalance, setBettingBalance] = useState([]);
  const [bankAmount, setBankAmount] = useState("");
  const withDrawLimit = {
    bank: {
      min: 110,
      max: 50000,
    },
    usdt: {
      min: 1000,
      max: 1000000,
    },
  };

  const [usdtInrAmount, setUsdtInrAmount] = useState("");
  const [usdtTokenAmount, setUsdtTokenAmount] = useState("");

  const USDT_TO_INR = 97;

  // When INR changes
  const handleInrChange = (e) => {
    const inr = e.target.value;
    setUsdtInrAmount(inr);
    if (!isNaN(inr) && inr !== "") {
      setUsdtTokenAmount((parseFloat(inr) / USDT_TO_INR).toFixed(2));
    } else {
      setUsdtTokenAmount("");
    }
  };

  // When USDT changes
  const handleUsdtChange = (e) => {
    const usdt = e.target.value;
    setUsdtTokenAmount(usdt);
    if (!isNaN(usdt) && usdt !== "") {
      setUsdtInrAmount((parseFloat(usdt) * USDT_TO_INR).toFixed(2));
    } else {
      setUsdtInrAmount("");
    }
  };

  const handleUsdtWithdraw = () => {
    handleWithDrawMoneyFromWallet(usdtInrAmount);
  };
  const handleBankWithdraw = () => {
    handleWithDrawMoneyFromWallet(bankAmount);
  };

  const fetchBankAccount = async () => {
    const data = await apiServices.getBankAccounts();
    setBankAccount(data?.data);
  };
  const fetchWalletBalance = async () => {
    const data = await apiServices.getWalletBalanceForWithDraw();
    setBalance(data?.wallet?.balance);
  };

  const fetchUsdtData = async () => {
    const data = await apiServices.getUSDTAccounts();
    setUsdtData(data?.data);
  };

  const fetchWithdrawals = async () => {
    try {
      const data = await apiServices.getWithdrawalHistory(page, 10);
      setWithDrawHistory(data.withdrawals || []);
    } catch (err) {
      setError("Failed to fetch withdrawal history");
    }
  };

  const fetchBettingBalance = async () => {
    let data = await apiServices.getBettingBalance();
    setBettingBalance(data?.data);
  };

  function fetchAllData() {
    fetchBankAccount();
    fetchWalletBalance();
    fetchUsdtData();
    fetchWithdrawals();
    fetchBettingBalance();
  }
  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  const handleWithdrawClick = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount to withdraw.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmWithdrawal = async () => {
    if (!otp) {
      setError("Please enter OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const withdrawalType = selected === 0 ? "BANK" : "USDT";
      const response = await apiServices.initiateWithdrawal({
        amount: parseFloat(amount),
        bank_account_id: 123, // Replace with actual bank account ID or USDT address
        withdrawal_type: withdrawalType,
      });

      if (response.success) {
        setBalance(response.newBalance);
        setWithdrawableBalance(response.newBalance);
        alert(response.message);
        setIsModalOpen(false);
        setAmount("");
        setOtp("");
      } else {
        setError("Withdrawal failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during withdrawal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOtp("");
    setError("");
  };

  const handleSelectAll = () => {
    setAmount(Number(withdrawableBalance).toFixed(2));
    setError("");
  };

  const handleSelect = (index) => {
    if (index == 1) {
      setSelected(1);
      setSelectedBankId(null);
    } else {
      setSelected(0);
      setSelectedUSDTid(null);
    }
  };

  const handleBankDelete = async (id) => {
    const data = await apiServices.deleteBankAccount(id);
    if (data.success == true) {
      fetchBankAccount();
    }
  };

  const handleUSDDelete = async (id) => {
    const data = await apiServices.deleteUSDTAccounts(id);
    if (data.success == true) {
      fetchUsdtData();
    }
  };

  const handleWithDrawMoneyFromWallet = async (amount) => {
    let accountIdType = selected == 0 ? "bank_account_id" : "usdt_account_id";
    let payload = {
      amount: amount,
      withdrawal_type: selected == 0 ? "BANK" : "USDT",
      [accountIdType]: selected == 0 ? selectedBankId : selectedUSDTid,
    };

    const data = await apiServices.withDrawMoneyFromWallet(payload);
    if (data?.success == true) {
      fetchAllData();
      setBankAmount("");
      setSelectedBankId(null);
    }
  };
  const paymentOptions = getPaymentOptions({
    bettingBalance,
    bankAmount,
    setBankAmount,
    handleBankWithdraw,
    handleUsdtWithdraw,
    setUsdtInrAmount,
    setUsdtTokenAmount,
    usdtTokenAmount,
    usdtInrAmount,
    balance,
    selectedUSDTid,
    selectedBankId,
    withDrawLimit,
    handleInrChange,
    handleUsdtChange,
    USDT_TO_INR,
  });

  return (
    <div className="bg-[#333332] min-h-screen flex flex-col items-center justify-center w-full mx-auto">
      <CommanHeader
        title="Withdraw"
        rightButtonText="Withdraw History"
        navigateValue="/withdraw-history"
      />
      <div className="w-full max-w-[400px] min-h-screen mt-8 bg-[#242424] p-3 text-[#8f5206] font-sans">
        {/* Balance Card */}
        <div
          className="p-4 rounded-xl mb-4 h-[140px] mt-4 relative"
          style={{
            backgroundImage: `url(${wcard})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img src={wallet} alt="icon" className="h-5 w-5" />
            <span className="text-sm text-white">Balance</span>
            <span className="material-symbols-outlined hover:rotate-180 transition-transform cursor-pointer text-white"></span>
          </div>

          <div className="flex items-center">
            <div className="text-3xl font-bold text-white mr-2">
              ₹{Number(balance).toFixed(2)}
            </div>
            <img
              src={refresh}
              alt="refresh icon"
              className="w-6 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {paymentOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`p-3 py-4 rounded-xl text-center cursor-pointer relative 
                ${selected === index ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]" : "bg-[#333332]"}`}
            >
              {typeof item.img === "function" ? (
                <img
                  src={item.img(selected === index)}
                  className="w-8 h-8 mx-auto mb-2"
                  alt={item.name}
                />
              ) : (
                <img
                  src={item.img}
                  className="w-8 h-8 mx-auto mb-2"
                  alt={item.name}
                />
              )}
              <div className="text-xs text-white">{item.name}</div>
            </div>
          ))}
        </div>

        {selected === 0 &&
          bankAccounts?.length > 0 &&
          bankAccounts?.map((bank, index) => {
            return (
              <BankCard
                key={index}
                bank={bank}
                isSelected={selectedBankId === bank.id}
                onSelect={(id) =>
                  setSelectedBankId((prev) => (prev === id ? null : id))
                }
                onDelete={handleBankDelete}
              />
            );
          })}

        {selected === 1 &&
          usdtData?.length > 0 &&
          usdtData?.map((data, index) => {
            return (
              <USDTCard
                key={index}
                data={data}
                isSelected={selectedUSDTid === data.id}
                onSelect={(id) =>
                  setSelectedUSDTid((prev) => (prev === id ? null : id))
                }
                onDelete={handleUSDDelete}
              />
            );
          })}

        {/* Selected Payment Option Content */}
        <div className="text-white rounded-lg">
          {paymentOptions[selected].content}
        </div>

        {/* Modal for Security Verification */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#2a2a2a] rounded-t-xl w-full max-w-[400px] p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-600">
                <img src={realtimecounticon} alt="icon" className="h-6 w-6" />
                <h2 className="text-white text-lg font-medium">
                  Security verification
                </h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <img src={emailiconn} alt="icon" className="h-4 w-6" />
                <p className="text-white">PLEASE ENTER OTP</p>
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Please enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full bg-neutral-700 text-white placeholder-gray-400 rounded-lg p-3 outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <p className="text-red-500 text-sm mb-4">
                To secure your balance, please enter OTP
              </p>
              <div className="flex justify-between text-sm mb-6">
                <button className="text-gray-400 hover:text-white">
                  Forget password?
                </button>
                <button className="text-gray-400 hover:text-white">
                  Contact customer service
                </button>
              </div>
              <div className="flex -mx-6">
                <button
                  onClick={handleCloseModal}
                  className="w-1/2 bg-neutral-700 text-white py-3 rounded-none hover:bg-neutral-600 transition-colors"
                >
                  Return
                </button>
                <button
                  onClick={handleConfirmWithdrawal}
                  disabled={isLoading}
                  className={`w-1/2 bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-none transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Processing..." : "Confirm withdrawal"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div id="webcrumbs" className="mt-4 rounded-xl">
          <div className="flex items-center gap-2 mb-8">
            <img src={copyicon} alt="icon" className="h-5 w-5" />
            <h2 className="text-white text-lg font-medium">
              Withdrawal History
            </h2>
          </div>
          {withdrawHistory && withdrawHistory.length > 0 ? (
            withdrawHistory
              .filter((withdrawal) =>
                selected === 0
                  ? withdrawal.withdrawal_type === "BANK"
                  : withdrawal.withdrawal_type === "USDT"
              )
              .map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="bg-[#333332] rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="bg-[#cc2f2f] text-white font-medium text-sm px-2 py-1 rounded">
                        Withdraw
                      </span>
                    </div>
                    <div className="ml-auto text-right">
                      <span
                        className={`text-sm font-medium ${
                          withdrawal.status === "success"
                            ? "text-green-500"
                            : withdrawal.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {withdrawal.status === "success"
                          ? "Completed"
                          : withdrawal.status === "pending"
                            ? "Pending"
                            : "Failed"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Balance</span>
                      <span className="text-amber-400 font-medium">
                        ₹{Number(withdrawal.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Type</span>
                      <span className="text-[#a8a5a1] font-medium">
                        {withdrawal.withdrawal_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Time</span>
                      <span className="text-[#a8a5a1] font-medium">
                        {formatDate(withdrawal.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Order Number</span>
                      <span className="text-[#a8a5a1] font-medium">
                        {withdrawal?.transaction_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Remark</span>
                      <span className="text-[#a8a5a1] font-medium">
                        {withdrawal?.rejection_reason || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-neutral-500 mb-8">No data</p>
          )}

          <div className="w-full px-4">
            <Link to="/withdraw-history">
              <button className="w-full py-3 px-4 bg-gradient-to-r from-[#fae59f] to-[#c4933f] transition-colors rounded-lg text-black font-medium flex items-center justify-center gap-2">
                All history
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
