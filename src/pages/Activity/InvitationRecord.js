import React from 'react';
import InvitationRecordHeader from './InvitationRecordHeader';

const MemberInfoCard = () => {
  return (
    <div className="bg-[#1e1e1e] min-h-screen w-full flex flex-col">
      {/* Header at the top */}
      <InvitationRecordHeader />
      
      {/* Content below header */}
      <div className="flex flex-col p-4 w-full">
        <div className="w-full">
          {/* Member Info Card */}
          <div className="bg-[#222222] rounded-lg overflow-hidden w-full p-4">
            {/* Member name and UID */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-white font-medium">MemberNNGMDO05</div>
              <div className="text-[#a08d5d]">UID:14480808</div>
            </div>
            
            {/* Registration time */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400 text-sm">Registration time</div>
              <div className="text-gray-400 text-sm">2025-01-15 21:48:24</div>
            </div>
            
            {/* Deposit amount */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400 text-sm">Deposit amount</div>
              <div className="text-[#cc8817] text-sm">₹200.00</div>
            </div>
            
            {/* No more message */}
            <div className="text-center mt-6 mb-2">
              <div className="text-gray-500 text-sm">No more</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberInfoCard;