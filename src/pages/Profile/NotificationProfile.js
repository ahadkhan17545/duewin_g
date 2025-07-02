import React, { useState } from "react";
import Footer from "../../components/Footer";
import NotificationHeader from "../../components/NotificationHeader";
import Notification from "../../Assets/notification.png";
import Delete from "../../Assets/delete.png";
import CommanHeader from "../../components/CommanHeader";

function NotificationProfile() {
  const [showPopup, setShowPopup] = useState(false);

  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-IN", { hour12: false });
  };

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <CommanHeader title="Notifications" />

      <div className="bg-[#242424] p-4 w-full  h-full flex flex-col">
        <div className="bg-[#333332] px-4 py-2 mt-14 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <img src={Notification} alt="File Icon" className="w-5 h-4 mr-1" />
            <p className="text-white text-[15px] mr-24 font-semibold">LOGIN NOTIFICATION</p>
            <img
              src={Delete}
              alt="Delete Icon"
              className="w-5 h-5 ml-6 cursor-pointer"
              onClick={() => setShowPopup(true)}
            />
          </div>

          {/* Date and Time */}
          <p className="text-[#666462] text-xs mb-2">{formatDateTime()}</p>

          {/* Notification Text */}
          <p className="text-[#a8a5a1] text-xs mr-18 mt-1">
            Your account is logged in on {formatDateTime()}
          </p>
        </div>
      </div>

      <Footer />

      {/* Delete Confirmation Pop-up */}
      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div className="bg-[#333332] w-80 rounded-xl shadow-lg text-white">
      <div className="p-4 text-center text-lg font-semibold">Warning</div>
      <p className="text-center text-sm text-[#a8a5a1] px-4 pb-4 mb-2">
        Are you sure to delete this message?
      </p>
      <div className="flex">
        <button
          className="w-1/2 px-3 py-3 text-center bg-[#6c6c75] text-lg rounded-bl-2xl text-white"
          onClick={() => setShowPopup(false)}
        >
          Cancel
        </button>
        <button
          className="w-1/2 px-3 py-3 text-center bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-[#8f5206] text-lg rounded-br-2xl"
          onClick={() => {
            setShowPopup(false);
           
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default NotificationProfile;