import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useAudio } from "../contexts/AudioContext";
import GirlMusic from "./../Assets/girl_music.png";
import Voice from "./../Assets/voice.png";
import mute from "../Assets/finalicons/mute.png";
import headerLogo from "../Assets/newLogo/newLogo.png";
const CommanHeader = ({
  title = "Header",
  rightButtonText,
  navigateValue,
  isGameHeader = false,
}) => {
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useAudio();

  return (
  <header
  className="bg-[#414140] fixed top-0 left-0 right-0 mx-auto w-full max-w-[400px] h-12 flex items-center px-2 z-50"
  style={{ height: isGameHeader ? "60px" : "" }}
>
  {/* Back Arrow - Always on left */}
  <BackButton className="text-[#f5f3f0] text-xl cursor-pointer" />

  {/* Title (Centered using absolute) for non-game header */}
  {!isGameHeader && (
    <p className="absolute left-1/2 transform -translate-x-1/2 text-[#f5f3f0] text-[17px]">
      {title}
    </p>
  )}

  {/* Game Header Layout */}
  {isGameHeader && (
    <>
      {/* Logo - Perfectly centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <img src={headerLogo} alt="Logo" className="mt-3" style={{width:'70px'}} />
      </div>

      {/* Right side icons */}
      <div className="ml-auto flex items-center gap-3">
        <img
          src={GirlMusic}
          alt="Girl Music Icon"
          className="w-8 h-8 rounded-full"
          onClick={()=>navigate('/agentcustomer')}
          style={{cursor:'pointer'}}
        />
        <img
          src={isMuted ? mute : Voice}
          alt="Toggle Voice Icon"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={toggleMute}
        />
      </div>
    </>
  )}

  {/* Right Button (Optional) for non-game header */}
  {!isGameHeader && rightButtonText && (
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
