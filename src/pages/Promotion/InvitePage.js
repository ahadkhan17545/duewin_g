import React, { useState, useRef, useEffect } from "react";
import InviteHeader from "../../components/InviteHeader";
// Import your image assets
import poster from "../../Assets/additionalicons/poster.png"; // Use existing poster image
// Define icons for the feature boxes

import trucktick from "../../Assets/trucktick.png";
import bank from "../../Assets/bank.png";
import bgposter from "../../Assets/additionalicons/bgposter.png";
import CommanHeader from "../../components/CommanHeader";
import apiServices from "../../api/apiServices";

function InvitePage() {
  const [copied, setCopied] = useState(false); // State for tracking copy status
  const scrollRef = useRef(null); // Ref for the scrollable container
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [userData, setUserData] = useState(null);
  const [invitationCode, setInvitationCode] = useState(null);
  const fetchUserProfile = async () => {
    try {
      const data = await apiServices.getUserProfile();

      if (!data?.success) {
        console.error("Error fetching user data");
        return;
      }
      const user = data.user;
      const baseUrl = window.location.origin;
      const invitationCode = `${baseUrl}/signup?referralCode=${user?.referring_code}`;
      setInvitationCode(invitationCode)
      setUserData(user);
    } catch (err) {}
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(invitationCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Handle touch swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe || isRightSwipe) {
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        const scrollAmount =
          scrollContainer.offsetWidth * (isLeftSwipe ? 1 : -1);
        scrollContainer.scrollLeft += scrollAmount;
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle mouse drag
  const handleMouseDown = (e) => {
    setMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!mouseDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleMouseLeave = () => {
    setMouseDown(false);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("mousedown", handleMouseDown);
      scrollContainer.addEventListener("mousemove", handleMouseMove);
      scrollContainer.addEventListener("mouseup", handleMouseUp);
      scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("mousedown", handleMouseDown);
        scrollContainer.removeEventListener("mousemove", handleMouseMove);
        scrollContainer.removeEventListener("mouseup", handleMouseUp);
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [mouseDown]);

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col items-center justify-center">
      <CommanHeader title="Invite" />
      <div className="bg-[#242424] min-h-screen w-full max-w-md flex flex-col items-center justify-center mt-2">
        <div className="text-left w-full max-w-md px-3">
          <p className="mb-4 text-[#a8a5a1] text-xs font-semibold">
            Please swipe left - right to choose your favorite poster
          </p>
          <div
            ref={scrollRef}
            className="flex px-4 items-center space-x-4 overflow-x-auto scrollbar-hide"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="p-2 rounded-lg shadow-md flex-shrink-0 transition-all duration-300 relative"
                style={{
                  width: "300px", // Fixed width to match design
                  height: "500px", // Fixed height to match design
                  backgroundImage: `url(${poster})`, // Use poster as fallback
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Text Overlay Section */}
                <div className="flex flex-col items-center h-full w-full p-4">
                  {/* Fair and Justice + Open and Transparent in the same row */}
                  <div className="flex justify-between w-full mt-2 space-x-2">
                    <div
                      className="px-2 py-1 rounded-md flex-1 text-center"
                      style={{
                        backgroundImage: `url(${bgposter})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <p className="text-[rgb(242,69,68)] text-xs font-bold">
                        Fair and justice
                      </p>
                    </div>
                    <div
                      className="px-2 py-1 rounded-md flex-1 text-center"
                      style={{
                        backgroundImage: `url(${bgposter})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <p className="text-[rgb(242,69,68)] text-xs font-bold">
                        Open and transparent
                      </p>
                    </div>
                  </div>

                  {/* Main Bonus Text */}
                  <div className="mt-4 text-center">
                    <h2 className="text-white text-lg font-bold whitespace-nowrap">
                      Full Odds Bonus Rate
                    </h2>
                  </div>

                  {/* Feature Boxes */}
                  <div className="flex justify-between w-full mt-4 px-2 gap-2">
                    <div className="border border-white rounded-lg p-1 flex-1 flex flex-col items-center">
                      <div className="p-1 rounded-full mb-1">
                        <img src={bank} alt="icon" className="h-7 w-7" />
                      </div>
                      <p className="text-white text-xs whitespace-nowrap">
                        Financial security
                      </p>
                    </div>
                    <div className="border border-white rounded-lg p-1 flex-1 flex flex-col items-center">
                      <div className="p-1 rounded-full mb-1">
                        <img src={trucktick} alt="icon" className="h-7 w-7" />
                      </div>
                      <p className="text-white text-xs whitespace-nowrap">
                        Quick withdrawals
                      </p>
                    </div>
                  </div>

                  {/* Commission Text */}
                  <div className="mt-4 text-center">
                    <p className="text-white text-base font-bold whitespace-nowrap">
                      Permanent commission up to
                    </p>
                    <p className="text-yellow-400 text-xl font-bold">85%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-lg justify-center mt-6 flex">
            <p className="text-white mr-6 text-xs">Invite friends </p>
            <p className="text-white text-xs">
              Income <span className="text-[#d23838]"> 10 billion </span>
              Commission
            </p>
          </div>
          <div className="px-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] p-4 rounded-full mt-8 text-[#8f5206] font-bold py-2 rounded-full focus:ring-2 "
            >
              INVITATION LINK
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center mb-20 mt-4 justify-center border border-[#d9ac4f] text-[#d9ac4f] py-2 rounded-full focus:ring-2 "
            >
              Copy invitation link
            </button>
            {copied && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg flex flex-col items-center w-32 h-32">
                  <svg
                    className="w-20 h-20 text-white mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M10 24l10 10L38 14"
                    ></path>
                  </svg>
                  <span className="text-sm font-sans text-center">
                    Copy successful
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitePage;
