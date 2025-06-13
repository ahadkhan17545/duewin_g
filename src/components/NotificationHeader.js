import React from "react";
import BackButton from "./BackButton";


const NotificationHeader = () => {
  return (
    <header className="bg-[#414140] fixed top-0 w-full max-w-[400px] h-12 flex items-center px-2 z-10">
      {/* Back Arrow on the Left */}
      <BackButton className="text-white text-xl cursor-pointer" />

      {/* Notification Title in the Center */}
      <p className="text-white text-xl mx-auto">Notifications</p>
    </header>
  );
};

export default NotificationHeader;
