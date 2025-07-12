import React, { useState, useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import CommanHeader from "../../components/CommanHeader";
import apiServices from "../../api/apiServices";

const filterOptions = [
  "game_win",
  "deposit",
  "withdrawal",
  "admin_credit",
  "admin_debit",
  "game_loss",
  "gift_code",
  "referral_bonus",
  "rebate",
  "vip_reward",
  "transfer_in",
  "transfer_out",
  "refund",
  "game_move_in",
  "game_move_out",
  "activity_reward",
];

// Function to format filter options for display
const formatFilterLabel = (filterValue) => {
  return filterValue
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function TransactionProfile() {
  const [filter, setFilter] = useState(filterOptions[0]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear().toString(),
    month: (today.getMonth() + 1).toString().padStart(2, "0"),
    day: today.getDate().toString().padStart(2, "0"),
  });

  const [tempDate, setTempDate] = useState({
    year: today.getFullYear().toString(),
    month: (today.getMonth() + 1).toString().padStart(2, "0"),
    day: today.getDate().toString().padStart(2, "0"),
  });

  const yearOptions = Array.from({ length: 5 }, (_, i) =>
    (2022 + i).toString()
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const dayOptions = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const dateRefs = {
    year: useRef(null),
    month: useRef(null),
    day: useRef(null),
  };
  const filterRef = useRef(null);

  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        type: filter, // Still using original filter value for API
        ...getDateFilterParams(selectedDate),
      };

      const res = await apiServices.getGameTransactions(params);
      setTransactions(res?.data?.transactions || []);
      setPagination(res?.data?.pagination || {});
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filter, selectedDate]);

  const [modal, setModal] = useState({ type: null, isOpen: false });

  const openModal = (type) => {
    setModal({ type, isOpen: true });
    if (type === "date") {
      setTempDate({ ...selectedDate });
    }
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
  };

  const handleFilterSelect = (option) => {
    setFilter(option); // Still using original value
    closeModal();
  };

  const handleDateSelect = (type, value) => {
    setTempDate((prev) => ({ ...prev, [type]: value }));

    const ref = dateRefs[type].current;
    const options =
      type === "year"
        ? yearOptions
        : type === "month"
          ? monthOptions
          : dayOptions;
    const index = options.indexOf(value);

    if (ref && index !== -1) {
      ref.scrollTop = index * 40 - 80;
    }
  };

  const handleConfirm = () => {
    if (modal.type === "date") {
      setSelectedDate(tempDate);
    }
    closeModal();
  };

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

  const formatDateString = (dateObj) => {
    const { year, month, day } = dateObj;
    return `${year}-${month}-${day}`;
  };

  const getDateFilterParams = (dateObj) => {
    const { year, month, day } = dateObj;

    const start = new Date(`${year}-${month}-${day}T00:00:00`);
    const end = new Date(`${year}-${month}-${day}T23:59:59.999`);

    return {
      start_date: start.toISOString(), 
      end_date: end.toISOString(), 
    };
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
        <CommanHeader title="Transaction History" />

        <div className="flex-1 flex flex-col mt-14">
          {/* Filter and Date Buttons */}
          <div className="w-full max-w-[400px] p-3 gap-3 flex text-gray-300">
            <button
              className="modal-button flex-1 bg-[#2d2d2d] p-3 rounded-lg flex justify-between items-center"
              onClick={() => openModal("filter")}
            >
              <span className="truncate">{formatFilterLabel(filter)}</span>
              <MdExpandMore className="text-gray-400 ml-1" />
            </button>
            <button
              className="modal-button flex-1 bg-[#2d2d2d] p-3 rounded-lg flex justify-between items-center"
              onClick={() => openModal("date")}
            >
              <span className="truncate">{formatDateString(selectedDate)}</span>
              <MdExpandMore className="text-gray-400 ml-1" />
            </button>
          </div>

          {/* Transaction List */}
          <div className="flex-1 px-3 pb-4 overflow-y-auto w-full max-w-[400px]">
            {loading && <span className="text-white">Loading...</span>}
            {transactions?.map((txn, index) => (
              <div
                key={index}
                className="bg-[#2d2d2d] rounded-lg mb-4 shadow-md w-full"
              >
                <div className="bg-[#4d4d4c] py-2 px-4 rounded-t-lg">
                  <h2 className="text-white font-medium text-base">
                    {txn?.game_type}
                  </h2>
                </div>
                <div className="px-4 py-3">
                  <div className="bg-[#242424] flex justify-between items-center py-2 px-3 rounded-md mb-1">
                    <span className="text-gray-400 text-sm">Detail</span>
                    <span className="text-white text-sm">{formatFilterLabel(txn.type)}</span>
                  </div>
                  <div className="bg-[#242424] flex justify-between items-center py-2 px-3 rounded-md mb-1">
                    <span className="text-gray-400 text-sm">Time</span>
                    <span className="text-white text-sm">
                      {new Date(txn?.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="bg-[#242424] flex justify-between items-center py-2 px-3 rounded-md">
                    <span className="text-gray-400 text-sm">Balance</span>
                    <span className="text-red-500 text-sm font-medium">
                      {txn.amount}
                    </span>
                  </div>
                  <div
                    className="bg-[#333332] flex justify-between items-center py-2 px-3 rounded-md height-[50px]"
                    style={{
                      marginTop: "10px",
                      height: "56px",
                      border: "1px solid #4D4D4C",
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {transactions?.length < 1 && !loading && (
              <p className="text-white text-center">No data found.</p>
            )}
          </div>
          {pagination.total_pages > 0 && (
            <div className="flex justify-center gap-4 mt-4 mb-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.has_prev_page}
                className={`px-4 py-2 rounded-lg ${
                  !pagination.has_prev_page
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-[#fae59f] text-[#8f5206]"
                }`}
              >
                Previous
              </button>

              <span className="text-white">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.total_pages))
                }
                disabled={!pagination.has_next_page}
                className={`px-4 py-2 rounded-lg ${
                  !pagination.has_next_page
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-[#fae59f] text-[#8f5206]"
                }`}
              >
                Next
              </button>
            </div>
          )}
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
                filter === option
                  ? "text-white bg-[#333332]"
                  : "text-[#a8a5a1]"
              }`}
              onClick={() => handleFilterSelect(option)}
            >
              {formatFilterLabel(option)}
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        type="date"
        isOpen={modal.type === "date" && modal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      >
        <div className="flex w-full max-w-[400px]">
          {["year", "month", "day"].map((type) => (
            <div key={type} className="flex-1">
              <div className="text-center text-gray-500 py-2 capitalize">
                {type}
              </div>
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
                      className={`h-[40px] flex items-center justify-center text-center cursor-pointer transition-colors duration-150 ${
                        tempDate[type] === value
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