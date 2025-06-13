import React from 'react';
import Capture from './../Assets/Capture.png';

const Promotionheader = () => {
  return (
    <header className="bg-[#414140] fixed top-0 left-0 right-0 mx-auto w-full max-w-[400px] h-12 flex items-center px-2 z-50">

      <div className="flex-1"></div>

      {/* Center with logo */}
      <div className="flex items-center mr-24">
        <p className='text-[#f5f3f0] text-2xl'>Agency</p>
      </div>

      {/* Right side with flag */}
      <div className="flex space-x-2 ml-10 mr-auto">
  <a href="/newsubordinate" target="_self">
    <img src={Capture} alt="Country Flag" className="w-8 h-8 rounded-full" />
  </a>
</div>
    </header>
  );
};

export default Promotionheader;
