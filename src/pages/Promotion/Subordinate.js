import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import Search from "../../Assets/search.png";
import SubordinateHeader from "../../components/SubordinateHeader";
import { MdExpandMore } from "react-icons/md";
import apiServices from "../../api/apiServices";
import { useNavigate } from 'react-router-dom';
function Subordinate() {
  const uid = "14480808";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false); // New state for "All" modal
  const [selectedDate, setSelectedDate] = useState({
    year: "2025",
    month: "04",
    day: "05",
  });
  const [userCounts, setUserCounts] = useState({});
  const [selectedTier, setSelectedTier] = useState("All"); // Track selected tier
  const [data, setData] = useState(null)
  const [searchUid, setSearchUid] = useState(""); // for search input
  const [searchResult, setSearchResult] = useState(null); // for found user

  const navigate = useNavigate()

  const fetchData = async () => {
    let data = await apiServices.getReferralTeam()
    setData(data?.teamReferrals)
    const counts = {};

    Object.entries(data?.teamReferrals).forEach(([levelKey, users]) => {
      counts[levelKey] = users?.length ?? 0;
    });
    console.log(counts)

    setUserCounts(counts)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    if (!searchUid || !data){
       setSearchResult(null)
       setSearchUid("")
    };
    

    for (const [levelKey, users] of Object.entries(data)) {
      const found = users.find((user) => user.user_id === Number(searchUid));
      if (found) {
        setSearchResult({ ...found, level: levelKey });
        return;
      }
    }

    // If not found
    setSearchResult("not-found");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uid);
    alert("UID copied!");
  };

  const openDateModal = () => {
    setIsModalOpen(true);
  };

  const openAllModal = () => {
    setIsAllModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAllModalOpen(false); // Close both modals
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

  // Handle tier selection
  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <SubordinateHeader />

      <div className="bg-[#242424] p-3 w-full max-w-md mx-auto flex flex-col mt-12">
        {/* Search Input */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search subordinate UID"
            value={searchUid}
            onChange={(e) => setSearchUid(e.target.value)}
            className="w-full bg-[#333332] text-[#a8a5a1] p-3 rounded-lg pr-10 outline-none focus:ring-2 transition-all text-base"
          />
          <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg">
            <img src={Search} alt="Search" className="w-16 h-8 md:w-20 md:h-10" />
          </button>
        </div>
      </div>


      {/* Filter Options */}
      <div className="flex gap-2 mb-3 text-[#f5f3f0]">
        <details className="relative w-1/2" onClick={(e) => { e.preventDefault(); openAllModal(); }}>
          <summary className="bg-[#333332] p-2.5 rounded-lg cursor-pointer transition-colors flex justify-between items-center list-none appearance-none text-sm">
            <span className="mx-auto">{selectedTier}</span>
            <MdExpandMore className="text-gray-400 absolute right-2" />
          </summary>
        </details>
        <details className="relative w-1/2" onClick={(e) => { e.preventDefault(); openDateModal(); }}>
          <summary className="bg-[#333332] p-2.5 rounded-lg cursor-pointer transition-colors flex justify-between items-center list-none appearance-none text-sm">
            <span className="mx-auto">
              {`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`}
            </span>
            <MdExpandMore className="text-gray-400 absolute right-2" />
          </summary>
        </details>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 grid-rows-3 mb-3 bg-[#4d4d4c] py-3 rounded-lg">
        {/* Row 1 */}
        <div className="border-r border-[#a8a5a13f] h-14 flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            0
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Deposit number
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            0
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Deposit amount
          </div>
        </div>

        {/* Row 2 */}
        <div className="border-r border-[#a8a5a13f] h-14 flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            0
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Number of bettors
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            0
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Total bet
          </div>
        </div>

        {/* Row 3 */}
        <div className="border-r border-[#a8a5a13f] h-14 flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            0
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Number of people making first deposit
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            0
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            First deposit amount
          </div>
        </div>
      </div>

      {/* Level Stats Section */}
      <div className="grid grid-cols-2 grid-rows-3 mb-3 bg-[#4d4d4c] py-3 rounded-lg">
        {/* Row 1 */}
        <div className="border-r border-[#a8a5a13f] h-14 flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            {userCounts?.level1}
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Level 1
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            {userCounts?.level2}
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Level 2
          </div>
        </div>

        {/* Row 2 */}
        <div className="border-r border-[#a8a5a13f] h-14 flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            {userCounts?.level3}
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Level 3
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            {userCounts?.level4}
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Level 4
          </div>
        </div>

        {/* Row 3 */}
        <div className="border-r border-[#a8a5a13f] h-14 flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            {userCounts?.level5}
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Level 5
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-bold text-center text-[#f5f3f0] mb-1">
            {userCounts?.level6}
          </div>
          <div className="text-xs text-center font-semibold text-[#a8a5a1] px-1">
            Level 6
          </div>
        </div>
      </div>

      {/* UID Details */}

      {searchUid && searchResult === "not-found" && (
        <div className="text-red-400 font-medium mb-4">No user found with UID: {searchUid}</div>
      )}

      {searchResult && searchResult !== "not-found" ? (
        <div className="bg-[#333332] rounded-lg p-3 mb-3">
          <div className="flex justify-start items-center mb-2">
            <span className="text-[#f5f3f0]">UID: {searchResult?.user_id}</span>
          </div>

          <hr className="border-[#666462] mb-2" />

          <div className="flex justify-between items-center py-1">
            <span className="text-[#a8a5a1]">Level</span>
            <span className="text-[#a8a5a1]">{searchResult?.level?.replace("level", "")}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-[#a8a5a1]">Deposit amount</span>
            <span className="text-[#dd9138]">{searchResult?.actual_deposit_amount ?? 0}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-[#a8a5a1]">Commission</span>
            <span className="text-[#dd9138]">{searchResult?.commission_earned ?? 0}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-[#a8a5a1]">Time</span>
            <span className="text-[#666462]">{searchResult?.created_at?.split("T")[0]}</span>
          </div>
        </div>
      ) : (
        // ✅ Only show default list if not searching
        data && Object.entries(data).map(([levelKey, users], levelIndex) => {
          const user = users?.[0];
          if (!user) return null;

          return (
            <div key={levelKey} className="bg-[#333332] rounded-lg p-3 mb-3">
              <div className="flex justify-start items-center mb-2">
                <span className="text-[#f5f3f0]">UID: {user?.user_id}</span>
              </div>

              <hr className="border-[#666462] mb-2" />

              <div className="flex justify-between items-center py-1">
                <span className="text-[#a8a5a1]">Level</span>
                <span className="text-[#a8a5a1]">{levelIndex + 1}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#a8a5a1]">Deposit amount</span>
                <span className="text-[#dd9138]">{user?.actual_deposit_amount ?? 0}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#a8a5a1]">Commission</span>
                <span className="text-[#dd9138]">{user?.commission_earned ?? 0}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#a8a5a1]">Time</span>
                <span className="text-[#666462]">{user?.created_at?.split("T")[0]}</span>
              </div>

              <button
                onClick={() => navigate(`/subordinate/level/${levelIndex + 1}`, { state: users })}
                className="w-full border border-[#dd9138] text-[#dd9138] rounded-full py-2 mt-1 hover:bg-[#dd9138] hover:text-black transition"
              >
                View All Level {levelIndex + 1}
              </button>
            </div>
          );
        })
      )}



      {/* No More Data */}
      {/* {Object.entries(data)?.length < 1 && <div className="text-center text-[#f5f3f0] py-2">No more</div>} */}


      {/* Modal for Date Selection */}
      {
        isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">

            <div
              className="rounded-t-3xl shadow-xl w-full max-w-[400px] bg-[#333332]"
              style={{
                background: 'linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))'
              }}
            >
              <div className="flex justify-between items-center px-4 py-3  bg-[#333332]">
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
                          className={`h-[40px] flex items-center justify-center text-center ${parseInt(selectedDate.year) === year
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
                          className={`h-[40px] flex items-center justify-center text-center ${selectedDate.month === month
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
                          className={`h-[40px] flex items-center justify-center text-center ${selectedDate.day === day
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
        )
      }

      {/* Modal for "All" Dropdown */}
      {
        isAllModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50">
            <div
              className="rounded-t-3xl shadow-xl w-full max-w-[400px]"
              style={{
                background: 'linear-gradient(180deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4)), linear-gradient(0deg, rgba(32, 29, 43, 0.9), rgba(32, 29, 43, 0.4))'
              }}
            >
              <div className="flex justify-between items-center px-4 py-3  rounded-t-xl bg-[#333332]">
                <button
                  className="text-gray-400  transition-colors"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <h2 className="text-white font-medium">Select Tier</h2>
                <button
                  className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                  onClick={closeModal}
                >
                  Confirm
                </button>
              </div>

              {/* Tier Options */}
              <div className="flex flex-col">
                {["All", "Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Tier 6"].map((tier) => (
                  <div
                    key={tier}
                    className={`px-4 py-3 text-center text-sm cursor-pointer ${selectedTier === tier
                      ? "bg-[#333332] text-white"
                      : "text-gray-500 hover:bg-[#333332] hover:text-white"
                      }`}
                    onClick={() => handleTierSelect(tier)}
                  >
                    {tier}
                  </div>
                ))}
              </div>

              <div className="h-4"></div>
            </div>
          </div>
        )
      }


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
    </div >
  );
}

export default Subordinate;