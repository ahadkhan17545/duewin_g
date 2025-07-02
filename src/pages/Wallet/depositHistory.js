import React, { useState, useRef, useEffect } from "react";
import DepositHistoryHeader from "../../components/DepositHistoryHeader";
import { MdExpandMore, MdContentCopy } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCheck } from "react-icons/md";
import apiServices from "../../api/apiServices";

import paytm from "../../Assets/gamesimage/paytm.png";
import upi from "../../Assets/gamesimage/UPI.png";
import all from "../../Assets/gamesimage/all.png";
import img6 from "../../Assets/finalicons/allicon.png";
import img7 from "../../Assets/finalicons/bankcardicon1.png";
import img8 from "../../Assets/finalicons/Usdt.png";
import whitetick from "../../Assets/whitetick.png";

import activeImg6 from "../../Assets/finalicons/allicon2.png";
import activeImg7 from "../../Assets/finalicons/bankcardicon1.png";
import CommanHeader from "../../components/CommanHeader";

function DepositHistory() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [deposits, setDeposits] = useState([]); // Store API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });

  const tabsContainerRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  const images = [img6, paytm, upi, all, img8];
  const activeImages = [activeImg6, paytm, upi, all, img8];
  const descriptions = ["All","UPI-QRpay",  "USDT"];

  // Current date as per system instructions (May 23, 2025)
  const currentDate = new Date(2025, 4, 23);

  // Fetch deposit history from API
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const data = await apiServices.getDepositHistory(page, pagination.limit);
        setDeposits(data.recharges || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 10, pages: 1 });
      } catch (err) {
        setError("Failed to fetch deposit history");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [page]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isDateModalOpen || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDateModalOpen, isModalOpen]);

  // Handle copy action
  const handleCopy = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => {
      setCopiedOrderId(null);
    }, 2000);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedIndex < descriptions.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }

    if (isRightSwipe && selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  const scrollToCenter = (index) => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tabElement = container.children[index];

      if (tabElement) {
        const containerWidth = container.offsetWidth;
        const tabWidth = tabElement.offsetWidth;
        const tabLeft = tabElement.offsetLeft;

        container.scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;
      }
    }
  };

  useEffect(() => {
    scrollToCenter(selectedIndex);
  }, [selectedIndex]);

  const handleTabSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsModalOpen(false);
  };

  const handleDateSelect = (type, value) => {
    const year =
      type === "year"
        ? value
        : selectedDateRange.startDate
        ? selectedDateRange.startDate.getFullYear()
        : currentDate.getFullYear();
    const month =
      type === "month"
        ? value - 1
        : selectedDateRange.startDate
        ? selectedDateRange.startDate.getMonth()
        : currentDate.getMonth();
    const day =
      type === "day"
        ? value
        : selectedDateRange.startDate
        ? selectedDateRange.startDate.getDate()
        : currentDate.getDate();
    const selectedDate = new Date(year, month, day);

    if (selectedDate > currentDate) return;

    if (
      !selectedDateRange.startDate ||
      (selectedDateRange.startDate && selectedDateRange.endDate)
    ) {
      setSelectedDateRange({ startDate: selectedDate, endDate: null });
    } else {
      const newEndDate =
        selectedDate >= selectedDateRange.startDate
          ? selectedDate
          : selectedDateRange.startDate;
      const newStartDate =
        selectedDate >= selectedDateRange.startDate
          ? selectedDateRange.startDate
          : selectedDate;
      setSelectedDateRange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }

    const containerRef =
      type === "year"
        ? yearRef.current
        : type === "month"
        ? monthRef.current
        : dayRef.current;
    const items =
      type === "year" ? years : type === "month" ? months : days;
    const selectedIndex = items.findIndex(
      (item) => item.toString() === value.toString().padStart(2, "0")
    );

    if (containerRef && selectedIndex !== -1) {
      const rowHeight = 40;
      containerRef.scrollTop = selectedIndex * rowHeight + 60;
    }
  };

  const handleDateConfirm = () => {
    setIsDateModalOpen(false);
  };

  const renderDateLabel = () => {
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      return `${selectedDateRange.startDate.toLocaleDateString()} - ${selectedDateRange.endDate.toLocaleDateString()}`;
    }
    return "Choose a date";
  };

  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  // Filter deposits based on tab, status, and date range
  const filteredDeposits = deposits?.filter((deposit) => {
    const matchesTab =
      descriptions[selectedIndex] === "All" ||
      (descriptions[selectedIndex] === "UPI-QRpay" && deposit.payment_method.includes("QRpay")) ||
      (descriptions[selectedIndex] === "USDT" && deposit.payment_method === "USDT");

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "To Be Paid" && deposit.status === "pending") ||
      (selectedStatus === "Complete" && deposit.status === "completed") ||
      (selectedStatus === "Failed" && deposit.status === "failed");

    const depositDate = new Date(deposit.created_at);
    const matchesDate =
      selectedDateRange.startDate && selectedDateRange.endDate
        ? depositDate >= selectedDateRange.startDate && depositDate <= selectedDateRange.endDate
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
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col">
      <CommanHeader title="Deposit History" />

      <div className="bg-[#242424] flex flex-col items-center mt-12">
        <div className="w-full px-3">
          <div
            ref={tabsContainerRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {descriptions.map((desc, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg shadow-md px-8 mb-1 mt-2 flex-shrink-0 transition-all duration-300 cursor-pointer 
                  ${
                    selectedIndex === index
                      ? "bg-gradient-to-r from-[#fae59f] to-[#c4933f]"
                      : "bg-[#333332]"
                  }`}
                onClick={() => handleTabSelect(index)}
              >
                <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                  <img
                    src={selectedIndex === index ? activeImages[index] : images[index]}
                    alt={`Box ${index}`}
                    className="w-8 h-6 object-contain"
                  />
                  <p
                    className={`text-sm font-semibold ${
                      selectedIndex === index ? "text-[#8f5206]" : "text-[#a8a5a1]"
                    }`}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              {descriptions.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-4 rounded-full ${
                    selectedIndex === index ? "bg-[#fae59f]" : "bg-[#333332]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 text-sm font-medium rounded-xl w-full max-w-[440px]">
            <div className="flex gap-4 mb-4">
              <div className="relative ">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-between w-full bg-[#333332] px-3 py-2 rounded-lg cursor-pointer w-[175px] h-[42px]"
                >
                  <span className="text-zinc-400">{selectedStatus}</span>
                  <MdExpandMore className="text-lg text-white" />
                </button>

                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
                    <div
                      className="rounded-t-3xl shadow-xl w-full max-w-[400px] bg-[#333332]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))",
                      }}
                    >
                      <div className="flex justify-between items-center px-4 py-3 bg-[#333332] rounded-t-xl">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-zinc-400 hover:text-zinc-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <h2 className="text-zinc-400 font-medium">Select Status</h2>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                      <div className="space-y-4 p-4">
                        {["All", "To Be Paid", "Complete", "Failed"].map((status) => (
                          <div
                            key={status}
                            onClick={() => handleStatusSelect(status)}
                            className={`p-2 rounded-lg cursor-pointer text-center ${
                              selectedStatus === status
                                ? "bg-[#4a4a4a] text-white"
                                : "text-zinc-400"
                            }`}
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative w-64">
                <button
                  onClick={() => setIsDateModalOpen(true)}
                  className="flex items-center justify-between w-full bg-[#333332] px-3 py-2 rounded-lg cursor-pointer w-[175px] h-[42px]"
                >
                  <span className="text-zinc-400">{renderDateLabel()}</span>
                  <MdExpandMore className="text-lg text-white" />
                </button>

                {isDateModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
                    <div
                      className="rounded-t-3xl shadow-xl w-full max-w-[400px] bg-[#333332]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))",
                      }}
                    >
                      <div className="flex justify-between items-center px-4 py-3 bg-[#333332] rounded-t-xl">
                        <button
                          className="text-zinc-400 hover:text-zinc-300 transition-colors"
                          onClick={() => setIsDateModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <h2 className="text-zinc-400 font-medium">Choose a date</h2>
                        <button
                          className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                          onClick={handleDateConfirm}
                        >
                          Confirm
                        </button>
                      </div>

                      <div className="flex w-full">
                        <div className="flex-1">
                          <div className="w-full text-center text-zinc-400 py-2">Year</div>
                          <div className="h-[160px] relative overflow-hidden" ref={yearRef}>
                            <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                              <div className="h-[60px]"></div>
                              {years.map((year) => (
                                <div
                                  key={year}
                                  className={`h-[40px] flex items-center justify-center text-center ${
                                    parseInt(selectedDateRange.startDate?.getFullYear()) === year ||
                                    (!selectedDateRange.startDate && year === currentDate.getFullYear())
                                      ? "text-white font-medium"
                                      : "text-zinc-400"
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
                          <div className="w-full text-center text-zinc-400 py-2">Month</div>
                          <div className="h-[160px] relative overflow-hidden" ref={monthRef}>
                            <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                              <div className="h-[60px]"></div>
                              {months.map((month) => {
                                const monthNum = parseInt(month) - 1;
                                const isSelected =
                                  selectedDateRange.startDate?.getMonth() === monthNum ||
                                  (!selectedDateRange.startDate && monthNum === currentDate.getMonth());
                                return (
                                  <div
                                    key={month}
                                    className={`h-[40px] flex items-center justify-center text-center ${
                                      isSelected ? "text-white font-medium" : "text-zinc-400"
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
                          <div className="w-full text-center text-zinc-400 py-2">Day</div>
                          <div className="h-[160px] relative overflow-hidden" ref={dayRef}>
                            <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                              <div className="h-[60px]"></div>
                              {days.map((day) => {
                                const year = selectedDateRange.startDate?.getFullYear() || currentDate.getFullYear();
                                const month =
                                  (selectedDateRange.startDate?.getMonth() || currentDate.getMonth()) + 1;
                                const selectedDate = new Date(year, month - 1, day);
                                const isSelected =
                                  selectedDateRange.startDate?.getDate() === day ||
                                  (!selectedDateRange.startDate && day === currentDate.getDate());
                                const isFuture = selectedDate > currentDate;
                                return (
                                  <div
                                    key={day}
                                    className={`h-[40px] flex items-center justify-center text-center ${
                                      isFuture
                                        ? "text-zinc-400 cursor-not-allowed"
                                        : isSelected
                                        ? "text-white font-medium"
                                        : "text-zinc-400"
                                    } cursor-pointer`}
                                    onClick={() => !isFuture && handleDateSelect("day", day)}
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

            <div
              className="rounded-lg shadow-md mt-4 max-h-screen overflow-y-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading ? (
                <div className="text-white text-center p-4">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">{error}</div>
              ) : filteredDeposits.length === 0 ? (
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
                <div className="space-y-4">
                  {filteredDeposits.map((deposit) => {
                    const orderId = `RC${deposit.created_at.replace(/[-T:Z]/g, "")}${deposit.id}`; // Generate a mock order ID
                    return (
                      <div key={deposit.id} className="bg-[#333332] p-2 rounded-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white">
                          <button className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-1.5 rounded-lg transition-colors">
                            Deposit
                          </button>
                          <span
                            className={`${
                              deposit.status === "completed"
                                ? "text-emerald-500"
                                : deposit.status === "pending"
                                ? "text-[#5080D3]"
                                : "text-red-500"
                            }`}
                            style={{textTransform:'capitalize'}}
                          >
                            {deposit.status === "pending"  ? "To be paid": deposit.status }
                          </span>
                        </div>
                        <div className="space-y-2 text-zinc-400 mt-4">
                          <div className="flex justify-between">
                            <span>Balance</span>
                            <span className="text-amber-500">
                              ₹{(parseFloat(deposit?.amount || '0') + parseFloat(deposit?.bonus_amount || '0')).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Type</span>
                            <span className="text-white">{deposit.payment_method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time</span>
                            <span className="text-white">{formatDate(deposit.created_at)}</span>
                          </div>
                          <div className="flex justify-between items-center relative">
                            <span>Order number</span>
                            <div className="flex items-center gap-1 max-w-[60%]">
                              <span className="text-white truncate">{orderId}</span>
                              <button
                                onClick={() => handleCopy(orderId)}
                                className="p-2 rounded flex-shrink-0"
                              >
                                <MdContentCopy className="text-lg" />
                              </button>
                              {copiedOrderId === orderId && (
                                <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-black text-white text-sm px-3 py-1 rounded shadow-md z-10 flex items-center gap-2 transition-opacity duration-300">
                                  <img
                                    src={whitetick}
                                    alt="Copied"
                                    className="w-4 h-4 object-contain"
                                  />
                                  <span>Copied</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-4 mt-4 mb-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg ${
                    page === 1 ? "bg-gray-500" : "bg-[#fae59f] text-[#8f5206]"
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
                  className={`px-4 py-2 rounded-lg ${
                    page === pagination.pages ? "bg-gray-500" : "bg-[#fae59f] text-[#8f5206]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
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

    .calendar-scroll::-webkit-scrollbar {
      width: 8px;
    }
    
    .calendar-scroll::-webkit-scrollbar-track {
      background: #2a2a2a;
    }
    
    .calendar-scroll::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    
    .calendar-scroll::-webkit-scrollbar-thumb:hover {
      background: #555;
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

  export default DepositHistory;