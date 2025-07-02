import activity from '../../Assets/activity.jpg';
import React from 'react';
import activitybanner from '../../Assets/activityBanner.png';
import CommanHeader from '../../components/CommanHeader';

const ActivityDetails = () => {
    return (
        <div className="bg-[#242424] min-h-screen flex flex-col items-start">
            <CommanHeader title='Activity Details' />

            {/* Banner Image taking full width without padding issues */}
            <img src={activitybanner} alt="banner" className="mb-2 mt-14 w-full" />

            {/* Text with padding applied separately */}
            <div className="w-full flex justify-center">
                <p className="text-white text-lg font-semibold mb-4">LUCKY 10 Days Recharge Bonus</p>
            </div>


            {/* Image taking full width without extra spacing */}
            <img src={activity} alt="img" className="w-[90%] mx-auto " />

        </div>
    );
};

export default ActivityDetails;
