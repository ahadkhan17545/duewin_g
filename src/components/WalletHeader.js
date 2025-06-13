import React from "react";
import BackButton from "./BackButton";

const WalletHeader = () => {
  return (
    <header className="bg-[#414140] fixed top-0 left-0 right-0 mx-auto max-w-[400px] w-full h-12 flex items-center px-2 z-10">

      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

      {/* Notification Title in the Center */}
      <p className="text-[#f5f3f0] text-xl mx-auto">Wallet</p>
    </header>
  );
};

export default WalletHeader;
