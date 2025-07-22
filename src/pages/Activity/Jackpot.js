import React, { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import RebateHeader from '../../components/RebateHeader';
import realtimecounticon from '../../Assets/realtimecounticon.png';
import rebateicon from "../../Assets/rebateicon.png";
import moment from 'moment'
import img1 from "../../Assets/lottery1.png";
import img2 from "../../Assets/casino1.png";
import img3 from "../../Assets/sport1.png";
import img4 from "../../Assets/rummy1.png";
import img5 from "../../Assets/slot1.png";
import img6 from "../../Assets/finalicons/allicon.png"

import activeImg1 from "../../Assets/Lottery2.png";
import activeImg2 from "../../Assets/casino2.png";
import activeImg3 from "../../Assets/sport2.png";
import activeImg4 from "../../Assets/rummy2.png";
import activeImg5 from "../../Assets/slot2.png";
import activeImg6 from "../../Assets/finalicons/allicon2.png"

import verticalLineImage from '../../Assets/gameStatsSteps.png';
import succeed from '../../Assets/succeed.png';
import apiServices from '../../api/apiServices';
import CommanHeader from '../../components/CommanHeader';

const Jackpot = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0); // Default to first tab selected
  const scrollRef = useRef(null);
  const [rebateHistory, setRebateHistory] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rebateStats, setRebateStats] = useState(null)
  const scrollContainerRef = useRef(null);

  // Function to scroll selected item to center
  const scrollToCenter = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = container.children[index];

      if (item) {
        const containerWidth = container.offsetWidth;
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;

        // Calculate scroll position to center the item
        const scrollPosition = itemLeft - containerWidth / 2 + itemWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };
  useEffect(() => {
    scrollToCenter(selectedTab);
  }, [selectedTab]);

  const fetchRebate = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await apiServices.getRebateHistory(page, 10);

      if (page === 1) {
        setRebateHistory(data?.history || []);
      } else {
        setRebateHistory(prev => [...prev, ...(data?.history || [])]);
      }

      setCurrentPage(data.pagination.currentPage);
      setHasNextPage(data.pagination.hasNextPage);
    } catch (err) {
      console.error("Failed to fetch rebate history", err);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchRebateStats = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await apiServices.getRebateHistoryStats();
      setRebateStats(data?.summary)
    } catch (err) {
      console.error("Failed to fetch rebate history", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRebate(1)
    fetchRebateStats()
  }, [])
  const images = [img6, img1];
  const activeImages = [activeImg6, activeImg1];
  const tabNames = ["Original", "Provider"];

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Horizontal Scroll Handler
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Tab selection handler
  const handleTabClick = (index) => {
    setSelectedTab(index);
  };
  const handleShowMore = () => {
    if (hasNextPage && !isLoading) {
      fetchRebate(currentPage + 1);
    }
  };


  return (
    <div className="w-full flex justify-center bg-[#242424] min-h-screen text-white overflow-x-hidden">
      <div className="w-[450px] bg-[#242424] text-white rounded-lg overflow-y-auto min-h-screen p-2">
        <CommanHeader title='Rebate' />

        {/* Tab Images with Selection */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto space-x-2 py-4 px-2 mt-2 scrollbar-hide"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={`flex flex-col items-center flex-shrink-0 cursor-pointer rounded-lg px-10 mt-6 py-1 ${selectedTab === index ? '' : 'bg-[#333332]'
                }`}
              style={
                selectedTab === index
                  ? { background: 'linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)' }
                  : {}
              }
              onClick={() => handleTabClick(index)}
            >
              <img
                src={selectedTab === index ? activeImages[index] : img}
                alt={tabNames[index]}
                className="w-[24px] h-[24px] object-contain mb-1" // Smaller image size like in the provided image
              />
              <span className={`text-xs ${selectedTab === index ? 'text-black' : 'text-gray-400'
                }`}>
                {tabNames[index]}
              </span>
            </div>
          ))}
        </div>

        {/* Grey Box */}
        <div className="max-w-[420px] w-full bg-[#333332] rounded-lg  p-2 shadow-lg">
          <span className="text-white text-[14px]">All-Total betting rebate</span>

          <div className="mb-2">
            <div className="inline-flex items-center space-x-2 border py-1 border-[#d9ac4f] rounded w-fit">
              <img src={realtimecounticon} alt="shield" className="h-5 w-5 ml-2" />
              <span className="text-[#d9ac4f] text-sm font-normal pr-2">Real-time count</span>
            </div>
          </div>

          <div className="flex items-center mb-2">
            <img src={rebateicon} alt='rebate' className='w-7 h-7 mt-1 mr-2'></img>
            <span className="text-xl font-semibold text-white">{rebateStats?.totalRebateAmount}</span>
          </div>

          <div className="bg-[#4d4d4c] p-2 rounded w-4/5 mb-2 text-[#a8a5a1] text-xs">
            Upgrade VIP level to increase rebate rate
          </div>

          <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="bg-[#4d4d4c] p-2 rounded">
              <div className="text-[#a8a5a1] text-xs">Today rebate</div>
              <div className="text-[#dd9138] text-lg font-medium">{rebateStats?.todayRebateAmount}</div>
            </div>
            <div className="bg-[#4d4d4c] p-2 rounded">
              <div className="text-[#a8a5a1] text-xs">Total rebate</div>
              <div className="text-[#dd9138] text-lg font-medium">{rebateStats?.totalRebates}</div>
            </div>
          </div>

          <div className="text-[#a8a5a1] text-xs mb-2">
            Automatic code washing at 01:00:00 every morning
          </div>

          <button
            className="w-full bg-[#6f7381] text-white p-1.5 text-lg rounded-full text-[15px]"
            onClick={openPopup}
          >
            One-Click Rebate
          </button>
        </div>

        {/* Rebate history section */}
        <div className="p-2 max-w-[420px] w-full text-white mt-1">
          <div className="flex items-center mb-4">
            <div className="w-1 h-5 bg-yellow-300 mr-2"></div>
            <h2 className="text-white font-medium text-[18px]">Rebate history</h2>
          </div>
          {rebateHistory?.length > 0 &&
            rebateHistory?.map((rebate, index) => {
              return (
                <div key={index} className="bg-[#333332] rounded-lg p-2 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[15px] font-bold">Lottery ({rebate?.gameType == "wingo" ? "Win Go" : rebate?.gameType })</span>
                    <span className="text-green-500 text-[15px]">Completed</span>
                  </div>
                  <div className="text-gray-400 text-xs mb-1">{moment(rebate?.createdAt).format("DD-MM-YYYY hh:mm A")}</div>
                  <hr className="border-gray-700 mb-4" />

                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <img
                        style={{ marginTop: '-3px' }}
                        src={verticalLineImage}
                        alt="Timeline"
                        className="h-20 object-contain"
                      />
                    </div>

                    <div className="flex-grow space-y-4 -mt-1">
                      <div className="flex items-center justify-between">
                        <span className='text-xs'>Betting rebate</span>
                        <span className="text-white text-xs">{rebate?.betAmount}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className='text-xs'>Rebate rate</span>
                        <span className="text-red-400 text-xs">{rebate?.rate}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className='text-xs'>Rebate amount</span>
                        <span className="text-[#d9ac4f] text-xs">{rebate?.rebateAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }

        </div>
        {hasNextPage && (
          <button
            className="w-full border border-[#d9ac4f] text-[#d9ac4f] p-2 rounded-full disabled:opacity-50"
            onClick={handleShowMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Show More"}
          </button>
        )}

      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-[#2A2A2A] rounded-xl max-w-xs w-full mx-4 overflow-visible shadow-lg min-h-[280px] p-4 mt-2">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={succeed}
                alt="Success"
                className="w-38 h-24"
              />
            </div>

            <div className="pt-16 flex flex-col items-center">
              <h3 className="text-white text-2xl font-semibold mb-1">All-Betting rebate</h3>
              <p className="text-gray-400 text-center text-sm mb-6">
                All users will get rebate automatically.
              </p>
              {/* <p className="text-white text-base mb-6">
                Rebate amount: <span className="text-yellow-400">0.06</span>
              </p> */}

              <button
                onClick={closePopup}
                className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-full text-center text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jackpot;