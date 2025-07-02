import React, { useState, useEffect, useRef, useCallback } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import BackButton from "./../../../components/BackButton";
import LotteryWingoheader from "./../../../components/LotteryWingoheader";
import FreezePopup from "./../../../components/FreezePopup";
import useSocket from "../../../hooks/useSocket";
import { getWalletBalance } from "../../../api/apiServices";
import gameApi from "../../../api/gameAPI";
import { useAudio } from "../../../contexts/AudioContext";
// Assets
import back from "./../../../Assets/back.png";
import speaker from "./../../../Assets/speaker.png";
import invitation from "./../../../Assets/invitation.png";
import refresh from "./../../../Assets/refresh.png";
import wallet from "./../../../Assets/wallets.png";
import fire from "./../../../Assets/fire.png";
import HowToPlay from "./../../../Assets/how to play.png";
import Timecolor from "./../../../Assets/timecolor.png";
import Timeblack from "./../../../Assets/timeblack.png";
import walletbggame from "./../../../Assets/walletbggame.png";
import detailicon from "./../../../Assets/finalicons/detailicon.png";
import agree from "./../../../Assets/agree-a.png";
import notAgree from "./../../../Assets/agree-b.png";
import win from "./../../../Assets/updatedwin.png";
import lost from "./../../../Assets/loss.png";
import whitetick from "./../../../Assets/whitetick.png";
import cross from "./../../../Assets/safed.png";
import img0 from "./../../../Assets/WingoNew/n0-30bd92d1.png";
import img1 from "./../../../Assets/WingoNew/n1-dfccbff5.png";
import img2 from "./../../../Assets/WingoNew/n2-c2913607.png";
import img3 from "./../../../Assets/WingoNew/n3-f92c313f.png";
import img4 from "./../../../Assets/WingoNew/n4-cb84933b.png";
import img5 from "./../../../Assets/WingoNew/n5-49d0e9c5.png";
import img6 from "./../../../Assets/WingoNew/n6-a56e0b9a.png";
import img7 from "./../../../Assets/WingoNew/n7-5961a17f.png";
import img8 from "./../../../Assets/WingoNew/n8-d4d951a4.png";
import img9 from "./../../../Assets/WingoNew/n9-a20f6f42.png";
import { useLocation } from "react-router-dom";
import ChartConnectorCanvas from "../../../utils/charConnectorCavas";
import CommanHeader from "../../../components/CommanHeader";
const imageMap = {
  0: img0,
  1: img1,
  2: img2,
  3: img3,
  4: img4,
  5: img5,
  6: img6,
  7: img7,
  8: img8,
  9: img9,
  default: img0,
};

const iconColorMap = [
  "ReVi",
  "Green",
  "Red",
  "Green",
  "Red",
  "GrVi",
  "Red",
  "Green",
  "Red",
  "Green",
];

const tailwindColorMap = {
  Green: "bg-green-600 hover:bg-green-500",
  Violet: "bg-violet-600 hover:bg-violet-500",
  Red: "bg-[#d23838] hover:bg-red-600",
  ReVi: "bg-gradient-to-r from-red-600 via-violet-600 to-violet-600 hover:from-red-500 hover:via-violet-500 hover:to-violet-500",
  GrVi: "bg-gradient-to-r from-green-600 via-violet-600 to-violet-600 hover:from-green-500 hover:via-violet-500 hover:to-violet-500",
  Big: "bg-orange-600 hover:bg-orange-500",
  Small: "bg-blue-600 hover:bg-blue-500",
};

const buttonData = [
  {
    id: 0,
    title: "WinGo 30 Sec",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 30,
  },
  {
    id: 1,
    title: "WinGo 1Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 60,
  },
  {
    id: 2,
    title: "WinGo 3Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 180,
  },
  {
    id: 3,
    title: "WinGo 5Min",
    icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />,
    activeIcon: (
      <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />
    ),
    duration: 300,
  },
];

