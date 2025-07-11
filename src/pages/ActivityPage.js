import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaPhone,
  FaEnvelope,
  FaLock,
  FaQuestionCircle,
  FaKey,
} from "react-icons/fa";
import Footer from "../components/Footer";
import invitationBonus from "./../Assets/invitationBonus.png";
import ActivityHeader from "../components/ActivityHeader";
import signInBanner from "../Assets/signInBanner.png";
import giftRedeem from "../Assets/giftRedeem.png";
import BettingRebate from "../Assets/BettingRebate.png";
import superJackpot from "../Assets/superJackpot.png";

function ActivityPage() {
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setverificationCode] = useState("");
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value);
  const handleverificationCodeChange = (event) =>
    setverificationCode(event.target.value);
  const handlePrivacyAgreementChange = (event) =>
    setPrivacyAgreement(event.target.checked);
  const handleRememberPasswordChange = (event) =>
    setRememberPassword(event.target.checked);

  const handleSendVerificationCode = () => {
    // Logic to send verification code
    console.log("Verification code sent!");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const loginData = isPhoneLogin
      ? { phoneNumber, password }
      : { email, password };
    console.log("Login data:", loginData);
    console.log("Remember password:", rememberPassword);
    console.log("verification code:", verificationCode);
    console.log("Privacy agreement accepted:", privacyAgreement);
  };

  return (
    <div className="bg-[rgb(36,36,36)] min-h-screen w-full flex flex-col items-center justify-center">
      <ActivityHeader />
      <div className="text-left mb-0 w-full max-w-md px-4 mt-10 p-3 bg-[#333332] font-roboto leading-tight text-sm">
        <h1 className="text-lg text-white mb-2 font-sans">Activity</h1>
        <p className="text-white text-xs font-sans">
          Please remember to follow the event page
          <br />
          We will launch user feedback activities from time to time
        </p>
      </div>

      <div className="bg-custom-dark-gray p-4 shadow-md w-full max-w-md h-full  flex flex-col justify-between" style={{paddingBottom:'50px'}}>
        <div className="grid grid-cols-3 text-[#a8a5a1] items-center mb-2">
          <div className="text-center">
            <Link to="/invitebonus">
              <img
                src={invitationBonus}
                alt="Target"
                className="w-9 h-9 mx-auto"
              />
              <div className="text-xs mt-2">
                Invitation <br /> bonus
              </div>
            </Link>
          </div>
          <div className="text-center">
            <Link to="/rebate">
              <img src={superJackpot} alt="Idea" className="w-9 h-9 mx-auto" />
              <div className="text-xs mt-2">
                Activity
                <br />
                Award
              </div>{" "}
            </Link>
          </div>
          <div className="text-center">
            <Link to="/jackpot">
              <img src={BettingRebate} alt="Idea" className="w-9 h-9 mx-auto" />
              <div className="text-xs mt-2">
                Betting
                <br />
                Rebate
              </div>{" "}
            </Link>
          </div>
        </div>

        <div className="w-full ">
          <div className="grid grid-cols-2 gap-1 w-full">
            {/* Gift Box */}
            <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col overflow-hidden max-w-[98%]">
              <Link to="/Gift">
                <div className="w-full aspect-[5/3]">
                  {" "}
                  {/* Height thoda kam */}
                  <img
                    src={signInBanner}
                    alt="description"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="flex flex-col items-start justify-center p-2">
                  {" "}
                  {/* tighter padding */}
                  <h2 className="text-base text-[#f5f3f0] font-semibold mb-1 font-sans">
                    Gifts
                  </h2>
                  <p className="text-[#a8a5a1] text-xs tracking-tight leading-snug font-sans">
                    Enter the redemption code to receive gift rewards
                  </p>
                </div>
              </Link>
            </div>

            {/* Attendance Bonus Box */}
            <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col overflow-hidden max-w-[98%]">
              <Link to="/AttendanceBonus">
                <div className="w-full aspect-[5/3]">
                  <img
                    src={giftRedeem}
                    alt="description"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="flex flex-col items-start justify-center p-2">
                  <h2 className="text-base text-[#f5f3f0] font-semibold mb-1 font-sans">
                    Attendance Bonus
                  </h2>
                  <p className="text-[#a8a5a1] text-xs tracking-tight leading-tight font-sans">
                    The more consecutive days you sign in, the higher the reward
                    will be.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-4 mt-6">
          <Link to="/activitygamesrules">
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_20240827180534ickk.png"
              alt="First Deposit Bonus"
              className="w-full h-auto rounded-lg"
            />
          </Link>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              First Deposit Bonus
            </h2>
          </div>
        </div>

        <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-4">
          <Link to="/activitygamesrules">
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_20240827175709gnr5.png"
              alt="Daily Bonus"
              className="w-full h-auto rounded-lg"
            />
          </Link>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              Daily Bonus
            </h2>
          </div>
        </div>

        <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-4">
          <Link to="/activitygamesrules">
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_20240828174930butj.png"
              alt="Aviator Challenger"
              className="w-full h-auto rounded-lg"
            />
          </Link>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              Aviator Challenger
            </h2>
          </div>
        </div>

        <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-4">
          <Link to="/activitygamesrules">
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_20240828175051yb1x.png"
              alt="Lucky 10 Days"
              className="w-full h-auto rounded-lg"
            />
          </Link>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              Lucky 10 Days
            </h2>
          </div>
        </div>

        <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-4">
          <Link to="/activitygamesrules">
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_20240828175144x8p1.png"
              alt="Wingo Win Streak Bonus"
              className="w-full h-auto rounded-lg"
            />
          </Link>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              Wingo Win Streak Bonus
            </h2>
          </div>
        </div>

        <div className="bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-14">
          <Link to="/activitygamesrules">
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_202408291537368dtv.png"
              alt="Diuwin Content Creators"
              className="w-full h-auto rounded-lg"
            />
          </Link>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              Diuwin Content Creators
            </h2>
          </div>
        </div>

        <div className=" bg-custom-light-gray rounded-lg shadow-md flex flex-col mb-14">
          <div>
            <img
              src="https://ossimg.diuacting.com/DiuWin/banner/Banner_202408291537368dtv.png"
              alt="Descriptive Alt Text"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full h-1/4 flex flex-col items-left justify-center p-2">
            <h2 className="text-lg text-[#f5f3f0] font-semibold">
              Diuwin Content Creators
            </h2>
            {/* <p className="text-gray-700 text-sm ">
              The more consecutive days you sign in, the higher the reward will
              be.
            </p> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ActivityPage;
