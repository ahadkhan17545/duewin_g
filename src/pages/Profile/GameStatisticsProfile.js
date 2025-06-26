import React, { useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import GameStatisticsHeader from "../../components/GameStatisticsHeader";
import lotteryion8 from "../../Assets/lotteryicon8.png";
import gameStatsSteps from "../../Assets/gameStatsSteps.png"
import apiServices from "../../api/apiServices";
import CommanHeader from "../../components/CommanHeader";

const allowedPeriods = ["today", "yesterday", "this_week", "this_month"];
function GameStatistics() {
  const [selectedTab, setSelectedTab] = useState(allowedPeriods[0]);
  const [gameStats,setGameStats] = useState(null)
  // Data mapping for each button
  const data = {
    "today": { amount: "₹19.00", description: "Total bet for today" },
    "yesterday": { amount: "₹0.00", description: "Total bet for yesterday" },
    "this_week": { amount: "₹19.00", description: "Total bet this week" },
    "this_month": { amount: "₹24.00", description: "Total bet this month" },
  };
  const fetchData = async () => {
    let data = await apiServices.getInHouseGameStats(selectedTab)
    setGameStats(data?.overall_stats)
  }
  useEffect(()=>{
    fetchData()
  },[selectedTab])

  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col">
      <CommanHeader title="Game Statistics" />
      <div className="px-4">
        <div className="mt-16 rounded-xl ">
          {/* Navigation Buttons */}
          <nav className="flex justify-between mt-4 mb-4">
            {allowedPeriods?.map((tab) => (
              <button
                key={tab}
                className={` transition-colors text-base text-sm font-medium ${selectedTab === tab
                  ? "bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-[#8f5206]"
                  : "bg-[#333332] text-neutral-400"
                  }`}
                  style={{textTransform:'capitalize',borderRadius:'20px',padding:'10px'}}
                onClick={() => setSelectedTab(tab)}
              >
                {tab?.split("_").join(" ")}
              </button>
            ))}
          </nav>

          {/* Dynamic Content */}
          <div className="bg-[#333332] rounded-lg p-12 mb-4 flex flex-col items-center justify-center text-center">
            <span className="text-[#dd9138] text-2xl font-semibold">
              ₹{gameStats?.total_bet_amount}
            </span>
            <p className="text-neutral-400 text-sm mt-1">
              {data[selectedTab]?.description}
            </p>
          </div>

          {/* Display "No data" if amount is 0 */}
          { (
            <div className="bg-[#333332] rounded-lg p-4">
              {/* Header with Icon and Title */}
              <div className="flex items-center gap-2 mb-4 -ml-2">
                <img src={lotteryion8} alt="icongame" className="h-8 w-8" />
                <span className="material-symbols-outlined font-bold text-xl text-white">
                  Lottery
                </span>
              </div>

              {/* Stats Section with Image */}
              <div className="flex items-center gap-4">
                {/* Left Side - Image */}
                <img src={gameStatsSteps} alt="gamestats" className="h-20" />

                {/* Right Side - Stats Section */}
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Total bet</span>
                    <span className="text-gray-300 font-semibold">₹{gameStats?.total_bet_amount}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Number of bets</span>
                    <span className="text-gray-300 font-semibold">{gameStats?.total_bets}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Winning amount</span>
                    <span className="text-[#dd9138] font-semibold">₹{gameStats?.total_win_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
               { (
            <div className="bg-[#333332] rounded-lg p-4 mt-4">
              {/* Header with Icon and Title */}
              <div className="flex items-center gap-2 mb-4 -ml-2">
                <img src={lotteryion8} alt="icongame" className="h-8 w-8" />
                <span className="material-symbols-outlined font-bold text-xl text-white">
                  Hot Games
                </span>
              </div>

              {/* Stats Section with Image */}
              <div className="flex items-center gap-4">
                {/* Left Side - Image */}
                <img src={gameStatsSteps} alt="gamestats" className="h-20" />

                {/* Right Side - Stats Section */}
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Total bet</span>
                    <span className="text-gray-300 font-semibold">₹{gameStats?.total_bet_amount}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Number of bets</span>
                    <span className="text-gray-300 font-semibold">{gameStats?.total_bets}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Winning amount</span>
                    <span className="text-[#dd9138] font-semibold">₹{gameStats?.total_win_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
               { (
            <div className="bg-[#333332] rounded-lg p-4 mt-4">
              {/* Header with Icon and Title */}
              <div className="flex items-center gap-2 mb-4 -ml-2">
                <img src={lotteryion8} alt="icongame" className="h-8 w-8" />
                <span className="material-symbols-outlined font-bold text-xl text-white">
                  Live Casino
                </span>
              </div>

              {/* Stats Section with Image */}
              <div className="flex items-center gap-4">
                {/* Left Side - Image */}
                <img src={gameStatsSteps} alt="gamestats" className="h-20" />

                {/* Right Side - Stats Section */}
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Total bet</span>
                    <span className="text-gray-300 font-semibold">₹{gameStats?.total_bet_amount}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Number of bets</span>
                    <span className="text-gray-300 font-semibold">{gameStats?.total_bets}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Winning amount</span>
                    <span className="text-[#dd9138] font-semibold">₹{gameStats?.total_win_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
               { (
            <div className="bg-[#333332] rounded-lg p-4 mt-4 mb-4">
              {/* Header with Icon and Title */}
              <div className="flex items-center gap-2 mb-4 -ml-2">
                <img src={lotteryion8} alt="icongame" className="h-8 w-8" />
                <span className="material-symbols-outlined font-bold text-xl text-white">
                  Slot
                </span>
              </div>

              {/* Stats Section with Image */}
              <div className="flex items-center gap-4 mb-4">
                {/* Left Side - Image */}
                <img src={gameStatsSteps} alt="gamestats" className="h-20" />

                {/* Right Side - Stats Section */}
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Total bet</span>
                    <span className="text-gray-300 font-semibold">₹{gameStats?.total_bet_amount}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Number of bets</span>
                    <span className="text-gray-300 font-semibold">{gameStats?.total_bets}</span>
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="text-gray-400">Winning amount</span>
                    <span className="text-[#dd9138] font-semibold">₹{gameStats?.total_win_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
}

export default GameStatistics;
