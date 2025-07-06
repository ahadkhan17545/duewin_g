import React from "react";
import { FaAngleRight } from "react-icons/fa"; // Right arrow icon
import aboutBg from "../../Assets/aboutBg.png";
import iconrisk from "../../Assets/iconrisk.png";
import iconcon from "../../Assets/iconcon.png"; // Fixed variable name
import CommanHeader from "../../components/CommanHeader";
import { useNavigate } from "react-router-dom";

const agreements = [
  {
    id: 1,
    title: "Confidentiality Agreement",
    icon: iconcon,
    link:'/aboutDetail'
  },
  {
    id: 2,
    title: "Risk Disclosure Agreement",
    icon: iconrisk,
    link:'/riskDetails'
  },
];

function AboutusProfile() {
  const navigate = useNavigate()
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#242424] text-white">
      <CommanHeader title="About Us" />
      <div className="w-full max-w-[450px] h-screen mt-30 flex flex-col bg-[#242424] mx-auto">
        {/* Header Image */}
        <div className="w-full">
          <img src={aboutBg} alt="Header" className="w-full h-auto mt-10" />
        </div>

        {/* Agreement List */}
        <div className="flex-1 p-4 bg-[#2b2b2b]">
          {agreements.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-6 border-b border-gray-600 cursor-pointer"
              onClick={()=>navigate(item?.link)}
            >
              {/* Icon & Text */}
              <div className="flex items-center gap-4">
                <img src={item.icon} alt="icon" className="w-8 h-8" />
                <span
                  className="text-lg
                 text-white"
                >
                  {item.title}
                </span>
              </div>

              {/* Right Arrow */}
              <FaAngleRight className="text-gray-400 text-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutusProfile;
