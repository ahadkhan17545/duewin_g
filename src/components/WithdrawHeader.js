import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

const WithdrawHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#414140] fixed top-0 w-full max-w-[400px] h-12 flex items-center px-2 z-10">
      {/* Back Arrow on the Left */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

      {/* Notification Title in the Center */}
      <p className="text-[#f5f3f0] text-xl mx-auto">Withdraw</p>

      {/* Withdraw History on the Right */}
      <button
        className="text-[#f5f3f0] text-sm ml-auto cursor-pointer"
        onClick={() => navigate("/withdraw-history")}
      >
        Withdraw History
      </button>
    </header>
  );
};

export default WithdrawHeader;

