import React, { useState, useRef, useEffect } from "react";
import { MdExpandMore } from "react-icons/md";
import { BsCurrencyRupee } from "react-icons/bs";
import GameHistoryHeader from "../../components/GameHistoryHeader";
import Img1 from "../../Assets/lottery1.png";
import Img2 from "../../Assets/casino1.png";
import Img3 from "../../Assets/sport1.png";
import Img4 from "../../Assets/rummy1.png";
import Img5 from "../../Assets/slot1.png";
import activeImg1 from "../../Assets/Lottery2.png";
import activeImg2 from "../../Assets/casino2.png";
import activeImg3 from "../../Assets/sport2.png";
import activeImg4 from "../../Assets/rummy2.png";
import activeImg5 from "../../Assets/slot2.png";
import line from "../../Assets/finalicons/line.png";
import bets from "../../Assets/Newicons/betrecordsicon.png";
import apiServices from "../../api/apiServices";
import moment from 'moment'
function GameHistoryProfile() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
  const [selectedOption, setSelectedOption] = useState("");
  const [betHistory, setBetHistory] = useState([])

  const tabsContainerRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const descriptions = ["Lottery", "Casino", "Fishing", "Rummy", "Original", "Slots"];
  const inactiveImages = [Img1, Img2, Img3, Img4, Img5, Img1];
  const activeImages = [activeImg1, activeImg2, activeImg3, activeImg4, activeImg5, activeImg1];

  const dropdownOptions = {
    Lottery: ["wingo", "trx_wix", "5d", "k3"],
    Casino: ["All", "Evo Video", "DG", "AG Video"],
    Fishing: ["All", "Jili", "JDB", "CQ9", "V8Card"],
    Rummy: ["All", "V8Card", "Card365"],
    Original: ["All", "Jili", "JDB", "TB Chess", "Spribe"],
    Slots: ["All", "Jili", "JDB", "Evo Electronic", "MG", "CQ9", "AG Electronic", "9G"],
  };
  const fetchUserBet = async (gameType, duration) => {
    let data = await apiServices.getUserBets(gameType, duration);
    return data?.data?.bets
  }
  useEffect(() => {
    const currentOptions = dropdownOptions[descriptions[selectedIndex]];
    const selected = currentOptions ? currentOptions[0] : "All";
    setSelectedOption(selected);
  }, [selectedIndex]);

  useEffect(() => {
    const fetchAllBets = async () => {
      try {
        const durationMap = apiServices.getListOfGameAndDuration();
        const durationArr = durationMap[selectedOption];
        console.log("durationArr", durationArr)

        if (!durationArr || durationArr.length === 0) return;
        const results = await Promise.all(
          durationArr.map(duration => fetchUserBet(selectedOption, duration))
        );
        setBetHistory(results.flat());
      } catch (error) {
        console.error("Error fetching user bets:", error);
      }
    };

    fetchAllBets();
  }, [selectedOption])

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragOffset(walk);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragOffset(walk);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) < 5) return;
    setDragOffset(0);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
      const handleMouseLeave = () => setIsDragging(false);
      tabsContainer.addEventListener("mouseleave", handleMouseLeave);
      return () => tabsContainer.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, []);

  const openDateModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  const handleDateSelect = (type, value) => {
    setSelectedDate((prev) => ({
      ...prev,
      [type]: value.toString().padStart(2, "0"),
    }));

    const containerRef =
      type === "year" ? yearRef.current :
        type === "month" ? monthRef.current :
          dayRef.current;

    const items = type === "year" ? years :
      type === "month" ? months : days;

    const selectedIndex = items.findIndex(item =>
      item.toString() === value.toString().padStart(2, "0"));

    if (containerRef && selectedIndex !== -1) {
      const rowHeight = 40;
      containerRef.scrollTop = selectedIndex * rowHeight + 60;
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  function getNumberBgClass(number) {
    if (number === 0) {
      return "bg-gradient-to-r from-red-600 to-violet-600";
    } else if (number === 5) {
      return "bg-gradient-to-r from-green-600 to-violet-600";
    } else if ([2, 4, 6, 8].includes(number)) {
      return "bg-red-600";
    } else if ([3, 5, 7, 9].includes(number)) {
      return "bg-green-600";
    } else {
      return "bg-yellow-500"; // default fallback
    }
  }


  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col items-center">
      <GameHistoryHeader />
      <div className="bg-[#242424] flex flex-col w-full max-w-[400px] mx-auto items-center mt-12">
        <div className="w-full px-3">
          <div
            ref={tabsContainerRef}
            className="flex space-x-4 overflow-hidden cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              userSelect: "none",
              scrollBehavior: "smooth",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {descriptions.map((desc, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg shadow-md px-8 mb-1 mt-2 flex-shrink-0 transition-all duration-300 
                ${selectedIndex === index ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]" : "bg-[#333332]"}
                ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
                onClick={() => {
                  if (Math.abs(dragOffset) < 5) setSelectedIndex(index);
                }}
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <img
                    src={selectedIndex === index ? activeImages[index] : inactiveImages[index]}
                    alt={`Box ${index}`}
                    className="w-6 h-6 object-contain"
                  />
                  <p
                    className={`text-xs font-semibold ${selectedIndex === index ? "text-[#8f5206]" : "text-[#a8a5a1]"}`}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#242424] flex flex-col items-center justify-start w-full max-w-[400px] mx-auto">
          {/* Filter Options */}
          <div className="flex w-full p-3 gap-3 mb-4 text-[#f5f3f0]">
            <details className="relative w-1/2">
              <summary className="bg-[#333332] p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center list-none appearance-none">
                {selectedOption || (descriptions[selectedIndex] in dropdownOptions
                  ? dropdownOptions[descriptions[selectedIndex]][0]
                  : "All")}
                <MdExpandMore className="text-gray-400" />
              </summary>
              <ul className="absolute bg-[#333332] mt-2 rounded-lg shadow-lg p-2 w-full z-10">
                {dropdownOptions[descriptions[selectedIndex]]?.map((option, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-[#444] cursor-pointer"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </details>
            <div className="relative w-1/2" onClick={openDateModal}>
              <div className="bg-[#333332] p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center">
                {`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`}
                <MdExpandMore className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Transaction Card (Win Go) - Modified to match the image */}
          {
            betHistory?.length > 0 && betHistory?.map((bet, index) => {
              return (
                <>
                  <div className="bg-[#333332] w-full rounded-md p-3 shadow-lg border border-gray-700 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-white font-semibold text-lg" style={{ textTransform: 'capitalize' }}>{selectedOption}</h2>
                      <span
                        className={`font-medium text-lg ${bet?.status === "won"
                          ? "text-green-500"
                          : bet?.status === "lost"
                            ? "text-red-500"
                            : "text-yellow-500"
                          }`}
                      >
                        {bet?.status}
                      </span>

                    </div>

                    <p className="text-gray-500 text-xs mb-2" style={{ textTransform: 'capitalize' }}>{moment(bet?.updatedAt).format("DD-MM-YYYY hh:mm A")}</p>
                    <div className="border-b border-gray-600 my-2"></div>

                    <div className="flex">
                      {/* Left vertical image */}
                      <div className="mr-3 pt-1">
                        <img src={bets} alt="Bets Line" className="h-32 object-contain" />

                      </div>

                      {/* Info Items */}
                      <div className="space-y-2 text-sm flex-1">
                        <div className="flex justify-between">
                          <span className="text-white">Type</span>
                          <span className="text-white">Win Go {bet?.duration} second</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Period</span>
                          <span className="text-white">{bet?.periodId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Order</span>
                          <span className="text-white">{bet?.betId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Select</span>
                          <span className="text-white">{bet?.betValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white">Total bet</span>
                          <span className="text-yellow-500 font-semibold">₹{bet?.betAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-[400px]">
                    <img
                      src={line}
                      alt="Line Separator"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  {/* Lottery Results Section */}
                  <div className="bg-[#333332] w-full rounded-md p-4 shadow-lg border border-gray-700">
                    <h2 className="text-white font-semibold text-sm mb-3">Lottery Results</h2>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`${getNumberBgClass(bet?.result?.number)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
                        {bet?.result?.number}
                      </span>
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">{bet?.result?.size}</span>
                      <span className="bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-md">{bet?.result?.color}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-[#4d4d4c] p-3 rounded-md text-center">
                        <p className="text-[#a8a5a1] font-semibold">₹{bet?.amountAfterTax}</p>
                        <p className="text-[#a8a5a1] text-xs">Actual amount</p>
                      </div>
                      <div className="bg-[#4d4d4c] p-3 rounded-md text-center">
                        <p className="text-[#a8a5a1] font-semibold">₹{bet?.payout}</p>
                        <p className="text-[#a8a5a1] text-xs">Winnings</p>
                      </div>
                      <div className="bg-[#4d4d4c] p-3 rounded-md text-center">
                        <p className="text-[#a8a5a1] font-semibold">₹{bet?.taxAmount}</p>
                        <p className="text-[#a8a5a1] text-xs">Handling fee</p>
                      </div>
                      <div className="bg-[#4d4d4c] p-3 rounded-md text-center">
                        <p className="text-[#a8a5a1] font-semibold">₹{bet?.profitLoss}</p>
                        <p className="text-[#a8a5a1] text-xs">Profit/loss</p>
                      </div>
                    </div>
                  </div>
                </>
              )

            })
          }





        </div>
      </div>

      {/* Date Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
          <div
            className="rounded-t-3xl shadow-xl w-full max-w-[400px] bg-[#333332]"
            style={{
              background: 'linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))'
            }}
          >
            <div className="flex justify-between items-center px-4 py-3 bg-[#333332]">
              <button
                className="text-gray-400 hover:text-gray-300 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <h2 className="text-white font-medium">Choose a date</h2>
              <button
                className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                onClick={closeModal}
              >
                Confirm
              </button>
            </div>

            {/* Date Picker */}
            <div className="flex w-full">
              {/* Year Column */}
              <div className="flex-1">
                <div className="w-full text-center text-gray-500 py-2">Year</div>
                <div className="h-[160px] relative overflow-hidden" ref={yearRef}>
                  <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                  <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                    <div className="h-[60px]"></div>
                    {years.map((year) => (
                      <div
                        key={year}
                        className={`h-[40px] flex items-center justify-center text-center ${parseInt(selectedDate.year) === year
                          ? "text-white font-medium"
                          : "text-gray-500"
                          } cursor-pointer`}
                        onClick={() => handleDateSelect("year", year)}
                      >
                        {year}
                      </div>
                    ))}
                    <div className="h-[60px]"></div>
                  </div>
                </div>
              </div>

              {/* Month Column */}
              <div className="flex-1">
                <div className="w-full text-center text-gray-500 py-2">Month</div>
                <div className="h-[160px] relative overflow-hidden" ref={monthRef}>
                  <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                  <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                    <div className="h-[60px]"></div>
                    {months.map((month) => (
                      <div
                        key={month}
                        className={`h-[40px] flex items-center justify-center text-center ${selectedDate.month === month
                          ? "text-white font-medium"
                          : "text-gray-500"
                          } cursor-pointer`}
                        onClick={() => handleDateSelect("month", month)}
                      >
                        {month}
                      </div>
                    ))}
                    <div className="h-[60px]"></div>
                  </div>
                </div>
              </div>

              {/* Day Column */}
              <div className="flex-1">
                <div className="w-full text-center text-gray-500 py-2">Day</div>
                <div className="h-[160px] relative overflow-hidden" ref={dayRef}>
                  <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                  <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                    <div className="h-[60px]"></div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className={`h-[40px] flex items-center justify-center text-center ${selectedDate.day === day
                          ? "text-white font-medium"
                          : "text-gray-500"
                          } cursor-pointer`}
                        onClick={() => handleDateSelect("day", day)}
                      >
                        {day}
                      </div>
                    ))}
                    <div className="h-[60px]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4"></div>
          </div>
        </div>
      )}

      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default GameHistoryProfile;