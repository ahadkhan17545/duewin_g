import React, { useEffect, useState } from "react";

import empty from "./../../Assets/empty.png";
import Timecolor from "./../../Assets/timecolor.png";
import Timeblack from "./../../Assets/timeblack.png";
import LotteryWingoheader from "./../../components/LotteryWingoheader";
import NewSubordinateHeader from "../../components/NewSubordinateHeader";
import CommanHeader from "../../components/CommanHeader";
import apiServices from "../../api/apiServices";
import { RiFileCopyLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function NewSubordinate() {
  const [activeTab, setActiveTab] = useState("today");
  const [data, setData] = useState(null);
  const [copiedUID, setCopiedUID] = useState(null);
  const [total,setTotal]= useState(0)
  const navigate = useNavigate();
  const fetchData = async (type) => {
    if(type == "today"){
      let data = await apiServices.getReferralTeamToday();
      setData(data?.teamReferrals);
      setTotal(data?.total)
    }else if(type == "yesterday"){
      let data = await apiServices.getReferralTeamYesterday();
      setData(data?.teamReferrals);
      setTotal(data?.total)
    }else{
      let data = await apiServices.getReferralTeamMonth();
      setData(data?.teamReferrals);
      setTotal(data?.total)
    }
  };


  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleCopy = (uid) => {
    if (uid) {
      navigator.clipboard.writeText(uid.toString());
      setCopiedUID(uid);
      setTimeout(() => setCopiedUID(null), 1500);
    }
  };

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col items-center max-w-md justify-center max-w-[400px]  w-full">
      <CommanHeader title="New Subordindate" />
      <div className="w-full min-h-screen  px-2 mt-[49px]">
        {/* Buttons */}
        <div className="flex mb-2 mt-4 w-full">
          <button
            className={`text-sm rounded-lg ${
              activeTab === "today"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                : "bg-[#333332] text-[#a8a5a1]"
            }`}
            onClick={() => setActiveTab("today")}
            style={{
              width: "110px",
              padding: "10px",
            }}
          >
            Today
          </button>
          <button
            className={`text-sm rounded-lg ml-2 ${
              activeTab === "yesterday"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                : "bg-[#333332] text-[#a8a5a1]"
            }`}
            onClick={() => setActiveTab("yesterday")}
            style={{
              width: "110px",
              padding: "10px",
            }}
          >
            Yesterday
          </button>
          <button
            className={`text-sm rounded-lg ml-2 ${
              activeTab === "thisMonth"
                ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
                : "bg-[#333332] text-[#a8a5a1]"
            }`}
            onClick={() => setActiveTab("thisMonth")}
            style={{
              width: "110px",
              padding: "10px",
            }}
          >
            This month
          </button>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col items-center justify-center">
          {activeTab === "today" && total < 1 && (
            <div className="flex flex-col justify-center items-center">
              <img src={empty} alt="" className="mt-14 w-52 h-26" />
              <p className="text-[#666462] text-sm">No data</p>
            </div>
          )}

          {activeTab === "yesterday"  && total < 1 && (
            <div className="flex flex-col justify-center items-center">
              <img src={empty} alt="" className="mt-14 w-52 h-26" />
              <p className="text-[#666462] text-sm">No data</p>
            </div>
          )}

          {activeTab === "thisMonth" && total < 1 && (
            <div className="flex flex-col justify-center items-center">
              <img src={empty} alt="" className="mt-14 w-52 h-26" />
              <p className="text-[#666462] text-sm">No data</p>
            </div>
          )}
          {data &&
            Object.entries(data).map(([levelKey, users], levelIndex) => {
              const user = users?.[0];
              if (!user) return null;

              return (
                <div
                  key={levelKey}
                  className="w-full bg-[#333332] rounded-lg p-3 mb-3"
                >
                  <div className="flex justify-start items-center gap-2 mb-2">
                    <span className="text-[#f5f3f0]">UID: {user?.user_id}</span>
                    <RiFileCopyLine
                      onClick={() => handleCopy(user.user_id)}
                      className="text-white cursor-pointer hover:text-gray-300 transition"
                      size={16}
                    />

                    {copiedUID === user.user_id && (
                      <span className="text-white text-xs ml-2">Copied!</span>
                    )}
                  </div>

                  <hr className="border-[#666462] mb-2" />

                  <div className="flex justify-between items-center ">
                    <span className="text-xs text-white opacity-60 opacity-60">
                      Level
                    </span>
                    <span className="text-xs text-white opacity-60">
                      {levelIndex + 1}
                    </span>
                  </div>

                  <div className="flex justify-between items-center ">
                    <span className="text-xs text-white opacity-60">
                      Deposit amount
                    </span>
                    <span className="text-[#dd9138]">
                      {user?.actual_deposit_amount ?? 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white opacity-60">
                      Commission
                    </span>
                    <span className="text-[#dd9138]">
                      {user?.commission_earned ?? 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center ">
                    <span className="text-xs text-white opacity-60">Time</span>
                    <span className="text-[#666462]">
                      {user?.created_at?.split("T")[0]}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/subordinate/level/${levelIndex + 1}`, {
                        state: users,
                      })
                    }
                    className="w-full border border-[#dd9138] text-[#dd9138] text-md rounded-full py-1 mt-1 hover:bg-[#dd9138] hover:text-black transition"
                  >
                    View All Level {levelIndex + 1}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default NewSubordinate;
