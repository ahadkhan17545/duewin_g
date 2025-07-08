import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AttendanceHeader from "../../components/AttendanceHeader";
import Footer from "../../components/Footer";
import apiServices from "../../api/apiServices";
import attendance from "../../Assets/attendance.png";
import coin from "../../Assets/coin.png";
import giftattd from "../../Assets/giftattd.png";

const Attandancebonus = () => {
  const [unclaimedBonuses, setUnclaimedBonuses] = useState([]);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [accumulatedAmount, setAccumulatedAmount] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch unclaimed bonuses on component mount

  useEffect(() => {
    // const fetchUnclaimedBonuses = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await apiServices.getUnclaimedAttendanceBonuses();
    //     if (response.success) {
    //       setUnclaimedBonuses(response.unclaimedBonuses);
    //       // Calculate consecutive days based on the latest streak
    //       const latestBonus = response.unclaimedBonuses[0];
    //       setConsecutiveDays(latestBonus ? latestBonus.streak : 0);
    //       // Calculate accumulated amount
    //       const total = response.unclaimedBonuses.reduce(
    //         (sum, bonus) => sum + bonus.totalBonus,
    //         0
    //       );
    //       setAccumulatedAmount(total);
    //     } else {
    //       setError("Failed to fetch unclaimed bonuses.");
    //     }
    //   } catch (err) {
    //     setError(err.message || "An error occurred while fetching bonuses.");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchUnclaimedBonuses();
  }, []);

  // Handle attendance bonus claim
  const handleAttendanceClick = async () => {
    if (unclaimedBonuses.length === 0) {
      setError("No unclaimed bonuses available.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const latestBonus = unclaimedBonuses[0];
      const response = await apiServices.claimAttendanceBonus({
        attendanceDate: latestBonus.date,
      });

      if (response.success) {
        alert(response.message);
        // Update unclaimed bonuses by removing the claimed one
        setUnclaimedBonuses(unclaimedBonuses.slice(1));
        // Update accumulated amount
        setAccumulatedAmount((prev) => prev - latestBonus.totalBonus);
        // Update consecutive days if needed
        setConsecutiveDays(latestBonus.streak);
      } else {
        setError("Failed to claim bonus.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while claiming the bonus.");
    } finally {
      setIsLoading(false);
    }
  };

  const rewardTiers = [
    { days: 300, amount: 10 },
    { days: 1000, amount: 30 },
    { days: 3000, amount: 130 },
    { days: 8000, amount: 300 },
    { days: 20000, amount: 650 },
    { days: 80000, amount: 3150 },
    { days: 200000, amount: 7500, isSpecial: true },
  ];

  return (
    <div className="flex flex-col  w-full min-h-screen bg-[#242424]">
      <AttendanceHeader />
      {/* Header Section with Red Background */}
      <div className="bg-red-500 text-white p-3 relative h-64 w-full">
        <h2 className="text-xl font-bold pl-1">Attendance bonus</h2>
        <p className="text-sm mb-1 pl-1">
          Get rewards based on consecutive login days
        </p>

        <div className="flex justify-between pl-1">
          <div>
            {/* White Badge with text */}
            <div className="bg-white text-red-500 rounded-md py-1 px-3 inline-block shadow-sm mb-2">
              <p>Attended consecutively</p>
              <p className="font-bold">
                {consecutiveDays} Day{consecutiveDays !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Accumulated Amount */}
            <div className="flex items-center mt-2">
              <img src={coin} alt="coin" className="w-6 h-6 mr-2" />
              <div>
                <p className="text-sm">Accumulated</p>
                <p className="text-xl font-bold">
                  ₹{accumulatedAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Image */}
        <img
          src={attendance}
          alt="attendance"
          className="w-72 h-72 absolute bottom-0 right-0"
        />

        {/* Buttons with Link components */}
        <div className="flex justify-between mt-3 relative z-10 pl-1">
          <Link
            to="/game-rules"
            className="bg-gradient-to-b from-[#FFBD40] to-[#FF7F3D] text-sm text-white py-1 px-4 rounded-full font-normal no-underline inline-block"
          >
            Game Rules
          </Link>
          <Link
            to="/attendance-history"
            className="bg-gradient-to-b from-[#FFBD40] to-[#FF7F3D] text-sm text-white py-1 px-4 rounded-full font-normal no-underline inline-block"
          >
            Attendance history
          </Link>
        </div>
      </div>

      {/* Reward Tiers Grid */}
      <div className="bg-[#242424] grid grid-cols-3 gap-2 p-2 w-full">
        {rewardTiers.slice(0, 6).map((tier, index) => (
          <div
            key={index}
            className="bg-[#333332] p-1 flex flex-col items-center rounded-lg h-[114px]"
          >
            <p className="text-white font-bold mb-2">₹{tier.amount}.00</p>
            {/* <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-2"> */}
            <img src={coin} alt="coin" width={41} height={41} />
            {/* </div> */}
            <p className="text-white text-[14px]">{index + 1} Day </p>
          </div>
        ))}
      </div>

      {/* Day 7 Special Reward */}
      <div className="bg-[#242424] px-2 pb-2 w-full">
        <div className="bg-[#333332] p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-start">
            <div className="w-32 flex items-center justify-center">
              <img
                src={giftattd}
                alt="gift"
                className="object-contain max-w-full max-h-24"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span className="text-gray-400 mx-2">—</span>
              <p className="text-white text-xl font-bold">₹7,500.00</p>
              <span className="text-gray-400 mx-2">—</span>
            </div>
            <p className="text-white text-lg mt-2">7 Day</p>
          </div>
        </div>
      </div>

      {/* Attendance Button */}
      <div className="bg-[#242424] px-4 pb-4 pt-2 flex justify-center w-full">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {/* <button
          onClick={handleAttendanceClick}
          disabled={isLoading || unclaimedBonuses.length === 0}
          className={`w-full py-3 rounded-full text-amber-900 text-lg font-normal ${isLoading || unclaimedBonuses.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          style={{ background: "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",width: '80%' }}
        >
          {isLoading ? "Processing..." : "Attendance"}
        </button> */}
        <p
          className="text-yellow-400 text-sm md:text-base font-semibold text-center mt-2"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Attendance rewards will be credited daily at 12:30 A.M, following a
          successful recharge.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Attandancebonus;