function LotteryWingo() {
  const isMounted = useRef(true);
  const location = useLocation();
  const gameType = "wingo";
  const { playCountdownAudio, playResultAudio } = useAudio();
  const hasPlayedCountdownRef = useRef(false);
  const previousResult = useRef(null);
  // Component state
  const [activeTab, setActiveTab] = useState("gameHistory");
  const [activeButton, setActiveButton] = useState(
    location?.state ? location?.state : 0
  );
  const [selectedTitle, setSelectedTitle] = useState(buttonData[0].title);
  const [externalMultiplier, setExternalMultiplier] = useState("X1");
  const [popupMultiplier, setPopupMultiplier] = useState("X1");
  const [currentPage, setCurrentPage] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBigOption, setSelectedBigOption] = useState(null);
  const [checked, setChecked] = useState(true);
  const [showPopup, setShowPopup] = useState(null);
  const [showBigPopup, setShowBigPopup] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPreSalePopup, setShowPreSalePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showLossPopup, setShowLossPopup] = useState(false);
  const [showWinPopupChecked, setShowWinPopupChecked] = useState(false);
  const [showLossPopupChecked, setShowLossPopupChecked] = useState(false);
  const [selectedNumberPopup, setSelectedNumberPopup] = useState(null);
  const [isRandomAnimating, setIsRandomAnimating] = useState(false);
  const [gameHistoryData, setGameHistoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchDataFlag, setFetchDataFlag] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [currentPeriod, setCurrentPeriod] = useState({
    periodId: "",
  });
  const [isPeriodTransitioning, setIsPeriodTransitioning] = useState(false);
  const [refetchData, setRefetchData] = useState(false);
  const [userDidBet, setUserDidBet] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const multiplierOptions = ["X1", "X5", "X10", "X20", "X50", "X100"];
  const API_BASE_URL = "https://api.strikecolor1.com";

  const fetchUserBets = async (page = 1, limit = 10) => {
    if (!isMounted.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const duration = buttonData[activeButton].duration;
      // Use the gameApi to fetch user bets
      const response = await gameApi.getUserBets(
        gameType,
        duration,
        page,
        limit
      );

      if (isMounted.current) {
        if (response && response.success) {
          // Handle different possible response structures
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
            console.log("timeDiffSeconds", timeDiffSeconds);
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
                period: bet.periodId || bet.period || "N/A",
                orderTime: bet.createdAt
                  ? new Date(bet.createdAt).toLocaleString()
                  : bet.orderTime || new Date().toLocaleString(),
                orderNumber:
                  bet.betId || bet.orderNumber || `ORD-${Date.now()}-${index}`,
                amount: `₹${bet.betAmount || bet.amount || 0}`,
                quantity: bet.quantity || 1,
                afterTax: `₹${bet.amountAfterTax.toFixed(2)}`,
                tax: `₹${(bet.taxAmount || 0).toFixed(2)}`,
                result: bet.result
                  ? typeof bet.result === "string"
                    ? bet.result
                    : `${bet.result.number || "?"} (${bet.result.size || "?"}, ${bet.result.color || "?"})`
                  : "Pending",
                select:
                  bet.betType && bet.betValue
                    ? `${bet.betType}: ${bet.betValue}`
                    : bet.select || "N/A",
                status: bet.status,
                winLose:
                  bet.profitLoss !== undefined
                    ? bet.profitLoss >= 0
                      ? `+₹${bet.profitLoss}`
                      : `-₹${Math.abs(bet.profitLoss)}`
                    : bet.winLose || "₹0",
                // Additional fields for display
                date: bet.createdAt
                  ? new Date(bet.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString(),
                time: bet.createdAt
                  ? new Date(bet.createdAt).toLocaleTimeString()
                  : new Date().toLocaleTimeString(),
              };
            });

            setUserBets(formattedBets);

            // Handle pagination
            const totalPagesCalc =
              response.pagination?.total_pages ||
              Math.ceil((response.total || formattedBets.length) / limit) ||
              1;
            setTotalPages(totalPagesCalc);
          } else {
            setUserBets([]);
            setTotalPages(1);
          }
        } else {
          setUserBets([]);
          setTotalPages(1);
          setError("Failed to fetch betting history");
        }
      }
    } catch (error) {
      console.error("❌ Error in fetchUserBets:", error);
      if (isMounted.current) {
        setError("Failed to fetch user bets: " + error.message);
        setUserBets([]);
        setTotalPages(1);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const totalSeconds = timeRemaining.minutes * 60 + timeRemaining.seconds;
    // Play countdown audio when exactly 4 seconds remain (changed from 5)
    if (totalSeconds === 4 && !hasPlayedCountdownRef.current) {
      playCountdownAudio();
      hasPlayedCountdownRef.current = true;
    }
    // Play result audio when exactly 0 seconds remain (changed from 1)
    if (totalSeconds === 0 && hasPlayedCountdownRef.current) {
      playResultAudio();
    }
    // Reset countdown flag when new period starts (more than 4 seconds, changed from 5)
    if (totalSeconds > 4) {
      hasPlayedCountdownRef.current = false;
    }
    // Log when timer reaches 0
    if (totalSeconds === 0) {
      setFetchDataFlag((prev) => !prev);
    }
  }, [timeRemaining, playCountdownAudio, playResultAudio]);
  // Update the wallet balance fetching logic
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

  const {
    isConnected,
    connectionError,
    currentPeriod: socketPeriod,
    timeRemaining: socketTime,
    currentResult,
    gameHistory: socketHistory,
    placeBet,
  } = useSocket(gameType, buttonData[activeButton].duration);

  // Update state based on socket data
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

  // Auto-close betting popups when time remaining is 5 seconds or less
  useEffect(() => {
    if (
      (showPopup || selectedNumberPopup || showBigPopup) &&
      timeRemaining.seconds <= 5 &&
      timeRemaining.minutes === 0
    ) {
      handleCancelBet();
    }
  }, [timeRemaining, showPopup, selectedNumberPopup, showBigPopup]);

  // Modified: Show loading state during period transitions
  useEffect(() => {
    if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
      setIsPeriodTransitioning(true);
      setCurrentPeriod({ periodId: "Loading..." });

      const timer = setTimeout(() => {
        if (!isMounted.current) return;

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

  // Update state more efficiently
  useEffect(() => {
    if (isConnected) {
      const updates = {};
      let hasUpdates = false;

      if (socketPeriod && socketPeriod.periodId !== currentPeriod.periodId) {
        // Only update if we have a valid period ID (not loading)
        if (socketPeriod.periodId && socketPeriod.periodId !== "Loading...") {
          updates.period = socketPeriod;
          hasUpdates = true;
        }
      }

      if (
        socketTime &&
        (socketTime.minutes !== timeRemaining.minutes ||
          socketTime.seconds !== timeRemaining.seconds)
      ) {
        updates.time = socketTime;
        hasUpdates = true;
      }

      if (hasUpdates) {
        // Update period immediately without transitioning state
        if (updates.period) setCurrentPeriod(updates.period);
        if (updates.time) setTimeRemaining(updates.time);
      }
    }
  }, [
    isConnected,
    socketPeriod,
    socketTime,
    currentPeriod.periodId,
    timeRemaining.minutes,
    timeRemaining.seconds,
  ]);

  // Auto-close success popup after 3 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  useEffect(() => {
    if (currentResult && currentResult !== previousResult.current) {
      setTimeout(() => playResultAudio(), 300); // Reduced from 1000ms to 300ms
      previousResult.current = currentResult;
    }
  }, [currentResult, playResultAudio]);
  // Fetch game data from API
  const fetchGameData = async (page, duration) => {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/games/wingo/${duration}/history?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      let results = [];
      if (data.success && data.data) {
        const dataArray =
          data.data.results || (Array.isArray(data.data) ? data.data : []);
        if (Array.isArray(dataArray)) {
          results = dataArray.map((item) => ({
            periodId: item.periodId || "N/A",
            number: item.result?.number || 0,
            size: item.result?.size || "N/A",
            parity: item.result?.parity || "N/A",
            timestamp: item.timestamp || new Date().toISOString(),
          }));
        } else if (typeof data.data === "object") {
          results = [
            {
              periodId: data.data.periodId || "N/A",
              number: data.data.result?.number || 0,
              size: data.data.result?.size || "N/A",
              parity: data.data.result?.parity || "N/A",
              timestamp: data.data.timestamp || new Date().toISOString(),
            },
          ];
        }
      }

      return {
        results,
        pagination: data.data?.pagination || { total_pages: 1 },
      };
    } catch (error) {
      console.error("Error fetching game data:", error);
      return { results: [], pagination: { total_pages: 1 } };
    }
  };
  useEffect(() => {
    setRefetchData((prev) => !prev);
  }, [activeButton]);

  // Fetch user bets

  // Game History useEffect
  useEffect(() => {
    if (activeTab === "gameHistory") {
      const duration = buttonData[activeButton].duration;
      const fetchGameHistory = async () => {
        setIsLoading(true);
        const response = await fetchGameData(currentPage, duration);
        if (isMounted.current) {
          setGameHistoryData(response.results);
          setTotalPages(response.pagination.total_pages || 1);
          setIsLoading(false);
        }
      };
      fetchGameHistory().catch(console.error);
    }
  }, [activeTab, currentPage, activeButton, fetchDataFlag, refetchData]);

  // Chart useEffect
  useEffect(() => {
    if (activeTab === "chart") {
      const duration = buttonData[activeButton].duration;
      const fetchChartData = async () => {
        setIsLoading(true);
        const response = await fetchGameData(currentPage, duration);
        if (isMounted.current) {
          setChartData(response.results);
          setTotalPages(response.pagination.total_pages || 1);
          setIsLoading(false);
        }
      };
      fetchChartData().catch(console.error);
    }
  }, [activeTab, currentPage, activeButton, fetchDataFlag, refetchData]);

  useEffect(() => {
    if (activeTab === "myHistory") {
      fetchUserBets(currentPage).catch(console.error);
    }
  }, [activeTab, currentPage, fetchDataFlag, refetchData]);

  useEffect(() => {
    fetchUserBets(currentPage).catch(console.error);
  }, [refetchData]);

  // Initial timer setup
  useEffect(() => {
    const duration = buttonData[activeButton].duration;
    setTimeRemaining({
      minutes: Math.floor(duration / 60),
      seconds: duration % 60,
    });

    setCurrentPeriod({ periodId: "Refreshing" });
    setIsPeriodTransitioning(true);

    setTimeout(() => {
      if (!isConnected) {
        setIsPeriodTransitioning(false);
      }
    }, 500);
  }, [activeButton]);

  // Debug token status
  const debugTokenStatus = () => {
    const token = localStorage.getItem("token");
  };

  useEffect(() => {
    debugTokenStatus();
  }, []);

  // Event handlers
  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    const selectedButton = buttonData.find((button) => button.id === buttonId);
    if (selectedButton) setSelectedTitle(selectedButton.title);
    setCurrentPage(1);
  };

  const handleBet = (color) => {
    setShowPopup(color);
    setBetAmount(1);
    setPopupMultiplier("X1");
    setQuantity(1);
  };

  const handleCancelBet = () => {
    setShowPopup(null);
    setSelectedNumberPopup(null);
    setShowBigPopup(null);
    setSelectedBigOption(null);
    setBetAmount(1);
    setQuantity(1);
    setPopupMultiplier("X1");
  };

  const handleIconClick = (iconName) => {
    setShowPopup(iconName);
    setBetAmount(1);
    setPopupMultiplier("X1");
    setQuantity(1);
  };

  const handleToggleBigPopup = (option) => {
    setSelectedBigOption(option);
    setShowBigPopup(true);
    setBetAmount(1);
    setPopupMultiplier("X1");
    setQuantity(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRandomClick = () => {
    if (isRandomAnimating) return;
    setIsRandomAnimating(true);
  };

  useEffect(() => {
    if (isRandomAnimating && isMounted.current) {
      const timeout = setTimeout(() => {
        if (!isMounted.current) return;
        const randomNumber = Math.floor(Math.random() * 10).toString();
        const colorKey = iconColorMap[randomNumber] || "Green";
        setSelectedNumberPopup({ number: randomNumber, color: colorKey });
        setBetAmount(1);
        setPopupMultiplier("X1");
        setQuantity(1);
        setIsRandomAnimating(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isRandomAnimating]);

  const handleExternalMultiplierClick = (value) => setExternalMultiplier(value);
  const handlePopupMultiplierClick = (value) => setPopupMultiplier(value);
  const formatTime = (num) => num.toString().padStart(2, "0");
  const handleOpenPreSalePopup = () => setShowPreSalePopup(true);
  const handleClosePreSalePopup = () => setShowPreSalePopup(false);
  const handleNumberClick = (number) => {
    const colorKey = iconColorMap[number] || "Green";
    setSelectedNumberPopup({ number, color: colorKey });
    setBetAmount(1);
    setPopupMultiplier("X1");
    setQuantity(1);
  };
  const handleCloseNumberPopup = () => {
    setSelectedNumberPopup(null);
    setBetAmount(1);
    setQuantity(1);
    setPopupMultiplier("X1");
  };

  const handlePlaceBet = () => {
    if (!checked) {
      alert("Please agree to the pre-sale rules");
      return;
    }
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    const totalAmount = betAmount * quantity * multiplierValue;
    const selection =
      showPopup || selectedNumberPopup?.number || selectedBigOption;
    const betType = showPopup
      ? "color"
      : selectedNumberPopup
        ? "number"
        : "size";

    const betData = {
      amount: totalAmount,
      selection: selection,
      type: betType,
      periodId: currentPeriod.periodId,
      gameType: gameType,
      duration: buttonData[activeButton].duration,
    };

    const betPlaced = placeBet(betData);

    if (betPlaced) {
      setUserDidBet(true);
      setShowPopup(null);
      setShowBigPopup(null);
      setSelectedNumberPopup(null);
      setSelectedBigOption(null);
      setBetAmount(1);
      setQuantity(1);
      setPopupMultiplier("X1");
      setShowSuccessPopup(true);
    } else {
      console.log("❌ Failed to send bet to WebSocket");
      setError("Failed to place bet. Please try again.");
    }
  };

  const getDisplayPeriodId = () => {
    // Always return the current period ID, never show loading
    return currentPeriod.periodId || currentPeriod.periodId;
  };

  // Game History Table Component
  const GameHistoryTable = () => {
    if (!gameHistoryData || gameHistoryData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No game history available</p>
          <button
            onClick={() =>
              fetchGameData(
                currentPage,
                buttonData[activeButton].duration
              ).then(({ results, pagination }) => {
                setGameHistoryData(results);
                setTotalPages(pagination.total_pages || 1);
              })
            }
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load History"}
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="table-auto rounded-lg w-full text-sm text-center bg-[#333332] text-[#f5f3f0]">
          <thead>
            <tr className="bg-[#3a3947] p-4">
              <th className="px-2 py-4 text-white rounded-tl-lg text-xs font-normal">
                Period
              </th>
              <th className="px-2 py-4 text-white text-xs font-normal">
                Number
              </th>
              <th className="px-2 py-4 text-xs text-white font-normal">
                Big/Small
              </th>
              <th className="px-2 py-4 text-white rounded-tr-lg text-xs font-normal">
                Color
              </th>
            </tr>
          </thead>

          <tbody>
            {gameHistoryData.map((row, index) => {
              const colorKey = iconColorMap[row.number] || "Green";
              const numberColor =
                colorKey === "Red"
                  ? "#ef4444"
                  : colorKey === "Green"
                    ? "#22c55e"
                    : colorKey === "Violet"
                      ? "#8b5cf6"
                      : colorKey === "ReVi"
                        ? "red"
                        : "green";
              const circleColor =
                colorKey === "ReVi"
                  ? "linear-gradient(to right, red 50%, #8b5cf6 50%)"
                  : colorKey === "GrVi"
                    ? "linear-gradient(to right, green 50%, #8b5cf6 50%)"
                    : numberColor;

              return (
                <tr key={index}>
                  <td className="px-2 py-2 text-center">{row.periodId}</td>
                  <td className="px-2 py-2 text-4xl font-bold text-center relative w-6 h-6 mx-auto">
                    {row.number === 0 || row.number === 5 ? (
                      <div className="relative inline-block min-w-[1.5rem] h-10">
                        <span
                          className={`absolute top-0 left-0 w-full h-full text-4xl  ${
                            row.number === 0 ? "text-red-500" : "text-green-500"
                          }`}
                          style={{ clipPath: "inset(0 50% 0 0)" }}
                        >
                          {row.number}
                        </span>
                        <span
                          className="absolute top-0 left-0 w-full h-full text-4xl  text-violet-500"
                          style={{ clipPath: "inset(0 0 0 50%)" }}
                        >
                          {row.number}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: numberColor }}>{row.number}</span>
                    )}
                  </td>
                  <td className="px-2 text-sm py-2 text-center">{row.size}</td>
                  <td className="px-2 py-2 text-center">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: circleColor }}
                    ></span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-[#242424] min-h-screen w-full mx-auto flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  const calculateTotalAmount = () => {
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    return (betAmount * quantity * multiplierValue).toFixed(2);
  };
  const isInsufficient = Number(walletBalance) < Number(calculateTotalAmount());
  return (
    <div className="bg-[#242424]  w-full mx-auto flex flex-col items-center justify-center  pr-2 pl-2   pt-20 pb-24">
      <style>
        {`
          @keyframes squeeze {
            0% { transform: scale(1); }
            50% { transform: scale(0.8); }
            100% { transform: scale(1); }
          }
          .squeeze-animate {
            animation: squeeze 0.3s ease-in-out infinite;
          }
        `}
      </style>
      <CommanHeader isGameHeader={true} />

      <div className="bg-[#242424] text-center w-full " style={{ zIndex: 10 }}>
        <div className="rounded-3xl shadow-2xl p-2 relative overflow-hidden min-h-[120px]">
          <div className="absolute inset-0 z-0">
            <img
              src={walletbggame}
              alt="wallet background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[#4d4d4c] opacity-70 z-10"></div>
          <div className="relative z-20">
            <div className="relative flex items-center justify-center">
              <div className="text-base font-bold text-white">
                ₹{walletBalance.toFixed(2)}
              </div>
              <img
                src={refresh}
                alt="Refresh balance"
                className={`w-4 h-4 absolute right-16 cursor-pointer transition-transform duration-200 ${
                  isRefreshingBalance
                    ? "animate-spin opacity-50"
                    : "hover:scale-110"
                }`}
                onClick={handleRefreshBalance}
                style={{
                  pointerEvents: isRefreshingBalance ? "none" : "auto",
                  filter: isRefreshingBalance ? "brightness(0.7)" : "none",
                }}
              />
            </div>
            <div className="flex items-center justify-center text-center ">
              <img src={wallet} alt="Wallet" className="w-5 h-5 ml-1" />
              <span className="text-[#f5f3f0] text-xs ml-1">
                Wallet Balance
              </span>
            </div>
            <div className="flex justify-center gap-10 mb-2 mt-5">
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
              <div className="absolute w-full animate-marqueeUp text-xs text-white ml-2">
                Thanks to all our members — past and present — for being part of
                our journey.
              </div>
            </div>

            <button
              className="text-xs min-w-[80px] px-3 py-[1px] rounded-md flex items-center justify-center gap-1"
              style={{
                backgroundImage: `url(${invitation})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <img src={fire} alt="icon" className="w-3 h-3" /> Detail
            </button>
          </div>
        </div>

        <div className="bg-[#4d4d4c] rounded-lg mt-4 shadow-md pr-3" style={{zIndex:1}}>
          <div className="button-container justify-between flex">
            {buttonData.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className={`flex flex-col items-center px-1 py-2 rounded-lg flex-1 mx-0.5 transition-all duration-300 ${
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
                  style={{ fontSize: "14px", marginBottom: "2px" }}
                >
                  {activeButton === button.id ? button.activeIcon : button.icon}
                </div>
                <span className="text-xs leading-none whitespace-nowrap">
                  {button.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg mt-2 bg-cover mb-2 p-2"
          style={{
            backgroundImage: `url(${back})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between items-center flex-wrap">
            <div className="-mt-2">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="border border-black rounded-full px-9 py-1 flex items-center justify-center gap-1 text-[#8f5206] text-center shrink-0"
              >
                <img src={HowToPlay} alt="How to Play" className="w-4 h-4" />
                <p className="text-[#8f5206] text-xs ">How to Play</p>
              </button>
              <p className="text-[#8f5206] mb-2 mt-2 text-xs truncate whitespace-nowrap max-w-full">
                {selectedTitle}
              </p>

              <div className="flex space-x-1">
                {gameHistoryData.slice(0, 5).map((item, idx) => (
                  <span
                    key={idx}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    <img
                      src={imageMap[item.number] || imageMap.default}
                      alt={`History Ball ${item.number}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center min-w-0 mt-2 sm:mt-0">
              <p className="text-[#8f5206] text-xs font-bold">
                Time Remaining
              </p>
              <div className="flex space-x-0.5 text-[#8f5206] justify-end items-center mt-1">
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.minutes)[0]}
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.minutes)[1]}
                </span>
                <span className="text-[#8f5206] font-bold text-lg px-0.5 w-4 text-center">
                  :
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.seconds)[0]}
                </span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-6 text-center">
                  {formatTime(timeRemaining.seconds)[1]}
                </span>
              </div>
              {/* Fixed height container to prevent position shifts */}
              <div className="mt-1 h-5 flex items-center justify-center">
                <p className="text-xs font-bold text-[#8f5206] min-w-[120px] text-center">
                  {getDisplayPeriodId()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showHowToPlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
            <div className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-2xl shadow-lg w-[90%] max-w-[360px] min-h-[65vh]">
              <div className="text-center text-lg text-[#8f5206] font-normal mb-2 py-2 bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-2xl">
                How to Play
              </div>
              <div className="bg-[#201d2b] p-4 text-white text-sm max-h-[50vh] overflow-y-auto rounded-b-lg">
                <p>
                  1 minute 1 issue, 45 seconds to order, 15 seconds waiting for
                  the draw. It opens all day. The total number of trades is 1440
                  issues.
                </p>
                <p className="mt-2">
                  If you spend 100 to trade, after deducting a 2% service fee,
                  your contract amount is 98:
                </p>
                <p className="mt-2">
                  1. Select Green: If the result shows 1,3,7,9 you will get
                  (98*2) 196; If the result shows 5, you will get (98*1.5) 147.
                </p>
                <p className="mt-2">
                  2. Select Red: If the result shows 2,4,6,8 you will get (98*2)
                  196; If the result shows 0, you will get (98*1.5) 147.
                </p>
                <p className="mt-2">
                  3. Select Violet: If the result shows 0 or 5, you will get
                  (98*4.5) 441.
                </p>
                <p className="mt-2">
                  4. Select Number: If the result matches the number you
                  selected, you will get (98*9) 882.
                </p>
                <p className="mt-2">
                  5. Select Big: If the result shows 5,6,7,8,9 you will get
                  (98*2) 196.
                </p>
                <p className="mt-2">
                  6. Select Small: If the result shows 0,1,2,3,4 you will get
                  (98*2) 196.
                </p>
              </div>
              <div className="flex justify-center py-4 bg-[#201d2b] rounded-b-xl">
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="w-16 h-10 flex items-center justify-center text-white bg-gradient-to-b px-20 from-[#c4933f] to-[#fae59f] rounded-full font-medium shadow-md"
                >
                  Close
                </button>
                -
              </div>
            </div>
          </div>
        )}

        {showWinPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-70 fixed inset-0"></div>
            <div className="relative z-10 flex flex-col items-center max-w-[400px] mx-auto">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] overflow-hidden">
                <Confetti
                  width={400}
                  height={400}
                  recycle={true}
                  numberOfPieces={75}
                  gravity={0.01}
                  initialVelocityX={{ min: -15, max: 15 }}
                  initialVelocityY={{ min: -3, max: 3 }}
                  tweenDuration={20000}
                  confettiSource={{
                    x: 100,
                    y: 200,
                    w: 10,
                    h: 10,
                  }}
                />
              </div>
              <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                <img
                  src={win}
                  alt="Winner"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-center text-white">
                  <p className="text-2xl font-bold text-white drop-shadow-lg">
                    Congratulations
                  </p>
                </div>
                <div className="absolute top-[62%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                  <div className="flex items-center justify-center gap-x-2 mt-1">
                    <h2 className="text-xs whitespace-nowrap text-white font-medium mr-1">
                      Lottery results
                    </h2>
                    <p className="text-xs bg-green-500 px-1 border-2 border-white py-0.5 rounded text-white">
                      {lastResult?.result?.number || "N/A"}
                    </p>
                    <p className="text-xs bg-green-500 px-1 border-2 border-white py-0.5 rounded">
                      {lastResult?.result?.size || "Big"}
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-md font-bold text-red-500">Bonus</p>
                    <p
                      className="text-xl font-bold "
                      style={{ color: "black" }}
                    >
                      ₹{lastResult?.payout}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "black" }}>
                      Period: {lastResult?.duration} seconds{" "}
                      {lastResult?.periodId}
                    </p>
                  </div>
                </div>
                <label className="absolute bottom-4 left-20 inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWinPopupChecked}
                    onChange={() =>
                      setShowWinPopupChecked(!showWinPopupChecked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 relative">
                    <img
                      src={agree}
                      alt="checkbox background"
                      className="w-full h-full object-contain"
                    />
                    {showWinPopupChecked && (
                      <img
                        src={whitetick}
                        alt="tick"
                        className="absolute inset-0 w-3 h-3 m-auto pointer-events-none"
                      />
                    )}
                  </div>
                  <span className="ml-1 text-sm text-white drop-shadow">
                    3 sec auto close
                  </span>
                </label>
              </div>
              <button
                onClick={() => {
                  setShowWinPopup(false);
                  setLastResult(null);
                }}
                className="mt-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              >
                <img
                  src={cross}
                  alt="Close"
                  className="w-10 h-10 object-contain"
                />
              </button>
            </div>
          </div>
        )}
        {showLossPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-70 fixed inset-0"></div>
            <div className="relative z-10 flex flex-col items-center max-w-[400px] mx-auto">
              <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                <img
                  src={win}
                  alt="Loss"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-center text-white">
                  <p className="text-2xl font-bold text-red-500 drop-shadow-lg">
                    Better Luck Next Time
                  </p>
                </div>
                <div className="absolute top-[62%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                  <div className="flex items-center justify-center gap-x-2 mt-1">
                    <h2 className="text-xs whitespace-nowrap text-white font-medium mr-1">
                      Lottery results
                    </h2>
                    <p className="text-xs bg-red-500 px-1 border-2 border-white py-0.5 rounded text-white">
                      {lastResult?.result?.number || "N/A"}
                    </p>
                    <p className="text-xs bg-red-500 px-1 border-2 border-white py-0.5 rounded">
                      {lastResult?.result?.size || "Big"}
                    </p>
                    <p className="text-xs bg-red-500 px-1 border-2 border-white py-0.5 rounded">
                      {lastResult?.result?.parity || "Even"}
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-md font-bold text-red-500">No Bonus</p>
                    <p className="text-xl font-bold" style={{ color: "black" }}>
                      ₹0
                    </p>
                    <p className="text-xs text-400" style={{ color: "black" }}>
                      Period: {lastResult?.duration} seconds{" "}
                      {lastResult?.periodId}
                    </p>
                  </div>
                </div>
                <label className="absolute bottom-4 left-20 inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLossPopupChecked}
                    onChange={() =>
                      setShowLossPopupChecked(!showLossPopupChecked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 relative">
                    <img
                      src={agree}
                      alt="checkbox background"
                      className="w-full h-full object-contain"
                    />
                    {showLossPopupChecked && (
                      <img
                        src={whitetick}
                        alt="tick"
                        className="absolute inset-0 w-3 h-3 m-auto pointer-events-none"
                      />
                    )}
                  </div>
                  <span className="ml-1 text-sm text-white drop-shadow">
                    3 sec auto close
                  </span>
                </label>
              </div>
              <button
                onClick={() => {
                  setShowLossPopup(false);
                  setLastResult(null);
                }}
                className="mt-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              >
                <img
                  src={cross}
                  alt="Close"
                  className="w-10 h-10 object-contain"
                />
              </button>
            </div>
          </div>
        )}

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
            <div className="bg-black bg-opacity-80 rounded-2xl shadow-lg w-[10%] w-[300px] p-2 text-center">
              <div className="text-white text-lg font-bold">Success</div>
            </div>
          </div>
        )}

        <FreezePopup
          timeRemaining={timeRemaining}
          duration={buttonData[activeButton].duration}
          handleRefresh={() => setRefetchData((prev) => !prev)}
          gameType="wingo"
        >
          <div className="bg-[#333332] rounded-lg shadow-md  p-2 pt-1 space-y-2">
            {/* {isLoading && (
              <div className="text-center text-gray-500">Loading...</div>
            )} */}
            <div className="flex justify-between mb-2 space-x-4">
              {["Green", "Violet", "Red"].map((color) => (
                <button
                  key={color}
                  className={`flex-1 text-white py-2 rounded-tl-lg rounded-br-lg text-sm ${tailwindColorMap[color]}`}
                  onClick={() => handleBet(color)}
                >
                  {color}
                </button>
              ))}
            </div>
            <div className="bg-custom-dark-gray p-2 rounded-lg">
              <div className="flex justify-between space-x-1 mb-2">
                {["0", "1", "2", "3", "4"].map((num) => (
                  <span
                    key={num}
                    className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer ${tailwindColorMap[iconColorMap[num]]} ${
                      isRandomAnimating ? "squeeze-animate" : ""
                    }`}
                    onClick={() => handleNumberClick(num)}
                  >
                    <img
                      src={imageMap[num] || imageMap.default}
                      alt={`Icon ${num}`}
                      className="w-full h-full"
                    />
                  </span>
                ))}
              </div>
              <div className="flex justify-between space-x-1">
                {["5", "6", "7", "8", "9"].map((num) => (
                  <span
                    key={num}
                    className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer ${tailwindColorMap[iconColorMap[num]]} ${
                      isRandomAnimating ? "squeeze-animate" : ""
                    }`}
                    onClick={() => handleNumberClick(num)}
                  >
                    <img
                      src={imageMap[num] || imageMap.default}
                      alt={`Icon ${num}`}
                      className="w-full h-full"
                    />
                  </span>
                ))}
              </div>
            </div>

            {showPopup && (
              <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] bg-neutral-900 text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
                <div
                  className={`${tailwindColorMap[showPopup]} rounded-t-xl flex flex-col items-center text-center`}
                >
                  <h2 className="text-lg font-bold mt-2">{selectedTitle}</h2>
                  <div className="flex w-full max-w-xs items-center justify-center bg-white text-black gap-2 mt-2 p-2 rounded-lg">
                    <span>Select</span>
                    <span className="font-bold">{showPopup}</span>
                  </div>
                  <div
                    className={`relative ${tailwindColorMap[showPopup]} rounded-t-xl px-0 flex flex-col items-center text-center p-[14px]`}
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
                          className={`px-2 py-1 rounded text-sm ${
                            betAmount === parseInt(label)
                              ? `${tailwindColorMap[showPopup]} ring-2 ring-white`
                              : "bg-neutral-700 hover:bg-neutral-600"
                          }`}
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
                        className={`${tailwindColorMap[showPopup]} px-2 rounded text-sm`}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-16 bg-neutral-800 text-center py-1 rounded text-sm"
                      />
                      <button
                        className={`${tailwindColorMap[showPopup]} px-2 rounded text-sm`}
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2 justify-end">
                    {multiplierOptions.map((label) => (
                      <button
                        key={label}
                        className={`px-2 py-1 rounded text-sm transition ${
                          popupMultiplier === label
                            ? `${tailwindColorMap[showPopup]} ring-2 ring-white`
                            : "bg-neutral-700 hover:bg-neutral-600"
                        }`}
                        onClick={() => handlePopupMultiplierClick(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="" onClick={() => setChecked(!checked)}>
                      {checked ? (
                        <img src={agree} alt="icon" className="w-5 h-5 ml-2" />
                      ) : (
                        <img
                          src={notAgree}
                          alt="icon"
                          className="w-5 h-5 ml-2"
                        />
                      )}
                    </div>
                    <span className="text-sm">I agree</span>
                    <button
                      className="text-red-500 hover:underline text-sm"
                      onClick={handleOpenPreSalePopup}
                    >
                      Pre-sale rules
                    </button>
                  </div>

                  {isInsufficient && (
                    <span className="text-red-500 text-xs">
                      Insufficient balance
                    </span>
                  )}
                  <div className="flex w-[calc(100%+16px)] -mx-2">
                    <button
                      onClick={handleCancelBet}
                      className="bg-neutral-700 flex-1 hover:bg-neutral-600 transition py-3 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      className={`${tailwindColorMap[showPopup]} flex-1 py-3 transition text-sm`}
                      onClick={handlePlaceBet}
                      disabled={isInsufficient}
                    >
                      Total amount ₹{calculateTotalAmount()}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {selectedNumberPopup && (
              <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] bg-neutral-900 text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
                <div
                  className={`${tailwindColorMap[selectedNumberPopup.color]} rounded-t-xl flex flex-col items-center text-center`}
                >
                  <h2 className="text-lg font-bold mt-2">{selectedTitle}</h2>
                  <div className="flex w-full max-w-xs items-center justify-center bg-white text-black gap-2 mt-2 p-2 rounded-lg">
                    <span>Select</span>
                    <span className="font-bold">
                      {selectedNumberPopup.number}
                    </span>
                  </div>
                  <div
                    className={`relative ${tailwindColorMap[selectedNumberPopup.color]} rounded-t-xl px-0 flex flex-col items-center text-center p-[14px]`}
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
                          className={`px-2 py-1 rounded text-sm ${
                            betAmount === parseInt(label)
                              ? `${tailwindColorMap[selectedNumberPopup.color]} ring-2 ring-white`
                              : "bg-neutral-700 hover:bg-neutral-600"
                          }`}
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
                        className={`${tailwindColorMap[selectedNumberPopup.color]} px-2 rounded text-sm`}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-16 bg-neutral-800 text-center py-1 rounded text-sm"
                      />
                      <button
                        className={`${tailwindColorMap[selectedNumberPopup.color]} px-2 rounded text-sm`}
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2 justify-end">
                    {multiplierOptions.map((label) => (
                      <button
                        key={label}
                        className={`px-2 py-1 rounded text-sm transition ${
                          popupMultiplier === label
                            ? `${tailwindColorMap[selectedNumberPopup.color]} ring-2 ring-white`
                            : "bg-neutral-700 hover:bg-neutral-600"
                        }`}
                        onClick={() => handlePopupMultiplierClick(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="" onClick={() => setChecked(!checked)}>
                      {checked ? (
                        <img src={agree} alt="icon" className="w-5 h-5 ml-2" />
                      ) : (
                        <img
                          src={notAgree}
                          alt="icon"
                          className="w-5 h-5 ml-2"
                        />
                      )}
                    </div>
                    <span className="text-sm">I agree</span>
                    <button
                      className="text-red-500 hover:underline text-sm"
                      onClick={handleOpenPreSalePopup}
                    >
                      Pre-sale rules
                    </button>
                  </div>
                  {isInsufficient && (
                    <span className="text-red-500 text-xs">
                      Insufficient balance
                    </span>
                  )}
                  <div className="flex w-[calc(100%+16px)] -mx-2">
                    <button
                      onClick={handleCancelBet}
                      className="bg-neutral-700 flex-1 hover:bg-neutral-600 transition py-3 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      className={`${tailwindColorMap[selectedNumberPopup.color]} flex-1 py-3 transition text-sm`}
                      onClick={handlePlaceBet}
                      disabled={isInsufficient}
                    >
                      Total amount ₹{calculateTotalAmount()}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center items-center space-x-1">
              <button
                onClick={handleRandomClick}
                className={`text-sm px-3 py-2 rounded-lg flex-1 transition-all duration-300 ${
                  isRandomAnimating
                    ? "bg-gray-500 text-red-600"
                    : "bg-[#242424] text-red-600 border border-red-700"
                }`}
                disabled={isRandomAnimating}
              >
                Random
              </button>
              {multiplierOptions.map((value) => (
                <button
                  key={value}
                  className={`text-xs px-2 py-2 rounded-lg flex-1 transition-all duration-200 ${
                    externalMultiplier === value
                      ? "bg-green-500 text-white transform -translate-y-0.5"
                      : "bg-[#242424] text-[#a8a5a1]"
                  }`}
                  onClick={() => handleExternalMultiplierClick(value)}
                  disabled={isRandomAnimating}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-[#5088d3] text-white rounded-full flex overflow-hidden w-full max-w-xs">
                <span
                  className="flex-1 py-2 bg-[#feaa57] cursor-pointer text-center text-sm"
                  onClick={() => handleToggleBigPopup("Big")}
                >
                  Big
                </span>
                <span
                  className="flex-1 py-2 bg-green-500 cursor-pointer text-center text-sm"
                  onClick={() => handleToggleBigPopup("Ai Trade")}
                >
                  Ai Trade
                </span>
                <span
                  className="flex-1 py-2 cursor-pointer text-center text-sm"
                  onClick={() => handleToggleBigPopup("Small")}
                >
                  Small
                </span>
              </button>
            </div>
            {showBigPopup && (
              <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] bg-neutral-900 text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
                <div
                  className={`${tailwindColorMap[selectedBigOption]} rounded-t-xl flex flex-col items-center text-center`}
                >
                  <h2 className="text-lg font-bold mt-2">{selectedTitle}</h2>
                  <div className="flex w-full max-w-xs items-center justify-center bg-white text-black gap-2 mt-2 p-2 rounded-lg">
                    <span>Select</span>
                    <span className="font-bold">{selectedBigOption}</span>
                  </div>
                  <div
                    className={`relative ${tailwindColorMap[selectedBigOption]} rounded-t-xl px-0 flex flex-col items-center text-center p-[14px]`}
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
                          className={`px-2 py-1 rounded text-sm ${
                            betAmount === parseInt(label)
                              ? `${tailwindColorMap[selectedBigOption]} ring-2 ring-white`
                              : "bg-neutral-700 hover:bg-neutral-600"
                          }`}
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
                        className={`${tailwindColorMap[selectedBigOption]} px-2 rounded text-sm`}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-16 bg-neutral-800 text-center py-1 rounded text-sm"
                      />
                      <button
                        className={`${tailwindColorMap[selectedBigOption]} px-2 rounded text-sm`}
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2 justify-end">
                    {multiplierOptions.map((label) => (
                      <button
                        key={label}
                        className={`px-2 py-1 rounded text-sm transition ${
                          popupMultiplier === label
                            ? `${tailwindColorMap[selectedBigOption]} ring-2 ring-white`
                            : "bg-neutral-700 hover:bg-neutral-600"
                        }`}
                        onClick={() => handlePopupMultiplierClick(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="" onClick={() => setChecked(!checked)}>
                      <img
                        src={agree}
                        alt="checkbox"
                        className="w-5 h-5 ml-2"
                      />
                    </div>
                    <span className="text-sm">I agree</span>
                    <button
                      className="text-red-500 hover:underline text-sm"
                      onClick={handleOpenPreSalePopup}
                    >
                      Pre-sale rules
                    </button>
                  </div>
                  {isInsufficient && (
                    <span className="text-red-500 text-xs">
                      Insufficient balance
                    </span>
                  )}
                  <div className="flex w-[calc(100%+16px)] -mx-2">
                    <button
                      onClick={handleCancelBet}
                      className="bg-neutral-700 flex-1 hover:bg-neutral-600 transition py-3 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      className={`${tailwindColorMap[selectedBigOption]} flex-1 py-3 transition text-sm`}
                      onClick={handlePlaceBet}
                      disabled={isInsufficient}
                    >
                      Total amount ₹{calculateTotalAmount()}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FreezePopup>

        {showPreSalePopup && (
          <div className="fixed inset-0 bg-[#201d2b] bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-[#201d2b] text-white rounded-3xl shadow-lg w-[90%] max-w-[360px] p-4 relative mt-[-5vh]">
              <div className="bg-gradient-to-b from-[#FAE59F] to-[#C4933F] text-white text-center py-3 text-lg font-normal rounded-t-2xl w-full absolute top-0 left-0">
                《Pre-sale rules》
              </div>
              <div className="text-sm text-white max-h-[45vh] overflow-y-auto p-3 mt-8 leading-[2.5]">
                <p>
                  In order to protect the legitimate rights and interests of
                  users participating in the pre-sale and maintain the normal
                  operating order of the pre-sale, these rules are formulated in
                  accordance with relevant agreements and regulations.
                </p>
                <ol className="list-decimal pl-4">
                  <li>
                    <strong>Pre-sale definition:</strong> Refers to a sales
                    model in which a seller offers a bundle of a product or
                    service collectively.
                  </li>
                  <li>
                    <strong>Pre-sale process:</strong> Customers place an order,
                    make a deposit, and the product is delivered at a specified
                    date.
                  </li>
                  <li>
                    <strong>Cancellation policy:</strong> Orders can be canceled
                    before the final payment, but deposits may be non-refunded.
                  </li>
                  <li>
                    <strong>Pre-sale system:</strong> This helps sellers
                    organize product launches and ensures smooth transactions.
                  </li>
                  <li>
                    <strong>Pricing:</strong> Pre-sale items have two components
                    – deposit and final payment.
                  </li>
                  <li>
                    <strong>Refunds:</strong> Refunds are only applicable under
                    certain conditions.
                  </li>
                </ol>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleClosePreSalePopup}
                  className="bg-gradient-to-b from-[#FAE59F] to-[#C4933F] rounded-lg text-white px-8 py-2 font-normal shadow-md"
                >
                  I know
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between space-x-1 mb-3 mt-1">
          <button
            className={`w-full px-1 py-2 text-xs rounded-lg shadow text-center ${
              activeTab === "gameHistory"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] "
                : "bg-[#333332] text-[#a8a5a1] font-normal"
            }`}
            onClick={() => setActiveTab("gameHistory")}
          >
            Game history
          </button>
          <button
            className={`w-full px-4 py-2 text-sm rounded-lg shadow text-center ${
              activeTab === "chart"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
                : "bg-[#333332] text-[#a8a5a1] font-normal"
            }`}
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
          <button
            className={`w-full px-4 py-2 text-sm rounded-lg shadow text-center ${
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
            <>
              <GameHistoryTable />
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
            </>
          )}
          {activeTab === "chart" && (
            <>
              <div className="p-2 rounded-t-lg relative">
                <ChartConnectorCanvas chartData={chartData} />
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
                          className=" border-gray-700 text-white text-xs text-center"
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
                                const isHighlighted = row.number === i;
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
                                        ? `${highlightColor} text-white`
                                        : `bg-gray-600 text-gray-300 border border-${highlightColor}`
                                    }`}
                                  >
                                    {i}
                                  </span>
                                );
                              })}

                              {/* B/S circle */}
                              <span
                                className={`w-[16px] h-[16px] ml-4 flex items-center justify-center rounded-full text-xs ${
                                  row.size === "Big"
                                    ? "bg-yellow-500 text-white"
                                    : row.size === "Small"
                                      ? "bg-blue-400 text-white"
                                      : "bg-gray-500"
                                }`}
                              >
                                {row.size === "Big"
                                  ? "B"
                                  : row.size === "Small"
                                    ? "S"
                                    : ""}
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
            </>
          )}
          {activeTab === "myHistory" && (
            <div className="bg-[#333332] ">
              {isLoading ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d9ac4f] mx-auto mb-2"></div>
                  <p>Loading your betting history...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-400">
                  <p>{error}</p>
                  <button
                    onClick={() => fetchUserBets(currentPage)}
                    className="mt-2 px-4 py-2 bg-[#d9ac4f] text-black rounded hover:bg-[#c49b45]"
                  >
                    Retry
                  </button>
                </div>
              ) : userBets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No betting history found</p>
                  <p className="text-sm mt-1">
                    Your bets will appear here once you start playing
                  </p>
                </div>
              ) : (
                <>
                  {userBets.map((bet, index) => {
                    // Function to determine the color based on bet selection
                    const getColorClass = (selection) => {
                      if (!selection) return "bg-gray-500";

                      const sel = selection.toString().toLowerCase();
                      if (
                        sel.includes("green") ||
                        sel === "g" ||
                        sel === "1" ||
                        sel === "3" ||
                        sel === "7" ||
                        sel === "9"
                      ) {
                        return "bg-green-500";
                      } else if (
                        sel.includes("red") ||
                        sel === "r" ||
                        sel === "2" ||
                        sel === "4" ||
                        sel === "6" ||
                        sel === "8"
                      ) {
                        return "bg-red-500";
                      } else if (
                        sel.includes("violet") ||
                        sel === "v" ||
                        sel === "0" ||
                        sel === "5"
                      ) {
                        return "bg-purple-500";
                      } else if (sel.includes("big") || sel === "big") {
                        return "bg-blue-500";
                      } else if (sel.includes("small") || sel === "small") {
                        return "bg-yellow-500";
                      }
                      return "bg-gray-500";
                    };

                    return (
                      <div
                        key={bet.betId || index}
                        className=" rounded-md cursor-pointer bg-[#2a2a29] "
                        onClick={() =>
                          setIsDetailsOpen(
                            isDetailsOpen === index ? null : index
                          )
                        }
                      >
                        <div className="flex justify-between items-center p-3">
                          <div className="flex items-center space-x-3">
                            {/* Color Square Box */}
                            <div
                              className={`w-8 h-8 rounded ${getColorClass(bet.select)}`}
                            ></div>
                            <div className="text-left">
                              <p className="text-gray-200 text-sm font-medium">
                                {bet.period}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {bet.orderTime}
                              </p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-xs">
                              {bet.result || "Pending"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <div
                              className={`border text-xs rounded-md px-2 py-1 ${
                                bet.status === "won"
                                  ? "border-green-500 text-green-500"
                                  : bet.status === "lost"
                                    ? "border-red-500 text-red-500"
                                    : "border-red-500 text-red-500"
                              }`}
                              style={{ textTransform: "capitalize" }}
                            >
                              {bet.status === "won" ? "Success" : "Failed"}
                            </div>
                            <p
                              className={`font-medium text-sm ${
                                bet.winLose?.startsWith("+")
                                  ? "text-green-500"
                                  : bet.winLose?.startsWith("-")
                                    ? "text-red-500"
                                    : "text-gray-400"
                              }`}
                            >
                              {bet.winLose}
                            </p>
                          </div>
                        </div>

                        {isDetailsOpen === index && (
                          <div className="bg-[#2a2a2a] p-2 mx-1 mb-3 rounded-b-lg">
                            <div className="mb-4">
                              <h3 className="text-white text-lg font-medium mb-1">
                                Details
                              </h3>
                            </div>
                            <div className="space-y-3 text-sm">
                              {[
                                {
                                  label: "Order number",
                                  value: bet.orderNumber,
                                  valueClass: "text-right text-white",
                                },
                                { label: "Period", value: bet.period },
                                { label: "Purchase amount", value: bet.amount },
                                { label: "Quantity", value: bet.quantity },
                                {
                                  label: "Amount after tax",
                                  value: bet.afterTax,
                                  valueClass: "text-[#ff5555]",
                                },
                                {
                                  label: "Tax",
                                  value: bet.tax,
                                  valueClass: "text-[#ff5555]",
                                },
                                {
                                  label: "Result",
                                  value: bet.result || "Pending",
                                  valueClass: "text-green-400",
                                },
                                {
                                  label: "Select",
                                  value: bet.select,
                                  valueClass: "text-[#ff5555]",
                                },
                                {
                                  label: "Status",
                                  value:
                                    bet.status === "won" ? "Success" : "Failed",
                                  valueClass:
                                    bet.status === "won"
                                      ? "text-green-400"
                                      : "text-[#ff5555]",
                                },
                                {
                                  label: "Win/lose",
                                  value: bet.winLose,
                                  valueClass: bet.winLose?.startsWith("+")
                                    ? "text-green-400"
                                    : bet.winLose?.startsWith("-")
                                      ? "text-[#ff5555]"
                                      : "text-[#ff5555]",
                                },
                                { label: "Order time", value: bet.orderTime },
                              ].map(
                                ({
                                  label,
                                  value,
                                  valueClass = "text-gray-400",
                                }) => (
                                  <div
                                    key={label}
                                    className="bg-[#4d4d4c] px-1.5 py-1.5 rounded-md flex justify-between items-center"
                                  >
                                    <span className="text-gray-300 text-sm">
                                      {label}
                                    </span>
                                    <span
                                      className={`${valueClass} text-sm font-normal`}
                                    >
                                      {value || "N/A"}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Pagination for My History */}
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
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="text-center mb-0 w-full mt-2 relative z-0">
          <div className="bg-[#333332] rounded-xl shadow-lg p-4 flex items-center justify-center space-x-4 relative z-0">
            <button
              className="p-3 text-[#a8a5a1] bg-[#4d4d4c] rounded-lg disabled:opacity-50 z-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoIosArrowBack className="w-5 h-5" />
            </button>
            <span className="px-8 text-sm text-[#a8a5a1] font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              className="p-3 text-[#a8a5a1] bg-[#4d4d4c] rounded-lg disabled:opacity-50 z-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LotteryWingo;
