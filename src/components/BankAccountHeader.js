import React from "react";
import BackButton from "./BackButton";


const  BankAccountHeader = () => {
  return (
    <header className="bg-custom-light-gray fixed top-0 max-w-[400px] w-full h-12 flex items-center px-2 z-10">
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer ml-2" />

      {/* Notification Title in the Center */}
      <p className="text-[#f5f3f0] text-xl mx-auto">Add a Bank Account Number</p>
    </header>
  );
};

export default BankAccountHeader;