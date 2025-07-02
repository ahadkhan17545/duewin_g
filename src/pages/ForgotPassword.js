import React, { useState } from "react";
import realtime from "../Assets/loginicons/realtime.png";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import phone from "../Assets/loginicons/phone.png";
import email from "../Assets/loginicons/email.png";
import phoneicon from "../Assets/loginicons/phoneicon.png";
import emailiconn from "../Assets/loginicons/emailiconn.png";
import lockicon from "../Assets/loginicons/lockicon.png";
import agree from "../Assets/finalicons/agree.png";
import agreeborder from "../Assets/finalicons/agreeborder.png";
import { FaChevronDown } from "react-icons/fa";

function ForgotPassword() {
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");

  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+61", country: "Australia" },
    { code: "+971", country: "United Arab Emirates" },
  ];

  const handlePhoneNumberChange = (event) => setPhoneNumber(event.target.value);
  const handleEmailChange = (event) => setEmailAddress(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value);
  const handleVerificationCodeChange = (event) =>
    setVerificationCode(event.target.value);
  const handlePrivacyAgreementChange = () =>
    setPrivacyAgreement(!privacyAgreement);

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
      ? { countryCode, phoneNumber, password }
      : { emailAddress, password };
    console.log("Login data:", loginData);
    console.log("Verification code:", verificationCode);
    console.log("Privacy agreement accepted:", privacyAgreement);
  };

  const inputClass =
    "bg-[#333332] text-white text-base rounded-lg block w-full p-3 h-12 border-none outline-none focus:ring-0";

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#242424] w-full">
      <div className="w-full max-w-[400px] mx-auto">
        <Header />
        <div className="bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] w-full px-6 py-2">
          <h1 className="text-lg font-bold text-white mb-1 text-left">
            Forgot Password
          </h1>
          <p className="text-white text-xs sm:text-base leading-tight text-left mb-2">
            Please retrieve/change your password through your mobile phone number or
            email.
          </p>
        </div>

        <div className="bg-[#242424] p-4 w-full max-w-[400px] flex flex-col items-center rounded-lg">
          <div className="flex justify-center gap-12 mb-4 w-full border-b border-gray-600">
            <button
              className={`flex flex-col items-center w-1/2 py-2 font-medium text-xl ${
                isPhoneLogin
                  ? "text-[#d9ac4f] border-b-2 border-[#d9ac4f]"
                  : "text-gray-400"
              }`}
              onClick={() => setIsPhoneLogin(true)}
            >
              <img src={phone} alt="Phone" className="h-8 w-6" />
              <span className="text-lg">phone reset</span>
            </button>
            <button
              className={`flex flex-col items-center w-1/2 py-2 font-medium text-xl ${
                !isPhoneLogin
                  ? "text-[#d9ac4f] border-b-2 border-[#d9ac4f]"
                  : "text-gray-400"
              }`}
              onClick={() => setIsPhoneLogin(false)}
            >
              <img src={email} alt="Email" className="h-8 w-14" />
              <span className="text-lg">mailbox reset</span>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full bg-[#242424] p-1 rounded-lg"
          >
            {isPhoneLogin ? (
              <div>
                <label className="block mb-2 text-sm font-medium text-white mt-3 flex items-center gap-2">
                  <img src={phoneicon} alt="Phone" className="h-6 w-5" />
                  Phone number
                </label>
                <div className="relative flex items-center">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center px-2 bg-[#333332] rounded-l-lg cursor-pointer border-r border-gray-600 h-12"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="text-white">{countryCode}</span>
                    <FaChevronDown className="text-gray-400 w-4 h-4 ml-1" />
                  </div>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className={`${inputClass} pl-16 ml-4`}
                    placeholder="Please enter the phone number"
                    required
                  />
                  {showDropdown && (
                    <div className="absolute left-0 mt-1 w-full max-w-[400px] bg-[#333332] rounded-md shadow-lg z-10 top-12">
                      {countryCodes.map(({ code, country }) => (
                        <div
                          key={code}
                          className="px-4 py-2 text-[#a8a5a1] cursor-pointer flex items-center gap-x-3 hover:bg-[#424242]"
                          onClick={() => {
                            setCountryCode(code);
                            setShowDropdown(false);
                          }}
                        >
                          <span>{code}</span>
                          <span>{country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm mt-3 font-medium text-white flex items-center gap-1">
                  <img src={emailiconn} alt="Email" className="h-6 w-5" />
                  Email
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={handleEmailChange}
                  className={inputClass}
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm mt-6 font-medium text-white flex items-center gap-2">
                <img src={lockicon} alt="Lock" className="h-6 w-5" />
                A new password
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={inputClass}
                placeholder="A new password"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm mt-6 font-medium text-white flex items-center gap-2">
                <img src={lockicon} alt="Lock" className="h-6 w-5" />
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={inputClass}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium mt-6 text-white flex items-center gap-2">
                <img src={realtime} alt="Verification" className="h-6 w-5" />
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  className={inputClass}
                  placeholder="Please enter the confirmation code"
                />
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] rounded-full"
                >
                  Send
                </button>
              </div>
            </div>

            <div
              className="flex items-center cursor-pointer "
              onClick={handlePrivacyAgreementChange}
            >
              <img
                src={privacyAgreement ? agree : agreeborder}
                alt="Privacy Agreement Checkbox"
                className="w-5 h-5 mt-3"
              />
              <label className="ml-2 mt-3 text-sm text-white">
                I have read and agree{" "}
                <span className="text-red-500">[Privacy Agreement]</span>
              </label>
            </div>

            <Link to="/login">
              <button
                type="submit"
                className="w-full text-lg font-bold mt-8 bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] py-3 rounded-full focus:ring-gray-300"
              >
                Reset
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;