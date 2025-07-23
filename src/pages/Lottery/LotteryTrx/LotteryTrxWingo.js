import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import walletbggame from "../../../Assets/walletbggame.png";
import Timecolor from "../../../Assets/timecolor.png";
import Timeblack from "../../../Assets/timeblack.png";
import refresh from "../../../Assets/refresh.png";
import trxbg from "../../../Assets/newIcon/trxbg.png";
import question from "../../../Assets/newIcon/questionIcon.png";
import empty from "../../../Assets/empty.png";
import wallet from "../../../Assets/wallets.png";
import fire from "../../../Assets/fire.png";
import HowToPlay from "../../../Assets/finalicons/howtoplayicon.png";
import searchicon from "../../../Assets/finalicons/searchicon.png";
import speaker from "./../../../Assets/speaker.png";
import invitation from "../../../Assets/invitation.png";
import LotteryWingoheader from "../../../components/LotteryWingoheader";
import agree from "./../../../Assets/agree-a.png";
import notAgree from "./../../../Assets/agree-b.png";
import gameApi from "../../../api/gameAPI";
import apiServices, { getWalletBalance } from "../../../api/apiServices";
import useSocket from "../../../hooks/useSocket";

import img0 from "../../../Assets/WingoNew/n0-30bd92d1.png";
import img1 from "../../../Assets/WingoNew/n1-dfccbff5.png";
import img2 from "../../../Assets/WingoNew/n2-c2913607.png";
import img3 from "../../../Assets/WingoNew/n3-f92c313f.png";
import img4 from "../../../Assets/WingoNew/n4-cb84933b.png";
import img5 from "../../../Assets/WingoNew/n5-49d0e9c5.png";
import img6 from "../../../Assets/WingoNew/n6-a56e0b9a.png";
import img7 from "../../../Assets/WingoNew/n7-5961a17f.png";
import img8 from "../../../Assets/WingoNew/n8-d4d951a4.png";
import img9 from "../../../Assets/WingoNew/n9-a20f6f42.png";
import CommanHeader from "../../../components/CommanHeader";
import FreezePopup from "../../../components/FreezePopup";
import ChartConnectorCanvas from "../../../utils/charConnectorCavas";
import Notification from "../../Notification";
import ResultPopUp from "../../../components/ResultPopUp";

const buttonData = [
  {
    id: 0,
    title: (
      <>
        Trx Wingo <br /> 30
      </>
    ),
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 30,
  },
  {
    id: 1,
    title: "Trx Wingo 1Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 60,
  },
  {
    id: 2,
    title: "Trx Wingo 3Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 180,
  },
  {
    id: 3,
    title: "Trx Wingo 5Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 300,
  },
];

const numberImages = [
  img0,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
];

