import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

const DepositHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#414140] fixed top-0 w-full max-w-[400px] h-12 flex items-center px-2 z-10">
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

      {/* Spacer to push "Deposit" Right */}
      <div className="w-[100px]" />

      {/* Notification Title (Shifted More Right) */}
      <p className="text-[#f5f3f0] text-xl">Deposit</p>

      {/* Pushes Deposit History to the Far Right */}
      <div className="flex-grow" />

      {/* Deposit History Button on the Right */}
      <button
        onClick={() => navigate("/deposit-history")}
        className="text-[#f5f3f0] text-sm cursor-pointer"
      >
        Deposit History
      </button>
    </header>
  );
};

export default DepositHeader;
