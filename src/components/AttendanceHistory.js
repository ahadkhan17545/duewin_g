import React from "react";
import BackButton from "./BackButton";

const AttendanceHistory = () => {
  return (
    <header className="bg-[#414140] fixed mb-8 top-0 max-w-[400px] w-full h-12 flex items-center px-2 z-10">
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

      {/* Notification Title in the Center */}
      <p className="text-[#f5f3f0] text-xl mx-auto">Attendance History</p>
    </header>
  );
};

export default AttendanceHistory ;