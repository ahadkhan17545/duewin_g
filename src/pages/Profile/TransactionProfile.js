import React, { useState, useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import TransactionHistoryHeader from "../../components/TransactionHistoryHeader";

function TransactionProfile() {
  // State for filter and date selections
  const [filter, setFilter] = useState({ selected: "All", temp: "All" });
  const [date, setDate] = useState({
    selected: { year: "2025", month: "04", day: "10" },
    temp: { year: "2025", month: "04", day: "10" },
  });
  const [modal, setModal] = useState({ type: null, isOpen: false });

  const filterRef = useRef(null);
  const dateRefs = {
    year: useRef(null),
    month: useRef(null),
    day: useRef(null),
  };

  // Dropdown and date options
  const filterOptions = [
    "Bet",
"Agent commission",
"Win",
"Red envelope",
"Deposit",
"Withdraw",
"Cancel withdraw",
"Attendance bonus",
"Agent’s red envelope",
"Withdrawal rejected",
"Deposit gift",
"Manual deposit",
"Sign up bonus",
"Bonus",
"First deposit bonus",
"First deposit rebate",
"Investment and financial management",
"Financial income",
"Financial capital",
"Capital",
"Mission rewards",
"Game moved in",
"Game moved out",
"Wining slots",
"Bank binding bonus",
"Game refunded",
"Usdt deposit",
"Betting rebate",
"Vip level up increase",
"Vip monthly reward",
"Vip deposit bonus",
"Bonus deduction",
"Manual withdrawal",
"One-click rebate",
"Slots jackpot",
"Bind mobile number rewards",
"Xoso issue cancelled",
"Bind email rewards",
"Weekly award",
"C2c withdraw awards",
"C2c withdraw",
"C2c withdraw back",
"C2c recharge",
"C2c recharge awards",
"Newbie gift pack",
"Tournament rewards",
"Return awards",
"New members will receive bonuses if they make a loss on their first deposit",
"New members get bonuses by playing games",
"Daily rewards",
"Turntable awards",
"Partner rewards",

"Join channel rewards",

    // Add other options as needed
  ];
  const yearOptions = Array.from({ length: 5 }, (_, i) => (2022 + i).toString());
  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const dayOptions = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // Handle modal open/close
  const openModal = (type) => {
    setModal({ type, isOpen: true });
    if (type === "filter") {
      setFilter((prev) => ({ ...prev, temp: prev.selected }));
    } else if (type === "date") {
      setDate((prev) => ({ ...prev, temp: { ...prev.selected } }));
    }
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
  };

  // Handle filter selection
  const handleFilterSelect = (option) => {
    setFilter((prev) => ({ ...prev, temp: option }));
  };

  // Handle date selection
  const handleDateSelect = (type, value) => {
    setDate((prev) => ({
      ...prev,
      temp: { ...prev.temp, [type]: value },
    }));

    const ref = dateRefs[type].current;
    const options = type === "year" ? yearOptions : type === "month" ? monthOptions : dayOptions;
    const index = options.indexOf(value);
    if (ref && index !== -1) {
      ref.scrollTop = index * 40 - 80; // Center the selected item
    }
  };

  // Confirm selections
  const handleConfirm = () => {
    if (modal.type === "filter") {
      setFilter((prev) => ({ ...prev, selected: prev.temp }));
    } else if (modal.type === "date") {
      setDate((prev) => ({ ...prev, selected: { ...prev.temp } }));
    }
    closeModal();
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modal.isOpen &&
        filterRef.current &&
        !filterRef.current.contains(e.target) &&
        !e.target.closest(".modal-button")
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modal.isOpen]);

  // Format date for display
  const getFormattedDate = () => {
    const { year, month, day } = date.selected;
    return `${year}-${month}-${day}`;
  };

  // Modal component
  const Modal = ({ type, isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
        <div
          ref={filterRef}
          className="w-full max-w-[400px] bg-[#1e2131] rounded-t-3xl shadow-lg mx-auto"
        >
          <div className="flex justify-between items-center bg-[#333332] py-4 px-6 border-b border-gray-800 rounded-t-3xl">
            <button className="text-gray-400 text-lg" onClick={onClose}>
              Cancel
            </button>
            <button className="text-yellow-500 text-lg" onClick={onConfirm}>
              Confirm
            </button>
          </div>
          <div className="py-4">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#242424] w-full">
      <div className="w-full max-w-[400px] mx-auto flex flex-col flex-1">
        <TransactionHistoryHeader />

        <div className="flex-1 flex flex-col mt-14">
          {/* Filter and Date Buttons */}
          <div className="w-full max-w-[400px] p-3 gap-3 flex text-gray-300">
            <button
              className="modal-button flex-1 bg-[#2d2d2d] p-3 rounded-lg flex justify-between items-center"
              onClick={() => openModal("filter")}
            >
              <span className="truncate">{filter.selected}</span>
              <MdExpandMore className="text-gray-400 ml-1" />
            </button>
            <button
              className="modal-button flex-1 bg-[#2d2d2d] p-3 rounded-lg flex justify-between items-center"
              onClick={() => openModal("date")}
            >
              <span className="truncate">{getFormattedDate()}</span>
              <MdExpandMore className="text-gray-400 ml-1" />
            </button>
          </div>

          {/* Transaction List */}
          <div className="flex-1 px-3 pb-4 overflow-y-auto w-full max-w-[400px]">
            {[
              { detail: "Bet", time: "2025-04-02 09:29:36", balance: "₹1.00" },
              { detail: "Bet", time: "2025-04-02 09:28:30", balance: "₹1.00" },
            ].map((txn, index) => (
              <div
                key={index}
                className="bg-[#2d2d2d] rounded-lg mb-4 shadow-md w-full"
              >
                <div className="bg-[#4d4d4c] py-2 px-4 rounded-t-lg">
                  <h2 className="text-white font-medium text-base">Bet</h2>
                </div>
                <div className="px-4 py-3">
                  <div className="bg-[#242424] flex justify-between items-center py-2 px-3 rounded-md mb-1">
                    <span className="text-gray-400 text-sm">Detail</span>
                    <span className="text-white text-sm">{txn.detail}</span>
                  </div>
                  <div className="bg-[#242424] flex justify-between items-center py-2 px-3 rounded-md mb-1">
                    <span className="text-gray-400 text-sm">Time</span>
                    <span className="text-white text-sm">{txn.time}</span>
                  </div>
                  <div className="bg-[#242424] flex justify-between items-center py-2 px-3 rounded-md">
                    <span className="text-gray-400 text-sm">Balance</span>
                    <span className="text-red-500 text-sm font-medium">
                      {txn.balance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        type="filter"
        isOpen={modal.type === "filter" && modal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      >
        <div className="flex flex-col items-center max-h-[300px] overflow-y-auto hide-scrollbar">
          {filterOptions.map((option, index) => (
            <div
              key={index}
              className={`py-4 w-full text-center cursor-pointer transition-colors ${
                filter.temp === option
                  ? "text-white bg-[#333332]"
                  : "text-[#a8a5a1]"
              }`}
              onClick={() => handleFilterSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </Modal>

      {/* Date Modal */}
      <Modal
        type="date"
        isOpen={modal.type === "date" && modal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      >
        <div className="flex w-full max-w-[400px]">
          {["year", "month", "day"].map((type) => (
            <div key={type} className="flex-1">
              <div className="text-center text-gray-500 py-2 capitalize">{type}</div>
              <div className="h-[160px] relative overflow-hidden">
                <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                <div
                  ref={dateRefs[type]}
                  className="absolute inset-0 overflow-y-auto hide-scrollbar"
                >
                  <div className="h-[60px]"></div>
                  {(type === "year"
                    ? yearOptions
                    : type === "month"
                    ? monthOptions
                    : dayOptions
                  ).map((value) => (
                    <div
                      key={value}
                      className={`h-[40px] flex items-center justify-center text-center cursor-pointer ${
                        date.temp[type] === value
                          ? "text-white font-medium"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleDateSelect(type, value)}
                    >
                      {value}
                    </div>
                  ))}
                  <div className="h-[60px]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default TransactionProfile;