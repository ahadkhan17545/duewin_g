import React from 'react';
import { useParams } from 'react-router-dom';
import activitybanner from '../../Assets/activityBanner.png';
import CommanHeader from '../../components/CommanHeader';

// Import all the images
import firstDeposit from "../../Assets/newIcon/firstDepositS.webp";
import firstDepositBonusB from "../../Assets/newIcon/firstDepositBonusB.webp";
import Bonus888 from "../../Assets/newIcon/888Bonuss.webp";
import ytS from "../../Assets/newIcon/ytS.webp";
import ytB from "../../Assets/newIcon/ytB.webp";
import winstreakS from "../../Assets/newIcon/winstreakS.webp";
import winstreakB from "../../Assets/newIcon/winstreakB.webp";
import supportFundsS from "../../Assets/newIcon/supportFundsS.webp";
import supportFundsB from "../../Assets/newIcon/supportFundsB.webp";
import invitationBonusS from "../../Assets/newIcon/invitationBonusS.webp";
import invitationBonusB from "../../Assets/newIcon/invitationBonusB.webp";
import attandenceBonusS from "../../Assets/newIcon/attandenceBonusS.webp";
import VIPS from "../../Assets/newIcon/VIPS.png";
import avaitorS from "../../Assets/newIcon/avaitorS.webp";
import avaitorB from "../../Assets/newIcon/avaitorBonusB.webp";
import agentS from "../../Assets/newIcon/agentS.webp";
import Bonus8B from "../../Assets/newIcon/888BonusB.webp";

const ActivityDetails = () => {
    const { pageName } = useParams();

    // Create a mapping object for images and titles
    const pageConfig = {
        'first-deposit': {
            image: firstDeposit,
            title: 'First Deposit Bonus',
            image2:firstDepositBonusB
        },
        'bonus-888': {
            image: Bonus888,
            title: '888 Bonus',
            image2:Bonus8B
        },
        'youtube': {
            image: ytS,
            title: 'YouTube Bonus',
            image2:ytB
        },
        'winstreak': {
            image: winstreakS,
            title: 'Win Streak Bonus',
            image2:winstreakB
        },
        'support-funds': {
            image: supportFundsS,
            title: 'Support Funds',
            image2:supportFundsB
        },
        'invitation-bonus': {
            image: invitationBonusS,
            title: 'Invitation Bonus',
            image2:invitationBonusB
        },
        'attendance-bonus': {
            image: attandenceBonusS,
            title: 'Attendance Bonus'
        },
        'vip': {
            image: VIPS,
            title: 'VIP Benefits'
        },
        'aviator': {
            image: avaitorS,
            title: 'Aviator Game',
            image2:avaitorB
        },
        'agent': {
            image: agentS,
            title: 'Agent Program'
        }
    };

    // Get the current page configuration
    const currentConfig = pageConfig[pageName] || {
        image: firstDeposit, // fallback image
        title: 'Activity Details' // fallback title
    };

    return (
        <div className="bg-[#242424] min-h-screen flex flex-col items-start">
            <CommanHeader title='Activity Details' />

            {/* Banner Image taking full width without padding issues */}
            <img src={currentConfig.image} alt="banner" className="mb-2 mt-14 w-full" />

            {/* Dynamic title based on pageName */}
            <div className="w-full flex justify-center">
                <p className="text-white text-lg font-semibold mb-4">{currentConfig.title}</p>
            </div>

            {/* Dynamic image based on pageName */}
            <img src={currentConfig.image2} alt={currentConfig.title} className="w-[90%] mx-auto" />

        </div>
    );
};

export default ActivityDetails;
