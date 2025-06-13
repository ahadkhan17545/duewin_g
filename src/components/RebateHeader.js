import React from "react";
import BackButton from "./BackButton";

const SettingHeader = () => {
  return (
    <header className="bg-custom-light-gray fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[400px] h-12 flex items-center px-4 z-10 mb-8">
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

      {/* Notification Title in the Center */}
      <p className="text-[#f5f3f0] text-xl font-semibold flex-1 text-center">
        Rebate
      </p>
    </header>
  );
};

export default SettingHeader;
