import React from "react";
import Capture from "./../Assets/Capture.png";
import { Link } from "react-router-dom";

const Promotionheader = () => {
  return (
    <header className="bg-[#414140] fixed top-0 left-0 right-0 mx-auto w-full max-w-[400px] h-12 flex items-center px-2 z-50">
      {/* <div className="flex-1"></div> */}

      {/* Center with logo */}
      <div className="flex items-center w-full">
        <p
          className="text-[#f5f3f0] text-2xl w-full"
          style={{ textAlign: "center" }}
        >
          Agency
        </p>
      </div>

      {/* Right side with flag */}
      <div style={{ position: "absolute", right: "8px" }}>
        <Link to="/newsubordinate">
          <img
            src={Capture}
            alt="Country Flag"
            className="w-8 h-8 rounded-full"
          />
        </Link>
      </div>
    </header>
  );
};

export default Promotionheader;
