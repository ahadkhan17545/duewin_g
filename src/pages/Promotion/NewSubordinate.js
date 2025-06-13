import React, { useState } from "react";

import empty from "./../../Assets/empty.png";
import Timecolor from "./../../Assets/timecolor.png";
import Timeblack from "./../../Assets/timeblack.png";
import LotteryWingoheader from "./../../components/LotteryWingoheader";
import NewSubordinateHeader from "../../components/NewSubordinateHeader";

function NewSubordinate() {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col items-center max-w-md justify-center max-w-[400px]  w-full">
      <NewSubordinateHeader />
      <div className="w-full min-h-screen  px-2 mt-[49px]">
        {/* Buttons */}
        <div className="flex justify-between mb-2 mt-4 w-full">
          <button
            className={`px-12 py-2 text-sm rounded-lg ${
              activeTab === "today"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                : "bg-[#333332] text-[#a8a5a1]"
            }`}
            onClick={() => setActiveTab("today")}
          >
            Today
          </button>
          <button
            className={`px-5 py-3 text-sm rounded-lg ml-2 ${
              activeTab === "yesterday"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                : "bg-[#333332] text-[#a8a5a1]"
            }`}
            onClick={() => setActiveTab("yesterday")}
          >
            Yesterday
          </button>
          <button
            className={`px-[37px] py-2 text-sm rounded-lg ml-2 ${
              activeTab === "thisMonth"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                : "bg-[#333332] text-[#a8a5a1]"
            }`}
            onClick={() => setActiveTab("thisMonth")}
          >
            This month
          </button>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col items-center justify-center">
          {activeTab === "today" && (
            <div className="flex flex-col justify-center items-center">
              <img src={empty} alt="" className="mt-14 w-52 h-26" />
              <p className="text-[#666462] text-sm">No data</p>
            </div>
          )}

          {activeTab === "yesterday" && (
            <div className="flex flex-col justify-center items-center">
              <img src={empty} alt="" className="mt-14 w-52 h-26" />
              <p className="text-[#666462] text-sm">No data</p>
            </div>
          )}

          {activeTab === "thisMonth" && (
            <div className="flex flex-col justify-center items-center">
              <img src={empty} alt="" className="mt-14 w-52 h-26" />
              <p className="text-[#666462] text-sm">No data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewSubordinate;