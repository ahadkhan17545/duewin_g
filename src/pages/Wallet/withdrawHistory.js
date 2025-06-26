import React, { useState, useRef, useEffect } from "react";
import WithdrawHistoryHeader from "../../components/WithdrawHistoryHeader";
import { MdExpandMore, MdContentCopy } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import apiServices from "../../api/apiServices";

// Import images
import img6 from "../../Assets/finalicons/allicon.png";
import img7 from "../../Assets/finalicons/bankcardicon1.png";
import img8 from "../../Assets/finalicons/Usdt.png";

// Import active state images
import activeImg6 from "../../Assets/finalicons/allicon2.png";
import activeImg7 from "../../Assets/finalicons/bankcardicon1.png";
import CommanHeader from "../../components/CommanHeader";

function WithdrawHistory() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [withdrawals, setWithdrawals] = useState([]); // Store API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });

  // Dragging state
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const tabsContainerRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const images = [img6, img7, img8];
  const activeImages = [activeImg6, activeImg7, img8];
  const descriptions = ["All", "Bank", "USDT"];


  // Fetch withdrawal history from API
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const data = await apiServices.getWithdrawalHistory(page, pagination.limit);
        setWithdrawals(data.withdrawals || []);
        setPagination(data.pagination);
      } catch (err) {
        setError("Failed to fetch withdrawal history");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [page]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragOffset(walk);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tabsContainerRef.current.scrollLeft = scrollLeft - walk;
    setDragOffset(walk);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) < 5) {
      return;
    }
    setDragOffset(0);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
      const handleMouseLeave = () => {
        setIsDragging(false);
      };
      tabsContainer.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        tabsContainer.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // Handle date selection and scrolling
  const handleDateSelect = (type, value) => {
    const year = type === "year" ? value : selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
    const month = type === "month" ? value - 1 : selectedDate ? selectedDate.getMonth() : new Date().getMonth();
    const day = type === "day" ? value : selectedDate ? selectedDate.getDate() : new Date().getDate();
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);

    const containerRef = type === "year" ? yearRef.current : type === "month" ? monthRef.current : dayRef.current;
    const items = type === "year" ? years : type === "month" ? months : days;
    const selectedIndex = items.findIndex((item) => item.toString() === value.toString().padStart(2, "0"));

    if (containerRef && selectedIndex !== -1) {
      const rowHeight = 40;
      containerRef.scrollTop = selectedIndex * rowHeight + 60;
    }
  };

  const handleDateConfirm = () => {
    setIsDateModalOpen(false);
  };

  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusConfirm = () => {
    setIsStatusModalOpen(false);
  };

  // Filter withdrawals based on tab, status, and date
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesTab =
      descriptions[selectedIndex] === "All" ||
      (descriptions[selectedIndex] === "Bank" && withdrawal.withdrawal_type === "BANK") ||
      (descriptions[selectedIndex] === "USDT" && withdrawal.withdrawal_type === "USDT");

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Complete" && withdrawal.status === "completed") ||
      (selectedStatus === "Failed" && withdrawal.status === "failed");

    const withdrawalDate = new Date(withdrawal.created_at);
    const matchesDate = selectedDate
      ? withdrawalDate.getFullYear() === selectedDate.getFullYear() &&
      withdrawalDate.getMonth() === selectedDate.getMonth() &&
      withdrawalDate.getDate() === selectedDate.getDate()
      : true;

    return matchesTab && matchesStatus && matchesDate;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#242424] w-full max-w-[440px] min-h-screen flex flex-col mx-auto">
      <CommanHeader title="Withdraw History" />

      {/* Buttons Section */}
      <div className="flex flex-row items-center gap-2 mt-14">
        <div className="w-full max-w-md px-3">
          <div
            ref={tabsContainerRef}
            className="flex space-x-4 cursor-grab overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              userSelect: "none",
              scrollBehavior: "smooth",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {descriptions.map((desc, index) => (
              <div
                key={index}
                className={`px-2 py-2 w-28 rounded-lg shadow-md mb-1 mt-2 flex-shrink-0 transition-all duration-300 
                  ${selectedIndex === index
                    ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                    : "bg-[#333332]"
                  }
                  ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
                onClick={() => {
                  if (Math.abs(dragOffset) < 5) {
                    setSelectedIndex(index);
                  }
                }}
              >
                <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                  <img
                    src={selectedIndex === index ? activeImages[index] : images[index]}
                    alt={`Box ${index}`}
                    className="w-8 h-6 object-contain"
                  />
                  <p
                    className={`text-sm font-semibold ${selectedIndex === index ? "text-[#8f5206]" : "text-[#a8a5a1]"
                      }`}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-sm font-medium rounded-xl">
            <div className="flex gap-4 mb-4">
              {/* Status Dropdown */}
              <div className="relative w-24">
                <button
                  onClick={() => setIsStatusModalOpen(true)}
                  className="flex items-center justify-between w-full bg-[#333332] px-3 py-2 rounded-lg cursor-pointer"
                >
                  <span className="text-white">{selectedStatus}</span>
                  <MdExpandMore className="text-lg text-white" />
                </button>

                {isStatusModalOpen && (
                  <div className="fixed inset-0 flex items-end justify-center z-50">
                    <div
                      className="absolute inset-0 bg-black opacity-50"
                      onClick={() => setIsStatusModalOpen(false)}
                    ></div>
                    <div className="bg-[#2a2a2a] w-full max-w-[400px] mx-auto rounded-t-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <button
                          onClick={() => setIsStatusModalOpen(false)}
                          className="text-gray-400 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleStatusConfirm}
                          className="text-amber-500 text-sm"
                        >
                          Confirm
                        </button>
                      </div>
                      <div className="space-y-4">
                        {["All", "Complete", "Failed"].map((status) => (
                          <div
                            key={status}
                            className={`p-2 rounded-lg cursor-pointer text-center ${selectedStatus === status
                                ? "bg-[#4a4a4a] text-white"
                                : "text-gray-400 hover:bg-[#4a4a4a] hover:text-white"
                              }`}
                            onClick={() => handleStatusSelect(status)}
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="relative flex-1">
                <button
                  onClick={() => setIsDateModalOpen(true)}
                  className="flex items-center justify-between w-full bg-[#333332] px-3 py-2 rounded-lg cursor-pointer"
                >
                  <span className={selectedDate ? "text-white" : "text-zinc-400"}>
                    {selectedDate ? selectedDate.toLocaleDateString() : "Choose a date"}
                  </span>
                  <MdExpandMore className="text-lg text-white" />
                </button>

                {isDateModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
                    <div
                      className="rounded-t-3xl shadow-xl w-full max-w-[400px] bg-[#333332] mx-auto"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))",
                      }}
                    >
                      <div className="flex justify-between items-center px-4 py-3 bg-[#333332] rounded-t-xl">
                        <button
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                          onClick={() => setIsDateModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <h2 className="text-white font-medium">Choose a date</h2>
                        <button
                          className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                          onClick={handleDateConfirm}
                        >
                          Confirm
                        </button>
                      </div>

                      <div className="flex w-full">
                        <div className="flex-1">
                          <div className="w-full text-center text-gray-500 py-2">Year</div>
                          <div className="h-[160px] relative overflow-hidden" ref={yearRef}>
                            <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                              <div className="h-[60px]"></div>
                              {years.map((year) => (
                                <div
                                  key={year}
                                  className={`h-[40px] flex items-center justify-center text-center ${selectedDate && selectedDate.getFullYear() === year
                                      ? "text-white font-medium"
                                      : "text-gray-500"
                                    } cursor-pointer`}
                                  onClick={() => handleDateSelect("year", year)}
                                >
                                  {year}
                                </div>
                              ))}
                              <div className="h-[60px]"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="w-full text-center text-gray-500 py-2">Month</div>
                          <div className="h-[160px] relative overflow-hidden" ref={monthRef}>
                            <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                              <div className="h-[60px]"></div>
                              {months.map((month) => {
                                const monthNum = parseInt(month) - 1;
                                const isSelected = selectedDate && selectedDate.getMonth() === monthNum;
                                return (
                                  <div
                                    key={month}
                                    className={`h-[40px] flex items-center justify-center text-center ${isSelected ? "text-white font-medium" : "text-gray-500"
                                      } cursor-pointer`}
                                    onClick={() => handleDateSelect("month", month)}
                                  >
                                    {month}
                                  </div>
                                );
                              })}
                              <div className="h-[60px]"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="w-full text-center text-gray-500 py-2">Day</div>
                          <div className="h-[160px] relative overflow-hidden" ref={dayRef}>
                            <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                              <div className="h-[60px]"></div>
                              {days.map((day) => {
                                const year = selectedDate
                                  ? selectedDate.getFullYear()
                                  : new Date().getFullYear();
                                const month = (selectedDate
                                  ? selectedDate.getMonth()
                                  : new Date().getMonth()) + 1;
                                const isSelected = selectedDate && selectedDate.getDate() === day;
                                return (
                                  <div
                                    key={day}
                                    className={`h-[40px] flex items-center justify-center text-center ${isSelected ? "text-white font-medium" : "text-gray-500"
                                      } cursor-pointer`}
                                    onClick={() => handleDateSelect("day", day)}
                                  >
                                    {day}
                                  </div>
                                );
                              })}
                              <div className="h-[60px]"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="rounded-lg shadow-md mt-4 max-h-screen overflow-y-auto" style={{ maxHeight: '500px' }}>
            {loading ? (
              <div className="text-white text-center p-4">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center p-4">{error}</div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="flex items-center justify-center">
                <div className="w-72 h-72 flex flex-col items-center justify-center rounded-lg p-6">
                  <div className="relative w-24 h-24 mb-4">
                    <MdCheck className="absolute inset-0 w-full h-full text-neutral-700" />
                    <AiOutlinePlus className="absolute -right-2 -bottom-2 w-6 h-6 text-neutral-700" />
                  </div>
                  <p className="text-neutral-500 text-lg font-medium">No data</p>
                </div>
              </div>
            ) : (
              filteredWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="bg-[#333332] rounded-xl p-4 mb-4">
                  <div style={{
                    borderBottom: '.01333rem solid #525167'
                    , paddingBottom: '8px'
                  }} className="flex items-center justify-between mb-2">
                    <div>
                      <span className="bg-[#cc2f2f] text-white font-medium text-sm px-2 py-1 rounded">
                        Withdraw
                      </span>
                    </div>
                    <div className="ml-auto text-right">
                      <span
                        className={`text-sm font-medium ${withdrawal.status === "completed" ? "text-green-500" : (withdrawal.status === "pending" ? "text-yellow-500" : "text-red-500")
                          }`}
                      >
                        {withdrawal.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Balance</span>
                      <span className="text-amber-400 font-medium">₹{Number(withdrawal.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Type</span>
                      <span className="text-[#a8a5a1] font-medium">{withdrawal.withdrawal_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Time</span>
                      <span className="text-[#a8a5a1] font-medium">{formatDate(withdrawal.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a8a5a1]">Method</span>
                      <span className="text-[#a8a5a1] font-medium">{withdrawal.payment_gateway}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 0 && (
            <div className="flex justify-center gap-4 mt-4 mb-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-500" : "bg-[#fae59f] text-[#8f5206]"
                  }`}
              >
                Previous
              </button>
              <span className="text-white">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
                disabled={page === pagination.pages}
                className={`px-4 py-2 rounded-lg ${page === pagination.pages ? "bg-gray-500" : "bg-[#fae59f] text-[#8f5206]"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const style = document.createElement("style");
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default WithdrawHistory;