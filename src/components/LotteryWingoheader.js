import React from "react";
import { useAudio } from "../contexts/AudioContext";
import GirlMusic from "./../Assets/girl_music.png";
import Voice from "./../Assets/voice.png";
import mute from "../Assets/finalicons/mute.png";
import BackButton from "./BackButton";

const LotteryWingoheader = () => {
  const { isMuted, toggleMute } = useAudio(); // Use the context

  return (
    <header className="bg-[#414140] fixed top-0 z-[9999] h-14 flex items-center justify-between px-4 w-full max-w-[400px] mx-auto">
      <div className="flex items-center">
        <BackButton />
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src="https://ossimg.diuacting.com/DiuWin/other/h5setting_20240724134839qf9p.png"
          alt="Logo"
          className="w-36 h-auto"
        />
      </div>

      <div className="flex space-x-2 items-center">
        <img
          src={GirlMusic}
          alt="Girl Music Icon"
          className="w-8 h-8 rounded-full"
        />
        <img
          src={isMuted ? mute : Voice}
          alt="Toggle Voice Icon"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={toggleMute} // Use the context function
        />
      </div>
    </header>
  );
};

export default LotteryWingoheader;