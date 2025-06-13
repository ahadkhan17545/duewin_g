import React, { useState } from "react";
import Giftbg from "../../Assets/giftbg.png";


function GiftsProfile() {
  const [giftCode, setGiftCode] = useState("");
  const [showEmptyCodePopup, setShowEmptyCodePopup] = useState(false);

  const handleReceiveClick = () => {
    console.log("Button clicked, gift code:", giftCode);
    if (!giftCode.trim()) {
      console.log("Setting popup to true");
      setShowEmptyCodePopup(true);
    } else {
      console.log("Processing gift code:", giftCode);
    }
  };

  const handleConfirmPopup = () => {
    setShowEmptyCodePopup(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-[420px] bg-[#242424] p-4">
      {/* Dummy Image (Replace with your actual image) */}
      <div className="w-full max-w-sm">
        <img
          src= {Giftbg}
          alt="Gift"
          className="w-full rounded-lg"
        />
      </div>

      {/* Gift Code Section */}
      <div className="bg-[#333332] text-white p-6 rounded-lg shadow-lg w-full max-w-sm mt-4">
        <p className="text-lg font-medium">Hi</p>
        <p className="text-sm text-gray-300">We have a gift for you</p>

        <p className="text-sm font-semibold text-white mt-4">
          Please enter the gift code below
        </p>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Please enter gift code"
          value={giftCode}
          onChange={(e) => setGiftCode(e.target.value)}
          className="w-full bg-[#222] text-white p-3 rounded-lg mt-2 outline-none border border-gray-600 focus:border-yellow-400"
        />

        {/* Receive Button */}
        <button 
          onClick={handleReceiveClick}
          className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] font-semibold"
        >
          Receive
        </button>
      </div>

      {/* Empty Gift Code Popup */}
      {showEmptyCodePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#333333] w-[350px] rounded-lg overflow-hidden">
            {/* Popup Message */}
            <div className="p-6 text-center">
              <p className="text-white text-lg">Please enter gift code</p>
            </div>
            
            {/* Confirm Button */}
            <button
              onClick={handleConfirmPopup}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-800 font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftsProfile;