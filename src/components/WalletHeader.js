import React from "react";
import BackButton from "./BackButton";

const WalletHeader = () => {
  return (
    <header className="bg-[#414140] fixed top-0 left-0 right-0 mx-auto max-w-[400px] w-full h-12 flex items-center px-2 z-10 relative">
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer z-10" />

      {/* Centered Title */}
  <p className="absolute left-1/2 transform -translate-x-1/2 text-[#f5f3f0] text-xl font-medium font-sans">
  Wallet
</p>
    </header>
  );
};

export default WalletHeader;
