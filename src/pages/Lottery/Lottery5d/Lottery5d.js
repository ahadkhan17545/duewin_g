import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import Timecolor from "../../../Assets/timecolor.png";
import Timeblack from "../../../Assets/timeblack.png";
import refresh from "../../../Assets/refresh.png";
import empty from "../../../Assets/empty.png";
import wallet from "../../../Assets/wallets.png";
import fire from "../../../Assets/fire.png";
import HowToPlay from "../../../Assets/finalicons/howtoplayicon.png";
import speaker from "./../../../Assets/speaker.png";
import invitation from "../../../Assets/invitation.png";
import LotteryWingoheader from "../../../components/LotteryWingoheader";
import walletbggame from "../../../Assets/walletbggame.png";
import agree from "./../../../Assets/agree-a.png";
import notAgree from "./../../../Assets/agree-b.png";
import gameApi from "../../../api/gameAPI";
import apiServices, { getWalletBalance } from "../../../api/apiServices";
import useSocket from "../../../hooks/useSocket";
import CommanHeader from "../../../components/CommanHeader";
import FreezePopup from "../../../components/FreezePopup";
import ResultPopUp from "../../../components/ResultPopUp";
import ChartConnectorCanvas from "../../../utils/charConnectorCavas";
import ChartConnectorCanvas5D from "../../../utils/chartCanvas5d";
import Notification from "../../Notification";

const buttonData = [
  {
    id: 0,
    title: (
      <>
        <span className="block text-center">5D</span>
        <span className="block text-center">1Min</span>
      </>
    ),
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 60,
  },
  {
    id: 1,
    title: (
      <>
        <span className="block text-center">5D</span>
        <span className="block text-center">3Min</span>
      </>
    ),
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 180,
  },
  {
    id: 2,
    title: (
      <>
        <span className="block text-center">5D</span>
        <span className="block text-center">5Min</span>
      </>
    ),
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 300,
  },
  {
    id: 3,
    title: (
      <>
        <span className="block text-center">5D</span>
        <span className="block text-center">10Min</span>
      </>
    ),
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 600,
  },
];

