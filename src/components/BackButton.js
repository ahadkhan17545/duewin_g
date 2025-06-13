import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
// import left_arrow from '../Assets/left_arrow'

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-full  transition duration-300"
      aria-label="Go Back"
    >
      <IoIosArrowBack className="text-[#f5f3f0] h-6 w-6 text-xl cursor-pointer ml-2" />
    </button>
  );
};

export default BackButton;
