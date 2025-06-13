import React, { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import GameStatisticsHeader from "../../components/GameStatisticsHeader";
import lotteryion8 from "../../Assets/lotteryicon8.png";
import gameStatsSteps from "../../Assets/gameStatsSteps.png"

function GameStatistics() {
  const [selectedTab, setSelectedTab] = useState("Today");

  // Data mapping for each button
  const data = {
    "Today": { amount: "₹19.00", description: "Total bet for today" },
    Yesterday: { amount: "₹0.00", description: "Total bet for yesterday" },
    "This week": { amount: "₹19.00", description: "Total bet this week" },
    "This month": { amount: "₹24.00", description: "Total bet this month" },
  };

  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col">
      <GameStatisticsHeader />
      <div className="px-4">
        <div className="mt-16 rounded-xl ">
          {/* Navigation Buttons */}
          <nav className="flex justify-between mt-4 mb-4">
  {Object.keys(data).map((tab) => (
    <button
      key={tab}
      className={`px-3 py-1.5 rounded-full transition-colors text-base font-medium ${
        selectedTab === tab
          ? "bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-[#8f5206]"
          : "bg-[#333332] text-neutral-400"
      }`}
      onClick={() => setSelectedTab(tab)}
    >
      {tab}
    </button>
  ))}
</nav>

          {/* Dynamic Content */}
          <div className="bg-[#333332] rounded-lg p-12 mb-4 flex flex-col items-center justify-center text-center">
            <span className="text-[#dd9138] text-2xl font-semibold">
              {data[selectedTab].amount}
            </span>
            <p className="text-neutral-400 text-sm mt-1">
              {data[selectedTab].description}
            </p>
          </div>

          {/* Display "No data" if amount is 0 */}
          {data[selectedTab].amount !== "₹0.00" && (
  <div className="bg-[#333332] rounded-lg p-4">
    {/* Header with Icon and Title */}
    <div className="flex items-center gap-2 mb-4 -ml-2">
      <img src={lotteryion8} alt="icongame" className="h-8 w-8" />
      <span className="material-symbols-outlined font-bold text-xl text-white">
        lottery
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
          <span className="text-gray-300 font-semibold">{data[selectedTab].amount}</span>
        </div>

        <div className="flex justify-between w-full">
          <span className="text-gray-400">Number of bets</span>
          <span className="text-gray-300 font-semibold">10</span>
        </div>

        <div className="flex justify-between w-full">
          <span className="text-gray-400">Winning amount</span>
          <span className="text-[#dd9138] font-semibold">₹32.34</span>
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
