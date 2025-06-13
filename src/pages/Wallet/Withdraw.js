import React, { useState } from "react";
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

const paymentOptions = [
  {
    name: (
      <span style={{ color: "#8f5206", fontSize: "16px", marginTop: "4px" }}>
        BANK CARD
      </span>
    ),
    img: (isSelected) => (isSelected ? bankcard : redwallet),
    content: (
      <div>
        <div className="bg-[#333332] text-white p-4 rounded-xl">
          <div className="flex flex-col items-center gap-2 mb-6">
            <Link to="/BankAccountForm">
              <div className="p-4 rounded-lg cursor-pointer">
                <img src={add} alt="add" className="h-12 w-12" />
              </div>
            </Link>
            <p className="text-gray-400 text-sm">Add a bank account number</p>
            <p className="text-red-500 text-xs">
              Need to add beneficiary information to be able to withdraw money
            </p>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3 bg-neutral-700 rounded-lg p-3">
              <span className="text-amber-500">₹</span>
              <input
                type="text"
                placeholder="Please enter the amount"
                className="bg-transparent w-full outline-none text-white placeholder-gray-400"
              />
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">Withdrawable balance</span>
              <span>₹0.00</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray-400">Withdrawal amount received</span>
              <div className="flex items-center gap-2">
                <span>₹0.00</span>
                <button className="text-amber-500 border border-amber-500 rounded px-2 py-0.5 text-xs hover:bg-amber-500 hover:text-black transition-colors">
                  All
                </button>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-full transition-colors">
              Withdraw
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-amber-500">◆</span>
              <span>Need to bet ₹7700 to be able to withdraw</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-amber-500">◆</span>
              <span>
                Withdraw time <span className="text-red-500">00:00-23:59</span>
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-amber-500">◆</span>
              <span>
                Inday Remaining Withdrawal Times{" "}
                <span className="text-red-500">3</span>
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-amber-500">◆</span>
              <span>
                Withdrawal amount range{" "}
                <span className="text-red-500">₹110.00-₹50,000.00</span>
              </span>
            </p>
            <p className="flex items-center gap-2 text-gray-400">
              <span className="text-amber-500">◆</span>
              <span>
                Please confirm your beneficiary account information before
                withdrawing. If your information is incorrect, our company will
                not be liable for the amount of loss
              </span>
            </p>
            <p className="flex items-center gap-2 text-gray-400">
              <span className="text-amber-500">◆</span>
              <span>
                If your beneficial information is incorrect, please contact
                customer service
              </span>
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: (
      <span style={{ color: "#8f5206", fontSize: "16px", marginTop: "4px" }}>
        USDT
      </span>
    ),
    img: (isSelected) => (isSelected ? tpay : tpay),
    content: (
      <div>
        <div className="bg-[#333332] rounded-lg">
          <Link to="/AddUSDT">
            <div className="border-2 border-dashed border-zinc-700 rounded-lg h-[120px] flex items-center justify-center flex-col w-full cursor-pointer">
              <div className="p-4 rounded-lg cursor-pointer text-center">
                <img src={add} alt="add" className="h-12 w-12" />
                <p className="text-[#666462] text-xs mt-4 -ml-2">Add Address</p>
              </div>
            </div>  
            </Link>
          </div>

          <p className="text-red-500 text-xs mt-2 whitespace-nowrap">
            Ensure that beneficiary information is correctly added before
            proceeding.
          </p>

          <div className="bg-[#333332] p-4 mt-4 rounded-2xl font-['Open_Sans']">
            <div className="flex items-center gap-2 mb-6">
              <img src={tpay} className="w-6 h-6" alt="USDT" />
              <span className="text-white font-medium">
                Select amount of USDT
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-neutral-800 rounded-lg p-3 flex items-center">
                <span className="text-amber-500 mr-2">₹</span>
                <input
                  type="text"
                  placeholder="Please enter withdrawal amount"
                  className="bg-transparent w-full outline-none text-gray-300"
                />
              </div>

              <div className="bg-neutral-800 rounded-lg p-3 flex items-center">
                <img src={tpay} className="w-6 h-6 mr-2" alt="USDT" />
                <input
                  type="text"
                  placeholder="Please enter USDT amount"
                  className="bg-transparent w-full outline-none text-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-amber-500 text-sm">
                Withdrawable balance ₹0.00
              </span>
              <button className="text-amber-500 text-sm border border-amber-500 rounded px-3 py-1 hover:bg-amber-500 hover:text-black transition">
                All
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {[
                {
                  text: "Need to bet ₹7700 to be able to withdraw",
                  highlight: "text-red-500",
                },
                {
                  text: "Withdraw time 00:00-23:59",
                  highlight: "text-amber-500",
                },
                {
                  text: "Inday Remaining Withdrawal Times 5",
                  highlight: "text-red-500",
                },
                {
                  text: "Withdrawal amount range ₹1,000.00 - ₹10,000,000.00",
                  highlight: "text-red-500",
                },
                {
                  text: "After withdraw, you need to confirm the blockchain main network 3 times before it arrives at your account.",
                },
                {
                  text: "Please confirm that the operating environment is safe to avoid information being tampered with or leaked.",
                },
                {
                  text: "Please confirm your beneficial account information before withdrawing. If your information is incorrect, our company will not be liable for the amount of loss",
                },
                {
                  text: "If your beneficial information is incorrect, please contact customer service.",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-amber-500">♦</span>
                  <span className="text-gray-300">
                    {item.text.split(" ").map((word, i) =>
                      word.startsWith("₹") || word.match(/\d+/) ? (
                        <span
                          key={i}
                          className={item.highlight || "text-gray-300"}
                        >
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
  const [balance, setBalance] = useState(115.49);
  const [withdrawableBalance, setWithdrawableBalance] = useState(566.88);
  const [isLoading, setIsLoading] = useState(false);

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
    setAmount(withdrawableBalance.toFixed(2));
    setError("");
  };

  return (
    <div className="bg-[#333332] min-h-screen flex flex-col items-center justify-center w-full mx-auto">
      <WithdrawHeader />
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
            <div className="text-3xl font-bold text-white mr-2">₹{balance.toFixed(2)}</div>
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
              onClick={() => setSelected(index)}
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
                <h2 className="text-white text-lg font-medium">Security verification</h2>
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

        <div id="webcrumbs" className="mt-4 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-8">
            <img src={copyicon} alt="icon" className="h-5 w-5" />
            <h2 className="text-white text-lg font-medium">
              Withdrawal History
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-neutral-800 rounded-lg transform rotate-12"></div>
              <div className="absolute inset-0 bg-neutral-700 rounded-lg transform -rotate-6"></div>
              <div className="absolute inset-0 bg-neutral-600 rounded-lg">
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-neutral-500 rounded-sm"></div>
                <div className="absolute left-2 top-2 w-2 h-2 bg-neutral-500 rounded-full"></div>
                <div className="absolute left-2 bottom-2 w-2 h-2 bg-neutral-500 rounded-full"></div>
                <div className="absolute right-2 bottom-2 w-2 h-2 bg-neutral-500 rounded-full"></div>
              </div>
            </div>

            <p className="text-neutral-500 mb-8">No data</p>
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
    </div>
  );
};

export default Withdraw;