import React from 'react'
import { FaChevronRight } from "react-icons/fa";
import { BsFileText, BsChatDots, BsPerson } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineBanknotes } from "react-icons/hi2";
import ArWalletHeader from '../../components/ArWalletHeader';
import { BiShoppingBag, BiHelpCircle } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";

const ARWallet = () => {
  return (
    <div className='bg-[#242424] w-[412px] min-h-screen flex flex-col'>
      <ArWalletHeader/>
    <div className="w-[410px] mt-8 font-sans bg-[#242424] p-4 flex flex-col gap-4 text-[#a8a5a1]">
      {/* Total Assets Section */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">My total assets</p>
          <p className="text-xl font-bold">0.00 ARB</p>
        </div>
      </div>

      {/* Platform Notice Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-400 rounded-xl p-4 relative overflow-hidden">
        <p className="text-white/80 text-sm mb-1">Platform Notice</p>
        <h3 className="text-white text-xl font-bold mb-1">New Year's Welfare</h3>
        <p className="text-white/90 text-sm mb-3">Earn 3% bonus of buying<br />and 1% of selling</p>
        <div className="flex justify-between items-center">
          <button className="text-white text-xs flex items-center gap-1 hover:underline transition-all">
            View Details <FaChevronRight className="h-4 w-4" />
          </button>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-yellow-300"></span>
            <span className="h-2 w-2 rounded-full bg-white"></span>
            <span className="h-2 w-2 rounded-full bg-white/50"></span>
          </div>
        </div>
      </div>

      {/* Grid Action Buttons */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {["Buy rules", "Sell rules", "Live Chat", "User"].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="bg-gray-100 rounded-full p-2">
              {index === 0 && <BsFileText className="h-5 w-5 text-gray-700" />}
              {index === 1 && <AiOutlineShoppingCart className="h-5 w-5 text-gray-700" />}
              {index === 2 && <BsChatDots className="h-5 w-5 text-gray-700" />}
              {index === 3 && <BsPerson className="h-5 w-5 text-gray-700" />}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Buy & Sell ARB */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Buy ARB", desc: "Flexible buying", text: "text-yellow-500", iconBg: "bg-yellow-400" },
          { label: "Sell ARB", desc: "Instant selling", text: "text-green-500", iconBg: "bg-green-400" },
        ].map((card, index) => (
          <div
            key={index}
            className={`${card.text}/20 border rounded-xl p-3 flex items-center justify-between hover:bg-opacity-75 transition-colors cursor-pointer`}
          >
            <div>
              <p className={`font-bold ${card.text}`}>{card.label}</p>
              <p className={`text-xs ${card.text}/70`}>{card.desc}</p>
            </div>
            <div className={`${card.iconBg} rounded-lg p-2`}>
              <HiOutlineBanknotes className="h-5 w-5 text-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Orders Info */}
      <div className="flex items-center mb-6 text-[#a8a5a1]">
        <BiShoppingBag className="w-5 h-5 mr-2 text-[#a8a5a1]" />
        <span className="font-medium">You have 0 orders in progress</span>
      </div>

      {/* No Active Orders */}
      <div className="flex flex-col items-center justify-center py-10 bg-[#333332] rounded-lg mb-6">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute w-16 h-16 bg-gray-200 rounded-full top-2 left-2 opacity-30"></div>
          <div className="absolute w-16 h-16 bg-gray-200 rounded-full top-2 right-2 opacity-30"></div>
          <div className="absolute w-14 h-20 bg-gray-300 rounded top-0 left-3 z-10"></div>
        </div>
        <p className="text-[#a8a5a1] text-sm">You have no active orders yet</p>
      </div>

      {/* FAQ Section */}
      <div className="mb-4">
        <div className="flex items-center mb-4 text-[#a8a5a1]">
          <BiHelpCircle className="w-5 h-5 mr-2 text-[#a8a5a1]" />
          <span className="font-medium">Q&A FAQ</span>
        </div>

        {/* FAQ Categories */}
        <div className="flex mb-4 space-x-2">
          <button className="px-4 py-2 bg-[#333332] rounded-full text-sm font-medium hover:bg-gray-300 transition">
            Beginner's questions
          </button>
          <button className="px-4 py-2 bg-[#333332] rounded-full text-sm font-medium hover:bg-gray-100 transition">
            Trading problems
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {[
            "How to sell ARB?",
            "How to withdraw to bank account?",
            "How to withdraw ARB to game account?",
            "Sell order has been completed, but have not received funds to UPI account",
            "How to complete Real-name verification?",
            "When will the withdrawal be successful?",
            "How to deactivate AR wallet?",
            "How to change phone number?",
            "I forgot my payment password",
            "How to add UPI ID?",
          ].map((question, index) => (
            <details key={index} className="group bg-[#333332] rounded-lg">
              <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
                <span className="font-medium text-sm">{`${index + 1}. ${question}`}</span>
                <MdKeyboardArrowDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
            </details>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default ARWallet