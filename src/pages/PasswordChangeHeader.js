import React from "react";
import BackButton from "../components/BackButton";

const PasswordChangeHeader = () => {
  return (
    <header className="bg-custom-light-gray fixed top-0 w-full max-w-[400px] h-12 flex items-center px-2 z-10 relative">
      {/* Back Arrow on the Left */}
      <div className="absolute left-2">
        <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />
      </div>

      {/* Notification Title Centered */}
      <p className="absolute left-1/2 transform -translate-x-1/2 text-[#f5f3f0] text-xl whitespace-nowrap">
        Change Login Password
      </p>
    </header>
  );
};

export default PasswordChangeHeader;