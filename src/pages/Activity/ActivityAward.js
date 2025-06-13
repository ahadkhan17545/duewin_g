import React, { useState, useEffect } from "react";
import InvitationBonusHeader from "./InviteBonusHeader";
import apiServices from "../../api/apiServices";
import invitation from "../../Assets/invitation_bg.png";
import inviterule from "../../Assets/inviterule.svg";
import inviterecord from "../../Assets/inviterecord.svg";
import succeed from "../../Assets/succeed.png";
import cross from "../../Assets/cross.svg";

const InviteFriendsComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [bonusStatus, setBonusStatus] = useState({
    totalReferrals: 0,
    validReferrals: 0,
    claimedTiers: [],
    nextTier: null,
    hasUnclaimedBonus: false,
    unclaimedTier: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch invitation bonus status on component mount
  useEffect(() => {
    const fetchBonusStatus = async () => {
      setIsLoading(true);
      try {
        const response = await apiServices.getInvitationBonusStatus();
        if (response.success) {
          setBonusStatus({
            totalReferrals: response.totalReferrals,
            validReferrals: response.validReferrals,
            claimedTiers: response.claimedTiers,
            nextTier: response.nextTier,
            hasUnclaimedBonus: response.hasUnclaimedBonus,
            unclaimedTier: response.unclaimedTier,
          });
        } else {
          setError("Failed to fetch invitation bonus status.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching bonus status.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBonusStatus();
  }, []);

  // Handle claiming an invitation bonus
  const handleClaimBonus = async () => {
    if (!bonusStatus.hasUnclaimedBonus || !bonusStatus.unclaimedTier) {
      setError("No unclaimed bonus available.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiServices.claimInvitationBonus();
      if (response.success) {
        setShowPopup(true);
        // Update bonus status after claiming
        setBonusStatus((prev) => ({
          ...prev,
          hasUnclaimedBonus: false,
          unclaimedTier: null,
          claimedTiers: [
            ...prev.claimedTiers,
            {
              tier: response.tier,
              amount: response.amount,
              claimedAt: new Date().toISOString(),
            },
          ],
        }));
      } else {
        setError("Failed to claim bonus.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while claiming the bonus.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Define bonus tiers for display (based on the original code)
  const bonusTiers = [
    { tier: 1, invitees: 1, amount: 55.00, rechargePerPerson: 300.00 },
    { tier: 3, invitees: 3, amount: 155.00, rechargePerPerson: 300.00 },
  ];

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col w-full">
      <InvitationBonusHeader />

      {/* Top banner */}
      <div className="relative w-full">
        <div
          className="p-2 h-[220px] text-white relative overflow-hidden bg-cover bg-center w-full"
          style={{
            backgroundImage: `linear-gradient(94deg, rgb(249, 153, 55) 2.72%, rgb(255, 105, 34) 43.54%, rgb(255, 128, 57) 98.54%), url(${invitation})`,
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl mb-4">Invite friends and deposit</h2>
          <p className="text-sm mb-1">Both parties can receive rewards</p>
          <p className="text-sm mb-2">
            Invite friends to register and recharge <br />
            to receive rewards
          </p>
          <p className="text-sm mb-1">Activity date</p>
          <p className="text-xl font-medium">2024-05-03 - 2099-05-03</p>
        </div>

        {/* Navigation */}
        <div className="bg-[#4d4d4c] p-3 flex justify-around w-[90%] -bottom-20 mx-auto absolute left-1/2 transform -translate-x-1/2 rounded-2xl shadow-lg">
          <a
            href="/invitationrule"
            className="flex flex-col items-center w-[48%]"
          >
            <img src={inviterule} alt="Rules icon" className="w-14 h-14" />
            <span className="text-gray-400 text-sm mt-1">
              Invitation reward rules
            </span>
          </a>
          <a
            href="/invitaionrecord"
            className="flex flex-col items-center w-[48%]"
          >
            <img src={inviterecord} alt="Record icon" className="w-14 h-14" />
            <span className="text-gray-400 text-sm mt-1">Invitation record</span>
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col w-full py-2 mt-28 px-4">
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {bonusTiers.map((bonus, index) => {
          const isClaimed = bonusStatus.claimedTiers.some((t) => t.tier === bonus.tier);
          const isUnclaimed = bonusStatus.hasUnclaimedBonus && bonusStatus.unclaimedTier?.tier === bonus.tier;
          const inviteesMet = bonusStatus.validReferrals >= bonus.invitees;
          const depositMet = bonusStatus.validReferrals >= bonus.invitees; // Assuming validReferrals implies deposit condition met

          return (
            <div
              key={index}
              className="bg-[#333332] rounded-lg mb-4 w-full p-3 relative"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-700 mt-6">
                {/* Bonus Section - Attached to Top and Left */}
                <div className="absolute top-0 left-0 flex items-center">
                  <div className="flex items-center bg-[#17b15e] text-white px-6 py-2 rounded-br-3xl h-12">
                    <span className="text-sm font-medium">Bonus</span>
                    <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center text-xs text-black ml-1">
                      {bonus.tier}
                    </span>
                    {/* Cross Image */}
                    <img src={cross} alt="cross" className="h-7 w-7 ml-10" />
                  </div>
                </div>

                {/* Bonus Amount - Positioned at Top-Right */}
                <span className="absolute top-2 right-3 text-[#FFA500] font-semibold text-sm">
                  ₹{bonus.amount.toFixed(2)}
                </span>
              </div>

              {/* Rest of the content */}
              <div className="mt-4">
                <div className="bg-[#4d4d4c] p-1 rounded mb-2">
                  <div className="flex justify-between">
                    <span className="text-white text-sm">Number of invitees</span>
                    <span className="text-white text-base">{bonus.invitees}</span>
                  </div>
                </div>
                <div className="bg-[#4d4d4c] p-1 rounded mb-3">
                  <div className="flex justify-between">
                    <span className="text-white text-sm">Recharge per people</span>
                    <span className="text-red-500 text-base">₹{bonus.rechargePerPerson.toFixed(2)}</span>
                  </div>
                </div>
                {/* Progress */}
                <div className="border-t border-[#525167] border-dashed pt-2 mt-6">
                  <div className="flex mt-4">
                    <div className="flex-1 border-r border-[#525167]">
                      <div className="text-[#dd9138] text-center text-xl">
                        {Math.min(bonusStatus.validReferrals, bonus.invitees)} / {bonus.invitees}
                      </div>
                      <div className="text-gray-400 text-sm text-center">
                        Number of invitees
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[#d23838] text-center text-xl">
                        {Math.min(bonusStatus.validReferrals, bonus.invitees)} / {bonus.invitees}
                      </div>
                      <div className="text-gray-400 text-sm text-center">
                        Deposit number
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="mt-3">
                {isClaimed ? (
                  <button className="w-full bg-[#5c5f70] text-white py-2 rounded-full text-center text-sm font-medium">
                    Claimed
                  </button>
                ) : isUnclaimed && inviteesMet && depositMet ? (
                  <button
                    onClick={handleClaimBonus}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-full text-center text-base font-medium hover:bg-[#FFCC00] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? "Processing..." : "Finished"}
                  </button>
                ) : (
                  <button className="w-full bg-[#5c5f70] text-white py-2 rounded-full text-center text-sm font-medium">
                    Unfinished
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-[#2A2A2A] rounded-xl w-full max-w-xs mx-4 overflow-visible shadow-lg min-h-[250px] p-4 mt-2">
            {/* Success Image - Positioned to protrude from the top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src={succeed} alt="Success" className="w-38 h-24" />
            </div>

            {/* Content */}
            <div className="pt-12 flex flex-col items-center">
              <h3 className="text-white text-xl font-semibold mb-2">
                Congratulations!
              </h3>
              <p className="text-gray-300 text-center mb-4">
                You have successfully completed Bonus {bonusStatus.unclaimedTier?.tier || 1} challenge!
              </p>
              <p className="text-yellow-400 font-bold text-lg mb-4">
                ₹{bonusStatus.unclaimedTier?.amount.toFixed(2) || "0.00"} Earned
              </p>

              {/* Button */}
              <button
                onClick={closePopup}
                className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-black py-3 rounded-full text-center text-sm font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteFriendsComponent;