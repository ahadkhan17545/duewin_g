import React, { useEffect, useMemo, useState } from "react";
import DepositHeader from "../../components/DepositHeader";
import { AiOutlineFileText } from "react-icons/ai";
import { BsDiamondFill } from "react-icons/bs";
import bgImage from "../../Assets/wcard.png";
import balanceIcon from "../../Assets/wbal.png";
import paytm from "../../Assets/gamesimage/paytm.png";
import upi from "../../Assets/gamesimage/UPI.png";
import all from "../../Assets/gamesimage/all.png";
import tpay from "../../Assets/gamesimage/Tpay.png";
import paythird from "../../Assets/newIcon/paythird.png";
import cross from "../../Assets/cross.png";
import iconshouming from "../../Assets/finalicons/iconshouming.png";
import deposit from "../../Assets/finalicons/deposit-copy-icon.png";
import { FaCopy } from "react-icons/fa"; // Copy icon
import { Check } from "lucide-react"; // White tick icon from lucide-react
import iconquickpay from "../../Assets/finalicons/iconquickpay.png";
import refresh from "../../Assets/finalicons/refresh.png";
import apiServices from "../../api/apiServices";
import CommanHeader from "../../components/CommanHeader";
import walletImage from "../../Assets/newIcon/savewalleticon.png";
import iconInr from "../../Assets/finalicons/iconinr.png";
import gift from "../../Assets/trx/gift.png";
const Deposit = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("UPI");
  const [paymentChannelList, setPaymentChannelList] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [usdtChannel, setUsdtChannel] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAmountSelected, setIsAmountSelected] = useState(false);

  const [showPopup, setShowPopup] = useState({
    visible: false,
    orderNumber: "",
  }); // State for popup
  const [withdrawHistory, setWithDrawHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [page, setPage] = useState(1);

  const fetchWithdrawals = async () => {
    try {
      const data = await apiServices.getDepositHistory(page, 10);
      setWithDrawHistory(data.recharges || []);
    } catch (err) {
      // setError("Failed to fetch withdrawal history");
      console.log(err);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await apiServices?.getWalletBalance();
      if (response?.success && response?.mainWallet) {
        const balance = Number(response.mainWallet.balance) || 0;
        const thirdPartyBalance =
          Number(response?.thirdPartyWallet?.balance) || 0;
        setWalletBalance((balance + thirdPartyBalance).toFixed(2));
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      setWalletBalance(0);
    }
  };

  const fetchAvailableGateways = async () => {
    try {
      const response = await apiServices?.getAllPayments();

      if (response?.data?.gateways) {
        // Filter UPI gateways (not USDT)
        const upiGateways = response.data.gateways
          .filter((item) => item?.name !== "USDT WG Pay")
          .map((gateway, index) => ({
            ...gateway,
            isHighlight: index === 0, // First gateway highlighted by default
            balance: `${gateway.min_amount} - ${gateway.max_amount}`, // Format balance range
            key: gateway.code || gateway.name, // Use code if available, otherwise name
          }));

        // Filter USDT gateways
        const usdtGateways = response.data.gateways
          .filter((item) => item?.name === "USDT WG Pay")
          .map((gateway) => ({
            ...gateway,
            balance: `${gateway.min_amount} - ${gateway.max_amount}`, // Format balance range
            key: gateway.code || gateway.name,
            bonus: gateway.bonus || "", // Add bonus if available
          }));

        setPaymentChannelList(upiGateways);
        setUsdtChannel(usdtGateways);

        // Auto-select first UPI gateway if available
        if (upiGateways.length > 0) {
          setSelectedChannel(upiGateways[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch gateways:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    fetchWalletBalance();
    fetchAvailableGateways();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setInputAmount(value);
      setIsAmountSelected(value !== "");
    }
  };

  const handlePresetAmountClick = (amount) => {
    let numericAmount = amount;
    if (typeof amount === "string" && amount.toLowerCase().includes("k")) {
      numericAmount = parseFloat(amount) * 1000;
    }

    setInputAmount(numericAmount.toString());
    setIsAmountSelected(true);
  };

  const handleChannelSelect = (selected) => {
    // Update paymentChannelList highlighting
    const updatedChannels = paymentChannelList.map((channel) => ({
      ...channel,
      isHighlight: channel.id === selected.id, // Use id for comparison
    }));
    setPaymentChannelList(updatedChannels);
    setSelectedChannel(selected);
  };

  const handleUsdtChannelSelect = (selected) => {
    setSelectedChannel(selected);
  };

  const handlePaymentWaySelect = (payment) => {
    setSelectedPayment(payment.key);
    // Reset channel selection when payment method changes
    setSelectedChannel(null);

    // Auto-select first available channel for the selected payment method
    if (payment.key === "UPI" && paymentChannelList.length > 0) {
      const firstChannel = { ...paymentChannelList[0], isHighlight: true };
      const updatedChannels = paymentChannelList.map((channel, index) => ({
        ...channel,
        isHighlight: index === 0,
      }));
      setPaymentChannelList(updatedChannels);
      setSelectedChannel(firstChannel);
    } else if (payment.key === "USDT" && usdtChannel.length > 0) {
      setSelectedChannel(usdtChannel[0]);
    }
  };

  const clearInput = () => {
    setInputAmount("");
    setIsAmountSelected(false);
  };

  const handleCopyOrderNumber = (orderNumber) => {
    navigator.clipboard.writeText(orderNumber);
    setShowPopup({ visible: true, orderNumber });
    setTimeout(() => setShowPopup({ visible: false, orderNumber: "" }), 2000); // Hide popup after 2 seconds
  };

  const submitPayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) < 100) {
      alert("Please enter a valid amount (minimum ₹100)");
      return;
    }

    if (!selectedChannel) {
      alert("Please select a payment channel");
      return;
    }

    // Check if amount is within gateway limits
    if (
      selectedChannel.min_amount &&
      Number(inputAmount) < selectedChannel.min_amount
    ) {
      alert(`Minimum amount is ₹${selectedChannel.min_amount}`);
      return;
    }

    if (
      selectedChannel.max_amount &&
      Number(inputAmount) > selectedChannel.max_amount
    ) {
      alert(`Maximum amount is ₹${selectedChannel.max_amount}`);
      return;
    }

    const payload = {
      amount: Number(inputAmount),
      gateway:
        selectedChannel.key || selectedChannel.code || selectedChannel.name,
    };

    // Add pay_type for specific gateways if needed
    if (selectedChannel.key === "OKPAY" || selectedChannel.name === "OKPAY") {
      payload.pay_type = selectedPayment;
    }

    try {
      setIsSubmitting(true);
      const res = await apiServices.depositPayment(payload);
      if (res?.success) {
        window.location.href = res?.paymentUrl;
        setInputAmount("");
        setSelectedChannel(null);
        setIsAmountSelected(false);
      } else {
        alert(res?.message || "Deposit failed. Please try again.");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("An error occurred while processing the deposit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitUsdtPayment = async () => {
    if (!selectedChannel) {
      alert("Please select a USDT channel");
      return;
    }

    if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) < 10) {
      alert("Please enter a valid USDT amount (minimum 10 USDT)");
      return;
    }
    const payload = {
      amount: Number(rupeesAmount),
      gateway:
        selectedChannel.key || selectedChannel.code || selectedChannel.name,
    };

    try {
      setIsSubmitting(true);
      const res = await apiServices.depositPayment(payload);
      if (res?.success) {
        window.location.href = res?.paymentUrl;
        setInputAmount("");
        setSelectedChannel(null);
        setIsAmountSelected(false);
      } else {
        alert(res?.message || "Deposit failed. Please try again.");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("An error occurred while processing the deposit.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const rupeesAmount = useMemo(() => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return "";
    return (amount * 93).toFixed(2);
  }, [inputAmount]);

  const generateUsdtPresetAmounts = (minAmount = 10) => {
    const baseAmounts = [];

    // Start with the minimum amount
    baseAmounts.push(minAmount.toString());

    // Generate USDT preset amounts
    if (minAmount <= 10) {
      baseAmounts.push("50", "100", "500", "1K", "5K");
    } else if (minAmount <= 50) {
      baseAmounts.push("100", "500", "1K", "5K", "10K");
    } else {
      // Scale for higher amounts
      const multipliers = [2, 5, 10, 20, 50];
      multipliers.forEach((mult) => {
        const amount = minAmount * mult;
        if (amount < 1000) {
          baseAmounts.push(amount.toString());
        } else {
          baseAmounts.push(`${Math.floor(amount / 1000)}K`);
        }
      });
    }

    return [...new Set(baseAmounts)].slice(0, 6);
  };

  const generatePresetAmounts = (minAmount) => {
    const baseAmounts = [];

    // Start with the minimum amount
    baseAmounts.push(minAmount.toString());

    // Generate preset amounts based on min_amount
    if (minAmount <= 100) {
      baseAmounts.push("500", "1K", "5K", "10K", "20K", "50K");
    } else if (minAmount <= 500) {
      baseAmounts.push("1K", "5K", "10K", "20K", "50K", "100K");
    } else if (minAmount <= 1000) {
      baseAmounts.push("5K", "10K", "20K", "50K", "100K", "500K");
    } else {
      // For higher minimum amounts, scale accordingly
      const multipliers = [2, 5, 10, 20, 50, 100];
      multipliers.forEach((mult) => {
        const amount = minAmount * mult;
        if (amount < 1000) {
          baseAmounts.push(amount.toString());
        } else if (amount < 100000) {
          baseAmounts.push(`${Math.floor(amount / 1000)}K`);
        } else {
          baseAmounts.push(`${Math.floor(amount / 100000)}L`);
        }
      });
    }

    // Remove duplicates and return first 6 amounts
    return [...new Set(baseAmounts)].slice(0, 6);
  };
  return (
    <div className="bg-[#242424] min-h-screen flex flex-col w-full items-center justify-center mt-4">
      <CommanHeader
        title="Deposit"
        rightButtonText="Deposit History"
        navigateValue="/deposit-history"
      />
      <div className="w-full min-h-screen mt-8 bg-[#242424] p-3 text-[#8f5206] font-sans">
        {/* Balance Card */}
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100%",
            backgroundPosition: "top",
            borderRadius: ".26667rem",
            height: "160px",
            marginBottom: "10px",
          }}
          className="bg-cover bg-center p-4 rounded-xl h-[145px] flex flex-col justify-between relative"
        >
          <div className="flex items-center space-x-2">
            <img src={balanceIcon} alt="Balance Icon" className="w-4 h-4" />
            <span className="text-sm">Balance</span>
          </div>

          <div className="absolute top-[30%] left-4 flex items-center gap-2 text-3xl font-bold">
            ₹{walletBalance}
            <img
              onClick={fetchWalletBalance}
              src={refresh}
              alt="icon"
              className="h-5 w-7 cursor-pointer"
            />
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          {[
            { name: "UPI-QRpay", img: upi, key: "UPI" },
            { name: "Wake UP-APP", img: paythird, key: "WAKE_UP" },
            { name: "USDT", img: tpay, key: "USDT" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => handlePaymentWaySelect(item)}
              className={`p-1 rounded-md text-center cursor-pointer relative flex flex-col items-center justify-center ${
                selectedPayment === item.key
                  ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                  : "bg-[#333332] hover:bg-neutral-700"
              }`}
              style={{ width: "79px", height: "87px" }}
            >
              {/* Gift icon for USDT */}
              {item.key === "USDT" && (
                <>
                  <img
                    src={gift}
                    className="absolute top-[1px] right-[1px] w-7 h-7 z-10"
                    alt="Gift"
                  />
                  <span className="absolute top-[9px] right-[1px] w-6 h-6 z-10 text-[#fff] text-[12px]">3%</span>
                </>
              )}

              <img
                src={item.img}
                className="w-12 h-12 mx-auto mb-2"
                alt={item.name}
              />
              <div
                className="text-base text-xs"
                style={{
                  color: selectedPayment === item.key ? "#8f5206" : "#a8a5a1",
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* UPI Payment Flow */}
        {selectedPayment === "UPI" && (
          <>
            {/* Payment Channels */}
            <div className="bg-[#333332] p-3 rounded-xl mt-4">
              <div className="flex items-center gap-2 mb-3">
                <img src={iconquickpay} alt="icon" className="h-8 w-8" />
                <span className="font-semibold text-white">Select channel</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentChannelList?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`p-3 rounded-xl cursor-pointer transition relative ${
                      item.isHighlight
                        ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8F5206]"
                        : "bg-[#4d4d4c] hover:bg-neutral-700"
                    }`}
                    onClick={() => handleChannelSelect(item)}
                  >
                    <div
                      className="font-semibold text-neutral-400 text-sm"
                      style={{
                        color: item.isHighlight ? "#8F5206" : "#a8a5a1",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      className="text-neutral-400 text-sm"
                      style={{
                        color: item.isHighlight ? "#8F5206" : "#a8a5a1",
                      }}
                    >
                      Balance: ₹{item.balance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#d9ac4f]">
                  <img src={walletImage} width={24} height={24} />
                </span>
                <h2 className="text-lg font-semibold">Deposit amount</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {generatePresetAmounts(selectedChannel?.min_amount || 100).map(
                  (amount) => (
                    <button
                      key={amount}
                      onClick={() => handlePresetAmountClick(amount)}
                      className="border border-[#666462] hover:bg-neutral-700 transition-colors rounded-lg py-2 text-[#d9ac4f]"
                    >
                      <span className="text-[#666462]"> ₹ </span> {amount}
                    </button>
                  )
                )}
              </div>

              <div className="relative mb-6">
                <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3">
                  {/* <span className="text-[#d9ac4f] mr-2">₹</span> */}
                  <img src={iconInr} alt="icon" className="h-4 w-4 mr-2" />
                  <input
                    type="text"
                    placeholder="Please enter the amount"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-transparent w-full outline-none placeholder-neutral-400"
                    min={selectedChannel?.min_amount || 100}
                    max={selectedChannel?.max_amount}
                  />
                  {inputAmount && (
                    <button
                      onClick={() => setInputAmount("")}
                      className="ml-2 p-1 hover:bg-neutral-700 rounded-full transition-colors"
                      aria-label="Clear input"
                    >
                      <svg
                        className="h-4 w-4 text-neutral-400 hover:text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <button
                className={`w-full transition-colors rounded-full py-3 mb-2 ${
                  selectedPayment &&
                  selectedChannel &&
                  inputAmount &&
                  Number(inputAmount) >= (selectedChannel?.min_amount || 100)
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                    : "bg-[#6f7381] text-white"
                }`}
                disabled={
                  !selectedPayment ||
                  !selectedChannel ||
                  !inputAmount ||
                  Number(inputAmount) < (selectedChannel?.min_amount || 100) ||
                  isSubmitting
                }
                onClick={submitPayment}
              >
                {isSubmitting ? "Processing..." : "Deposit"}
              </button>
            </div>

            {/* Recharge Instructions */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <img src={iconshouming} alt="icon" className="h-8 w-8" />
                  <h3 className="font-semibold text-[#f5f3f0]">
                    Recharge Instructions
                  </h3>
                </div>

                <div className="border p-4 rounded-xl space-y-2 border-[#666462]">
                  {[
                    "If the transfer time is up, please fill out the deposit form again.",
                    "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
                    "If you transfer the wrong amount, our company will not be responsible for the lost amount!",
                    "Note: do not cancel the deposit order after the money has been transferred.",
                  ].map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-neutral-400 text-sm"
                    >
                      <BsDiamondFill className="text-amber-500 text-sm mt-1" />
                      <p>{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {selectedPayment === "WAKE_UP" && (
          <>
            {/* Payment Channels */}
            <div className="bg-[#333332] p-3 rounded-xl mt-4">
              <div className="flex items-center gap-2 mb-3">
                <img src={iconquickpay} alt="icon" className="h-8 w-8" />
                <span className="font-semibold text-white">Select channel</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentChannelList?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`p-3 rounded-xl cursor-pointer transition relative ${
                      item.isHighlight
                        ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8F5206]"
                        : "bg-[#4d4d4c] hover:bg-neutral-700"
                    }`}
                    onClick={() => handleChannelSelect(item)}
                  >
                    <div
                      className="font-semibold text-neutral-400 text-sm"
                      style={{
                        color: item.isHighlight ? "#8F5206" : "#a8a5a1",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      className="text-neutral-400 text-sm"
                      style={{
                        color: item.isHighlight ? "#8F5206" : "#a8a5a1",
                      }}
                    >
                      Balance: ₹{item.balance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#d9ac4f]">
                  <img src={walletImage} width={24} height={24} />
                </span>
                <h2 className="text-lg font-semibold">Deposit amount</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {generatePresetAmounts(selectedChannel?.min_amount || 100).map(
                  (amount) => (
                    <button
                      key={amount}
                      onClick={() => handlePresetAmountClick(amount)}
                      className="border border-[#666462] hover:bg-neutral-700 transition-colors rounded-lg py-2 text-[#d9ac4f]"
                    >
                      <span className="text-[#666462]"> ₹ </span> {amount}
                    </button>
                  )
                )}
              </div>

              <div className="relative mb-6">
                <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3">
                  {/* <span className="text-[#d9ac4f] mr-2">₹</span> */}
                  <img src={iconInr} alt="icon" className="h-4 w-4 mr-2" />
                  <input
                    type="text"
                    placeholder="Please enter the amount"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-transparent w-full outline-none placeholder-neutral-400"
                    min={selectedChannel?.min_amount || 100}
                    max={selectedChannel?.max_amount}
                  />
                  {inputAmount && (
                    <button
                      onClick={() => setInputAmount("")}
                      className="ml-2 p-1 hover:bg-neutral-700 rounded-full transition-colors"
                      aria-label="Clear input"
                    >
                      <svg
                        className="h-4 w-4 text-neutral-400 hover:text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <button
                className={`w-full transition-colors rounded-full py-3 mb-2 ${
                  selectedPayment &&
                  selectedChannel &&
                  inputAmount &&
                  Number(inputAmount) >= (selectedChannel?.min_amount || 100)
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                    : "bg-[#6f7381] text-white"
                }`}
                disabled={
                  !selectedPayment ||
                  !selectedChannel ||
                  !inputAmount ||
                  Number(inputAmount) < (selectedChannel?.min_amount || 100) ||
                  isSubmitting
                }
                onClick={submitPayment}
              >
                {isSubmitting ? "Processing..." : "Deposit"}
              </button>
            </div>

            {/* Recharge Instructions */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <img src={iconshouming} alt="icon" className="h-8 w-8" />
                  <h3 className="font-semibold text-[#f5f3f0]">
                    Recharge Instructions
                  </h3>
                </div>

                <div className="border p-4 rounded-xl space-y-2 border-[#666462]">
                  {[
                    "If the transfer time is up, please fill out the deposit form again.",
                    "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
                    "If you transfer the wrong amount, our company will not be responsible for the lost amount!",
                    "Note: do not cancel the deposit order after the money has been transferred.",
                  ].map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-neutral-400 text-sm"
                    >
                      <BsDiamondFill className="text-amber-500 text-sm mt-1" />
                      <p>{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* USDT Payment Flow */}
        {selectedPayment === "USDT" && (
          <>
            {/* Select Channel Section */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-3">
                <img src={iconquickpay} alt="icon" className="h-7 w-7" />
                <span className="font-semibold text-white">Select channel</span>
              </div>
              <div className="space-y-2">
                {usdtChannel?.map((item, index) => (
                  <div
                    key={item.id || index}
                    onClick={() => handleUsdtChannelSelect(item)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                      selectedChannel?.id === item.id
                        ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                        : "bg-[#4d4d4c] hover:bg-neutral-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <img src={tpay} alt="icon" className="h-10 w-10 mr-4" />
                      <div>
                        <div
                          className="font-semibold text-[14px]"
                          style={{
                            color:
                              selectedChannel?.id === item.id
                                ? "#8F5206"
                                : "#a8a5a1",
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          className="text-[14px]"
                          style={{
                            color:
                              selectedChannel?.id === item.id
                                ? "#8F5206"
                                : "#a8a5a1",
                          }}
                        >
                          ₹{item.balance}
                        </div>
                      </div>
                    </div>
                    <div className="text-amber-500 text-sm">{item.bonus}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Amount of USDT */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-6">
                <img src={tpay} alt="icon" className="h-7 w-7" />
                <h2 className="text-lg font-semibold">Select amount of USDT</h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {generateUsdtPresetAmounts(
                  selectedChannel?.min_amount || 100
                ).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handlePresetAmountClick(amount)}
                    className="border border-[#666462] hover:bg-neutral-700 transition-colors rounded-lg py-2 text-[#d9ac4f]"
                  >
                    <span className="text-[#666462]"> ₹ </span> {amount}
                  </button>
                ))}
              </div>

              <div className="relative mb-4">
                <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3">
                  <img src={tpay} alt="icon" className="h-6 w-6 mr-2" />
                  <input
                    type="text"
                    placeholder="Please enter USDT amount"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-transparent w-full outline-none placeholder-neutral-400 text-white hide-scrollbar"
                    min="10"
                  />
                  <button
                    onClick={clearInput}
                    className="text-neutral-400 hover:text-neutral-300"
                  >
                    <img src={cross} alt="cross" className="h-7 w-8" />
                  </button>
                </div>
                <div className="relative mb-4 mt-2">
                  <div className="flex items-center bg-neutral-800 rounded-full px-4 py-3 opacity-75">
                    <div className="h-6 w-6 mr-2 flex items-center justify-center text-yellow-500 font-bold">
                      ₹
                    </div>
                    <input
                      type="text"
                      placeholder="Rupees equivalent will appear here"
                      value={rupeesAmount ? `₹ ${rupeesAmount}` : 0}
                      disabled
                      className="bg-transparent w-full outline-none placeholder-neutral-500 text-neutral-300 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <button
                className={`w-full transition-colors rounded-full py-3 ${
                  selectedChannel && inputAmount && Number(inputAmount) >= 10
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                    : "bg-[#6f7381] text-white"
                }`}
                disabled={
                  !selectedChannel ||
                  !inputAmount ||
                  Number(inputAmount) < 10 ||
                  isSubmitting
                }
                onClick={submitUsdtPayment}
              >
                {isSubmitting ? "Processing..." : "Deposit"}
              </button>
            </div>

            {/* Recharge Instructions */}
            <div className="bg-[#333332] mt-4 p-3 rounded-xl text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <img src={iconshouming} alt="icon" className="h-8 w-8" />
                  <h3 className="font-semibold text-[#f5f3f0]">
                    Recharge Instructions
                  </h3>
                </div>

                <div className="border p-4 rounded-xl space-y-2 border-[#666462]">
                  {[
                    "Minimum deposit: 10USDT, deposits less than 10USDT will not be credited",
                    "Do not deposit any non-currency assets to the above address, or the assets will not be recovered.",
                    "Please confirm that the operating environment is safe to avoid information being tampered with or leaked.",
                    "The transfer amount must match the order you created, otherwise the money cannot be credited successfully.",
                    "Note: do not cancel the deposit order after the money has been transferred.",
                  ].map((instruction, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-neutral-400 text-sm"
                    >
                      <BsDiamondFill className="text-amber-500 text-sm mt-1" />
                      <p>{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Deposit History */}
        <div className="bg-[#242424] rounded-xl font-sans mt-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={deposit} alt="icon" className="h-6 w-6" />
            <h2 className="text-neutral-200 text-lg font-medium">
              Deposit history
            </h2>
          </div>
        </div>

        {withdrawHistory?.length > 0 &&
          withdrawHistory?.map((item, index) => {
            return (
              <div key={index} className="space-y-4 pb-2">
                <div className="bg-[#333332] p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-3 border-b py-2 border-[#666462]">
                    <button className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-1.5 rounded-md text-white text-sm">
                      Deposit
                    </button>
                    <span
                      className="text-emerald-500 text-sm"
                      style={{ textTransform: "capitalize" }}
                    >
                      {item?.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Balance</span>
                      <span className="text-[#dd9138]">₹{item?.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Type</span>
                      <span className="text-[#a8a5a1]">
                        {item?.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Time</span>
                      <span className="text-[#a8a5a1]">
                        {(item?.created_at).split("T")[0]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a8a5a1]">Order number</span>
                      <div className="flex items-center">
                        <span className="text-[#a8a5a1]">{item?.order_id}</span>
                        <button
                          onClick={() => handleCopyOrderNumber(item?.order_id)}
                          className="ml-2 text-neutral-400 hover:text-neutral-300"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        <div className="px-2 mt-6">
          <button className="w-full mb-4 bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] transition py-2 rounded-full font-medium">
            All history
          </button>
        </div>

        {/* Popup for Copy Success */}
        {showPopup.visible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg flex flex-col items-center w-32 h-32">
              <svg
                className="w-20 h-20 text-white mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M10 24l10 10L38 14"
                ></path>
              </svg>
              <span className="text-sm font-sans text-center">
                Copy successful
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;
