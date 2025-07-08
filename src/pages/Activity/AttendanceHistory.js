import React, { useState, useRef, useEffect } from "react";
import AttendanceHeader from "../../components/AttendanceHeader";
import apiServices from "../../api/apiServices";
import { FiClock } from "react-icons/fi";
import coin from "../../Assets/coin.png";
function AttendanceHistory() {
  const [attendance, setAttendance] = useState(null);
  const fetchAttendance = async () => {
    let data = await apiServices.getAttendanceBonus();
    setAttendance(data?.history?.slice(0, 8));
  };
  useEffect(() => {
    fetchAttendance();
  }, []);
  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <AttendanceHeader />

      <div className="px-4 py-6">
        {attendance &&
          attendance.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-col bg-[#1a1a1a] p-4" style={{borderBottom:'1px solid gray'}}
              >
                <div className="flex justify-between align-center gap-1">
                  <span  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-roboto text-[15px] w-[80%]">
                    Date: {item?.date}
                  </span>
                  <div className="flex align-center gap-2 w-[20%]">
                    <img src={coin} alt="coin" width={25} height={15} />
                    <span className="text-gray-500">{item?.bonusAmount} </span>
                  </div>
                </div>

                <span className="text-sm text-gray-400 font-roboto">
                  Streak Count: {item?.streakCount}
                </span>

                <span className="text-sm text-gray-400 font-roboto">
                  {item?.hasRecharged ? "Recharged" : "Not Recharged"}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AttendanceHistory;
