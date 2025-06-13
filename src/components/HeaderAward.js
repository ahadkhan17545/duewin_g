import React from 'react';
import { ChevronLeft } from "lucide-react";
import { GiBackwardTime } from "react-icons/gi";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";

const HeaderAward = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <header className="bg-[#3f3f3f] h-14 flex items-center justify-between top-0 px-4">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="text-white">
        <ChevronLeft size={28} strokeWidth={2} />
      </button>

      {/* Center with icon & text */}
     <Link to="/collect-reward" className="flex items-center">
  <GiBackwardTime className="text-white w-6 h-6 mr-2" />
  <p className="text-gray-100 text-sm">Collection record</p>
</Link>
    </header>
  );
};

export default HeaderAward;
