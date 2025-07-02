import React, { useEffect, useState } from "react";
import GiftHeader from "../../components/GiftHeader";
import Giftbg from "../../Assets/giftbg.png";
import iconhistory from "../../Assets/iconhistory.png";
import empty from "../../Assets/empty.png";
import CommanHeader from "../../components/CommanHeader";
import apiServices from "../../api/apiServices";

const Gift = () => {
  const [giftCode, setGiftCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [giftHistory, setGiftHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchGiftHistory();
  }, [page]);

  const fetchGiftHistory = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      const res = await apiServices.getAllGifts(params);

      if (res?.success) {
        setGiftHistory(res.data?.claims || []);
        setPagination(res.data?.pagination || {});
      }
    } catch (error) {
      console.error("Failed to fetch gift history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");

      if (!giftCode.trim()) {
        setErrorMessage("Please enter a valid gift code");
        return;
      }

      const payload = { code: giftCode };
      const data = await apiServices.addGift(payload);

      if (data?.success) {
        setGiftCode("");
        setErrorMessage("");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Invalid gift code");
    }
  };

  return (
    <div className="bg-[#242424] min-h-screen w-full flex overflow-x-hidden mt-12">
      <div className="w-full max-w-full md:max-w-[400px] mx-auto p-0 box-border">
        <CommanHeader title="Gift" />
        {/* Image Section */}
        <div className="w-full">
          <img
            src={Giftbg}
            alt="Gift background"
            className="w-full h-[200px] object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full px-3 py-4">
          {/* Gift Code Section */}
          <div className="bg-[#333332] p-4 rounded-lg mb-4">
            <div className="flex flex-col items-start">
              <h2 className="text-sm font-semibold text-[#a8a5a1]">Hi</h2>
              <h2 className="text-sm font-semibold text-[#a8a5a1]">
                We have a gift for you
              </h2>
            </div>

            <div className="flex flex-col items-start mt-8">
              <h2 className="text-sm font-semibold text-[#f5f3f0]">
                Please enter the gift code below
              </h2>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                placeholder="Please enter gift code"
                className="w-full bg-[#242424] py-3 px-6 rounded-full text-white outline-none border-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={giftCode.length < 1}
              className="mt-8 mb-4 w-full py-3 rounded-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206]"
            >
              Receive
            </button>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          {/* History Section */}
          <div className="bg-[#333332] p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img
                src={iconhistory}
                alt="History icon"
                className="w-5 h-5 mr-2 object-cover"
              />
              <h2 className="text-lg text-[#f5f3f0]">History</h2>
            </div>
            {loading ? (
              <p className="text-white text-center">Loading...</p>
            ) : giftHistory?.length === 0 ? (
              <div
                className="flex items-center justify-center min-h-[300px]"
                style={{ flexDirection: "column" }}
              >
                <img
                  src={empty}
                  alt="No Data"
                  className="w-48 h-52 object-contain"
                />
                <p className="text-gray-500" style={{marginTop:'-50px'}}> No Data</p>
              </div>
            ) : (
              <ul className="space-y-3 mt-4">
                {giftHistory &&
                  giftHistory?.map((item) => (
                    <li
                      key={item.id}
                      className="border-b border-[#555] pb-2 text-white"
                    >
                      <p className="text-sm">{item.code}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {pagination.pages > 0 && (
            <div className="flex justify-center gap-4 mt-4 mb-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-[#fae59f] text-[#8f5206]"
                }`}
              >
                Previous
              </button>

              <span className="text-white">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={page === pagination.pages}
                className={`px-4 py-2 rounded-lg ${
                  page === pagination.pages
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
    </div>
  );
};

export default Gift;
