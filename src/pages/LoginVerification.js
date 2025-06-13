import React from 'react';
import LoginVerficationHeader from '../components/LoginVerificationHeader';
import email from '../Assets/settingicon/resetemailicon.png';
import realtime from "../Assets/realtimecounticon.png";

const LoginVerificationForm = () => {
  return (
    <div className="min-h-screen w-full bg-[#242424] flex flex-col items-center justify-start px-4 py-6">
      <LoginVerficationHeader />
      <div className="w-full space-y-8 mt-14"> 
        {/* Email Field */}
        <div>
          <label className="flex items-center gap-2 mb-2 text-lg text-white">
            <img src={email} alt="email" className="h-5 w-5" />
            Email / Account Log in
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="please input your email"
              className="w-full py-3 px-4 bg-[#333332] border-none rounded-md text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Verification Code */}
        <div className="mb-20">
          <label className="flex items-center gap-2 mb-2  text-lg text-white">
            <img src={realtime} alt="realtime" className="h-5 w-5" />
            Verification Code
          </label>
          <div className="relative flex">
            <input
              type="text"
              placeholder="Please enter the confirmation code"
              className="w-full py-3 px-4 bg-[#333332] border-none rounded-md text-white placeholder-zinc-500 focus:outline-none"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 py-2 px-4 bg-[linear-gradient(90deg,_#FAE59F_0%,_#C4933F_100%)] text-[#8f5206] font-medium rounded-full transition-colors">
              Send
            </button>
          </div>
        </div>

        {/* Bind Button */}
        <button className="w-full py-3 px-4 bg-[linear-gradient(90deg,_#FAE59F_0%,_#C4933F_100%)] text-[#8f5206] font-medium rounded-full transition-colors">
          Bind
        </button>
      </div>
    </div>
  );
};

export default LoginVerificationForm;
