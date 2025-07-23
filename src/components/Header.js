import React from "react";
import BackButton from "./BackButton";
import headerLogo from "../Assets/newLogo/newLogo.png"; // adjust path as needed

const Header = () => {
  return (
    <header className="bg-[#414140] w-full max-w-[400px] h-12 flex items-center justify-between px-2 z-10 relative">
      {/* Left side with back button */}
      <div className="flex items-center">
        <BackButton />
      </div>

      {/* Center with logo - absolutely positioned for perfect centering */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <img
          src={headerLogo}
          alt="Logo"
          style={{ width: "70px", height: "auto" }}
        />
      </div>

      {/* Right side with flag and dropdown */}
      <div className="flex items-center space-x-1">
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
