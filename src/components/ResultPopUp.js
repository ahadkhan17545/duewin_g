// components/ResultPopup.jsx
import React from "react";
import Confetti from "react-confetti"; // if needed
import win from "../Assets/updatedwin.png";
import cross from "../Assets/safed.png";
import agree from "../Assets/agree-a.png";
import notAgree from "../Assets/agree-b.png";
const ResultPopUp = ({
  type = "win",
  onClose,
  lastResult,
  checked,
  onCheckedChange,
  showConfetti = false,
  gameType = "k3",
}) => {
  const isWin = type === "win";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-70 fixed inset-0"></div>
      <div className="relative z-10 flex flex-col items-center max-w-[400px] mx-auto">
        {/* Confetti for win */}
        {isWin && showConfetti && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] overflow-hidden">
            <Confetti
              width={400}
              height={400}
              recycle={true}
              numberOfPieces={75}
              gravity={0.01}
              initialVelocityX={{ min: -15, max: 15 }}
              initialVelocityY={{ min: -3, max: 3 }}
              tweenDuration={20000}
              confettiSource={{ x: 100, y: 200, w: 10, h: 10 }}
            />
          </div>
        )}

        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          <img
            src={win}
            alt="Result"
            className="w-full h-full object-contain"
          />

          {/* Heading */}
          <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-center text-white">
            <p
              className={`text-2xl font-bold drop-shadow-lg ${
                isWin ? "text-white" : "text-red-500"
              }`}
            >
              {isWin ? "Congratulations" : "Better Luck Next Time"}
            </p>
          </div>

          {/* Lottery Details */}
          <div className="absolute top-[62%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
            <div className="flex items-center justify-center gap-x-2 mt-1">
              <h2 className="text-xs whitespace-nowrap font-medium mr-1">
                Lottery results
              </h2>
              <p
                className={`text-xs px-1 border-2 py-0.5 rounded text-white ${
                  isWin
                    ? "bg-green-500 border-white"
                    : "bg-red-500 border-white"
                }`}
                style={{width:'40px'}}
              >
                {gameType == "k3"
                  ? lastResult?.result?.dice_1 +
                    " " +
                    lastResult?.result?.dice_2 +
                    " " +
                    lastResult?.result?.dice_3
                  : "N/A"}
              </p>
              <p
                className={`text-xs px-1 border-2 py-0.5 rounded ${
                  isWin ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {lastResult?.result?.sum_size || "Big"}
              </p>
              {!isWin && (
                <p className="text-xs bg-red-500 px-1 border-2 border-white py-0.5 rounded">
                  {lastResult?.result?.sum_parity || "Even"}
                </p>
              )}
            </div>

            <div className="mt-4 text-center">
              <p
                className={`text-md font-bold ${isWin ? "text-red-500" : "text-red-500"}`}
              >
                {isWin ? "Bonus" : "No Bonus"}
              </p>
              <p className="text-xl font-bold" style={{ color: "black" }}>
                ₹{isWin ? lastResult?.payout : 0}
              </p>
              <p className="text-xs mt-1" style={{ color: "black" }}>
                Period: {lastResult?.duration} seconds {lastResult?.periodId}
              </p>
            </div>
          </div>

          {/* Checkbox */}
          <label className="absolute bottom-4 left-20 inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={onCheckedChange}
              className="sr-only peer"
            />
            <div className="w-6 h-6 relative">
              <img
                src={agree}
                alt="checkbox"
                className="w-full h-full object-contain"
              />
              {checked && (
                <img
                  src={notAgree}
                  alt="tick"
                  className="absolute inset-0 w-3 h-3 m-auto pointer-events-none"
                />
              )}
            </div>
            <span className="ml-1 text-sm text-white drop-shadow">
              3 sec auto close
            </span>
          </label>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
        >
          <img src={cross} alt="Close" className="w-10 h-10 object-contain" />
        </button>
      </div>
    </div>
  );
};

export default ResultPopUp;
