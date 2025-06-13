import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const InvitationRecordHeader = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  return (
    <div className="bg-[#2d2d2d] w-full h-12 flex items-center justify-center relative">
      {/* Back button */}
      <button 
        onClick={handleGoBack} 
        className="absolute left-4 text-white"
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Title */}
      <h1 className="text-white text-lg font-medium">Invitation Record</h1>
    </div>
  );
};

export default InvitationRecordHeader;