import React, { useState, useEffect } from "react";
import RebateRatioHeader from "../../components/RebateRatioHeader";
import iconround from "./../../Assets/iconround.png";
import { PiLineVerticalDuotone } from "react-icons/pi";

// Import images
import img1 from "../../Assets/lottery1.png";
import img2 from "../../Assets/casino1.png";
import img3 from "../../Assets/sport1.png";
import img4 from "../../Assets/rummy1.png";
import img5 from "../../Assets/slot1.png";
import img6 from "../../Assets/finalicons/allicon.png";

// Active state images
import activeImg1 from "../../Assets/Lottery2.png";
import activeImg2 from "../../Assets/casino2.png";
import activeImg3 from "../../Assets/sport2.png";
import activeImg4 from "../../Assets/rummy2.png";
import activeImg5 from "../../Assets/slot2.png";
import activeImg6 from "../../Assets/finalicons/allicon2.png";

function RebateRatio() {
  const [selectedIndex, setSelectedIndex] = useState(0); // Default to All (index 0)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only on mount

  const images = [ img1, img2, img3, img4, img5]; // Fixed: img6 for "All"
  const activeImages = [activeImg1, activeImg2, activeImg3, activeImg4, activeImg5]; // Fixed: activeImg6 for "All"
  const descriptions = [ "Lottery", "Casino", "Sports", "Rummy", "Slots"];

  // Rebate percentages for each category
  const rebateLevels = {
    All: {
      L0: [0.3, 0.09, 0.027, 0.0081, 0.00243, 0.000729],
      L1: [0.35, 0.1225, 0.042875, 0.015006, 0.005252, 0.001838],
      L2: [0.375, 0.140625, 0.052734, 0.019775, 0.007416, 0.002781],
      L3: [0.4, 0.16, 0.064, 0.0256, 0.01024, 0.004096],
      L4: [0.425, 0.180625, 0.076766, 0.032625, 0.013866, 0.005839],
      L5: [0.45, 0.2025, 0.091125, 0.041006, 0.018453, 0.008304],
      L6: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625],
      L7: [0.55, 0.3025, 0.166375, 0.091506, 0.050328, 0.027681],
      L8: [0.6, 0.36, 0.216, 0.1296, 0.077776, 0.046656],
      L9: [0.65, 0.4225, 0.274625, 0.178506, 0.116029, 0.075419],
      L10: [0.7, 0.49, 0.343, 0.2401, 0.168075, 0.117649],
    },
    Lottery: {
      L0: [0.3, 0.09, 0.027, 0.0081, 0.00243, 0.000729],
      L1: [0.35, 0.1225, 0.042875, 0.015006, 0.005252, 0.001838],
      L2: [0.375, 0.140625, 0.052734, 0.019775, 0.007416, 0.002781],
      L3: [0.4, 0.16, 0.064, 0.0256, 0.01024, 0.004096],
      L4: [0.425, 0.180625, 0.076766, 0.032625, 0.013866, 0.005839],
      L5: [0.45, 0.2025, 0.091125, 0.041006, 0.018453, 0.008304],
      L6: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625],
      L7: [0.55, 0.3025, 0.166375, 0.091506, 0.050328, 0.027681],
      L8: [0.6, 0.36, 0.216, 0.1296, 0.077776, 0.046656],
      L9: [0.65, 0.4225, 0.274625, 0.178506, 0.116029, 0.075419],
      L10: [0.7, 0.49, 0.343, 0.2401, 0.168075, 0.117649],
    },
    Others: {
      L0: [0.3, 0.09, 0.027, 0.0081, 0.000243, 0.000729],
      L1: [0.375, 0.1225, 0.0735, 0.025725, 0.009004, 0.003151],
      L2: [0.375, 0.140625, 0.052734, 0.019775, 0.007416, 0.002781],
      L3: [0.4, 0.16, 0.064, 0.0256, 0.01024, 0.004096],
      L4: [0.425, 0.180625, 0.076766, 0.032625, 0.013866, 0.005893],
      L5: [0.45, 0.2025, 0.091125, 0.041006, 0.018453, 0.008304],
      L6: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625],
      L7: [0.55, 0.3025, 0.166375, 0.091506, 0.050328, 0.027681],
      L8: [0.6, 0.36, 0.216, 0.1296, 0.077776, 0.046656],
      L9: [0.65, 0.4225, 0.274625, 0.178506, 0.116029, 0.075419],
      L10: [0.7, 0.49, 0.343, 0.2401, 0.168075, 0.117649],
    },
  };

  // Determine which rebate percentages to use based on selectedIndex
  const getRebatePercentages = () => {
    if (selectedIndex === 0) return rebateLevels.All;
    if (selectedIndex === 1) return rebateLevels.Lottery;
    return rebateLevels.Others; // Casino, Sports, Rummy, Slots
  };

  const selectedRebates = getRebatePercentages();

  return (
    <>  <RebateRatioHeader />
    <div className="bg-[#242424] w-full min-h-screen flex flex-col items-center p-3">
      {/* Inline CSS to ensure scrollbar is hidden */}
      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

    

      {/* Main content wrapper with max width and proper alignment */}
      <div className="w-full mx-auto sm:px-4 md:px-4  flex flex-col items-center">
        {/* Selection Items - Reduced width with horizontal scroll */}
        <div className="flex w-full mb-2 overflow-x-auto flex-nowrap scrollbar-hidden">
          {descriptions.map((desc, index) => (
            <div
              key={index}
              className={`p-1 rounded-lg transition-all duration-300 cursor-pointer flex flex-col items-center min-w-[100px] mx-1 ${
                selectedIndex === index ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]" : "bg-[#333332]"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={selectedIndex === index ? activeImages[index] : images[index]}
                alt={desc}
                className="w-5 h-5 object-contain"
              />
              <p className={`text-xs font-semibold ${selectedIndex === index ? "text-[#8f5206]" : "text-[#a8a5a1]"}`}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Rebate Levels with separate boxes */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[400px]">
            {[...Array(11)].map((_, levelIndex) => (
              <div key={levelIndex} className="bg-[#333332] p-3 rounded-lg mb-2 w-full">
                <h2 className="text-sm text-[#f5f3f0] mb-1 text-left">
                  Rebate Level <span className="text-[#d9ac4f] font-bold italic">L{levelIndex}</span>
                </h2>

                <div className="space-y-1">
                  {[...Array(6)].map((_, rebateIndex) => (
                    <div key={rebateIndex} className="flex justify-between items-center text-base">
                      <div className="flex items-center flex-shrink-0">
                        <div className="flex flex-col items-center mr-2">
                          <img src={iconround} alt="File Icon" className="w-3 h-3" />
                          {rebateIndex < 5 && <PiLineVerticalDuotone className="w-[0.8px] h-2 bg-[#d9ac4f]" />}
                        </div>
                        <p className="text-[#a8a5a1] whitespace-nowrap text-xs">
                          {rebateIndex + 1} level lower level commission rebate
                        </p>
                      </div>
                      <span className="text-[#f5f3f0] flex-shrink-0 text-xs">
                        {selectedRebates[`L${levelIndex}`][rebateIndex]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default RebateRatio;