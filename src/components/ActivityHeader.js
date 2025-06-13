import React from "react";
import BackButton from "./BackButton";

const ActivityHeader = () => {
  return (
    <header className="bg-[#3f3f3f] fixed top-0 left-0 right-0 mx-auto max-w-[400px] w-full flex items-center justify-center py-2 shadow-sm z-10">
      {/* Back Button with White Arrow - Aligned to Extreme Left */}
      <div className="absolute left-2">
        <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />
      </div>

      {/* Center with logo */}
      <div className="flex items-center justify-center">
        <img
          src="https://ossimg.diuacting.com/DiuWin/other/h5setting_20240724134839qf9p.png"
          alt="Logo"
          className="w-28 h-auto sm:w-32 max-w-[80%]"
        />
      </div>
    </header>
  );
};

export default ActivityHeader;
