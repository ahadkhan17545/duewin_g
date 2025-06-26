import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

const CommanHeader = ({
  title = "Header",
  rightButtonText,
  navigateValue
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#414140] fixed top-0 left-0 right-0 mx-auto w-full max-w-[400px] h-12 flex items-center px-2 z-50">
      {/* Back Arrow */}
      <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

      {/* Title (Centered using absolute) */}
      <p className="absolute left-1/2 transform -translate-x-1/2 text-[#f5f3f0] text-[17px]">
        {title}
      </p>

      {/* Right Button (Optional) */}
      {rightButtonText  && (
        <button
          onClick={() => navigate(navigateValue)}
          className="ml-auto text-[#f5f3f0] text-sm cursor-pointer"
        >
          {rightButtonText}
        </button>
      )}
    </header>
  );
};

export default CommanHeader;
