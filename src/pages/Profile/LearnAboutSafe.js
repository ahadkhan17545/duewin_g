import React from 'react';
import SafeHeader from '../../components/SafeHeader';

const RulesComponent = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-[#242424] shadow-md rounded-lg p-4 text-gray-200">
      {/* Header Note */}
      <SafeHeader/>
      <div className="text-center text-red-400 text-xs mb-4">
        MINIMUM, DAILY INTEREST 0.1%
      </div>

      {/* Income Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">💰</span>
          <h2 className="text-lg font-semibold text-green-400">Income</h2>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>
              The Income Calculation Method is the Base Interest Rate Plus the VIP LEVEL Extra Interest Rate;
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>After the balance is transferred in, profit will be calculated once every 1 minute</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>
              Profit will be paid on the 2nd transfer or transfer out and the previous profit will be transferred to the wallet balance
            </span>
          </li>
        </ul>
      </div>

      {/* Transfer In Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">📥</span>
          <h2 className="text-lg font-semibold text-green-400">Transfer In</h2>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>Wallet balance transferred to the safe must be transferred in points</span>
          </li>
        </ul>
      </div>

      {/* Example Section */}
      <div className="text-gray-400 text-xs mb-6">
        <p className="font-semibold mb-1">For example</p>
        <p>
          1 point is 1000, transfer in 2 points is 2000, 10 points is 10000, 50 points is 50000, transfer amount must be a multiple of 1000
        </p>
      </div>

      {/* Transfer Out Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">📤</span>
          <h2 className="text-lg font-semibold text-green-400">Transfer Out</h2>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>
              Provided your income is guaranteed, you can transfer out at any time, from the balance of the safe to the balance of the wallet and the amount transferred must be a multiple of the number of copies
            </span>
          </li>
        </ul>
      </div>

      {/* Reminder Section */}
      <div className="bg-[#2f2f2f] rounded-lg p-3 text-gray-300 text-xs mb-6">
        <p className="text-red-400 font-semibold mb-1">REMINDER</p>
        <p>
          Please do not transfer in and out frequently. Earnings will be calculated from 1 minute after deposit. If the cumulative amount of an earned amount is less than 0.01, the amount will not be counted in "earnings"
        </p>
      </div>

      {/* Safe Section */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">🛡️</span>
          <h2 className="text-lg font-semibold text-green-400">Safe</h2>
        </div>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>Security technical team to ensure the safety of your money</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2">▶</span>
            <span>To keep your funds safe, it is recommended that you transfer to the safe</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RulesComponent;