import React from "react";
import GiftHeader from "../../components/GiftHeader";
import Giftbg from "../../Assets/giftbg.png";
import iconhistory from "../../Assets/iconhistory.png";
import empty from "../../Assets/empty.png";

const Gift = () => {
  return (
    <div className="bg-[#242424] min-h-screen w-full flex items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-full md:max-w-[400px] mx-auto p-0 box-border">
        <GiftHeader />
        {/* Image Section */}
        <div className="w-full">
          <img
            src={Giftbg}
            alt="Gift background"
            className="w-full h-[200px] object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full px-3 py-4">
          {/* Gift Code Section */}
          <div className="bg-[#333332] p-4 rounded-lg mb-4">
            <div className="flex flex-col items-start">
              <h2 className="text-sm font-semibold text-[#a8a5a1]">Hi</h2>
              <h2 className="text-sm font-semibold text-[#a8a5a1]">
                We have a gift for you
              </h2>
            </div>

            <div className="flex flex-col items-start mt-8">
              <h2 className="text-sm font-semibold text-[#f5f3f0]">
                Please enter the gift code below
              </h2>
            </div>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Please enter gift code"
                className="w-full bg-[#242424] py-3 px-6 rounded-full text-white outline-none border-none"
              />
            </div>

            <button className="mt-8 mb-4 w-full py-3 rounded-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]">
              Receive
            </button>
          </div>

          {/* History Section */}
          <div className="bg-[#333332] p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img
                src={iconhistory}
                alt="History icon"
                className="w-5 h-5 mr-2 object-cover"
              />
              <h2 className="text-lg text-[#f5f3f0]">History</h2>
            </div>

            <div className="flex items-center justify-center min-h-[300px]">
              <img
                src={empty}
                alt="No Data"
                className="w-48 h-52 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gift;