const tailwindColorMap = {
  Green: "bg-green-600 hover:bg-green-500",
  Violet: "bg-violet-600 hover:bg-violet-500",
  Red: "bg-red-600 hover:bg-red-500",
  Big: "bg-orange-600 hover:bg-orange-500",
  Small: "bg-blue-600 hover:bg-blue-500",
  Number: "bg-gray-600 hover:bg-gray-500",
};
const CopyIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);
function LotteryTrxWingo() {
  const isMounted = useRef(true);
  const location = useLocation();
  const gameType = "trx_wix";
  const [activeTab, setActiveTab] = useState("gameHistory");
  const [activeButton, setActiveButton] = useState(
    location?.state ? location?.state : buttonData[0].id
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMultiplier, setSelectedMultiplier] = useState("X1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [betType, setBetType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0.24);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [totalPages, setTotalPages] = useState(5);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [currentPeriod, setCurrentPeriod] = useState({
    periodId: "Loading...",
  });
  const [isPeriodTransitioning, setIsPeriodTransitioning] = useState(false);
  const [checked, setChecked] = useState(true);
  const [userBets, setUserBets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const multiplierOptions = ["X1", "X5", "X10", "X20", "X50", "X100"];
  const [fetchDataFlag, setFetchDataFlag] = useState(false);
  const API_BASE_URL = "https://api.strikecolor1.com";
  const [refetchData, setRefetchData] = useState(false);
  const [userDidBet, setUserDidBet] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [gameHistoryData, setGameHistoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const containerRef3 = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showLossPopup, setShowLossPopup] = useState(false);
  const [showWinPopupChecked, setShowWinPopupChecked] = useState(false);
  const [showLossPopupChecked, setShowLossPopupChecked] = useState(false);
  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  // WebSocket hook (used only for period and time, not game history)
  const {
    isConnected,
    connectionError,
    currentPeriod: socketPeriod,
    timeRemaining: socketTime,
    placeBet,
  } = useSocket(gameType, buttonData[activeButton].duration);
  const containerRef = useRef(null);
  const containerRef1 = useRef(null);
  const [kdPopHeight, setKdPopHeigth] = useState(0);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  const handleCopyOrderNumber = async (orderNumber) => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopiedOrderId(orderNumber);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedOrderId(null);
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = orderNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopiedOrderId(orderNumber);
      setTimeout(() => {
        setCopiedOrderId(null);
      }, 2000);
    }
  };
  useEffect(() => {
    if (isConnected && socketPeriod) {
      if (socketPeriod.periodId && socketPeriod.periodId !== "Loading...") {
        setIsPeriodTransitioning(true);
        setCurrentPeriod(socketPeriod);
        setTimeout(() => setIsPeriodTransitioning(false), 100);
      } else if (socketPeriod.periodId === "Loading...") {
        setCurrentPeriod({ periodId: "Loading..." });
        setIsPeriodTransitioning(true);
      }
    }
  }, [isConnected, socketPeriod]);

  useEffect(() => {
    if (isConnected && socketTime) {
      setTimeRemaining(socketTime);
    }
  }, [isConnected, socketTime]);

  useEffect(() => {
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
      setIsPeriodTransitioning(true);
      setCurrentPeriod({ periodId: "Loading..." });
      const timer = setTimeout(() => {
        if (!isConnected) {
          const duration = buttonData[activeButton].duration;
          setTimeRemaining({
            minutes: Math.floor(duration / 60),
            seconds: duration % 60,
          });
        }
        setTimeout(() => {
          if (!isConnected) {
            setIsPeriodTransitioning(false);
          }
        }, 1000);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining.minutes, timeRemaining.seconds, activeButton, isConnected]);

  useEffect(() => {
    let heightA = null;
    let heightB = null;
    if (containerRef.current) {
      heightA = containerRef.current.getBoundingClientRect().height;
    }
    if (containerRef1.current) {
      heightB = containerRef1.current.getBoundingClientRect().height;
    }
    let newHeight = heightA + heightB + 15;
    setKdPopHeigth(newHeight);
  }, []);
  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await getWalletBalance();
        if (response?.success && response?.mainWallet) {
          const balance = Number(response.mainWallet.balance) || 0;
          setWalletBalance(balance);
        } else {
          setWalletBalance(0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      }
    };
    fetchWalletBalance();
    const interval = setInterval(fetchWalletBalance, 30000);
    return () => clearInterval(interval);
  }, []);
  // Fetch user bets
  const fetchUserBets = async (page = 1, limit = 10) => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching user bets...");
      const duration = buttonData[activeButton].duration;
      const response = await gameApi.getUserBets(
        gameType,
        duration,
        page,
        limit
      );
      if (isMounted.current) {
        if (response.success && Array.isArray(response.data?.bets)) {
          const latestBet = response.data?.bets[0];
          console.log("latestBet", latestBet);
          const updatedAt = new Date(
            latestBet.updatedAt || latestBet.createdAt
          );
          const now = new Date();
          const timeDiffSeconds = (now - updatedAt) / 1000;
          if (timeDiffSeconds <= 5) {
            setLastResult(latestBet);
            setUserDidBet(false);
            if (latestBet.status == "won") {
              setShowWinPopup(true);
            } else if (latestBet.status == "lost") {
              setShowLossPopup(true);
            }
          }
          const bets = response?.data?.bets.map((bet) => ({
            betId: bet.betId,
            period: bet.periodId,
            orderTime: new Date(bet.createdAt).toLocaleString(),
            orderNumber: bet.betId,
            amount: `₹${bet.betAmount}`,
            quantity: bet.quantity || 1,
            afterTax: `₹${(bet.betAmount * 0.98).toFixed(2)}`,
            tax: `₹${(bet.betAmount * 0.02).toFixed(2)}`,
            result: bet.result
              ? `${bet.result.number} (${bet.result.size}, ${bet.result.color})`
              : "Pending",
            select: `${bet.betValue}`,
            status: bet.status || "Pending",
            winLose:
              bet.profitLoss >= 0
                ? `+₹${bet.profitLoss}`
                : `-₹${Math.abs(bet.profitLoss)}`,
            date: new Date(bet.createdAt).toLocaleDateString(),
            time: new Date(bet.createdAt).toLocaleTimeString(),
            finalAmount : bet?.winAmount
          }));
          setUserBets(bets);
          setTotalPages(
            response.data.pagination?.totalPages ||
              Math.ceil(response.data.pagination?.total / limit) ||
              1
          );
          console.log("✅ User bets fetched successfully", {
            count: bets.length,
          });
        } else {
          setUserBets([]);
          setTotalPages(1);
          console.log("✅ No user bets found");
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Failed to fetch user bets: " + error.message);
        console.log("❌ Error fetching user bets:", error.message);
        setUserBets([]);
        setTotalPages(1);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // Refresh wallet balance
  const handleRefreshBalance = async () => {
    if (isRefreshingBalance) return;
    setIsRefreshingBalance(true);
    try {
      const response = await getWalletBalance();
      if (response?.success && response?.mainWallet) {
        const balance = Number(response.mainWallet.balance) || 0;
        setWalletBalance(balance);
      } else {
        setError("Failed to refresh balance");
      }
    } catch (error) {
      setError("Failed to refresh balance. Please try again.");
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Fetch game history from API
  const fetchGameHistoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const duration = buttonData[activeButton].duration;
      const response = await apiServices.getGameHistory(
        gameType,
        duration,
        currentPage,
        10
      );
      console.log(response);
      if (response?.success && response?.data?.results) {
        const mappedHistory = response.data.results.map((item) => {
          const blockTimeRaw = item.verification?.time;
          const blockTimeFormatted = blockTimeRaw
            ? `${String(new Date(blockTimeRaw).getHours()).padStart(2, "0")}:${String(new Date(blockTimeRaw).getMinutes()).padStart(2, "0")}`
            : "N/A";

          return {
            periodId: item.periodId,
            blockHeight: item.verification?.block || "N/A",
            blockTime: blockTimeFormatted,
            hashValue: item.verification?.hash || "N/A",
            result: item.result?.number ?? "N/A",
            resultType: item.result?.size || item.result?.color || "N/A",
            link:item?.verification?.link
          };
        });
        setHistoryData(mappedHistory);
        setTotalPages(response.data.pagination?.totalPages || 5);
        setCurrentPage(response.data.pagination?.page);
      } else {
        setError("Failed to load game history.");
        setHistoryData([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err.message || "Error fetching game history.");
      setHistoryData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  const fetchGameChat = async (page, duration) => {
    try {
      let data = await apiServices.getGameHistory(gameType, duration, page, 10);
      if (data.success) {
        setChartData(data?.data?.results);
        setTotalPages(data?.data?.pagination.total || 1);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      setGameHistoryData([]);
    }
  };
  useEffect(() => {
    if (activeTab === "gameHistory") {
      const duration = buttonData[activeButton].duration;
      fetchGameHistoryData(currentPage, duration);
    }
  }, [activeTab, currentPage, activeButton, refetchData]);

  useEffect(() => {
    if (activeTab === "chart") {
      const duration = buttonData[activeButton].duration;
      fetchGameChat(currentPage, duration);
    }
  }, [activeTab, currentPage, activeButton, refetchData]);
  useEffect(() => {
    fetchUserBets();
  }, [activeTab, currentPage, activeButton, refetchData]);

  // Auto-close success popup
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);
  useEffect(() => {
    if (
      isModalOpen &&
      timeRemaining.seconds <= 5 &&
      timeRemaining.minutes === 0 &&
      buttonData[activeButton].duration == 30
    ) {
      handleCloseModal();
    }
    if (
      isModalOpen &&
      timeRemaining.seconds <= 10 &&
      timeRemaining.minutes === 0 &&
      buttonData[activeButton].duration != 30
    ) {
      handleCloseModal();
    }
  }, [timeRemaining, isModalOpen]);

  // Event handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setCurrentPage(1);
    setTimeRemaining({
      minutes: Math.floor(buttonData[buttonId].duration / 60),
      seconds: buttonData[buttonId].duration % 60,
    });
    setCurrentPeriod({ periodId: "Loading..." });
    setIsPeriodTransitioning(true);
    setTimeout(() => {
      if (!isConnected) {
        setIsPeriodTransitioning(false);
      }
    }, 500);
  };

  const handleOptionClick = (option, type) => {
    setSelectedOption(option);
    setBetType(type);
    setIsModalOpen(true);
    setBetAmount(1);
    setQuantity(1);
    setSelectedMultiplier("X1");
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleMultiplierClick = (multiplier) => {
    setSelectedMultiplier(multiplier);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
    setBetType(null);
    setQuantity(1);
    setBetAmount(1);
    setSelectedMultiplier("X1");
  };

  const handlePlaceBet = () => {
    if (!checked) {
      alert("Please agree to the pre-sale rules");
      return;
    }
    const multiplierValue = parseInt(selectedMultiplier.replace("X", "")) || 1;
    const totalAmount = betAmount * quantity * multiplierValue;
    const betData = {
      amount: totalAmount,
      selection: selectedOption,
      type: betType,
      periodId: currentPeriod.periodId,
      gameType: gameType,
      duration: buttonData[activeButton].duration,
    };
    console.log("🎯 Placing Bet:", betData);
    const betPlaced = placeBet(betData);
    if (betPlaced) {
      console.log("sadas------------------>");
      setTimeout(() => {
        fetchUserBets(currentPage).catch(console.error);
      }, 1500);
      console.log("✅ Bet sent to WebSocket successfully");
      setIsModalOpen(false);
      setSelectedOption(null);
      setBetType(null);
      setQuantity(1);
      setBetAmount(1);
      setSelectedMultiplier("X1");
      setShowSuccessPopup(true);
    } else {
      console.log("❌ Failed to send bet to WebSocket");
      setError("Failed to place bet. Please try again.");
    }
  };

  const calculateTotalAmount = () => {
    const multiplierValue = parseInt(selectedMultiplier.replace("X", "")) || 1;
    return (betAmount * quantity * multiplierValue).toFixed(2);
  };

  const formatTime = (num) => num.toString().padStart(2, "0");

  const getDisplayPeriodId = () => {
    if (
      isPeriodTransitioning ||
      (timeRemaining.minutes === 0 && timeRemaining.seconds === 0)
    ) {
      return "Loading...";
    }
    return currentPeriod.periodId || "Loading...";
  };

  if (error && !historyData.length && !userBets.length) {
    return (
      <div className="bg-[#242424] min-h-screen w-full mx-auto flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#242424]  w-full mx-auto flex flex-col items-center justify-center pr-3 pl-3   pt-11 pb-24">
      <CommanHeader isGameHeader={true} />
      <div className="text-center w-full max-w-sm mt-8" style={{ zIndex: 1 }}>
        <div className="relative rounded-2xl shadow-lg overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src={walletbggame}
              alt="wallet background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#4d4d4c] opacity-70 z-10"></div>

          {/* Main content */}
          <div className="relative z-20 p-2">
            {/* Balance + Refresh */}
            <div className="relative flex items-center justify-center ml-2">
              <div className="text-lg font-bold text-white">
                ₹{walletBalance.toFixed(2)}
              </div>
              <img
                src={refresh}
                alt="Refresh balance"
                className={`w-5 h-5 absolute right-4  top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                  isRefreshingBalance
                    ? "animate-spin opacity-50"
                    : "hover:scale-110"
                }`}
                onClick={handleRefreshBalance}
                style={{
                  pointerEvents: isRefreshingBalance ? "none" : "auto",
                }}
              />
            </div>

            {/* Wallet label */}
            <div className="flex items-center justify-center mb-4 mt-[-2]">
              <img src={wallet} alt="icon" className="w-5 h-5" />
              <span className="ml-2 text-[#f5f3f0] text-xs ">
                Wallet Balance
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-10 mb-2">
              <Link to="/withdraw">
                <button className="bg-[#d23838] text-white text-sm font-semibold px-10 py-2 rounded-full hover:bg-red-600 transition-all">
                  Withdraw
                </button>
              </Link>
              <Link to="/deposit">
                <button className="bg-[#17b15e] text-white text-sm font-semibold px-10 py-2 rounded-full hover:bg-green-600 transition-all">
                  Deposit
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#242424] shadow-md w-full h-full mt-1 flex flex-col justify-center">
        <div className="  mt-0">
          <div className="flex justify-between items-center w-full">
            <img src={speaker} alt="icon" className="w-6 h-6 ml-1" />
            <div
              className="h-6 relative"
              style={{
                width: "100%",
                zIndex: 0,
              }}
            >
              <Notification />
            </div>

            <Link to="/notificationsService">
              <button className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-md px-4 py-1 flex items-center justify-center">
                <img src={fire} alt="Hot Icon" className="w-3 h-3" />

                <span className="ml-1 text-xs font-semibold">Detail</span>
              </button>
            </Link>
          </div>
        </div>
        <div
          className="bg-[#4d4d4c] rounded-lg mt-4 shadow-md"
          style={{ zIndex: 1 }}
        >
          <div className="button-container flex justify-between ">
            {buttonData.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className={`flex flex-col items-center px-1 py-1 rounded-lg flex-1 transition-all duration-300 
          ${
            activeButton === button.id
              ? "bg-gradient-to-b from-[#fae59f] to-[#c4933f] text-[#8f5206]"
              : "bg-[#4d4d4c] text-[#a8a5a1]"
          }`}
                style={{
                  textAlign: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className="icon"
                  style={{
                    fontSize: "12px", // Smaller icon
                  }}
                >
                  {activeButton === button.id ? button.activeIcon : button.icon}
                </div>
                <span className="text-xs">{button.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg mt-4 mb-4 p-4"
          style={{
            backgroundImage: `url(${trxbg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex mb-10">
            <div className="flex flex-col min-w-0">
              <div className="flex gap-1 items-center">
                <p className="text-[#8f5206] border border-[#8f5206] px-2 rounded-lg text-xs">
                  Period
                </p>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="border bg-[#333332] border-[#d9ac4f] rounded-full px-2 py-1 flex items-center justify-center gap-1 text-[#8f5206] shrink-0"
                >
                  <img src={HowToPlay} alt="How to Play" className="w-3 h-3" />
                  <p className="text-[#d9ac4f] text-xs">How to Play</p>
                </button>
              </div>
              <p className="text-sm mt-2  text-[#8f5206] truncate">
                {getDisplayPeriodId()}
              </p>
            </div>
            <div className="flex flex-col items-end min-w-0">
              <div className="bg-[#333332] rounded-full py-1 px-2 inline-flex items-center space-x-1 shrink-0">
                <img src={searchicon} alt="icon" className="h-2 w-2" />
                <span className="text-[#d9ac4f] text-xs ">
                  Public Chain Query
                </span>
              </div>
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[#8f5206] text-xs ml-3 shrink-0">
                  Draw Time
                </span>
                <div className="flex space-x-0.5 items-center">
                  <span className=" border border-[#8f5206] text-[#8f5206] text-sm rounded px-1 py-0.4 w-4 text-center">
                    {formatTime(timeRemaining.minutes)[0]}
                  </span>
                  <span className=" border border-[#8f5206] text-[#8f5206] text-sm rounded px-1 py-0.4 w-4 text-center">
                    {formatTime(timeRemaining.minutes)[1]}
                  </span>
                  <span className="text-[#8f5206] font-bold text-lg px-0.5 w-4 text-center">
                    :
                  </span>
                  <span className=" border border-[#8f5206] text-[#8f5206]  text-sm rounded px-1 py-0.4 w-4 text-center">
                    {formatTime(timeRemaining.seconds)[0]}
                  </span>
                  <span className=" border border-[#8f5206] text-[#8f5206]  text-sm rounded px-1 py-0.4 w-4 text-center">
                    {formatTime(timeRemaining.seconds)[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            {historyData.length >= 5
              ? historyData
                  .slice(0, 5) // Get the last 5 results (assuming historyData is in descending order)
                  .map((entry, idx) => {
                    return (
                      <span
                        key={idx}
                        className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      >
                        <img
                          src={numberImages[entry.result % 10]}
                          alt={`Icon ${entry.result}`}
                          className="w-full h-full"
                        />
                      </span>
                    );
                  })
              : [img0, img1, img2, img3, img4].map((img, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  >
                    <img
                      src={img}
                      alt={`Icon ${idx}`}
                      className="w-full h-full"
                    />
                  </span>
                ))}
          </div>
        </div>
        <FreezePopup
          timeRemaining={timeRemaining}
          duration={buttonData[activeButton].duration}
          handleRefresh={() => setRefetchData((prev) => !prev)}
          gameType={gameType}
          height={kdPopHeight}
        >
          <div
            ref={containerRef}
            className="bg-[#333332] rounded-lg shadow-md mb-2 p-2 space-y-2"
          >
            <div className="flex justify-between space-x-2 mb-2">
              <button
                className="bg-green-500 flex-1 text-white py-2 rounded-tr-lg rounded-bl-lg text-sm"
                onClick={() => handleOptionClick("Green", "color")}
              >
                Green
              </button>
              <button
                className="bg-violet-500 flex-1 text-white py-2 rounded text-sm"
                onClick={() => handleOptionClick("Violet", "color")}
              >
                Violet
              </button>
              <button
                className="bg-red-500 flex-1 text-white py-2 rounded-tl-lg rounded-br-lg text-sm"
                onClick={() => handleOptionClick("Red", "color")}
              >
                Red
              </button>
            </div>
            <div className="bg-[#4d4d4c] p-2 rounded-lg">
              <div className="flex justify-between space-x-1">
                {[0, 1, 2, 3, 4].map((num) => (
                  <span
                    key={num}
                    className="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => handleOptionClick(num.toString(), "number")}
                  >
                    <img
                      src={numberImages[num]}
                      alt={`Icon ${num}`}
                      className="w-full h-full"
                    />
                  </span>
                ))}
              </div>
              <div className="flex justify-between space-x-1 mt-2">
                {[5, 6, 7, 8, 9].map((num) => (
                  <span
                    key={num}
                    className="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => handleOptionClick(num.toString(), "number")}
                  >
                    <img
                      src={numberImages[num]}
                      alt={`Icon ${num}`}
                      className="w-full h-full"
                    />
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center space-x-1">
              <span className="border border-red-700 text-red-500 text-sm px-4 py-2 rounded-lg">
                Random
              </span>
              {multiplierOptions.map((value) => (
                <button
                  key={value}
                  className={`
      text-[10px] px-2 py-2 rounded-lg flex-1 border 
      ${
        selectedMultiplier === value
          ? `${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} border-[#e4c26c]`
          : "bg-[#242424] text-[#a8a5a1] border-[#3a3a3a]"
      }
    `}
                  onClick={() => handleMultiplierClick(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-blue-500 text-white rounded-full flex overflow-hidden w-full max-w-xs">
                <span
                  className="flex-1 py-2 bg-[#feaa57]"
                  onClick={() => handleOptionClick("Big", "size")}
                >
                  Big
                </span>
                <span
                  className="flex-1 py-2"
                  onClick={() => handleOptionClick("Small", "size")}
                >
                  Small
                </span>
              </button>
            </div>
          </div>
        </FreezePopup>
        {showWinPopup && (
          <ResultPopUp
            type="win"
            lastResult={lastResult}
            showConfetti={true}
            checked={showWinPopupChecked}
            onCheckedChange={() => setShowWinPopupChecked(!showWinPopupChecked)}
            onClose={() => {
              setShowWinPopup(false);
              setLastResult(null);
            }}
            gameType={gameType}
          />
        )}

        {showLossPopup && (
          <ResultPopUp
            type="loss"
            lastResult={lastResult}
            checked={showLossPopupChecked}
            onCheckedChange={() =>
              setShowLossPopupChecked(!showLossPopupChecked)
            }
            onClose={() => {
              setShowLossPopup(false);
              setLastResult(null);
            }}
            gameType={gameType}
          />
        )}

        <div className="flex justify-between space-x-1 mb-4 mt-2">
          <button
            className={`w-full px-2 py-[8px] text-xs rounded-md shadow text-center whitespace-nowrap overflow-hidden text-ellipsis
      ${
        activeTab === "gameHistory"
          ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
          : "bg-[#333332] text-[#a8a5a1] font-normal"
      }`}
            onClick={() => setActiveTab("gameHistory")}
          >
            Game History
          </button>
          <button
            className={`w-full px-2 py-[8px] text-xs rounded-md shadow text-center whitespace-nowrap overflow-hidden text-ellipsis
      ${
        activeTab === "chart"
          ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
          : "bg-[#333332] text-[#a8a5a1] font-normal"
      }`}
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
          <button
            className={`w-full px-2 py-[8px] text-xs rounded-md shadow text-center whitespace-nowrap overflow-hidden text-ellipsis
      ${
        activeTab === "myHistory"
          ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
          : "bg-[#333332] text-[#a8a5a1] font-normal"
      }`}
            onClick={() => setActiveTab("myHistory")}
          >
            My History
          </button>
        </div>

        <div className="mb-2 rounded-lg shadow">
          {activeTab === "gameHistory" && (
            <div className="overflow-x-auto">
              {error && (
                <div className="text-center bg-red-600 w-full px-4 py-2 text-white text-center rounded-full mb-2">
                  <p>{error}</p>
                </div>
              )}
              {loading ? (
                <p className="text-white text-center py-4">
                  Loading game history...
                </p>
              ) : historyData.length > 0 ? (
                <table className="bg-[#333332] table-auto w-full rounded">
                  <thead>
                    <tr className="bg-[#3a3947] text-white">
                      <th className="w-12 py-3 text-sm">Period</th>
                      <th className="px-2 py-2 text-sm">Block height</th>
                      <th className="px-2 py-2 text-sm">Block time</th>
                      <th className="px-2 py-2 text-sm">Hash value</th>
                      <th className="px-2 py-2 text-sm">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((record, rowIndex) => {
                      const period = record.periodId?.toString() || "";
                      const hash = record.hashValue?.toString() || "";

                      const maskedPeriod = `${period.slice(0, 3)}***${period.slice(-4)}`;
                      const maskedHash = `***${hash.slice(-4)}`;
                      return (
                        <tr key={rowIndex} className="text-[#f5f3f0]">
                          <td className="text-sm px-2 text-center py-3">
                            {maskedPeriod || "N/A"}
                          </td>
                          <td className="text-sm text-center py-2">
                            <div className="flex items-center justify-center gap-1" style={{display:'flex',flexDirection:'column'}}>
                              <img onClick={()=> {window.location.href=record?.link}} src={question} className="w-3 h-3" />
                              <span>{record.blockHeight || "N/A"}</span>
                            </div>
                          </td>

                          <td className="text-sm text-center py-2">
                            {record.blockTime || "N/A"}
                          </td>
                          <td className="text-sm text-center py-2">
                            {maskedHash || "N/A"}
                          </td>
                          <td className="text-center">
                            <span className="inline-block text-white mr-2 text-xs px-1 py-1 border bg-[#ff4081] rounded-full py-1">
                              {record.result ? record?.result : "0"}
                            </span>
                            <span
                              style={{
                                color:
                                  record.resultType == "Big"
                                    ? "#DD9138"
                                    : "#5088D3",
                              }}
                            >
                              {" "}
                              {record.resultType == "Big" ? "B" : "S"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center bg-[#4d4d4c] py-4">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={empty}
                      alt="No Data"
                      className="w-28 h-40 object-contain"
                    />
                    <p className="text-[#a8a5a1] text-sm mt-2">
                      No game history available
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "chart" && (
            <div className="p-2 rounded-t-lg relative" ref={containerRef3}>
              <ChartConnectorCanvas
                chartData={chartData}
                containerRef={containerRef3}
              />
              <table className="table-fixed w-full text-left bg-[#333332] rounded-t-lg">
                <thead>
                  <tr className="bg-gray-700 rounded-t-lg">
                    <th className="px-2 w-2/5 py-2 text-center text-white text-xs font-normal border-b rounded-tl-xl border-[#3a3947]">
                      Period
                    </th>
                    <th className="px-2 w-3/5 py-2 text-center text-white text-xs font-normal border-b rounded-tr-xl border-[#3a3947]">
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.length > 0 ? (
                    chartData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-gray-700 text-white text-xs text-center"
                      >
                        {/* Period ID */}
                        <td className="px-2 py-4 text-gray-300">
                          {row.periodId}
                        </td>

                        {/* Number Row (0–9) */}
                        <td className="px-2 py-4">
                          <div className="flex items-center justify-center space-x-1 relative">
                            {/* 0–9 number row */}
                            {Array.from({ length: 10 }, (_, i) => {
                              const currentValue = row.result.number;
                              const isHighlighted = currentValue === i;
                              const highlightColor =
                                i === 0
                                  ? "bg-gradient-to-r from-red-500 to-violet-500"
                                  : i === 5
                                    ? "bg-gradient-to-r from-green-500 to-violet-500"
                                    : i % 2 === 0
                                      ? "bg-red-500"
                                      : "bg-green-500";

                              return (
                                <span
                                  key={i}
                                  className={`w-[16px] h-[16px] flex items-center justify-center rounded-full text-[12px] ${
                                    isHighlighted
                                      ? `highlight ${highlightColor} text-white`
                                      : "bg-gray-600 text-gray-300 border border-gray-500"
                                  }`}
                                >
                                  {i}
                                </span>
                              );
                            })}

                            {/* Big/Small indicator */}
                            <span
                              className={`w-[16px] h-[16px] ml-4 flex items-center justify-center rounded-full text-xs ${
                                row?.result?.size == "Big"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-blue-400 text-white"
                              }`}
                            >
                              {row?.result?.size == "Big" ? "B" : "S"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-2 py-4 text-center text-gray-200"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "myHistory" && (
            <div className="">
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b971]"></div>
                  <p className="mt-2 text-gray-600">
                    Loading your bet history...
                  </p>
                </div>
              )}
              {error && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchUserBets(currentPage)}
                    className="px-4 py-2 bg-[#00b971] text-white rounded hover:bg-[#00a863]"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!isLoading && !error && (
                <>
                  {userBets.length > 0 ? (
                    <>
                      {userBets.map((bet, index) => (
                        <div key={bet.betId || index}>
                          {/* Main Bet Row */}
                          <div
                            className="flex justify-between items-start border-b last:border-b-0 cursor-pointer p-2"
                            onClick={() => toggleDetails(index)}
                          >
                            <div className="flex items-center">
                              <div
                                className="w-10 h-10 rounded-md mr-3 flex items-center justify-center"
                                style={{
                                  backgroundColor:
                                    bet.select[0] === "g"
                                      ? "#00b971"
                                      : bet.select[0] === "r"
                                        ? "red"
                                        : bet.select[0] === "v"
                                          ? "#8A2BE2"
                                          : "#ccc",
                                }}
                              >
                                <span className="text-white font-bold text-sm capitalize">
                                  {bet.select[0]}
                                </span>
                              </div>

                              <div>
                                <p
                                  className="text-[14px]"
                                  style={{ color: "white" }}
                                >
                                  {bet.period}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {bet.date} {bet.time}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`mt-1 border text-right rounded px-1 text-sm  ${
                                  bet.status === "won"
                                    ? "text-green-600 border-green-600"
                                    : bet.status === "lost"
                                      ? "text-red-600 border-red-600"
                                      : "text-[#00b971] border-[#00b971]"
                                }`}
                              >
                                {bet.status === "won"
                                  ? "Won"
                                  : bet.status === "lost"
                                    ? "Failed"
                                    : "Pending"}
                              </p>

                              {bet?.result !== "Pending" &&
                                bet.winLose !== "₹0" && (
                                  <p
                                    className={`font-medium text-sm  ${
                                      bet.winLose.startsWith("+")
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {bet.finalAmount}
                                  </p>
                                )}
                            </div>
                          </div>

                          {/* Details View (Expandable) */}
                          {openIndex === index && (
                            <div className="bg-[#2a2a2a] p-2 mx-1 mb-3 rounded-b-lg w-full mt-2">
                              <div className="mb-4">
                                <h3 className="text-white text-lg font-medium mb-1 text-left">
                                  Details
                                </h3>
                              </div>
                              <div className="space-y-3 text-sm">
                                {[
                                  {
                                    label: "Bet ID",
                                    value: bet.betId,
                                    showCopy: true,
                                    valueClass: "text-right text-white",
                                  },
                                  {
                                    label: "Select",
                                    value: bet.select,
                                    valueClass: "text-[#ff5555]",
                                  },
                                  {
                                    label: "Period",
                                    value: bet.period,
                                  },
                                  {
                                    label: "Amount",
                                    value: bet.amount,
                                  },
                                  {
                                    label: "Tax",
                                    value: bet.tax,
                                    valueClass: "text-[#ff5555]",
                                  },
                                  {
                                    label: "After Tax",
                                    value: bet.afterTax,
                                    valueClass: "text-[#ff5555]",
                                  },
                                  {
                                    label: "Win/Lose",
                                    value:
                                      bet?.result === "Pending"
                                        ? "Pending"
                                        : bet.finalAmount,
                                    valueClass:
                                      bet?.result === "Pending"
                                        ? "text-yellow-400"
                                        : bet.winLose?.startsWith("+")
                                          ? "text-green-400"
                                          : "text-[#ff5555]",
                                  },
                                  {
                                    label: "Status",
                                    value:
                                      bet.status === "won"
                                        ? "Success"
                                        : bet.status === "lost"
                                          ? "Failed"
                                          : "Pending",
                                    valueClass:
                                      bet.status === "won"
                                        ? "text-green-400"
                                        : bet.status === "lost"
                                          ? "text-[#ff5555]"
                                          : "text-yellow-400",
                                  },
                                  {
                                    label: "Date",
                                    value: bet.date,
                                  },
                                  {
                                    label: "Time",
                                    value: bet.time,
                                  },
                                ].map(
                                  ({
                                    label,
                                    value,
                                    valueClass = "text-gray-400",
                                    showCopy = false,
                                  }) => (
                                    <div
                                      key={label}
                                      className="bg-[#4d4d4c] px-1.5 py-1.5 rounded-md flex justify-between items-center"
                                    >
                                      <span className="text-gray-300 text-sm text-left">
                                        {label}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`${valueClass} text-sm font-normal`}
                                        >
                                          {value}
                                        </span>
                                        {showCopy && value && (
                                          <button
                                            onClick={() =>
                                              handleCopyOrderNumber(value)
                                            }
                                            className="p-1 hover:bg-[#5a5a59] rounded transition-colors duration-200 group"
                                            title="Copy bet ID"
                                          >
                                            {copiedOrderId === value ? (
                                              <CheckIcon className="w-4 h-4 text-green-400" />
                                            ) : (
                                              <CopyIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center bg-[#4d4d4c] rounded-lg py-8">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={empty}
                          alt="No Data"
                          className="w-64 h-60 object-contain"
                        />
                        <p className="text-white mt-4">
                          No betting history found
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {
            <>
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-[#4d4d4c] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5d5d5c] transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          currentPage === pageNum
                            ? "bg-[#d9ac4f] text-black font-medium"
                            : "bg-[#4d4d4c] text-white hover:bg-[#5d5d5c]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-[#4d4d4c] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5d5d5c] transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="text-center mt-3 text-xs text-gray-500">
                Page {currentPage} of {totalPages} • {historyData?.length}{" "}
                records shown
              </div>
            </>
          }
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[1000] bg-[#333333] text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
          <div
            className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} rounded-t-lg flex flex-col items-center text-center`}
          >
            <h2 className="text-lg font-bold mt-2">
              {buttonData[activeButton].title}
            </h2>
            <div className="flex w-full max-w-xs items-center bg-white text-black gap-2 justify-center mt-2 p-2 rounded-lg">
              <span>Select</span>
              <span className="font-bold">{selectedOption}</span>
            </div>
            <div
              className={`relative ${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} rounded-t-lg px-0 flex items-center text-center p-[14px] flex-col justify-center`}
            >
              <div className="absolute top-0 right-0 mr-0 w-0 h-0 border-t-[30px] border-l-[200px] border-r-0 border-b-0 border-solid border-t-transparent border-l-[#333333]"></div>
              <div className="absolute top-0 left-0 mr-0 w-0 h-0 border-t-[30px] border-r-[200px] border-l-0 border-b-0 border-solid border-t-transparent border-r-[#333333]"></div>
            </div>
          </div>

          <div className="mt-6 space-y-4 px-2">
            <div className="flex justify-between">
              <p className="mb-2 text-sm">Balance</p>
              <div className="flex gap-1">
                {["1", "10", "100", "1000"].map((label) => (
                  <button
                    key={label}
                    className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} px-2 py-1 rounded text-sm ${betAmount === parseInt(label) ? "ring-2 ring-white" : ""}`}
                    onClick={() => setBetAmount(parseInt(label))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <p className="mb-2 text-sm">Quantity</p>
              <div className="flex items-center gap-1">
                <button
                  className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} px-2 rounded text-sm`}
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 bg-neutral-800 text-center py-1 rounded text-sm"
                />
                <button
                  className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} px-2 rounded text-sm`}
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-1 mt-2 justify-end">
              {multiplierOptions.map((label) => (
                <button
                  key={label}
                  className={`bg-neutral-700 px-2 py-1 rounded text-sm ${
                    selectedMultiplier === label
                      ? `${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} ring-2 ring-white`
                      : `${tailwindColorMap[betType === "number" ? "Number" : selectedOption]?.replace("bg-", "hover:bg-")} transition`
                  }`}
                  onClick={() => handleMultiplierClick(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div onClick={() => setChecked(!checked)}>
                {checked ? (
                  <img src={agree} alt="icon" className="w-5 h-5 ml-2" />
                ) : (
                  <img src={notAgree} alt="icon" className="w-5 h-5 ml-2" />
                )}
              </div>
              <span className="text-sm">I agree</span>
              <button className="text-red-500 hover:underline text-sm">
                Pre-sale rules
              </button>
            </div>

            <div className="flex w-[calc(100%+16px)] -mx-2">
              <button
                onClick={handleCloseModal}
                className="bg-neutral-700 flex-1 hover:bg-neutral-600 transition py-3 text-sm"
              >
                Cancel
              </button>
              <button
                className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} flex-1 py-3 transition text-sm`}
                onClick={handlePlaceBet}
              >
                Total amount ₹{calculateTotalAmount()}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-[#201d2b] rounded-2xl shadow-lg w-[90%] max-w-[300px] p-6 text-center">
            <div className="text-white text-lg font-bold mb-4">Success</div>
            <p className="text-white text-sm mb-6">
              Your bet has been placed successfully!
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-gradient-to-b from-[#fae59f] to-[#c4933f] text-[#8f5206] px-6 py-2 rounded-full font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
          <div className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-2xl shadow-lg w-full max-w-[360px] min-h-[65vh] flex flex-col">
            {/* Header */}
            <div className="text-center text-lg text-[#8f5206] font-medium py-4 bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-t-2xl">
              How to Play
            </div>

            {/* Content */}
            <div className="bg-[#201d2b] p-4 text-white text-sm flex-1 overflow-y-auto">
              <p>
                1 minute 1 issue, 45 seconds to order, 15 seconds waiting for
                the draw. It opens all day. The total number of trades is 1440
                issues.
              </p>
              <p className="mt-3">
                If you spend 100 to trade, after deducting a 2% service fee,
                your contract amount is 98:
              </p>
              <p className="mt-3">
                <span className="font-medium text-green-400">
                  1. Select Green:
                </span>{" "}
                If the result shows 1,3,7,9 you will get (98×2) 196; If the
                result shows 5, you will get (98×1.5) 147.
              </p>
              <p className="mt-3">
                <span className="font-medium text-red-400">2. Select Red:</span>{" "}
                If the result shows 2,4,6,8 you will get (98×2) 196; If the
                result shows 0, you will get (98×1.5) 147.
              </p>
              <p className="mt-3">
                <span className="font-medium text-purple-400">
                  3. Select Violet:
                </span>{" "}
                If the result shows 0 or 5, you will get (98×4.5) 441.
              </p>
              <p className="mt-3">
                <span className="font-medium text-blue-400">
                  4. Select Number:
                </span>{" "}
                If the result matches the number you selected, you will get
                (98×9) 882.
              </p>
              <p className="mt-3">
                <span className="font-medium text-yellow-400">
                  5. Select Big:
                </span>{" "}
                If the result shows 5,6,7,8,9 you will get (98×2) 196.
              </p>
              <p className="mt-3">
                <span className="font-medium text-orange-400">
                  6. Select Small:
                </span>{" "}
                If the result shows 0,1,2,3,4 you will get (98×2) 196.
              </p>
            </div>

            {/* Footer with Close Button */}
            <div className="flex justify-center py-4 bg-[#201d2b] rounded-b-2xl">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-8 py-2.5 flex items-center justify-center text-[#8f5206] bg-gradient-to-b from-[#fae59f] to-[#c4933f] rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 min-w-[120px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LotteryTrxWingo;
