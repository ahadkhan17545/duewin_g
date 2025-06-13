import React from "react";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900">
      <div className="w-full max-w-xl px-4">
        {/* SVG Placeholder */}
        <div className="w-40 h-40 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
          <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 19V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22h6M12 17v5"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* No Data Text */}
        <p className="text-gray-400 mt-2 text-center">No data</p>
      </div>
    </div>
  );
};

export default NoData;
