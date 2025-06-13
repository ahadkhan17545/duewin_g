import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import usdticon from "../../Assets/Bankicons/usdticon.png";
import usdt from "../../Assets/Bankicons/usdt2icon.png";
import usdtt from "../../Assets/Bankicons/usdticon3.png";
import hint from "../../Assets/loader/hint.png";
import USDTHeader from '../../components/USDTHeader';

const WalletForm = () => {
  const [network, setNetwork] = useState('TRC');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [usdtAddress, setUsdtAddress] = useState('');
  const [addressAlias, setAddressAlias] = useState('');

  // Check if both inputs are filled
  const isFormFilled = usdtAddress.trim() !== '' && addressAlias.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242424]">
      {/* Header is imported as a component */}
      

      {/* Main Content */}
      <div className="w-full max-w-[400px] ">
      <USDTHeader />
        <div className="bg-[#242424] rounded-lg w-full text-white mt-4 pb-4 px-4">
          {/* Warning message */}
          <div className="bg-[#333332] rounded-full p-3 mb-4 flex items-center">
            <img src={hint} alt="Alert" className="w-5 h-5 mr-2" />
            <span className="text-red-500 text-sm">
              To ensure the safety of your funds, please link your wallet
            </span>
          </div>

          {/* Network selection */}
          <div className="mb-4 mt-10">
            <div className="flex items-center gap-2 mb-1">
              <img src={usdticon} alt="Network" className="w-6 h-6" />
              <label className="font-medium">Select main network</label>
            </div>

            <div
              className="bg-[#333332] p-3 rounded flex justify-between items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-[#a8a5a1]">{network}</span>
              <ChevronDown className="h-5 w-5 text-[#a8a5a1]" />
            </div>
            
            {isDropdownOpen && (
              <div className="bg-[#333332] mt-1 rounded absolute z-20 w-[calc(100%-32px)] max-w-[368px]">
                {['TRC', 'ERC', 'BEP'].map((net) => (
                  <div 
                    key={net}
                    className="p-3 hover:bg-[#3a3a3a] cursor-pointer"
                    onClick={() => {
                      setNetwork(net);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {net}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* USDT Address */}
          <div className="mb-4 mt-10">
            <div className="flex items-center gap-2 mb-1">
              <img src={usdt} alt="USDT" className="w-6 h-6" />
              <label className="font-medium">USDT Address</label>
            </div>

            <input
              type="text"
              placeholder="Please enter the USDT address"
              className="bg-[#333332] p-3 rounded w-full text-white focus:outline-none"
              value={usdtAddress}
              onChange={(e) => setUsdtAddress(e.target.value)}
            />
          </div>

          {/* Address Alias */}
          <div className="mb-4 mt-10">
            <div className="flex items-center gap-2 mb-1">
              <img src={usdtt} alt="Tag" className="w-6 h-6" />
              <label className="font-medium">Address Alias</label>
            </div>

            <input
              type="text"
              placeholder="Please enter a remark of the withdrawal address"
              className="bg-[#333332] p-3 rounded w-full text-white focus:outline-none"
              value={addressAlias}
              onChange={(e) => setAddressAlias(e.target.value)}
            />
          </div>

          {/* Save button */}
          <button
            className={`text-white p-2 rounded-full w-full font-medium tracking-wider mt-14 ${
              isFormFilled
                ? 'bg-gradient-to-r from-[#fae59f] to-[#c4933f]'
                : 'bg-gray-400'
            }`}
          >
            S a v e
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletForm;