import React, { useState } from "react";
import { HiSpeakerphone } from "react-icons/hi";
import speakernew from "../../Assets/speakernew.png"

import NotificationServiceHeader from "../../components/NotificationServiceHeader";

function NotificationsService() {

  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col">
      <NotificationServiceHeader />
      <div className="px-4">
        <div className="text-gray-300 mt-14 rounded-lg space-y-4">
          <details className="group cursor-pointer">
            <summary className="flex bg-[#333332] items-start gap-2 p-1 rounded-lg transition-all">
              <img src={speakernew} alt="icon" className="w-6 h-6 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg text-white">About Withdrawal - BDGGame Notify</h3>
                  <p className="text-xs text-[#a8a5a1] mt-3">
                    Please Fill In The Correct Bank Card Information. The Platform Will Process Withdrawals Within 1-24 Hours Or More. The Withdrawal Status Is "Completed" And The Transaction Has Been Approved By The Platform. The Bank Will Complete The Transfer Within 1-7 Working Days, But Delays May Occur, Especially During Holidays. But You Are Guaranteed To Receive Your Funds.
                  </p>
                <div className="text-xs text-gray-500 mt-2">23 Feb 2025, 10:30 AM</div>
              </div>
            </summary>
          </details>

          <details className="group cursor-pointer">
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
          </details>

          <div className="text-center text-gray-400">No more</div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsService;
