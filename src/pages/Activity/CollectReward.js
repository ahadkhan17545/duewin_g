import React, { useState, useRef, useEffect } from "react";
import CollectRewardHeader from "../../components/CollectRewardHeader";

function CollectReward() {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <CollectRewardHeader />

      {/* Tab Component */}
      <div className="flex justify-center mt-4">
        <div className="flex bg-[#333332] rounded-lg p-1 w-64">
          <button
            className={`flex-1 py-2 rounded-lg text-center font-medium ${
              activeTab === "weekly"
                ? "bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-white"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("weekly")}
          >
            weekly
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-center font-medium ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-white"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("daily")}
          >
            daily
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      
    </div>
  );
}

export default CollectReward;