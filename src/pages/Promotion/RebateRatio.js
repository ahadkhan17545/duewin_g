import React, { useState, useEffect, useRef } from "react";
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
  const scrollContainerRef = useRef(null);

  // Function to scroll selected item to center
  const scrollToCenter = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = container.children[index];

      if (item) {
        const containerWidth = container.offsetWidth;
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;

        // Calculate scroll position to center the item
        const scrollPosition = itemLeft - containerWidth / 2 + itemWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };
  useEffect(() => {
    scrollToCenter(selectedIndex);
  }, [selectedIndex]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only on mount

  const images = [img1, img2, img3]; // Fixed: img6 for "All"
  const activeImages = [
    activeImg1,
    activeImg2,
    activeImg3,
  ]; // Fixed: activeImg6 for "All"
  const descriptions = ["Lottery", "Original", "Provider",];

  // Rebate percentages for each category
  const rebateLevels = {
    All: {
      L0: [0.6, 0.18, 0.054, 0.0162, 0.00486, 0.001458],
      L1: [0.7, 0.245, 0.08575, 0.030012, 0.010504, 0.003677],
      L2: [0.75, 0.2815, 0.105469, 0.039551, 0.014832, 0.005562],
      L3: [0.8, 0.32, 0.128, 0.0512, 0.02048, 0.008192],
      L4: [0.85, 0.36125, 0.153531, 0.065251, 0.027732, 0.011786],
      L5: [0.9, 0.405, 0.18225, 0.082012, 0.036906, 0.016608],
      L6: [1.0, 0.5, 0.25, 0.125, 0.0625, 0.055361],
      L7: [1.1, 0.605, 0.33275, 0.183013, 0.100657, 0.055361],
      L8: [1.2, 0.72, 0.432, 0.2592, 0.15552, 0.093312],
      L9: [1.3, 0.845, 0.54925, 0.377013, 0.232058, 0.150838],
      L10: [1.4, 0.98, 0.686, 0.4802, 0.33614, 0.235298],
    },
    Lottery: {
      L0: [0.6, 0.18, 0.054, 0.0162, 0.00486, 0.001458],
      L1: [0.7, 0.245, 0.08575, 0.030012, 0.010504, 0.003677],
      L2: [0.75, 0.2815, 0.105469, 0.039551, 0.014832, 0.005562],
      L3: [0.8, 0.32, 0.128, 0.0512, 0.02048, 0.008192],
      L4: [0.85, 0.36125, 0.153531, 0.065251, 0.027732, 0.011786],
      L5: [0.9, 0.405, 0.18225, 0.082012, 0.036906, 0.016608],
      L6: [1.0, 0.5, 0.25, 0.125, 0.0625, 0.055361],
      L7: [1.1, 0.605, 0.33275, 0.183013, 0.100657, 0.055361],
      L8: [1.2, 0.72, 0.432, 0.2592, 0.15552, 0.093312],
      L9: [1.3, 0.845, 0.54925, 0.377013, 0.232058, 0.150838],
      L10: [1.4, 0.98, 0.686, 0.4802, 0.33614, 0.235298],
    },
    Others: {
      L0: [0.3, 0.09, 0.027, 0.0081, 0.00243, 0.000729],
      L1: [0.35, 0.1225, 0.042875, 0.015006, 0.005252, 0.001838],
      L2: [0.35, 0.1225, 0.042875, 0.015006, 0.005252, 0.001838],
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
    // if (selectedIndex === 1) return rebateLevels.Lottery;
    return rebateLevels.Others; // Casino, Sports, Rummy, Slots
  };

  const selectedRebates = getRebatePercentages();

  return (
    <>
      {" "}
      <RebateRatioHeader />
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
        <div className="w-full mx-auto sm:px-2 md:px-2  flex flex-col items-center">
          {/* Selection Items - Reduced width with horizontal scroll */}
          <div
            ref={scrollContainerRef}
            className="flex w-full mb-2 overflow-x-auto flex-nowrap scrollbar-hidden" style={{justifyContent:'space-between'}}
          >
            {descriptions.map((desc, index) => (
              <div
                key={index}
                className={`p-1 rounded-lg transition-all duration-300 cursor-pointer flex flex-col items-center min-w-[100px] mx-1 ${
                  selectedIndex === index
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                    : "bg-[#333332]"
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={
                    selectedIndex === index
                      ? activeImages[index]
                      : images[index]
                  }
                  alt={desc}
                  className="w-5 h-5 object-contain"
                />
                <p
                  className={`text-xs font-semibold ${selectedIndex === index ? "text-[#8f5206]" : "text-[#a8a5a1]"}`}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Rebate Levels with separate boxes */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[400px] mt-3">
              {[...Array(11)].map((_, levelIndex) => (
                <div
                  key={levelIndex}
                  className="bg-[#333332] p-3 rounded-lg mb-2 w-full"
                >
                  <h2 className="text-[16px] text-[#f5f3f0] mb-1 text-left">
                    Rebate Level{" "}
                    <span className="text-[#d9ac4f] font-bold italic text-[20px]">
                      L{levelIndex}
                    </span>
                  </h2>

                  <div className="space-y-1">
                    {[...Array(6)].map((_, rebateIndex) => (
                      <div
                        key={rebateIndex}
                        className="flex justify-between items-center text-base"
                      >
                        <div className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center mr-2">
                            <img
                              src={iconround}
                              alt="File Icon"
                              className="w-3 h-3"
                            />
                            {rebateIndex < 5 && (
                              <PiLineVerticalDuotone className="w-[0.8px] h-2 bg-[#d9ac4f]" />
                            )}
                          </div>
                          <p className="text-[#a8a5a1] whitespace-nowrap text-[13.5px]">
                            {rebateIndex + 1} level lower level commission
                            rebate
                          </p>
                        </div>
                        <span className="text-[#f5f3f0] flex-shrink-0 text-sm">
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
