import React, { useEffect, useState } from "react";
import { HiSpeakerphone } from "react-icons/hi";
import speakernew from "../../Assets/speakernew.png"

import NotificationServiceHeader from "../../components/NotificationServiceHeader";
import CommanHeader from "../../components/CommanHeader";
import apiServices from "../../api/apiServices";

function NotificationsService() {
  const [data, setData] = useState([])
  const fetchData = async () => {
    try {
      let data = await apiServices.getAnnouncements();
      if (data?.success) {
        setData(data?.data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col">
      <CommanHeader title="Announcement" />
      <div className="px-4">
        <div className="text-gray-300 mt-14 rounded-lg space-y-4">
          {data && data?.map((item, index) => {
            return (
              <details key={index} className="group cursor-pointer">
                <summary className="flex bg-[#333332] items-start gap-2 p-1 rounded-lg transition-all">
                  <img src={speakernew} alt="icon" className="w-6 h-6 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-[16px] text-white">{item?.title}</h3>
                    <p className="text-xs text-[#a8a5a1] mt-3">
                      {item?.content}
                    </p>
                    <div className="text-xs text-gray-500 mt-2"><span className="text-xs text-gray-400">
                      {new Date(item?.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    </div>
                  </div>
                </summary>
              </details>
            )
          })}

          {/* <details className="group cursor-pointer">
            <summary className="flex bg-[#333332] items-start gap-2  p-3 rounded-lg transition-all">
              <img src={speakernew} alt="icon" className="w-6 h-6 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium">About Recharge - BDGGame Notify</h3>
                <p className="text-xs text-[#a8a5a1] mt-3">
                  For quicker deposits, use your last payment card. If funds went to an old one, recharge again. Visit BDGGame for a new UP account and follow the steps.
                </p>


                <div className="text-xs text-gray-500 mt-2">23 Feb 2025, 12:45 PM</div>
              </div>
            </summary>
          </details> */}

          <div className="text-center text-gray-400">No more</div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsService;
