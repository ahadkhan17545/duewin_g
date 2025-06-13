import React, { useState, useRef, useEffect } from "react";
import { MdExpandMore } from "react-icons/md";
import CommissionDetailHeader from "../../components/CommissionDetailHeader";

function CommissionDetailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    year: "2025",
    month: "01",
    day: "15",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Generate arrays for years, months, and days
  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  // Refs for scrollable containers
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);

  // Function to handle date selection and scrolling
  const handleDateSelect = (type, value) => {
    setSelectedDate((prev) => ({
      ...prev,
      [type]: value.toString().padStart(2, "0"),
    }));

    const containerRef =
      type === "year" ? yearRef.current :
      type === "month" ? monthRef.current :
      dayRef.current;

    const items = type === "year" ? years :
                  type === "month" ? months : days;

    const selectedIndex = items.findIndex(item =>
      item.toString() === value.toString().padStart(2, "0"));

    if (containerRef && selectedIndex !== -1) {
      const rowHeight = 40;
      containerRef.scrollTop = selectedIndex * rowHeight + 60;
    }
  };

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <CommissionDetailHeader />

      <div className="px-4 py-6">
        <div className="w-full max-w-md mx-auto text-gray-200 mt-10">
          <details className="group" onClick={(e) => { e.preventDefault(); openModal(); }}>
            <summary className="flex items-center bg-[#333332] rounded-lg justify-between px-4 py-3 cursor-pointer">
              <span className="text-[#a8a5a1]">{`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`}</span>
              <MdExpandMore className="transition-transform group-open:rotate-180" />
            </summary>

            <div className="p-4 space-y-3 mt-4 rounded-lg bg-[#333332]">
              <div className="flex flex-col gap-1">
                <div className="text-[#a8a5a1] text-sm font-semibold">
                  Settlement successful
                </div>
                <div className="text-[#a8a5a1] text-sm font-semibold">
                  2025-01-16 02:06:11
                </div>
                <div className="text-[#a8a5a1] text-sm font-semibold">
                  The commission has been automatically credited to your balance
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 px-3 bg-[#4d4d4c] rounded">
                  <span className="text-[#a8a5a1] text-sm">Number of bettors</span>
                  <span className="text-[#f5f3f0] font-semibold">1 People</span>
                </div>

                <div className="flex justify-between py-2 px-3 bg-[#4d4d4c] rounded">
                  <span className="text-[#a8a5a1] text-sm">Bet amount</span>
                  <span className="text-[#f5f3f0] font-semibold">10</span>
                </div>

                <div className="flex justify-between py-2 px-3 bg-[#4d4d4c] rounded">
                  <span className="text-[#a8a5a1] text-sm">Commission payout</span>
                  <span className="text-[#dd9138] font-semibold">0.06</span>
                </div>

                <div className="flex justify-between py-2 px-3 bg-[#4d4d4c] rounded">
                  <span className="text-[#a8a5a1] text-sm">Date</span>
                  <span className="text-[#f5f3f0] font-semibold">
                    2025-01-15 00:00:00
                  </span>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Modal for Date Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
          <div
            className="rounded-t-3xl shadow-xl w-full max-w-[400px] bg-[#333332]"
            style={{
              background: 'linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))'
            }}
          >
            <div className="flex justify-between items-center px-4 py-3 bg-[#333332] rounded-t-xl">
              <button
                className="text-gray-400 hover:text-gray-300 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <h2 className="text-white font-medium">Choose a date</h2>
              <button
                className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                onClick={closeModal}
              >
                Confirm
              </button>
            </div>

            {/* Date Picker */}
            <div className="flex w-full">
              {/* Year Column */}
              <div className="flex-1">
                <div className="w-full text-center text-gray-500 py-2">Year</div>
                <div
                  className="h-[160px] relative overflow-hidden"
                  ref={yearRef}
                >
                  <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                  <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                    <div className="h-[60px]"></div>
                    {years.map((year) => (
                      <div
                        key={year}
                        className={`h-[40px] flex items-center justify-center text-center ${
                          parseInt(selectedDate.year) === year
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

              {/* Month Column */}
              <div className="flex-1">
                <div className="w-full text-center text-gray-500 py-2">Month</div>
                <div
                  className="h-[160px] relative overflow-hidden"
                  ref={monthRef}
                >
                  <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                  <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                    <div className="h-[60px]"></div>
                    {months.map((month) => (
                      <div
                        key={month}
                        className={`h-[40px] flex items-center justify-center text-center ${
                          selectedDate.month === month
                            ? "text-white font-medium"
                            : "text-gray-500"
                        } cursor-pointer`}
                        onClick={() => handleDateSelect("month", month)}
                      >
                        {month}
                      </div>
                    ))}
                    <div className="h-[60px]"></div>
                  </div>
                </div>
              </div>

              {/* Day Column */}
              <div className="flex-1">
                <div className="w-full text-center text-gray-500 py-2">Day</div>
                <div
                  className="h-[160px] relative overflow-hidden"
                  ref={dayRef}
                >
                  <div className="absolute w-full h-[40px] top-[60px] bg-[#2C2C2C] z-0"></div>
                  <div className="absolute inset-0 overflow-y-auto hide-scrollbar">
                    <div className="h-[60px]"></div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className={`h-[40px] flex items-center justify-center text-center ${
                          selectedDate.day === day
                            ? "text-white font-medium"
                            : "text-gray-500"
                        } cursor-pointer`}
                        onClick={() => handleDateSelect("day", day)}
                      >
                        {day}
                      </div>
                    ))}
                    <div className="h-[60px]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4"></div>
          </div>
        </div>
      )}

      {/* Add custom CSS for hiding scrollbars */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default CommissionDetailPage;