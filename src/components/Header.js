import React from "react";
import BackButton from "./BackButton";
import headerLogo from "../Assets/newLogo/newLogo.png"; // adjust path as needed

const Header = () => {
  return (
    <header className="bg-[#414140] w-full max-w-[400px] h-14 flex items-center px-2 z-10">
      {/* Left side with back button */}
      <div className="flex items-center -ml-3">
        <BackButton />
      </div>

      {/* Center with logo */}
      <div className="flex items-center ml-20">
        <img src={headerLogo} alt="Logo" className="w-36 h-12 mb-0" />
      </div>

      {/* Right side with flag and dropdown */}
      <div className="flex items-center space-x-1 ml-14">
        <img
          src="https://flagcdn.com/w320/us.png"
          alt="Country Flag"
          className="w-5 h-5 rounded-full"
        />
        <p className="text-white">EN</p>
      </div>
    </header>
  );
};

export default Header;
