import React, { useState } from "react";
import { FaAngleRight, FaTimes } from "react-icons/fa"; // Added FaTimes for close button
import { Link } from "react-router-dom";
import aboutBg from "../../Assets/aboutBg.png";
import AboutusHeader from "../../components/AboutusHeader";
import iconrisk from "../../Assets/iconrisk.png";
import iconcon from "../../Assets/iconcon.png";
import CustomerServiceHeader from "../../components/CustomerServiceHeader";
import customer from "../../Assets/finalicons/cutomer.png";

const agreements = [
  {
    id: 1,
    title: "Telegram Support",
    icon: iconcon,
  },
  {
    id: 2,
    title: "Online Chat Support",
    icon: iconrisk,
  },
];

function AgentCustomer() {
  const [showPopup, setShowPopup] = useState(false);

  const handleChatSupportClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#242424] text-white">
      <CustomerServiceHeader />
      <div className="w-full max-w-[450px] h-screen mt-30 flex flex-col bg-[#242424] mx-auto">
        {/* Header Image */}
        <div className="w-full">
          <img src={customer} alt="Header" className="w-full h-auto mt-10" />
        </div>

        {/* Agreement List */}
        <div className="flex-1 p-4 bg-[#2b2b2b]">
          {agreements.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-6 border-b border-gray-600 cursor-pointer hover:bg-[#333333] transition-colors duration-200"
              onClick={item.title === "Online Chat Support" ? handleChatSupportClick : undefined}
            >
              {/* Icon & Text */}
              <div className="flex items-center gap-4">
                <img src={item.icon} alt="icon" className="w-8 h-8" />
                {item.title === "Online Chat Support" ? (
                  <span className="text-lg text-white">{item.title}</span>
                ) : (
                  <Link to={item.path} className="text-lg text-white hover:text-[#d9ac4f]">
                    {item.title}
                  </Link>
                )}
              </div>

              {/* Right Arrow */}
              <FaAngleRight className="text-gray-400 text-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
          <div className="relative bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Popup Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
              <p className="text-gray-300 text-sm">
                Our Online Chat Support is under development and will be available soon!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentCustomer;