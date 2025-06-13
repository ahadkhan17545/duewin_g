import React from 'react';
import { Gift, HelpCircle, Target } from 'lucide-react';
import { Link } from "react-router-dom";

const ActivityAwardss = () => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-md">
      {/* Header */}
      <div className="bg-orange-500 p-4 text-white relative">
        <div className="absolute right-4 top-4">
          <HelpCircle className="w-10 h-10 text-white opacity-30" />
        </div>
        <h2 className="text-2xl font-bold">Activity Award</h2>
        <p className="text-sm">
          Complete weekly/daily tasks to receive rich rewards.
          <br />
          Weekly rewards cannot be accumulated to the next week, and daily rewards cannot be accumulated to the next day.
        </p>
      </div>

      {/* Mission 1 */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-green-500 text-white py-1 px-3 rounded-full text-sm font-semibold">
            Daily mission
          </div>
          <div className="text-gray-400 text-sm">Unfinished</div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-500 rounded-md p-2 flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-600">slot betting bonus</span>
          <span className="ml-auto text-orange-500 font-medium">0/100000</span>
        </div>

        <div className="text-gray-500 text-sm ml-9 mb-3">
          slot betting bonus
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-600">Award amount</div>
          <div className="flex items-center">
            <div className="text-yellow-500 mr-1">👍</div>
            <div className="text-orange-400 font-bold">₹1,000.00</div>
          </div>
        </div>

        <button className="w-full py-2 border border-green-500 rounded-full text-green-500 font-medium">
          to complete
        </button>
      </div>

      {/* Mission 2 */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-green-500 text-white py-1 px-3 rounded-full text-sm font-semibold">
            Daily mission
          </div>
          <div className="text-gray-400 text-sm">Unfinished</div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="bg-green-600 rounded-md p-2 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-600">Lottery betting bonus</span>
          <span className="ml-auto text-orange-500 font-medium">0/100000</span>
        </div>

        <div className="text-gray-500 text-sm ml-9 mb-3">
          Lottery betting bonus
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-600">Award amount</div>
          <div className="flex items-center">
            <div className="text-yellow-500 mr-1">👍</div>
            <div className="text-orange-400 font-bold">₹500.00</div>
          </div>
        </div>

        <button className="w-full py-2 border border-green-500 rounded-full text-green-500 font-medium">
          to complete
        </button>
      </div>
    </div>
  );
};

export default ActivityAwardss;