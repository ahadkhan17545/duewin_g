import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Slice/loginSlice"; // Import logout action
import { AiOutlineRight } from "react-icons/ai";
import wallet from "../../src/Assets/wallets.png";
import rechargeIcon from "../Assets/recharge.png";
import widthdraw from "../Assets/Withdraw.png";
import vipiconup from "../Assets/finalicons/vipiconup.png"
import bet from "../Assets/bet.png";
import transaction from "../Assets/transaction.png";
import DepositHistory from "../Assets/deposithistory.png";
import withdrawHistory from "../Assets/withdrawhistory.png";
import NotifyIcon from "../Assets/notifyIcon.png";
import gift from "../Assets/gift.png";
import gameStatistics from "../Assets/gamestatistics.png";
import languageIcon from "../Assets/languageIcon.png";
import SettingCenter from "../Assets/settingCenter.png";
import about from "../Assets/about.png";
import CustomerService from "../Assets/icon_sevice.png";
import service_notification from "../Assets/service_notification.png";
import service_feedback from "../Assets/service_feedback.png";
import service_guide from "../Assets/service_guide.png";
import logout_icon from "../Assets/logout.png";
import safe from "../Assets/finalicons/iconsafe.png";
import Footer from "../components/Footer";
import { FaCopy } from "react-icons/fa";
import refreshicon from '../Assets/refresh.png'
import vip from "../Assets/vip/vip1.png"
import Avatar from "../components/common/Avatar";
import apiServices from "../api/apiServices";
import { avatarMap } from "./Settings";
import { vipMap } from "./Profile/VIPProfile";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0)
  const { user } = useSelector((store) => store.login)
  const fetchWalletBalance = async () => {
    try {
      const response = await apiServices?.getWalletBalance();
      if (response?.success && response?.mainWallet) {
        const balance = Number(response.mainWallet.balance) || 0;
        const thirdPartyBalance = Number(response?.thirdPartyWallet?.balance) || 0;
        setWalletBalance((balance + thirdPartyBalance).toFixed(2));
      } else {
        setWalletBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      setWalletBalance(0);
    }
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await apiServices.getUserProfile();

        if (!data?.success) {
          console.error("Error fetching user data");
          return;
        }
        const user = data.user;
        setUserData(user);
      } catch (err) {
      }
    };

    fetchWalletBalance()
    fetchUserProfile();
  }, []);


  // Handle logout button click
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  // Handle confirm logout
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Dispatch logout action to clear Redux state and localStorage
      dispatch(logout());

      // Close the modal
      setShowLogoutModal(false);

      console.log("User logged out successfully");

      // Navigate to login page
      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, we should still logout the user
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle cancel logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };
  const handleCopy = () => {
    if (userData?.user_id) {
      navigator.clipboard.writeText(userData.user_id)
        .then(() => {
          // Optional: show a toast or alert
          console.log("UID copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy UID:", err);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 bg-[#242424] overflow-x-hidden">
      {/* Main content wrapper with max-width matching Wallet page */}
      <div className="w-full max-w-md mx-auto">
        {/* Golden background header */}
        <div
          className="w-full relative"
          style={{
            background: "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",
            borderBottomLeftRadius: "40px",
            borderBottomRightRadius: "40px",
            paddingBottom: "100px"
          }}
        >
          <div className="px-4 py-4">
            <div className="flex items-center">
              {/* Profile Image */}

              <Avatar src={avatarMap[Number(userData?.profile_picture_id)]} />

              {/* Profile Details */}
              <div className="ml-2 mt-1">
                {/* Name + VIP */}
                <div className="flex items-center mt-1">
                  <h2 className="text-base font-semibold text-white uppercase">{user?.member_detail}</h2>
                  <img src={vipMap[userData?.vip_level]} alt="VIP Badge" className="h-5 ml-2 mt-1" />
                </div>

                {/* UID section */}
                <div className="flex items-center bg-[#dd9138] rounded-full text-white mt-1 px-3 py-[2px] text-xs w-fit space-x-1.5">
                  <span className="font-medium">UID</span>
                  <span className="opacity-70">|</span>
                  <span className="font-medium">{userData?.user_id}</span>
                  <button onClick={handleCopy} className="pl-1">
                    <FaCopy className="text-white text-[11px]" />
                  </button>
                </div>


                {/* Login Time */}
                <p className="text-white text-xs mt-1">Last login: 2025-06-14 15:37:49</p>
              </div>
            </div>
          </div>



          {/* Balance card - positioned to overlap the golden background */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 w-[90%] max-w-full">
            <div className="bg-[#4d4d4c] rounded-lg shadow-lg px-4 py-3">
              {/* Total balance */}
              <div className="text-gray-400 text-xs font-normal">Total balance</div>
              <div className="flex items-center gap-4 mt-1">
                <div className="text-white text-base font-semibold">₹{walletBalance}</div>
                <button className="text-white">
                  <img onClick={fetchWalletBalance} src={refreshicon} alt="refresh" className="w-5 h-5" />
                </button>
              </div>

              {/* Quick action buttons */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <Link to="/wallet" className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src={wallet} alt="AR Wallet" className="w-7 h-7" />
                  </div>
                  <p className="text-white text-sm font-medium mt-1">ARWallet</p>
                </Link>

                <Link to="/deposit" className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src={rechargeIcon} alt="Deposit" className="w-7 h-7" />
                  </div>
                  <p className="text-white text-sm font-medium mt-1">Deposit</p>
                </Link>

                <Link to="/withdraw" className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src={widthdraw} alt="Withdraw" className="w-7 h-7" />
                  </div>
                  <p className="text-white text-sm font-medium mt-1">Withdraw</p>
                </Link>

                <Link to="/vipprofile" className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src={vipiconup} alt="VIP" className="w-7 h-7" />
                  </div>
                  <p className="text-white text-sm font-medium mt-1">VIP</p>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Content section with padding to account for the overlapping balance card */}
        <div className="w-full flex flex-col items-center pt-20 px-4">
          <div className="w-full">
            <Link to="/safe" className="block">
              <div className="bg-[#333332] p-1 rounded-lg shadow-md  cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex">
                    <img
                      src={safe}
                      alt="Safe Icon"
                      className="w-14 h-12 mt-3 ml-4 flex-shrink-0"
                    />
                    <div className="text-[#a8a5a1] ml-4 leading-tight">
                      <div className="text-base">Vault</div>
                      <div className="text-xs leading-snug">
                        the daily interest rate is 0.1%, and the income is<br />
                        calculated once every 1 minute.
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Link>


            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Game History */}
              <Link
                to="/gamehistoryProfile"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={bet} alt="Game History Icon" className="w-10 h-10 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Game History
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium truncate">
                    My game history
                  </p>
                </div>
              </Link>

              {/* Transaction */}
              <Link
                to="/transactionProfile"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={transaction} alt="Transaction Icon" className="w-10 h-10 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Transaction
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium leading-tight">
                    My transaction history
                  </p>

                </div>
              </Link>

              {/* Deposit */}
              <Link
                to="/deposit-history"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={DepositHistory} alt="Deposit Icon" className="w-10 h-10 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Deposit
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium truncate">
                    My deposit history
                  </p>
                </div>
              </Link>

              {/* Withdraw */}
              <Link
                to="/withdraw-history"
                className="bg-[#333332] p-3 rounded-lg shadow-md flex items-center min-h-[64px] cursor-pointer hover:bg-[#3c3c3b] transition-colors"
              >
                <img src={withdrawHistory} alt="Withdraw Icon" className="w-10 h-10 mr-3 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <p className="text-[#f5f3f0] text-xs sm:text-sm font-semibold truncate">
                    Withdraw
                  </p>
                  <p className="text-[#a8a5a1] text-[10px] sm:text-xs font-medium leading-tight">
                    My withdraw history
                  </p>
                </div>
              </Link>
            </div>






            <div className="bg-[#333332] p-4 rounded-lg shadow-md mt-4">
              <div className="space-y-6">
                {/* Notification */}
                <div>
                  <Link
                    to="/notificationProfile"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={NotifyIcon}
                        alt="Notification Icon"
                        className="w-8 h-8 flex-shrink-0"
                      />
                      Notification
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>

                {/* Gifts */}
                <div>
                  <Link
                    to="/Gift"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img src={gift} alt="Gift Icon" className="w-8 h-8 flex-shrink-0" />
                      Gifts
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>

                {/* Game Statistics */}
                <div>
                  <Link
                    to="/gamestatistics"
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={gameStatistics}
                        alt="Game Statistics Icon"
                        className="w-8 h-8 flex-shrink-0"
                      />
                      Game Statistics
                    </div>
                    <AiOutlineRight className="text-[#666666] text-lg flex-shrink-0" />
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>

                {/* Language */}
                <div>
                  <Link
                
                    className="w-full text-base font-normal text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={languageIcon}
                        alt="Language Icon"
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <span>Language</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm text-[#a8a5a1]">English</span>
                      <AiOutlineRight className="text-[#666666] text-base" />
                    </div>
                  </Link>
                  <hr className="my-4 border-[#525167]" />
                </div>
              </div>
            </div>


            <div className="bg-[#333332] text-[#a8a5a1] p-4 rounded-lg shadow-md mt-4">
              {/* Title aligned to the left */}
              <p className="text-base font-medium mb-3 text-white text-left">
                Service center
              </p>

              {/* Grid layout */}
              <div className="grid grid-cols-3 gap-y-4 gap-x-2 mt-2">
                {/* Settings */}
                <Link to="/settingsprofile" className="flex flex-col items-center">
                  <img src={SettingCenter} alt="Settings" className="w-7 h-7 mb-1" />
                  <p className="text-xs text-center leading-none">Settings</p>
                </Link>

                {/* Feedback */}
                <Link to="/feedbackProfile" className="flex flex-col items-center">
                  <img src={service_feedback} alt="Feedback" className="w-7 h-7 mb-1" />
                  <p className="text-xs text-center leading-none">Feedback</p>
                </Link>

                {/* Announcement */}
                <Link to="/notificationsService" className="flex flex-col items-center">
                  <img src={service_notification} alt="Announcement" className="w-7 h-7 mb-1" />
                  <p className="text-xs text-center leading-none">Announcement</p>
                </Link>

                {/* Customer Service */}
                <Link to="/agentcustomer" className="flex flex-col items-center">
                  <img src={CustomerService} alt="Customer Service" className="w-7 h-7 mb-1" />
                  <p className="text-xs text-center leading-none">Customer Service</p>
                </Link>

                {/* Beginner's Guide */}
                <Link to="/beginnerguide" className="flex flex-col items-center">
                  <img src={service_guide} alt="Beginner's Guide" className="w-7 h-7 mb-1" />
                  <p className="text-xs text-center leading-none">Beginner's Guide</p>
                </Link>

                {/* About Us */}
                <Link to="/aboutusprofile" className="flex flex-col items-center">
                  <img src={about} alt="About Us" className="w-7 h-7 mb-1" />
                  <p className="text-xs text-center leading-none">About us</p>
                </Link>
              </div>
            </div>


            <form className="space-y-4 md:space-y-6 mt-12 mb-2">
              <button
                type="button"
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center border border-[#d9ac4f] text-[#d9ac4f] py-2 rounded-full disabled:opacity-50"
              >
                <img src={logout_icon} alt="Logout Icon" className="w-6 h-6 mr-2" />
                {isLoggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#2b2b2b] rounded-2xl w-[315px] max-w-sm overflow-hidden ">
            {/* Alert Icon */}
            <div className="flex justify-center pt-6 pb-2">
              <div className="w-16 h-16 rounded-full bg-[#ff4d4f] flex items-center justify-center">
                <span className="text-white text-6xl font-bold pb-">!</span>
              </div>
            </div>

            {/* Modal Text */}
            <div className="text-center text-white text-xl font-medium py-4">
              Do you want to log out?
            </div>

            {/* Modal Buttons */}
            <div className="px-6 pb-3 pt-2 mt-4">
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="w-full mb-3 py-1.5 bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-full text-[#8f5206] text-lg disabled:opacity-50"
              >
                {isLoggingOut ? "Logging Out..." : "Confirm"}
              </button>
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="w-full py-1.5 border border-[#d9ac4f] rounded-full text-[#d9ac4f] text-lg disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;