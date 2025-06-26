import React, { useEffect, useState } from "react";
import Promotionheader from "./../components/Promotionheader";
import { FaGreaterThan } from "react-icons/fa6";
import CopyLink from "./../Assets/copy link.png";
import Commission from "./../Assets/commission.png";
import Money from "./../Assets/money.png";
import RebateRatio from "./../Assets/rebateRatio.png";
import Rule from "./../Assets/rule.png";
import Right from "./../Assets/right.png";
import Server from "./../Assets/server.png";
import service_feedback from "./../Assets/service_feedback.png";
import Team_port from "./../Assets/team_port.png";
import Background from "./../Assets/bg.png";
import promotionbg from "./../Assets/promotionbg.png";
import whitetick from "./../Assets/whitetick.png";
import teamsubordinate from "../Assets/finalicons/teamsubordinate.png";
import { Link } from "react-router-dom";
import subordinate from "../Assets/finalicons/subordinate.png";
import { MdOutlineContentCopy } from "react-icons/md";
import Footer from "../components/Footer";
import apiServices from "../api/apiServices";

// Disable browser scroll restoration
if (typeof window !== "undefined" && window.history.scrollRestoration) {
  window.history.scrollRestoration = "manual";
}

function PromotionPage() {
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setverificationCode] = useState("");
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referral, setReferal] = useState(null)
  const [totalReferral, setTotalReferral] = useState(null)
  const [userData ,setUserData] = useState(null)

  const invitationCode = "185853395581";
  const fetchReferal = async () => {
    let data = await apiServices?.getReferral()
    if (data?.success == true) {
      setReferal(data?.directReferrals)
      setTotalReferral(data?.total)
    }
  }
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
  useEffect(() => {
    fetchReferal()
    fetchUserProfile()
  }, [])

  const handleCopy = () => {
    navigator.clipboard
      .writeText(userData?.referring_code)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

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
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#242424] font-sans">
      <Promotionheader className="fixed top-0 left-0 w-full z-50" />

      {/* Center Copy success notification */}
      {copied && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg flex flex-col items-center w-32 h-32">
            <img
              src={whitetick}
              alt="Success"
              className="w-10 h-10 mb-2 object-contain"
            />
            <span className="text-sm font-sans text-center">Copy successful</span>
          </div>
        </div>
      )}

      {/* Top section with background image - Full width */}
      <div
        className="relative w-screen overflow-hidden"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingBottom: "20rem",
          margin: "0",
          width: "100%"
        }}
      >
        {/* Promotion background image overlay - Made full width */}
        <div className="absolute z-0 top-0 w-full h-full">
          <img
            src={promotionbg}
            alt="Foreground"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content section that partially overlaps with the background */}
      <div className="relative z-20 w-full px-4 mx-auto mt-[-16rem] max-w-md">
        <h1 className="text-[#8f5206] text-3xl text-center mb-1 font-sans">0</h1>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="px-4 py-0.5 text-center text-[12px] bg-[#333332] text-[#d9ac4f] rounded-full font-sans"
          >
            Yesterday's total commission
          </button>
        </div>
        <p className="text-[#8f5206] text-[11px] text-center mt-1 mb-2 font-sans">
          Upgrade the level to increase commission income
        </p>

        {/* Table section with semi-transparent background */}
        <div className="bg-[#242424] bg-opacity-90 rounded-lg overflow-hidden">
          <table className="table-auto w-full bg-[#333332] bg-opacity-90 font-sans">
            <thead>
              <tr>
                <th className="bg-[#3a3947] text-base font-normal text-white p-2 border-r border-[#242424]">
                  <div className="flex items-center justify-center leading-tight">
                    <img src={subordinate} alt="Direct Icon" className="mr-1 w-6 h-6" />
                    <span className="text-xs">Direct subordinates</span>
                  </div>
                </th>
                <th className="bg-[#3a3947] text-base font-normal text-white p-2">
                  <div className="flex items-center justify-center leading-tight">
                    <img src={teamsubordinate} alt="Team Icon" className="mr-1 w-6 h-6" />
                    <span className="text-xs">Team subordinates</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td className="text-white border-r border-[#242424] p-[2px]">{totalReferral}</td>
                <td className="text-white p-[2px]">0</td>
              </tr>
              <tr>
                <td className="text-white text-xs font-medium border-r border-[#242424] p-[2px] leading-tight">
                  number of register
                </td>
                <td className="text-white text-xs font-medium p-[2px] leading-tight">
                  number of register
                </td>
              </tr>
              <tr>
                <td className="text-green-500 border-r border-[#242424] p-[2px] leading-tight">0</td>
                <td className="text-green-500 p-[2px] leading-tight">0</td>
              </tr>
              <tr>
                <td className="text-white text-xs font-medium border-r border-[#242424] p-[2px] leading-tight">
                  Deposit number
                </td>
                <td className="text-white font-medium text-xs p-[2px] leading-tight">
                  Deposit number
                </td>
              </tr>
              <tr>
                <td className="text-orange-500 border-r border-[#242424] p-[2px] leading-tight">0</td>
                <td className="text-orange-500 p-[2px] leading-tight">0</td>
              </tr>
              <tr>
                <td className="text-white text-xs font-medium border-r border-[#242424] p-[2px] leading-tight">
                  Deposit amount
                </td>
                <td className="text-white text-xs font-medium p-[2px] leading-tight">
                  Deposit amount
                </td>
              </tr>
              <tr>
                <td className="text-white border-r border-[#242424] p-[2px] leading-tight">0</td>
                <td className="text-white p-[2px] leading-tight">0</td>
              </tr>
              <tr>
                <td className="text-white px-[2px] py-[8px] font-medium text-xs border-r border-[#242424] leading-tight">
                  Number of people making first deposit
                </td>
                <td className="text-white px-[2px] py-[8px] font-medium text-xs leading-tight">
                  Number of people making first deposit
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invitation Link Button */}
        <div className="w-full flex justify-center mt-4 mb-3">
          <Link to="/invitepage" className="w-11/12">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-[#fae59f] to-[#c4933f] p-2 text-sm text-center text-[#8f5206] font-bold text-lg rounded-full font-sans"
            >
              INVITATION LINK
            </button>
          </Link>
        </div>

        {/* Additional menu items */}
        <div className="bg-[#333332] bg-opacity-90 p-3 rounded-lg mb-2" style={{height:'55px'}}>
          <div className="flex justify-between items-center">
            <div
              className="flex text-white items-center cursor-pointer"
              onClick={handleCopy}
            >
              <img src={CopyLink} alt="Copy Icon" className="mr-2 w- h-8 text-xs" />
              <p className="text-base font-sans text-sm">Copy invitation code</p>
            </div>
            <div className="flex items-center text-gray-400 space-x-2 text-xs">
              <span className="text-sm truncate max-w-20">{userData?.referring_code}</span>
              <button
                className="flex items-center text-gray-400"
                onClick={handleCopy}
              >
                <MdOutlineContentCopy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <Link to="/subordinate" className="w-full block">
          <div className="bg-[#333332] bg-opacity-90 p-3  rounded-lg mb-2">
            <div className="flex justify-between items-center">
              <div className="flex text-white items-center">
                <img
                  src={Team_port}
                  alt="Team Icon"
                  className="w-8 h-8 mr-1"
                />
                <p className="text-base font-sans text-sm">Subordinate data</p>
              </div>
              <span className="text-white">
                <img src={Right} alt="Right Icon" className="w-8 h-8" />
              </span>
            </div>
          </div>
        </Link>

        <Link to="/commissiondetailpage" className="w-full block">
          <div className="bg-[#333332] bg-opacity-90 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div className="flex text-white items-center">
                <img
                  src={Commission}
                  alt="Commission Icon"
                  className="w-8 h-8 mr-1"
                />
                <p className="text-base font-sans text-sm">Commission detail</p>
              </div>
              <span className="text-white">
                <img src={Right} alt="Right Icon" className="w-8 h-8" />
              </span>
            </div>
          </div>
        </Link>

        <Link to="/promotionrule" className="w-full block">
          <div className="bg-[#333332] bg-opacity-90 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div className="flex text-white items-center">
                <img src={Rule} alt="Rule Icon" className="mr-1 w-8 h-8" />
                <p className="text-base font-sans text-sm">Invitation rules</p>
              </div>
              <span className="text-gray-400">
                <img src={Right} alt="Right Icon" className="w-8 h-8" />
              </span>
            </div>
          </div>
        </Link>

        <Link to="/agentcustomer" className="w-full block">
          <div className="bg-[#333332] bg-opacity-90 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div className="flex text-white items-center">
                <img src={Server} alt="Server Icon" className="mr-1 w-8 h-8" />
                <p className="text-base font-sans text-sm">Agent line customer service</p>
              </div>
              <span className="text-gray-400">
                <img src={Right} alt="Right Icon" className="w-8 h-8" />
              </span>
            </div>
          </div>
        </Link>

        <Link to="/rebateratio" className="w-full block">
          <div className="bg-[#333332] bg-opacity-90 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div className="flex text-white items-center">
                <img
                  src={RebateRatio}
                  alt="Rebate Icon"
                  className="mr-1 w-8 h-8"
                />
                <p className="text-base font-sans text-sm">Rebate ratio</p>
              </div>
              <span className="text-gray-400">
                <img src={Right} alt="Right Icon" className="w-8 h-8" />
              </span>
            </div>
          </div>
        </Link>

        <div className="bg-[#333332] bg-opacity-90 p-2 rounded-lg mb-24">
          <div className="flex items-center mb-2">
            <img src={Money} alt="Money Icon" className="mr-2 w-6 h-6" />
            <h2 className="font-bold text-white text-lg font-sans text-xs">Promotion data</h2>
          </div>

          <div className="grid grid-cols-2 mb-1">
            <div className="flex flex-col items-center ">
              <span className="text-white text-base">0</span>
              <span className="text-sm text-[#a8a5a1] font-sans text-xs">This week</span>
            </div>
            <div className="flex flex-col border-l border-gray-700 items-center ">
              <span className="text-white text-base">0</span>
              <span className="text-sm text-[#a8a5a1] font-sans text-xs">Total Commission</span>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex flex-col items-center ">
              <span className="text-white text-base">0</span>
              <span className="text-sm text-[#a8a5a1] font-sans text-xs">direct subordinate</span>
            </div>
            <div className="flex flex-col border-l border-gray-700 items-center gap-1 text-center px-1">
              <span className="text-white text-base">0</span>
              <span className="text-xs text-[#a8a5a1] font-sans leading-tight text-xs">
                Total number of subordinates in the team
              </span>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default PromotionPage;