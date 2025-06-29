import React from "react";
import BackButton from "./BackButton";
import headerLogo from "../Assets/vip1/headerLogo.png";

const ActivityHeader = () => {
  return (
    <header className="bg-[#3f3f3f] fixed top-0 left-0 right-0 mx-auto max-w-[400px] w-full flex items-center justify-center py-2 shadow-sm z-10">
      {/* Back Button - Left */}
      <div className="absolute left-2">
        <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />
      </div>

      {/* Logo - Center */}
      <div className="flex items-center justify-center">
        <img
          src={headerLogo}
          alt="Logo"
          className="h-8 max-w-[140px] object-contain"
        />
      </div>
    </header>
  );
};

export default ActivityHeader;
