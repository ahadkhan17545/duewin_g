import React, { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroll-component";
import VIPHistoryHeader from "../../components/VIPHistoryHeader";
import apiServices from "../../api/apiServices";
import CommanHeader from "../../components/CommanHeader";

function VIPHistory() {
  const [allHistoryData, setAllHistoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load only once when component mounts
  useEffect(() => {
    fetchVipHistoryData(1);
  }, []);

  const fetchVipHistoryData = async (pageNumber) => {
    try {
      const res = await apiServices.getVipHistoryData(pageNumber);
      const newHistory = res?.data?.history || [];
      const totalPages = res?.data?.pagination?.total_pages;

      setAllHistoryData((prev) =>
        pageNumber === 1 ? newHistory : [...prev, ...newHistory]
      );
      setHasMore(pageNumber < totalPages);
    } catch (err) {
      console.error("Error fetching VIP history:", err);
    }
  };

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVipHistoryData(nextPage);
  };

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <CommanHeader title="History" />

      <div className="px-4 py-6 mt-10">
        <InfiniteScroll
          dataLength={[]}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4 className="text-white">Loading more...</h4>}
          endMessage={
            <p className="text-gray-400 text-center mt-4">
              <b>No more history to show</b>
            </p>
          }
        >
          {allHistoryData &&
            allHistoryData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col bg-[#1a1a1a] p-4"
                  style={{
                    borderBottom:
                      index !== allHistoryData.length - 1
                        ? "1px solid gray"
                        : "none",
                  }}
                >
                  <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-roboto text-[15px]">
                    Experience Bonus
                  </span>
                  <span className="text-sm text-gray-400 font-roboto">
                    Betting EXP
                  </span>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1 font-roboto text-xs text-gray-400">
                      <FiClock className="text-gray-400 text-sm" />
                      {String(item?.date)}
                    </span>
                    <span className="text-green-500 font-roboto text-sm">
                      {String(item?.exp_gained)} EXP
                    </span>
                  </div>
                </div>
              );
            })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default VIPHistory;
