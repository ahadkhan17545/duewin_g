import React from "react";
import BackButton from "./BackButton";
import headerLogo from "../Assets/newLogo/newLogo.png";

const ActivityHeader = () => {
  return (
    <header className="bg-[#3f3f3f] fixed top-0 left-0 right-0 mx-auto max-w-[400px] w-full flex items-center justify-center shadow-sm z-10">
      {/* Back Button - Left */}
      <div className="absolute left-2">
        <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />
      </div>

      {/* Logo - Center */}
      <div className="flex items-center justify-center h-[48px]">
        <img
          src={headerLogo}
          alt="Logo"
          className="mt-3" style={{width:'70px',height:'auto'}}
        />
      </div>
    </header>
  );
};

export default ActivityHeader;
