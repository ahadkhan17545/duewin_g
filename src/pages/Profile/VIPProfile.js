import React, { useState, useEffect } from "react";
import RebateRatioHeader from "../../components/RebateRatioHeader";
import { Link } from "react-router-dom";
import { calcGeneratorDuration, motion } from "framer-motion";
import apiServices from "../../api/apiServices";

// Import images (same as before)
import vipbadge from "../../Assets/vip/vip1.png";
import bgcard from "../../Assets/vip/bgcard.png";
import bg2 from "../../Assets/vip/bg2.png";
import bg3 from "../../Assets/vip/bg3.png";
import bg4 from "../../Assets/vip/bg4.png";
import bg5 from "../../Assets/vip/bg5.png";
import bg6 from "../../Assets/vip/bg6.png";
import bg7 from "../../Assets/vip/bg7.png";
import bg8 from "../../Assets/vip/bg8.png";
import bg9 from "../../Assets/vip/bg9.png";
import vipi from "../../Assets/vip/vipi.png";
import rebateicon from "../../Assets/vip/rebateicon.png";
import cd from "../../Assets/vip/cd.png";
import gifticon from "../../Assets/vip/gifticon.png";
import wallets from "../../Assets/vip/wallets.png";
import rebate from "../../Assets/vip/rebate.png";
import crown from "../../Assets/vip/crown.png";
import coin from "../../Assets/vip/coin.png";
import vault from "../../Assets/vip/vault.png";
import lockvip from "../../Assets/finalicons/lockvip.png";
import { FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import CommanHeader from "../../components/CommanHeader";
import { avatarMap } from "../Settings";
import Avatar from "../../components/common/Avatar";
import vip1 from "../../Assets/vip1/vip1.png";
import vip1a from "../../Assets/vip1/vip1a.png";
import vip2 from "../../Assets/vip1/vip2.png";
import vip2a from "../../Assets/vip1/vip2a.png";
import vip3 from "../../Assets/vip1/vip3.png";
import vip3a from "../../Assets/vip1/vip3a.png";

import vip4 from "../../Assets/vip1/vip4.png";

import vip6 from "../../Assets/vip1/vip6.png";
import vip6a from "../../Assets/vip1/vip6a.png";

import vip7 from "../../Assets/vip1/vip7.png";
import vip7a from "../../Assets/vip1/vip7a.png";
import vip8 from "../../Assets/vip1/vip8.png";
import vip8a from "../../Assets/vip1/vip8a.png";
import vip9 from "../../Assets/vip1/vip9.png";
import vip9a from "../../Assets/vip1/vip9a.png";
import vip0 from "../../Assets/vip/vip1.png";
import creach from "../../Assets/vip1/creach.png";
import reach from "../../Assets/vip1/reach.png";
import reached from "../../Assets/vip1/reached.png";

export const vipMap = {
  0: vip0,
  1: vip1,
  2: vip2,
  3: vip3,
  4: vip4,
  5: vip6,
  6: vip6,
  7: vip7,
  8: vip8,
  9: vip9,
  10: vip9,
};

export const vipMapLogo = {
  1: vip1a,
  2: vip2a,
  3: vip3a,
  4: vip8a,
  5: vip6a,
  6: vip6a,
  7: vip7a,
  8: vip8a,
  9: vip9a,
  10: vip9a,
};

// CardCarousel Component (same as before)
const CardCarousel = ({
  selectedIndex,
  setSelectedIndex,
  userExp,
  vipCards,
}) => {
  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50) {
      setSelectedIndex((prev) => (prev + 1) % vipCards.length);
    } else if (info.offset.x > 50) {
      setSelectedIndex((prev) => (prev === 0 ? vipCards.length - 1 : prev - 1));
    }
  };

  const [dragDirection, setDragDirection] = useState(null);

  const handleDrag = (event, info) => {
    if (info.offset.x < -20) {
      setDragDirection("right");
    } else if (info.offset.x > 20) {
      setDragDirection("left");
    } else {
      setDragDirection(null);
    }
  };
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - today.getDate();

  const calculateProgress = () => {
    const currentCard = vipCards[selectedIndex];
    return Math.min(
      100,
      Math.round((userExp / currentCard.required_exp) * 100)
    );
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden my-4 mx-auto w-full">
      <motion.div
        key={selectedIndex}
        className="p-1 rounded-lg shadow-lg w-full flex justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        <div
          className="relative w-full h-55 rounded-lg overflow-hidden p-2 text-white"
          style={{
            backgroundImage: `url(${vipCards[selectedIndex].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: vipCards[selectedIndex].colorGradient,
            }}
          ></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded">
                  <div className="w-6 h-6">
                    <img
                      src={
                        userExp >= vipCards[selectedIndex].required_exp
                          ? creach
                          : reach
                      }
                      alt="VIP Icon"
                    />
                  </div>
                </div>
                <span className="text-white text-2xl font-bold font-['Roboto',sans-serif]">
                  {vipCards[selectedIndex].label}
                </span>
                <div className="flex items-center bg-opacity-50 px-2 py-2 rounded-full">
                  <img
                    src={
                      userExp >= vipCards[selectedIndex].required_exp
                        ? reached
                        : lockvip
                    }
                    alt="lock"
                    className="h-5 w-5 mr-2"
                  ></img>
                  <span className="text-white text-xs font-['Roboto',sans-serif]">
                    {userExp >= vipCards[selectedIndex].required_exp
                      ? "Opened"
                      : "Not open yet"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-white text-sm ml-2 font-serif">
                Upgrading {vipCards[selectedIndex].label} requires
              </p>
              <span className="flex items-center text-white text-sm ml-2 leading-none">
                <span>{vipCards[selectedIndex].expRequired} EXP</span>
              </span>
            </div>

            <div className="mb-4">
              <button className="border border-white text-xs font-serif text-white px-1 rounded-sm ml-2">
                Bet ₹1=1EXP
              </button>
            </div>

            <div
              className="absolute top-24 text-white text-sm font-bold"
              style={{ right: "36px" }}
            >
              {vipCards[selectedIndex].label}
            </div>

            <div className="mb-8 mx-2 relative">
              <div className="h-2 bg-[#748AAA] bg-opacity-50 rounded-full relative">
                <div
                  className="absolute left-0 top-0 h-full bg-yellow-200 rounded-l-full"
                  style={{ width: `${calculateProgress()}%` }}
                >
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute left-1 top-3 px-1 mt-1 rounded-full bg-gradient-to-r from-[#899fbf] to-[#6f85a5] text-white text-xs">
                  {userExp}/{vipCards[selectedIndex].required_exp}
                </div>
              </div>

              <div className="absolute top-4 right-0 text-white font-serif font-medium text-[10px]">
                {vipCards[selectedIndex].required_exp} can be leveled up
              </div>
            </div>

            <div className="absolute top-1 right-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                <img
                  src={vipMapLogo[selectedIndex + 1]}
                  alt="VIP Badge"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-4 flex space-x-1">
        {vipCards.map((card, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${selectedIndex === index ? "bg-yellow-400" : "bg-gray-600"}`}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// VIPBenefits Component (same as before)
const VIPBenefits = ({ selectedCard }) => {
  return (
    <div className="bg-[#333332] p-3 rounded-lg font-roboto">
      <div className="mb-3 flex items-center">
        <img src={gifticon} alt="VIP Icon" className="w-12 h-12 mr-2" />
        <h2 className="text-base font-bold text-white">
          {selectedCard.label} Benefits Level
        </h2>
      </div>

      <div className="border-t border-gray-700 mb-3"></div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={gifticon} alt="Level Up Reward" className="w-12 h-12" />
            <div>
              <div className="text-white text-sm font-medium">
                Level Up Rewards
              </div>
              <div className="text-xs text-gray-400">
                Each account can receive once
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="border border-[#d9ac4f] bg-opacity-25 rounded min-w-[70px] flex items-center justify-center text-yellow-500 font-medium text-sm">
              <img src={wallets} alt="Coin Icon" className="w-3 h-3 mr-1" />
              {selectedCard?.bonus_amount}
            </div>
            <div className="border border-[#d9ac4f] bg-opacity-25 rounded min-w-[70px] flex items-center justify-center text-yellow-400 font-medium text-sm">
              <img src={cd} alt="Coin Icon" className="w-3 h-3 mr-1" />0
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={coin} alt="Monthly Reward" className="w-12 h-12" />
            <div>
              <div className="text-white text-sm font-medium">
                Monthly Reward
              </div>
              <div className="text-xs text-gray-400">
                Each account gets 1 per month
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="border border-[#d9ac4f] bg-opacity-25 rounded min-w-[70px] flex items-center justify-center text-yellow-500 font-medium text-sm">
              <img src={wallets} alt="Coin Icon" className="w-3 h-3 mr-1" />
              {selectedCard?.monthly_reward}
            </div>
            <div className="border border-[#d9ac4f] bg-opacity-25 rounded min-w-[70px] flex items-center justify-center text-yellow-400 font-medium text-sm">
              <img src={cd} alt="Coin Icon" className="w-3 h-3 mr-1" />0
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={vault} alt="Monthly Reward" className="w-12 h-12" />
            <div>
              <div className="text-white text-sm font-medium">Safe</div>
              <div className="text-xs text-gray-400">
                Increase the extra income of safe
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="border border-[#d9ac4f] bg-opacity-25 rounded min-w-[70px] flex items-center justify-center text-yellow-400 font-medium text-sm">
              <img src={cd} alt="Coin Icon" className="w-3 h-3 mr-1" />
              0.01%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={rebate} alt="Rebate Rate" className="w-12 h-12" />
            <div>
              <div className="text-white text-sm font-medium">Rebate Rate</div>
              <div className="text-xs text-gray-400">
                Increase rebate income
              </div>
            </div>
          </div>
          <div className="border border-[#d9ac4f] bg-opacity-25 rounded min-w-[70px] flex items-center justify-center text-yellow-500 font-medium text-sm">
            <img src={rebateicon} alt="Coin Icon" className="w-3 h-3 mr-1" />
            {selectedCard?.rebate_rate}%
          </div>
        </div>
      </div>
    </div>
  );
};
// Fallback data in case API fails
const defaultVipCards = [
  {
    id: 1,
    image: bgcard,
    label: "VIP 1",
    icon: vipi,
    expRequired: 3000,
    benefits: {
      levelUpReward: 60,
      monthlyReward: 30,
      rebateRatio: 0.05,
    },
    colorGradient:
      "linear-gradient(332.71deg, rgba(166, 183, 208, 0.8) 21.85%, rgba(136, 158, 190, 0.8) 67.02%)",
  },
  {
    id: 2,
    image: bg2,
    label: "VIP 2",
    icon: vipi,
    expRequired: 10000,
    benefits: {
      levelUpReward: 150,
      monthlyReward: 100,
      rebateRatio: 0.1,
    },
    colorGradient:
      "linear-gradient(332.71deg, rgba(248, 189, 131, 0.8) 21.85%, rgba(226, 152, 78, 0.8) 67.02%)",
  },
  {
    id: 3,
    image: bg3,
    label: "VIP 3",
    icon: vipi,
    expRequired: 40000,
    benefits: {
      levelUpReward: 500,
      monthlyReward: 600,
      rebateRatio: 0.3,
    },
    colorGradient:
      "linear-gradient(332.71deg, rgba(255, 164, 147, 0.8) 21.85%, rgba(255, 120, 120, 0.8) 67.02%)",
  },
  {
    id: 4,
    image: bg4,
    label: "VIP 4",
    icon: vipi,
    expRequired: 100000,
    benefits: {
      levelUpReward: 1000,
      monthlyReward: 1500,
      rebateRatio: 0.5,
    },
    colorGradient:
      "linear-gradient(332.71deg, rgba(120, 219, 235, 0.8) 21.85%, rgba(72, 199, 240, 0.8) 67.02%)",
  },
  {
    id: 5,
    image: bg5,
    label: "VIP 5",
    icon: vipi,
    expRequired: 300000,
    benefits: {
      levelUpReward: 2000,
      monthlyReward: 3000,
      rebateRatio: 0.8,
    },
    colorGradient:
      "linear-gradient(332.71deg, rgba(223, 145, 251, 0.8) 21.85%, rgba(239, 130, 213, 0.8) 67.02%)",
  },
  {
    id: 6,
    image: bg6,
    label: "VIP 6",
    icon: vipi,
    expRequired: 600000,
    benefits: {
      levelUpReward: 3500,
      monthlyReward: 5000,
      rebateRatio: 1.0,
    },
    colorGradient:
      "linear-gradient(117.29deg, rgba(255, 160, 122, 0.8) 21.85%, rgba(250, 128, 114, 0.8) 67.02%)",
  },
  {
    id: 7,
    image: bg7,
    label: "VIP 7",
    icon: vipi,
    expRequired: 1000000,
    benefits: {
      levelUpReward: 6000,
      monthlyReward: 8000,
      rebateRatio: 1.5,
    },
    colorGradient:
      "linear-gradient(117.29deg, rgba(70, 130, 180, 0.8) 21.85%, rgba(30, 144, 255, 0.8) 67.02%)",
  },
  {
    id: 8,
    image: bg8,
    label: "VIP 8",
    icon: vipi,
    expRequired: 2000000,
    benefits: {
      levelUpReward: 10000,
      monthlyReward: 12000,
      rebateRatio: 2.0,
    },
    colorGradient:
      "linear-gradient(117.29deg, rgba(255, 228, 181, 0.8) 21.85%, rgba(238, 201, 0, 0.8) 67.02%)",
  },
  {
    id: 9,
    image: bg9,
    label: "VIP 9",
    icon: vipi,
    expRequired: 4000000,
    benefits: {
      levelUpReward: 20000,
      monthlyReward: 25000,
      rebateRatio: 3.0,
    },
    colorGradient:
      "linear-gradient(117.29deg, rgba(139, 69, 19, 0.8) 21.85%, rgba(205, 133, 63, 0.8) 67.02%)",
  },
  {
    id: 10,
    image: bg9,
    label: "VIP 10",
    icon: vipi,
    expRequired: 4000000,
    benefits: {
      levelUpReward: 20000,
      monthlyReward: 25000,
      rebateRatio: 3.0,
    },
    colorGradient: "linear-gradient(117.29deg, #eeaf3a 21.85%, #f98b3b 67.02%)",
  },
];

function VIPProfile() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("history");
  const [userExp, setUserExp] = useState(0);
  const [vipCards, setVipCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [levels, setLevels] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchVipData = async () => {
      try {
        const data = await apiServices.getVipInfo();

        // Validate response structure
        if (
          !data ||
          typeof data.current_exp !== "number" ||
          typeof data.current_level !== "number"
        ) {
          throw new Error("Invalid API response structure");
        }

        setUserExp(data.current_exp);

        setSelectedIndex(Math.max(0, data.current_level));
      } catch (err) {
        console.error("Error fetching VIP data:", err.message);
        setError("Failed to fetch VIP data. Using default data instead.");
        // Use fallback data
        setUserExp(0);
        setVipCards(defaultVipCards);
        setSelectedIndex(0);
      } finally {
        setLoading(false);
      }
    };
    fetchVipData();

    const fetchVipHistoryData = async () => {
      const data = await apiServices.getVipHistoryData();
      setHistoryData(data?.data.history);
    };
    fetchVipHistoryData();

    const fetchVipLevel = async () => {
      let levelData = await apiServices.getVipLevelData();
      const levelMap = new Map();
      levelData.forEach((level) => {
        levelMap.set(level.level, level);
      });

      const mergedVipCards = defaultVipCards.map((card, index) => {
        const matchingLevel = levelMap.get(index + 1);
        delete card.benefits;
        return matchingLevel ? { ...card, ...matchingLevel } : card;
      });
      setVipCards(mergedVipCards);
    };
    fetchVipLevel();
    const fetchUserProfile = async () => {
      try {
        const data = await apiServices.getUserProfile();

        if (!data?.success) {
          console.error("Error fetching user data");
          return;
        }
        console.log("data", data);

        setUserData(data);
      } catch (err) {}
    };
    fetchUserProfile();
  }, []);
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - today.getDate();

  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col font-['Roboto',sans-serif]">
      <CommanHeader title="VIP" />
      <div className="bg-[#242424] min-h-screen flex flex-col items-start justify-start mt-14">
        <div className="text-left w-full px-4">
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {loading ? (
            <div className="text-white text-center">Loading...</div>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Avatar
                    src={avatarMap[Number(userData?.user?.profile_picture_id)]}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={vipMap[userData?.user?.vip_level]}
                    alt="VIP Badge"
                    className="w-14 h-6 mb-1 mr-28"
                  />
                  <h3 className="text-white font-medium flex items-center space-x-1">
                    <span className="text-xs">
                      {userData?.data?.member_detail}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="flex mt-2">
                <div className="w-1/2 py-2 px-4 m-2 bg-[#2c2c2c] rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-[#d9ac4f] text-sm mt-1 font-['Roboto',sans-serif] tracking-[0.05em] leading-none [font-feature-settings:'tnum']">
                      {userExp} EXP
                    </span>
                    <span className="text-gray-400 text-sm font-['Roboto',sans-serif] mt-1">
                      My experience
                    </span>
                  </div>
                </div>
                <div className="w-1/2 py-2 px-4 m-2 bg-[#2c2c2c] rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="text-white font-bold text-sm font-['Roboto',sans-serif]">
                      {daysLeft} {daysLeft === 1 ? "Day" : "Days"}
                    </span>
                    <span className="text-gray-400 text-sm font-['Roboto',sans-serif]">
                      Payout time
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-2 py-2 text-center border border-[#525167] rounded">
                <p className="text-[#a8a5a1] leading-tight m-0 font-['Roboto',sans-serif] text-[11.5px]">
                  VIP level rewards are settled at 2:00 AM on the 1st of every
                  month
                </p>
              </div>

              <CardCarousel
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                userExp={userExp}
                vipCards={vipCards}
              />

              <div className="mt-5 rounded-lg text-white">
                <VIPBenefits selectedCard={vipCards[selectedIndex]} />
              </div>

              <div className="bg-[#333332] mt-4 rounded-lg">
                <div className="flex text-center border-b border-gray-700">
                  <div
                    className={`w-1/2 py-3 font-semibold cursor-pointer font-['Roboto',sans-serif] transition-all duration-300 ${
                      activeTab === "history"
                        ? "text-yellow-500 bg-[#444343] border-b-2 border-yellow-500"
                        : "text-gray-400 hover:bg-[#3a3a3a]"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    History
                  </div>
                  <div
                    className={`w-1/2 py-3 font-semibold cursor-pointer font-['Roboto',sans-serif] transition-all duration-300 ${
                      activeTab === "rules"
                        ? "text-yellow-500 bg-[#444343] border-b-2 border-yellow-500"
                        : "text-gray-400 hover:bg-[#3a3a3a]"
                    }`}
                    onClick={() => setActiveTab("rules")}
                  >
                    Rules
                  </div>
                </div>

                <div className="bg-[#242424] rounded-md text-gray-200 shadow-lg">
                  {activeTab === "history" ? (
                    <div className="p-4">
                      {historyData?.slice(0, 10)?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col pb-2 pt-2"
                          style={{
                            borderBottom:
                              index !== historyData.length - 1
                                ? "1px solid gray"
                                : "none",
                          }}
                        >
                          <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-['Roboto',sans-serif]">
                            Experience Bonus
                          </span>
                          <span className="text-sm text-gray-400 font-['Roboto',sans-serif]">
                            Betting EXP
                          </span>
                          <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1 font-['Roboto',sans-serif]">
                              <FiClock className="text-gray-400" />
                              {item.date}
                            </span>
                            <span className="text-green-500 flex items-center gap-1 font-['Roboto',sans-serif]">
                              {item.exp_gained} EXP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-amber-500 font-bold pt-4 text-xl text-center mb-1 font-['Roboto',sans-serif]">
                        VIP Privileges
                      </h2>
                      <p className="text-gray-400 text-sm text-center mb-4 font-['Roboto',sans-serif]">
                        VIP rule description
                      </p>

                      <div
                        className="space-y-4"
                        style={{ fontFamily: "roboto" }}
                      >
                        <div className="relative bg-[#242424] bg-opacity-60  rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                          {/* Top Purple Banner with curve */}
                          <div
                            className="absolute  left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                            style={{
                              width: "60%",
                              height: "30px",
                              textAlign: "center",
                              fontSize: "13px",
                              paddingTop: "4px",
                              lineHeight: "24px",
                            }}
                          >
                            Upgrade Standard
                          </div>

                          {/* Description */}
                          <p
                            className="bg-[#333332]"
                            style={{
                              color: "#A8A5A1",
                              fontSize: "13px",
                              fontFamily: "roboto",
                              padding: "36px 10px 10px 10px",
                              borderRadius: "10px",
                            }}
                          >
                            The VIP member's experience points (valid bet
                            amount) that meet the requirements of the
                            corresponding rank will be promoted to the
                            corresponding VIP level. The member's VIP data
                            statistics period starts from 00:00:00 when the VIP
                            system launches. VIP level calculation is refreshed
                            every 10 minutes! The corresponding experience level
                            is calculated according to valid odds 1:1.
                          </p>
                        </div>

                        <div className="space-y-6">
                          {/* Upgrade Order */}
                          <div className="relative bg-[#242424] bg-opacity-60 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Upgrade Order
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                              }}
                            >
                              The VIP level that meets the corresponding
                              requirements can be promoted by one level every
                              day, but the VIP level cannot be promoted by
                              leapfrogging.
                            </p>
                          </div>

                          {/* Level Maintenance */}
                          <div className="relative bg-[#242424] bg-opacity-60 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Level Maintenance
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                              }}
                            >
                              VIP members need to complete the maintenance
                              requirements of the corresponding level within 30
                              days after the "VIP level change." If the
                              promotion is completed during this period, the
                              maintenance requirements will be calculated
                              according to the current level.
                            </p>
                          </div>

                          {/* Downgrade Standard */}
                          <div className="relative bg-[#242424] bg-opacity-60 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Downgrade standard
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                              }}
                            >
                              If a VIP member fails to complete the
                              corresponding level maintenance requirements
                              within 30 days, the system will automatically
                              deduct the experience points corresponding to the
                              level. If the experience points are insufficient,
                              the level will be downgraded, and the
                              corresponding discounts will be adjusted to the
                              downgraded level accordingly.
                            </p>
                          </div>

                          {/* Upgrade Bonus */}
                          <div className="relative bg-[#242424] bg-opacity-60 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Upgrade Bonus
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                              }}
                            >
                              The upgrade benefits can be claimed on the VIP
                              page after the member reaches the VIP membership
                              level, and each VIP member can only get the
                              upgrade reward of each level once.
                            </p>
                          </div>

                          {/* Monthly Reward */}
                          <div className="relative bg-[#242424] bg-opacity-60 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Monthly reward
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                              }}
                            >
                              VIP members can earn the highest level of VIP
                              rewards once a month. Can only be received once a
                              month. Prizes cannot be accumulated. And any
                              unclaimed rewards will be refreshed on the next
                              settlement day. When receiving the highest level
                              of monthly rewards this month Monthly Rewards
                              earned in this month will be deducted e.g. when
                              VIP1 earns 500 and upgrades to VIP2 to receive
                              monthly rewards 500 will be deducted.
                            </p>
                          </div>

                          {/* Real-time Rebate */}
                          <div className="relative bg-[#242424] bg-opacity-60 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Real-time rebate
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                              }}
                            >
                              The higher the VIP level, the higher the return
                              rate, all the games are calculated in real time
                              and can be self-rewarded!
                            </p>
                          </div>

                          {/* Safe */}
                          <div className="relative bg-[#242424] bg-opacity-60 mb-6 rounded-md hover:bg-opacity-70 transition-colors duration-300 w-full max-w-md mx-auto text-white">
                            {/* Top Purple Banner with curve */}
                            <div
                              className="absolute left-1/2 transform -translate-x-1/2 bg-[#3a3947] rounded-b-full"
                              style={{
                                width: "60%",
                                height: "30px",
                                textAlign: "center",
                                fontSize: "13px",
                                paddingTop: "4px",
                                lineHeight: "24px",
                              }}
                            >
                              Safe
                            </div>

                            {/* Description */}
                            <p
                              className="bg-[#333332]"
                              style={{
                                color: "#A8A5A1",
                                fontSize: "13px",
                                fontFamily: "roboto",
                                padding: "36px 10px 10px 10px",
                                borderRadius: "10px",
                                marginBottom:"10px"
                              }}
                            >
                              VIP members who have reached the corresponding
                              level will get additional benefits on safe deposit
                              based on the member's VIP level.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {activeTab === "history" && (
                  <div className="p-4 pt-0 bg-[#242424]">
                    <Link to="/VIPHistory">
                      <button className="w-full py-2 bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] hover:opacity-90 rounded-full text-yellow-900 font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-['Roboto',sans-serif]">
                        View All
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VIPProfile;
