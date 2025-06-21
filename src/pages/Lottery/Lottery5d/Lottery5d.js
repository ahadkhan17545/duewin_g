
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
import { getWalletBalance } from "../../../api/apiServices";
import useSocket from "../../../hooks/useSocket";

const buttonData = [
  { id: 0, title: <><span className="block text-center">5D</span><span className="block text-center">1Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 60 },
  { id: 1, title: <><span className="block text-center">5D</span><span className="block text-center">3Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 180 },
  { id: 2, title: <><span className="block text-center">5D</span><span className="block text-center">5Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 300 },
  { id: 3, title: <><span className="block text-center">5D</span><span className="block text-center">10Min</span></>, icon: <img src={Timeblack} alt="clock icon" className="w-14 h-14" />, activeIcon: <img src={Timecolor} alt="active clock icon" className="w-14 h-14" />, duration: 600 },
];

const tailwindColorMap = {
  Big: "bg-orange-600 hover:bg-orange-500",
  Small: "bg-blue-600 hover:bg-blue-500",
  Odd: "bg-green-600 hover:bg-green-500",
  Even: "bg-red-600 hover:bg-red-500",
  Number: "bg-gray-600 hover:bg-gray-500",
};

function Lottery5d() {
  const isMounted = useRef(true);
  const location = useLocation()
  console.log("location?.state",location?.state)
  const gameType = "fiveD";
  const [activeTab, setActiveTab] = useState("gameHistory");
  const [activeImgTab, setActiveImgTab] = useState("A");
  const [historyData, setHistoryData] = useState([]);
  const [activeButton, setActiveButton] = useState(location?.state? location?.state :buttonData[0].id);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [betType, setBetType] = useState(null); // number or size
  const [quantity, setQuantity] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [popupMultiplier, setPopupMultiplier] = useState("X1");
  const [totalPages, setTotalPages] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0 });
  const [currentPeriod, setCurrentPeriod] = useState({ periodId: "Loading..." });
  const [isPeriodTransitioning, setIsPeriodTransitioning] = useState(false);
  const [checked, setChecked] = useState(false);
  const multiplierOptions = ["X1", "X5", "X10", "X20", "X50", "X100"];
  const API_BASE_URL = "https://api.strikecolor1.com";

  // WebSocket hook
  const {
    isConnected,
    connectionError,
    currentPeriod: socketPeriod,
    timeRemaining: socketTime,
    gameHistory: socketHistory,
    placeBet,
  } = useSocket(gameType, buttonData[activeButton]?.duration);

  // Wallet balance fetching
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

  // WebSocket data handling
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
          const duration = buttonData[activeButton]?.duration;
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

  // Auto-close success popup
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  // Fetch game history
  const fetchGameHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const duration = buttonData[activeButton]?.duration;
      const response = await gameApi.getGameHistory("5D", duration, currentPage, 10);
      if (response.success && response.data?.results) {
        setHistoryData(response.data.results);
        setTotalPages(response.data.pagination?.total_pages || 5);
      } else {
        setError("Failed to load game history.");
      }
    } catch (err) {
      setError(err.message || "Error fetching game history.");
    } finally {
      setLoading(false);
    }
  }, [activeButton, currentPage]);

  useEffect(() => {
    if (activeTab === "gameHistory") {
      fetchGameHistory();
    }
  }, [activeTab, fetchGameHistory]);

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
    setBetType(type); // number or size
    setIsModalOpen(true);
    setBetAmount(1);
    setQuantity(1);
    setPopupMultiplier("X1");
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleMultiplierClick = (multiplier) => {
    setPopupMultiplier(multiplier);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
    setBetType(null);
    setQuantity(1);
    setBetAmount(1);
    setPopupMultiplier("X1");
  };

  const handlePlaceBet = () => {
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
      position: activeImgTab, // A, B, C, D, E, or SUM
    };

    console.log("🎯 Placing Bet:", betData);

    const betPlaced = placeBet(betData);

    if (betPlaced) {
      console.log("✅ Bet sent to WebSocket successfully");
      setIsModalOpen(false);
      setSelectedOption(null);
      setBetType(null);
      setQuantity(1);
      setBetAmount(1);
      setPopupMultiplier("X1");
      setShowSuccessPopup(true);
      handleRefreshBalance(); // Refresh balance after placing bet
    } else {
      console.log("❌ Failed to send bet to WebSocket");
      setError("Failed to place bet. Please try again.");
    }
  };

  const calculateTotalAmount = () => {
    const multiplierValue = parseInt(popupMultiplier.replace("X", "")) || 1;
    return (betAmount * quantity * multiplierValue).toFixed(2);
  };

  const formatTime = (num) => num.toString().padStart(2, "0");

  const getDisplayPeriodId = () => {
    if (isPeriodTransitioning || (timeRemaining.minutes === 0 && timeRemaining.seconds === 0)) {
      return "Loading...";
    }
    return currentPeriod.periodId || "Loading...";
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
      <LotteryWingoheader />

      <div className="text-center w-full max-w-sm mt-8">
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
              <div className="text-lg font-bold text-white">₹{walletBalance.toFixed(2)}</div>
              <img
                src={refresh}
                alt="Refresh balance"
                className={`w-5 h-5 absolute right-4  top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${isRefreshingBalance ? 'animate-spin opacity-50' : 'hover:scale-110'
                  }`}
                onClick={handleRefreshBalance}
                style={{
                  pointerEvents: isRefreshingBalance ? 'none' : 'auto',
                }}
              />
            </div>

            {/* Wallet label */}
            <div className="flex items-center justify-center mb-4 mt-[-2]">
              <img src={wallet} alt="icon" className="w-5 h-5" />
              <span className="ml-2 text-[#f5f3f0] text-xs ">Wallet Balance</span>
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

      <div className="bg-[#242424]  w-full h-full mt-2 flex flex-col justify-center">
        <div className="  mt-0">
          <div className="flex justify-between items-center w-full">
            <img src={speaker} alt="icon" className="w-6 h-6 ml-1" />
            <p className="text-xs text-white ml-2 flex-1 opacity-80 transition-opacity duration-1000">
              Thanks to all our members — past and present — for being part of our journey.
            </p>

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


        <div className="bg-[#4d4d4c] rounded-lg mt-4 shadow-md">
          <div className="button-container flex justify-between space-x-1">
            {buttonData.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                className={`flex flex-col items-center px-1 py-1 rounded-lg flex-1 transition-all duration-300 
          ${activeButton === button.id
                    ? "bg-gradient-to-b from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                    : "bg-[#4d4d4c] text-[#a8a5a1]"}`}
                style={{
                  textAlign: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className="icon"
                  style={{
                    fontSize: "16px", // Smaller icon
                    marginBottom: "2px", // Less gap
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
            {(historyData[0]?.result ? ["A", "B", "C", "D", "E"].map((pos, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#444] text-white text-xs">
                  {historyData[0].result[pos]}
                </div>
                <div className="text-[#a8a5a1] text-xs mt-1">{pos}</div> {/* made text-xs (bigger than 10px) */}
              </div>
            )) : ["5", "9", "5", "0", "7"].map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#444] text-white text-xs">
                  {num}
                </div>
                <div className="text-[#a8a5a1] text-xs mt-1">{["A", "B", "C", "D", "E"][idx]}</div>
              </div>
            )))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-[#a8a5a1] text-lg mb-4">=</div>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#d9ac4f] text-[#8f5206] text-sm mb-4">
              {historyData[0]?.result
                ? Object.values(historyData[0].result).reduce((acc, n) => acc + (Number(n) || 0), 0)
                : [5, 9, 5, 0, 7].reduce((acc, n) => acc + Number(n), 0)}
            </div>
          </div>
        </div>



        <div className="bg-[#333332] rounded-lg  shadow-md mb-2 p-2">
          <div className="flex justify-between mb-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-[#a8a5a1] text-xs">Period</p>
                <button onClick={() => setShowHowToPlay(true)} className="border border-[#d9ac4f] rounded-full px-3 py-0.5 flex items-center justify-center gap-1 text-[#8f5206] text-center shrink-0">
                  <img src={HowToPlay} alt="How to Play" className="w-1 h-1" />
                  <p className="text-[#d9ac4f] text-xs ">How to Play</p>
                </button>
              </div>
              <p className="text-md mt-1 font-bold text-[#f5f3f0] truncate">{getDisplayPeriodId()}</p>
            </div>
            <div className="text-right min-w-0  sm:mt-0">
              <p className="text-[#a8a5a1] mb-1 text-xs">Time Remaining</p>
              <div className="flex space-x-0.5 justify-end items-center">
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">{formatTime(timeRemaining.minutes)[0]}</span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">{formatTime(timeRemaining.minutes)[1]}</span>
                <span className="text-[#8f5206] font-bold text-lg px-0.5 w-4 text-center">:</span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">{formatTime(timeRemaining.seconds)[0]}</span>
                <span className="bg-[#f7e2c5] text-[#8f5206] font-bold text-lg rounded px-1 py-0.5 w-5 text-center">{formatTime(timeRemaining.seconds)[1]}</span>
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
              {(historyData[0]?.result ? ["A", "B", "C", "D", "E"] : [5, 9, 9, 8, 6]).map((item, index) => {
                const value = historyData[0]?.result ? historyData[0].result[item] : item;
                return (
                  <div key={index} className="flex-1 bg-[#727272] rounded flex flex-col items-center py-[4px]">
                    <div className="w-8 h-[6px] bg-[#e1e1ec] rounded-t-none rounded-b-full"></div>
                    <div className={`flex items-center justify-center ${index === 0 ? "bg-emerald-500 text-white" : "bg-[#e1e1ec] text-[#a8a5a1]"} rounded-full w-12 h-12 text-3xl font-bold my-1`}>
                      {value}
                    </div>
                    <div className="w-8 h-[6px] bg-[#e1e1ec] rounded-b-none rounded-t-full"></div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="flex mt-8 justify-start space-x-2 mb-2 overflow-x-auto">
            {["A", "B", "C", "D", "E", "SUM"].map((tab) => (
              <button
                key={tab}
                className={`w-10 h-10 shrink-0 flex items-center justify-center font-bold rounded-t-full ${activeImgTab === tab
                    ? "bg-[#d9ac4f] text-[#8f5206]"
                    : "bg-[#6f7381] text-white"
                  }`}
                onClick={() => setActiveImgTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {["A", "B", "C", "D", "E", "SUM"].map((tab) =>
            activeImgTab === tab && (
              <div key={tab} className="grid grid-cols-4 gap-2">

                {/* Top Buttons: Big Small Odd Even */}
                <div className="col-span-4 flex justify-between mt-2 space-x-2 px-1">
                  {["Big 1.98", "Small 1.98", "Odd 1.98", "Even 1.98"].map((label) => (
                    <button
                      key={label}
                      className="bg-[#57554f] text-white text-xs px-1.5 py-[10px] rounded-md  flex-1"
                      onClick={() => handleOptionClick(label.split(" ")[0], "size")}
                    >
                      {label}
                    </button>
                  ))}
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
                            onClick={() => handleOptionClick(number, "number")}
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-[#a8a5a1 border border-[#a8a5a] rounded-full text-[#a8a5a1]">
                              {number}
                            </div>
                            <p className="text-sm text-[#a8a5a1] mt-1">9X</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between px-1 mb-2 space-x-1">
                        {["5", "6", "7", "8", "9"].map((number) => (
                          <div
                            key={number}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => handleOptionClick(number, "number")}
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-[#a8a5a1] border border-[#a8a5a] rounded-full">
                              {number}
                            </div>
                            <p className="text-xs text-[#a8a5a1] mt-1">9X</p>
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

        </div>

        <div className="flex justify-between space-x-1 mb-6 mt-2">
          <button
            className={`w-full px-3 py-2 text-sm rounded-lg shadow text-center ${activeTab === "gameHistory"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
                : "bg-[#333332] text-[#a8a5a1] font-normal"
              }`}
            onClick={() => setActiveTab("gameHistory")}
          >
            Game history
          </button>
          <button
            className={`w-full px-3 py-1 text-sm rounded-lg shadow text-center ${activeTab === "chart"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-bold"
                : "bg-[#333332] text-[#a8a5a1] font-normal"
              }`}
            onClick={() => setActiveTab("chart")}
          >
            Chart
          </button>
          <button
            className={`w-full px-3 py-1 text-sm rounded-lg shadow text-center ${activeTab === "myHistory"
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
                <div className="w-full bg-red-500 text-white p-2 text-center rounded-lg mb-2">
                  {error}
                </div>
              )}
              {loading ? (
                <p className="text-white text-center py-4">Loading game history...</p>
              ) : historyData.length > 0 ? (
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr className="bg-[#3a3947] text-white">
                      <th className="px-2 py-2 text-center text-sm">Period</th>
                      <th className="px-2 py-2 text-center text-sm">Result</th>
                      <th className="px-2 py-2 text-center text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((record, index) => {
                      const totalSum = record.result?.sum ??
                        (record.result?.A + record.result?.B + record.result?.C + record.result?.D + record.result?.E) ??
                        "N/A";
                      return (
                        <tr key={index} className="bg-[#3f3f3e] relative">
                          <td className="px-2 text-xs text-[#f5f3f0] py-2">{record.periodId}</td>
                          <td className="px-2 py-2 text-xs text-center">
                            <div className="flex justify-center items-center space-x-1">
                              {[record.result.A, record.result.B, record.result.C, record.result.D, record.result.E].map((number, idx) => (
                                <div key={idx} className="w-5 h-5 flex items-center justify-center text-[#f5f3f0] bg-[#3f3f3e] rounded-full border border-gray-400">{number}</div>
                              ))}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-sm text-center">
                            <div className="w-5 h-5 flex items-center justify-center bg-[#d9ac4f] rounded-full border border-gray-400">{totalSum}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center bg-[#4d4d4c] py-4">
                  <div className="flex flex-col items-center justify-center">
                    <img src={empty} alt="No Data" className="w-28 h-40 object-contain" />
                    <p className="text-[#a8a5a1] text-sm mt-2">No game history available</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "chart" && (
            <div>
              <table className="table-auto w-full text-left">
                <thead>
                  <tr className="bg-[#3a3947] text-white">
                    <th className="px-1 py-2 text-center text-xs">Period</th>
                    <th className="px-1 py-2 text-center text-xs">Number</th>
                    <th className="px-1 py-2 text-center text-xs">O/E</th>
                  </tr>
                </thead>
                <tbody className="px-2 py-2">
                  {historyData.length > 0 ? (
                    historyData.map((row, index) => (
                      <tr key={index} className="bg-[#4d4d4c] px-2 py-2">
                        <td className="px-1 py-1 text-[#f5f3f0] text-xs text-center">{row.periodId}</td>
                        <td className="px-4 py-4 text-sm text-center">
                          <div className="flex items-center justify-center gap-[2px] h-5">
                            <span className="w-4 h-4 text-[10px] leading-[14px] flex items-center justify-center border border-[#666462] rounded-full bg-[#d9ac4f] text-[#8f5206]">{row.result[activeImgTab]}</span>
                          </div>
                        </td>
                        <td className="px-1 py-1 text-xs text-center text-white align-middle">
                          {row.result[activeImgTab] % 2 === 0 ? "E" : "O"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-2 py-4 text-center text-gray-200">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "myHistory" && (
            <div className="text-center bg-[#4d4d4c] py-4">
              <div className="flex flex-col items-center justify-center">
                <img src={empty} alt="No Data" className="w-28 h-40 object-contain" />
                <p className="text-[#a8a5a1] text-sm mt-2">No user bets available</p>
              </div>
            </div>
          )}
          <div className="text-center mb-0 w-full mt-2">
            <div className="bg-[#333332] rounded-xl shadow-lg p-4 flex items-center justify-center space-x-4">
              <button
                className="p-3 text-[#666462] bg-[#4d4d4c] rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IoIosArrowBack className="w-5 h-5" />
              </button>
              <span className="px-6 text-sm text-[#a8a5a1] font-semibold">{currentPage} / {totalPages}</span>
              <button
                className="p-3 text-[#8f5206] bg-[#d9ac4f] rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] bg-neutral-900 text-white w-full max-w-[400px] shadow-lg rounded-t-lg">
          <div className={`${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} rounded-t-xl flex flex-col items-center text-center`}>
            <h2 className="text-lg font-bold mt-2">{buttonData[activeButton]?.title}</h2>
            <div className="flex w-full max-w-xs items-center justify-center bg-white text-black gap-2 mt-2 p-2 rounded-lg">
              <span>Select</span>
              <span className="font-bold">{selectedOption} ({activeImgTab})</span>
            </div>
            <div className={`relative ${tailwindColorMap[betType === "number" ? "Number" : selectedOption]} rounded-t-xl px-0 flex flex-col items-center text-center p-[14px]`}>
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
                  className={`bg-neutral-700 px-2 py-1 rounded text-sm ${popupMultiplier === label
                    ? tailwindColorMap[betType === "number" ? "Number" : selectedOption]
                    : tailwindColorMap[betType === "number" ? "Number" : selectedOption]?.replace("bg-", "hover:bg-")
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
            <p className="text-white text-sm mb-6">Your bet has been placed successfully!</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50]">
          <div className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-2xl shadow-lg w-[90%] max-w-[360px] min-h-[65vh]">
            <div className="text-center text-lg text-[#8f5206] font-normal mb-2 py-2 bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-2xl">
              How to Play
            </div>
            <div className="bg-[#201d2b] p-4 text-white text-sm max-h-[50vh] overflow-y-auto rounded-b-lg">
              <p>1 minute 1 issue, 45 seconds to order, 15 seconds waiting for the draw. It opens all day. The total number of trades is 1440 issues.</p>
              <p className="mt-2">If you spend 100 to trade, after deducting a 2% service fee, your contract amount is 98:</p>
              <p className="mt-2">1. Select Number: If the result matches the number you selected for the chosen position (A, B, C, D, E), you will get (98*9) 882.</p>
              <p className="mt-2">2. Select Big: If the result for the chosen position shows 5,6,7,8,9, you will get (98*1.98) 194.04.</p>
              <p className="mt-2">3. Select Small: If the result for the chosen position shows 0,1,2,3,4, you will get (98*1.98) 194.04.</p>
              <p className="mt-2">4. Select Odd: If the result for the chosen position is odd (1,3,5,7,9), you will get (98*1.98) 194.04.</p>
              <p className="mt-2">5. Select Even: If the result for the chosen position is even (0,2,4,6,8), you will get (98*1.98) 194.04.</p>
            </div>
            <div className="flex justify-center py-4 bg-[#242424]">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="w-16 h-10 flex items-center justify-center text-white bg-gradient-to-b px-20 from-[#c4933f] to-[#fae59f] rounded-full font-medium shadow-md"
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