const tailwindColorMap = {
  Big: "bg-orange-600 hover:bg-orange-500",
  Small: "bg-blue-600 hover:bg-blue-500",
  Odd: "bg-green-600 hover:bg-green-500",
  Even: "bg-red-600 hover:bg-red-500",
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

function Lottery5d() {
  const isMounted = useRef(true);
  const location = useLocation();
  const gameType = "5d";
  const [activeTab, setActiveTab] = useState("gameHistory");
  const [activeImgTab, setActiveImgTab] = useState("A");
  const [historyData, setHistoryData] = useState([]);
  const [activeButton, setActiveButton] = useState(
    location?.state ? location?.state : buttonData[0].id
  );
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [betType, setBetType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [popupMultiplier, setPopupMultiplier] = useState("X1");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [gameHistoryData, setGameHistoryData] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [currentPeriod, setCurrentPeriod] = useState({
    periodId: "Loading...",
  });
  const [isPeriodTransitioning, setIsPeriodTransitioning] = useState(false);
  const [checked, setChecked] = useState(true);
  const multiplierOptions = ["X1", "X5", "X10", "X20", "X50", "X100"];
  const [fetchDataFlag, setFetchDataFlag] = useState(false);
  const [userDidBet, setUserDidBet] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showLossPopup, setShowLossPopup] = useState(false);
  const [lastResult5D, setLastResult5D] = useState(null);
  const [showWinPopupChecked, setShowWinPopupChecked] = useState(false);
  const [showLossPopupChecked, setShowLossPopupChecked] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const containerRef = useRef(null);

  // WebSocket hook
  const {
    isConnected,
    connectionError,
    currentPeriod: socketPeriod,
    timeRemaining: socketTime,
    currentResult,
    gameHistory: socketHistory,
    placeBet,
  } = useSocket("fiveD", buttonData[activeButton].duration);

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

  // Memoized functions to prevent infinite re-renders
  const fetchWalletBalance = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (showWinPopup && !showWinPopupChecked) {
      const timer = setTimeout(() => {
        setShowWinPopup(false);
        setLastResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (showLossPopup && !showLossPopupChecked) {
      const timer = setTimeout(() => {
        setShowLossPopup(false);
        setLastResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWinPopup, showWinPopupChecked, showLossPopup, showLossPopupChecked]);

  const handleRefreshBalance = useCallback(async () => {
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
  }, [isRefreshingBalance]);

  // Fixed fetchGameChart with proper pagination handling
  const fetchGameChat = useCallback(async (page, duration) => {
    try {
      let data = await apiServices.getGameHistory("5d", duration, page, 10);
      if (data.success) {
        setChartData(data?.data?.results);
        // Fixed: Handle both pagination formats
        const totalPagesCalc =
          data?.data?.pagination?.totalPages ||
          data?.data?.pagination?.total_pages ||
          Math.ceil(
            (data?.data?.pagination?.total || data?.data?.results?.length) / 10
          ) ||
          1;
        setTotalPages(totalPagesCalc);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      setChartData([]);
      setTotalPages(1);
    }
  }, []);

  const fetchChartData = useCallback(async () => {
    const duration = buttonData[activeButton].duration;
    setIsLoading(true);
    await fetchGameChat(currentPage, duration);
    setIsLoading(false);
  }, [activeButton, currentPage, fetchGameChat]);

  // Fixed fetchUserBets with proper pagination handling
  const fetchUserBets = useCallback(
    async (page = 1, limit = 10) => {
      setIsLoading(true);
      setError(null);

      try {
        const duration = buttonData[activeButton].duration;
        const response = await gameApi.getUserBets(
          gameType,
          duration,
          page,
          limit
        );

        if (response && response.success) {
          let betsData = [];

          if (Array.isArray(response.data)) {
            betsData = response.data;
          } else if (response.data && Array.isArray(response.data.results)) {
            betsData = response.data.results;
          } else if (response.data && Array.isArray(response.data.bets)) {
            betsData = response.data.bets;
          } else {
            console.log("⚠️ Unexpected response structure:", response);
          }

          if (betsData.length > 0) {
            const latestBet = betsData[0];
            const updatedAt = new Date(
              latestBet.updatedAt || latestBet.createdAt
            );
            const now = new Date();
            const timeDiffSeconds = (now - updatedAt) / 1000;

            if (timeDiffSeconds <= 5) {
              setLastResult(betsData[0]);
              setUserDidBet(false);
              if (betsData[0].status == "won") {
                setShowWinPopup(true);
              } else if (betsData[0].status == "lost") {
                setShowLossPopup(true);
              }
            }

            const formattedBets = betsData.map((bet, index) => {
              return {
                betId: bet.betId || bet._id || bet.id || `bet-${index}`,
                period: bet.periodId || "N/A",
                orderTime: bet.createdAt
                  ? new Date(bet.createdAt).toLocaleString()
                  : bet.orderTime || new Date().toLocaleString(),
                orderNumber:
                  bet.betId || bet.orderNumber || `ORD-${Date.now()}-${index}`,
                amount: `₹${bet?.betAmount || bet?.amount || 0}`,
                quantity: bet?.betValue || 1,
                afterTax: `₹${bet.amountAfterTax.toFixed(2)}`,
                tax: `₹${(bet.taxAmount || 0).toFixed(2)}`,
                result: bet?.result,
                select:
                  bet?.betType && bet.betValue
                    ? `${bet.betType}: ${bet.betValue}`
                    : bet.select || "N/A",
                status: bet?.status,
                winLose:
                  bet.profitLoss !== undefined
                    ? bet.profitLoss >= 0
                      ? `+₹${bet.profitLoss}`
                      : `-₹${Math.abs(bet.profitLoss)}`
                    : bet.winLose || "₹0",
                date: bet.createdAt
                  ? new Date(bet.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString(),
                time: bet.createdAt
                  ? new Date(bet.createdAt).toLocaleTimeString()
                  : new Date().toLocaleTimeString(),
                sum: bet?.result?.sum,
                payout: bet?.payout,
                betValue: bet?.betValue,
                finalAmount : bet?.winAmount
              };
            });

            setHistoryData(formattedBets);

            // Fixed: Handle pagination properly for both formats
            let totalPagesCalc = 1;
            if (response.pagination) {
              totalPagesCalc =
                response.pagination.totalPages ||
                response.pagination.total_pages ||
                Math.ceil(
                  (response.pagination.total || formattedBets.length) / limit
                );
            } else if (response.data && response.data.pagination) {
              totalPagesCalc =
                response.data.pagination.totalPages ||
                response.data.pagination.total_pages ||
                Math.ceil(
                  (response.data.pagination.total || formattedBets.length) /
                    limit
                );
            }

            setTotalPages(totalPagesCalc);
          } else {
            setHistoryData([]);
            setTotalPages(1);
          }
        } else {
          setHistoryData([]);
          setTotalPages(1);
          setError("Failed to fetch betting history");
        }
      } catch (error) {
        console.error("❌ Error in fetchUserBets:", error);
        if (isMounted.current) {
          setError("Failed to fetch user bets: " + error.message);
          setHistoryData([]);
          setTotalPages(1);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [activeButton, gameType]
  );

  // Fixed fetchGameHistory with proper pagination handling
  const fetchGameHistory = useCallback(async (page, duration) => {
    try {
      let data = await apiServices.getGameHistory("5d", duration, page, 10);
      if (data.success) {
        setGameHistoryData(data?.data?.results);
        // Fixed: Handle both pagination formats
        const totalPagesCalc =
          data?.data?.pagination?.totalPages ||
          data?.data?.pagination?.total_pages ||
          Math.ceil(
            (data?.data?.pagination?.total || data?.data?.results?.length) / 10
          ) ||
          1;
        setTotalPages(totalPagesCalc);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      setGameHistoryData([]);
      setTotalPages(1);
    }
  }, []);

  const fetchLastResult = useCallback(async () => {
    try {
      const duration = buttonData[activeButton].duration;
      let data = await apiServices.getLastResult("5d", duration);
      if (data?.success) {
        const final = data?.result;
        setLastResult5D(final);
      }
    } catch (err) {
      console.log(err);
    }
  }, [activeButton]);

  // Wallet balance fetching
  useEffect(() => {
    fetchWalletBalance();
    const interval = setInterval(fetchWalletBalance, 30000);
    return () => clearInterval(interval);
  }, [fetchWalletBalance]);

  // Socket connection effect
  useEffect(() => {
    if (!isConnected) return;

    if (
      socketPeriod?.periodId &&
      socketPeriod.periodId !== "Loading..." &&
      socketPeriod.periodId !== currentPeriod.periodId
    ) {
      setCurrentPeriod(socketPeriod);
    }

    if (
      socketTime &&
      (socketTime.minutes !== timeRemaining.minutes ||
        socketTime.seconds !== timeRemaining.seconds)
    ) {
      setTimeRemaining(socketTime);
    }
  }, [
    isConnected,
    socketPeriod?.periodId,
    socketTime?.minutes,
    socketTime?.seconds,
  ]);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
      const currentId = parseInt(currentPeriod.periodId) || 0;
      const nextPeriodId = (currentId + 1).toString();

      setCurrentPeriod((prev) => ({
        ...prev,
        periodId: nextPeriodId,
      }));

      if (!isConnected) {
        const timer = setTimeout(() => {
          const duration = buttonData[activeButton].duration;
          setTimeRemaining({
            minutes: Math.floor(duration / 60),
            seconds: duration % 60,
          });
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeRemaining.minutes, timeRemaining.seconds, activeButton, isConnected]);

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
    fetchUserBets(currentPage);
  }, [activeTab, currentPage, activeButton, refetchData, fetchUserBets]);

  useEffect(() => {
    if (activeTab === "chart") {
      fetchChartData();
    }
  }, [activeTab, currentPage, activeButton, refetchData, fetchChartData]);

  useEffect(() => {
    fetchLastResult();
  }, [refetchData, fetchLastResult]);

  useEffect(() => {
    const duration = buttonData[activeButton]?.duration;
    if (duration) {
      fetchGameHistory(currentPage, duration);
    }
  }, [activeTab, currentPage, activeButton, refetchData, fetchGameHistory]);

  // Add this useEffect to reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeButton]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fixed handlePageChange function
  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
      }
    },
    [totalPages, currentPage]
  );

  const handleButtonClick = useCallback(
    (buttonId) => {
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
    },
    [isConnected]
  );

  const handleOptionClick = useCallback((option, type) => {
    setSelectedOption(option);
    setBetType(type);
    setIsModalOpen(true);
    setBetAmount(1);
    setQuantity(1);
    setPopupMultiplier("X1");
  }, []);

  const handleQuantityChange = useCallback((change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      return newQuantity >= 1 ? newQuantity : prev;
    });
  }, []);

  const handleMultiplierClick = useCallback((multiplier) => {
    setPopupMultiplier(multiplier);
  }, []);
  useEffect(() => {
    if (
      isModalOpen &&
      timeRemaining.seconds <= 10 &&
      timeRemaining.minutes === 0
    ) {
      handleCloseModal();
    }
  }, [timeRemaining, isModalOpen]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOption(null);
    setBetType(null);
    setQuantity(1);
    setBetAmount(1);
    setPopupMultiplier("X1");
  }, []);

  const handlePlaceBet = useCallback(() => {
    if (!checked) {
      alert("Please agree to the pre-sale rules");
      return;
    }
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    const totalAmount = betAmount * quantity * multiplierValue;
    const betData = {
      amount: totalAmount,
      selection: selectedOption,
      type: betType,
      periodId: currentPeriod.periodId,
      gameType: gameType,
      duration: buttonData[activeButton]?.duration,
      position: activeImgTab,
    };

    console.log("🎯 Placing Bet:", betData);

    const betPlaced = placeBet(betData);

    if (betPlaced) {
      setTimeout(() => {
        fetchUserBets(currentPage).catch(console.error);
      }, 1500);
      console.log("✅ Bet sent to WebSocket successfully");
      setIsModalOpen(false);
      setSelectedOption(null);
      setBetType(null);
      setQuantity(1);
      setBetAmount(1);
      setPopupMultiplier("X1");
      setShowSuccessPopup(true);
      handleRefreshBalance();
    } else {
      console.log("❌ Failed to send bet to WebSocket");
      setError("Failed to place bet. Please try again.");
    }
  }, [
    checked,
    popupMultiplier,
    betAmount,
    quantity,
    selectedOption,
    betType,
    currentPeriod.periodId,
    gameType,
    activeButton,
    activeImgTab,
    placeBet,
    handleRefreshBalance,
    currentPage,
    fetchUserBets,
  ]);

  const calculateTotalAmount = useCallback(() => {
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    return (betAmount * quantity * multiplierValue).toFixed(2);
  }, [betAmount, quantity, popupMultiplier]);

  const formatTime = useCallback((num) => num.toString().padStart(2, "0"), []);

  const getDisplayPeriodId = useCallback(() => {
    return currentPeriod.periodId || "Loading...";
  }, [currentPeriod.periodId]);

  // Pagination Component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    return (
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
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

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
          Page {currentPage} of {totalPages} •{" "}
          {activeTab === "gameHistory"
            ? gameHistoryData.length
            : activeTab === "chart"
              ? chartData.length
              : historyData.length}{" "}
          records shown
        </div>
      </>
    );
  };

  if (error) {
    return (
      <div className="bg-[#242424] min-h-screen w-full mx-auto flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#242424]  w-full mx-auto flex flex-col items-center justify-center pr-2 pl-2   pt-11 pb-24">
      <CommanHeader isGameHeader={true} />

      <div className="text-center w-full max-w-sm mt-8" style={{ zIndex: 1 }}>
        <div className="relative rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={walletbggame}
              alt="wallet background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-[#4d4d4c] opacity-70 z-10"></div>

          <div className="relative z-20 p-2">
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

            <div className="flex items-center justify-center mb-4 mt-[-2]">
              <img src={wallet} alt="icon" className="w-5 h-5" />
              <span className="ml-2 text-[#f5f3f0] text-xs ">
                Wallet Balance
              </span>
            </div>

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

      <div className="bg-[#242424]  w-full h-full mt-2 flex flex-col justify-center">
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
          <div className="button-container flex justify-between space-x-1">
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
                    fontSize: "16px",
                    marginBottom: "2px",
                  }}
                >
                  {activeButton === button.id ? button.activeIcon : button.icon}
                </div>
                <span className="text-xs leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                  {button.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#2e2e2d] flex items-center justify-between rounded-lg mt-3 shadow-md mb-3 px-3 py-2 w-full">
          <div className="text-[#a8a5a1] text-sm leading-tight flex flex-col items-center justify-center mr-2">
            <span className="-mt-2">Lottery</span>
            <span className="mt-2">results</span>
          </div>

          <div className="flex items-center space-x-2 px-1">
            {lastResult5D && lastResult5D?.result
              ? ["A", "B", "C", "D", "E"].map((pos, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#444] text-white text-xs">
                      {lastResult5D?.result[pos]}
                    </div>
                    <div className="text-[#a8a5a1] text-xs mt-1">{pos}</div>
                  </div>
                ))
              : ["5", "9", "5", "0", "7"].map((num, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#444] text-white text-xs">
                      {num}
                    </div>
                    <div className="text-[#a8a5a1] text-xs mt-1">
                      {["A", "B", "C", "D", "E"][idx]}
                    </div>
                  </div>
                ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-[#a8a5a1] text-lg mb-4">=</div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#d9ac4f] text-[#8f5206] text-sm mb-4">
              {lastResult5D?.result?.sum ?? 0}
            </div>
          </div>
        </div>

        <div className="bg-[#333332] rounded-lg  shadow-md mb-2 p-2">
          <div className="flex justify-between mb-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-[#a8a5a1] text-xs">Period</p>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="border border-[#d9ac4f] rounded-full px-3 py-0.5 flex items-center justify-center gap-1 text-[#8f5206] text-center shrink-0"
                >
                  <img src={HowToPlay} alt="How to Play" className="w-1 h-1" />
                  <p className="text-[#d9ac4f] text-xs ">How to Play</p>
                </button>
              </div>
              <p className="text-md mt-1 font-bold text-[#f5f3f0] truncate">
                {getDisplayPeriodId()}
              </p>
            </div>
            <div className="text-right min-w-0  sm:mt-0">
              <p className="text-[#a8a5a1] mb-1 text-xs">Time Remaining</p>
              <div className="flex space-x-0.5 justify-end items-center">
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">
                  {formatTime(timeRemaining.minutes)[0]}
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">
                  {formatTime(timeRemaining.minutes)[1]}
                </span>
                <span className="text-[#8f5206] font-bold text-lg px-0.5 w-4 text-center">
                  :
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">
                  {formatTime(timeRemaining.seconds)[0]}
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">
                  {formatTime(timeRemaining.seconds)[1]}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#00b977] rounded-lg w-full p-2 relative">
            {/* Left Triangle */}
            <div className="absolute top-0 left-0 h-full w-6 z-10">
              <div className="absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[19px] border-t-transparent border-b-[19px] border-b-transparent border-l-[26px] border-l-[#00b971]"></div>
            </div>

            {/* Right Triangle */}
            <div className="absolute top-0 right-0 h-full w-6 z-10">
              <div className="absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[19px] border-b-transparent border-r-[26px] border-r-[#00b971]"></div>
            </div>

            {/* Main Content */}
            <div className="bg-[#003c26] rounded-lg w-full h-full p-1 flex space-x-1">
              {(lastResult5D?.result
                ? ["A", "B", "C", "D", "E"]
                : [5, 9, 9, 8, 6]
              ).map((item, index) => {
                const value = lastResult5D?.result
                  ? lastResult5D?.result[item]
                  : item;
                return (
                  <div
                    key={index}
                    className="flex-1 bg-[#727272] rounded flex flex-col items-center py-[4px]"
                  >
                    <div className="w-8 h-[6px] bg-[#e1e1ec] rounded-t-none rounded-b-full"></div>
                    <div
                      className={`flex items-center justify-center ${index === 0 ? "bg-emerald-500 text-white" : "bg-[#e1e1ec] text-[#a8a5a1]"} rounded-full w-12 h-12 text-3xl font-bold my-1`}
                    >
                      {value}
                    </div>
                    <div className="w-8 h-[6px] bg-[#e1e1ec] rounded-b-none rounded-t-full"></div>
                  </div>
                );
              })}
            </div>
          </div>
          {showWinPopup && (
            <ResultPopUp
              type="win"
              lastResult={lastResult}
              showConfetti={true}
              checked={showWinPopupChecked}
              onCheckedChange={() =>
                setShowWinPopupChecked(!showWinPopupChecked)
              }
              onClose={() => {
                setShowWinPopup(false);
                setLastResult(null);
              }}
              gameType="5d"
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
              gameType="5d"
            />
          )}
          <FreezePopup
            timeRemaining={timeRemaining}
            duration={buttonData[activeButton].duration}
            handleRefresh={() => setRefetchData((prev) => !prev)}
            gameType="5d"
          >
            <div className="flex mt-8 justify-start space-x-2 mb-2 overflow-x-auto">
              {["A", "B", "C", "D", "E", "SUM"].map((tab) => (
                <button
                  key={tab}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center font-bold rounded-t-full ${
                    activeImgTab === tab
                      ? "bg-[#d9ac4f] text-[#8f5206]"
                      : "bg-[#6f7381] text-white"
                  }`}
                  onClick={() => setActiveImgTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {["A", "B", "C", "D", "E", "SUM"].map(
              (tab) =>
                activeImgTab === tab && (
                  <div key={tab} className="grid grid-cols-4 gap-2">
                    {/* Top Buttons: Big Small Odd Even */}
                    <div className="col-span-4 flex justify-between mt-2 space-x-2 px-1">
                      {["Big 1.98", "Small 1.98", "Odd 1.98", "Even 1.98"].map(
                        (label) => (
                          <button
                            key={label}
                            className="bg-[#57554f] text-white text-xs px-1.5 py-[10px] rounded-md  flex-1"
                            onClick={() =>
                              handleOptionClick(label.split(" ")[0], "size")
                            }
                          >
                            {label}
                          </button>
                        )
                      )}
                    </div>

                    {/* Number Circles */}
                    <div className="flex flex-col px-1 col-span-4 mt-1">
                      {activeImgTab !== "SUM" ? (
                        <>
                          <div className="flex justify-between px-1 mb-2 space-x-1">
                            {["0", "1", "2", "3", "4"].map((number) => (
                              <div
                                key={number}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() =>
                                  handleOptionClick(number, "number")
                                }
                              >
                                <div className="w-8 h-8 flex items-center justify-center text-[#a8a5a1 border border-[#a8a5a] rounded-full text-[#a8a5a1]">
                                  {number}
                                </div>
                                <p className="text-sm text-[#a8a5a1] mt-1">
                                  9X
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between px-1 mb-2 space-x-1">
                            {["5", "6", "7", "8", "9"].map((number) => (
                              <div
                                key={number}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() =>
                                  handleOptionClick(number, "number")
                                }
                              >
                                <div className="w-8 h-8 flex items-center justify-center text-[#a8a5a1] border border-[#a8a5a] rounded-full">
                                  {number}
                                </div>
                                <p className="text-xs text-[#a8a5a1] mt-1">
                                  9X
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="h-[120px] mb-2"></div>
                      )}
                    </div>
                  </div>
                )
            )}
          </FreezePopup>
        </div>

        <div className="flex justify-between space-x-1 mb-6 mt-2">
          <button
            className={`w-full px-3 py-2 text-sm rounded-lg shadow text-center ${
              activeTab === "gameHistory"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
                : "bg-[#333332] text-[#a8a5a1] font-normal"
            }`}
            onClick={() => {
              setActiveTab("gameHistory");
              setCurrentPage(1);
            }}
          >
            Game history
          </button>
          <button
            className={`w-full px-3 py-1 text-sm rounded-lg shadow text-center ${
              activeTab === "chart"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
                : "bg-[#333332] text-[#a8a5a1] font-normal"
            }`}
            onClick={() => {
              setActiveTab("chart");
              setCurrentPage(1);
            }}
          >
            Chart
          </button>
          <button
            className={`w-full px-3 py-1 text-sm rounded-lg shadow text-center ${
              activeTab === "myHistory"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
                : "bg-[#333332] text-[#a8a5a1] font-normal"
            }`}
            onClick={() => {
              setActiveTab("myHistory");
              setCurrentPage(1);
            }}
          >
            My History
          </button>
        </div>

        <div className="mb-2 rounded-lg shadow">
          {activeTab === "gameHistory" && (
            <div className="overflow-x-auto">
              {error && (
                <div className="w-full bg-red-500 text-white p-2 text-center rounded-lg mb-2">
                  {error}
                </div>
              )}
              {loading ? (
                <p className="text-white text-center py-4">
                  Loading game history...
                </p>
              ) : gameHistoryData.length > 0 ? (
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr className="bg-[#3a3947] text-white">
                      <th className="px-2 py-2 text-center text-sm">Period</th>
                      <th className="px-2 py-2 text-center text-sm">Result</th>
                      <th className="px-2 py-2 text-center text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameHistoryData.map((record, index) => {
                      return (
                        <tr key={index} className="bg-[#3f3f3e] relative">
                          <td className="px-2 text-xs text-[#f5f3f0] py-2">
                            {record.periodId}
                          </td>
                          <td className="px-2 py-2 text-xs text-center">
                            <div className="flex justify-center items-center space-x-1">
                              {[
                                record.result.A,
                                record.result.B,
                                record.result.C,
                                record.result.D,
                                record.result.E,
                              ].map((number, idx) => (
                                <div
                                  key={idx}
                                  className="w-5 h-5 flex items-center justify-center text-[#f5f3f0] bg-[#3f3f3e] rounded-full border border-gray-400"
                                >
                                  {number}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-sm text-center flex justify-around ">
                            <div className="w-5 h-5 flex mt-[-2px] bg-[#d9ac4f] rounded-full border border-gray-400">
                              {record?.result?.sum}
                            </div>
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
              {totalPages > 1 && (
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
              )}
              <div className="text-center mt-3 text-xs text-gray-500">
                Page {currentPage} of {totalPages} • {gameHistoryData.length}{" "}
                records shown
              </div>
            </div>
          )}
          {activeTab === "chart" && (
            <div className="p-2 rounded-t-lg relative" ref={containerRef}>
              <ChartConnectorCanvas
                chartData={chartData}
                containerRef={containerRef}
                activeImage={activeImgTab}
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
                              const currentValue = row.result[activeImgTab];
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
                                row.result[activeImgTab] >= 5
                                  ? "bg-yellow-500 text-white"
                                  : "bg-blue-400 text-white"
                              }`}
                            >
                              {row.result[activeImgTab] >= 5 ? "B" : "S"}
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
              {totalPages > 1 && (
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
              )}
              <div className="text-center mt-3 text-xs text-gray-500">
                Page {currentPage} of {totalPages} • {chartData.length} records
                shown
              </div>
            </div>
          )}
          {activeTab === "myHistory" && (
            <div className="p-2 text-right">
              {historyData?.length > 0 ? (
                historyData?.map((history, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="flex bg-[#333335] justify-between items-start p-2 mb-2"
                        onClick={() =>
                          setIsDetailsOpen(
                            isDetailsOpen === index ? null : index
                          )
                        }
                      >
                        <div className="flex items-center">
                          <div
                            className="w-12 h-12 bg-[#d9ac4f] text-[14px] text-center rounded-md mb-2 mr-3"
                            style={{
                              color: "white",
                              paddingTop: "10px",
                              textTransform: "capitalize",
                            }}
                          >
                            {/* FIX: Convert result object to string display */}
                            {history?.betValue.split("_")[1]}
                          </div>
                          <div>
                            <p style={{ color: "white" }}>{history.period}</p>
                            <p className="text-gray-500 text-sm text-left">
                              {history.date || "N/A"}
                            </p>
                          </div>
                          <div
                            className="text-right"
                            style={{
                              position: "absolute",
                              right: "6%",
                            }}
                          >
                            <p
                              className={`mt-1  text-right rounded px-1 text-sm  ${
                                history.status === "won"
                                  ? "text-green-600 border-green-600"
                                  : history.status === "lost"
                                    ? "text-red-600 border-red-600"
                                    : "text-[#00b971]"
                              }`}
                            >
                              {history.status === "won"
                                ? "Won"
                                : history.status === "lost"
                                  ? "Failed"
                                  : "Pending"}
                            </p>

                            {(history.status == "won" ||
                              history?.status == "lost") &&
                              history.winLose !== "₹0" && (
                                <p
                                  className={`font-medium text-sm  ${
                                    history.winLose.startsWith("+")
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {history?.finalAmount}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                      {isDetailsOpen === index && (
                        <div className="bg-[#2a2a2a] p-2 mx-1 mb-3 rounded-b-lg w-full mt-2">
                          <div className="mb-4">
                            <h3 className="text-white text-lg font-medium mb-1 text-left">
                              Details
                            </h3>
                          </div>
                          <div className="space-y-3 text-sm">
                            {[
                              {
                                label: "Order number",
                                value: history?.orderNumber,
                                valueClass: "text-right text-white",
                                showCopy: true,
                              },
                              { label: "Period", value: history?.period },
                              {
                                label: "Purchase amount",
                                value: history?.amount,
                              },
                              { label: "Quantity", value: history?.quantity },
                              {
                                label: "Amount after tax",
                                value: history?.afterTax,
                                valueClass: "text-[#ff5555]",
                              },
                              {
                                label: "Tax",
                                value: history?.tax,
                                valueClass: "text-[#ff5555]",
                              },
                              {
                                label: "Result",
                                // FIX: Display result properly - show sum or formatted result
                                value: history?.result?.sum
                                  ? `Sum: ${history.result?.sum}`
                                  : history?.result
                                    ? `${history.result.A || 0}-${history.result.B || 0}-${history.result.C || 0}-${history.result.D || 0}-${history.result.E || 0}`
                                    : "Pending",
                                valueClass: "text-green-400",
                              },
                              {
                                label: "Select",
                                value: history?.select,
                                valueClass: "text-[#ff5555]",
                              },
                              {
                                label: "Status",
                                value:
                                  history.result == null
                                    ? "Pending"
                                    : history.status === "won"
                                      ? "Success"
                                      : "Failed",
                                valueClass:
                                  history.result === null
                                    ? "text-yellow-400"
                                    : history.status === "won"
                                      ? "text-green-400"
                                      : "text-[#ff5555]",
                              },
                              {
                                label: "Win/lose",
                                value:
                                  history.result === null
                                    ? "Pending"
                                    : history.finalAmount,
                                valueClass:
                                  history.result === null
                                    ? "text-yellow-400"
                                    : history.winLose?.startsWith("+")
                                      ? "text-green-400"
                                      : "text-[#ff5555]",
                              },
                              {
                                label: "Order time",
                                value: history?.orderTime,
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
                                        title="Copy order number"
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
                      {/* Pagination for My History */}
                    </>
                  );
                })
              ) : (
                <div className="text-center bg-[#4d4d4c]">
                  <div className="flex flex-col bg-[#4d4d4c] items-center justify-center">
                    <img
                      src={empty}
                      alt="No Data"
                      className="w-64 h-60 object-contain"
                    />
                  </div>
                </div>
              )}
              {totalPages > 1 && (
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
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
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
                        }
                      )}
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
                    Page {currentPage} of {totalPages} • {historyData.length}{" "}
                    records shown
                  </div>
                </>
              )}
            </div>
          )}
          {/* <div className="text-center mb-0 w-full mt-2">
            <div className="bg-[#333332] rounded-xl shadow-lg p-4 flex items-center justify-center space-x-4">
              <button
                className="p-3 text-[#666462] bg-[#4d4d4c] rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IoIosArrowBack className="w-5 h-5" />
              </button>
              <span className="px-6 text-sm text-[#a8a5a1] font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                className="p-3 text-[#8f5206] bg-[#d9ac4f] rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div> */}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] bg-neutral-900 text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
          <div
            className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} rounded-t-xl flex flex-col items-center text-center`}
          >
            <h2 className="text-lg font-bold mt-2">
              {buttonData[activeButton]?.title}
            </h2>
            <div className="flex w-full max-w-xs items-center justify-center bg-white text-black gap-2 mt-2 p-2 rounded-lg">
              <span>Select</span>
              <span className="font-bold">
                {selectedOption} ({activeImgTab})
              </span>
            </div>
            <div
              className={`relative ${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} rounded-t-xl px-0 flex flex-col items-center text-center p-[14px]`}
            >
              <div className="absolute top-0 mr-0 right-0 w-0 h-0 border-t-[30px] border-l-[200px] border-r-0 border-b-0 border-solid border-transparent border-l-neutral-900"></div>
              <div className="absolute top-0 ml-0 left-0 w-0 h-0 border-t-[30px] border-r-[200px] border-l-0 border-b-0 border-solid border-transparent border-r-neutral-900"></div>
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
                    popupMultiplier === label
                      ? tailwindColorMap[
                          betType === "number" ? "Number" : selectedOption
                        ]
                      : tailwindColorMap[
                          betType === "number" ? "Number" : selectedOption
                        ]?.replace("bg-", "hover:bg-")
                  } transition ${popupMultiplier === label ? "ring-2 ring-white" : ""}`}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
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
              5D lottery game rules
              </p>
              <p className="mt-3">
              Draw instructions
              </p>
              <p className="mt-3">
                5-digit number (00000-99999) will be drawn randomly in each period
              </p>
              <p className="mt-3">
              for example：
              </p>
              <p className="mt-3">
              The draw number for this Period is 12345
              </p>
              <p className="mt-3">
              A=1
              </p>
              <p className="mt-3">
              B=2
              </p>
              <p className="mt-3">
              C=3
              </p>
              <p className="mt-3">
              D=4
              </p>
              <p className="mt-3">
              E=5
              </p>
              <p className="mt-3">
              SUM=A+B+C+D+E=15
              </p>
              <p className="mt-3">
              How to play
              </p>
              <p className="mt-3">
              Players can specify six outcomes of betting A, B, C, D, E and the sum
              </p>
              <p className="mt-3">
              A, B, C, D, E can be purchased
              </p>
              <p className="mt-3">
              Number (0 1 2 3 4 5 6 7 8 9)
              </p>
              <p className="mt-3">
              Low (0 1 2 3 4)
              </p>
              <p className="mt-3">
              High (5 6 7 8 9)
              </p>
              <p className="mt-3">
              Odd (1 3 5 7 9)
              </p>
              <p className="mt-3">
              Even (0 2 4 6 8)
              </p>
              <p className="mt-3">
              Sum = A+B+C+D+E can be purchased
              </p>
              <p className="mt-3">
              Low (0-22)
              </p>
              <p className="mt-3">
              High (23-45)
              </p>
              <p className="mt-3">
              Odd (1 3 ···43 45)
              </p>
              <p className="mt-3">
              Even (0 2 ···42 44)
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

export default Lottery5d;
