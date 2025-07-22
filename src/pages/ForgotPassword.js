import React, { useState, useEffect } from "react";
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
import { forgotPassword, resetPassword } from "../api/apiServices";



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
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [step, setStep] = useState(1); // Step 1: Phone input, Step 2: Complete form
  const [forgetResponse,setForgotResponse] = useState(null)

  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+61", country: "Australia" },
    { code: "+971", country: "United Arab Emirates" },
  ];

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validation functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      message: password.length < minLength 
        ? "Password must be at least 8 characters long"
        : !hasUpperCase || !hasLowerCase 
        ? "Password must contain both uppercase and lowercase letters"
        : !hasNumbers 
        ? "Password must contain at least one number"
        : !hasSpecialChar 
        ? "Password must contain at least one special character"
        : ""
    };
  };

  // Event handlers
  const handlePhoneNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      if (errors.phoneNumber) {
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmailAddress(event.target.value);
    if (errors.emailAddress) {
      setErrors(prev => ({ ...prev, emailAddress: '' }));
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleVerificationCodeChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      if (errors.verificationCode) {
        setErrors(prev => ({ ...prev, verificationCode: '' }));
      }
    }
  };

  const handlePrivacyAgreementChange = () => {
    setPrivacyAgreement(!privacyAgreement);
    if (errors.privacyAgreement) {
      setErrors(prev => ({ ...prev, privacyAgreement: '' }));
    }
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    const newErrors = {};

    // Validate contact method
    if (isPhoneLogin) {
      if (!phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!validatePhoneNumber(phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      }
    } else {
      if (!emailAddress) {
        newErrors.emailAddress = 'Email address is required';
      } else if (!validateEmail(emailAddress)) {
        newErrors.emailAddress = 'Please enter a valid email address';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Call forgotPassword API
      const payload = {
        phone_no: isPhoneLogin ? `${phoneNumber}` : emailAddress
      };
      
      let response = await forgotPassword(payload);
      response = await response.json()
      console.log(response)
      if(response.success){
        setForgotResponse(response)
        setOtpSent(true);
        setStep(2); 
        setCountdown(60); 
        setErrors({});
      }
    } catch (error) {
      setErrors({ api: error.message || 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (event) => {
    event.preventDefault();
    const newErrors = {};

    // Validate all fields
    if (!password) {
      newErrors.password = 'New password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!verificationCode) {
      newErrors.verificationCode = 'Verification code is required';
    } else if (verificationCode.length !== 4) {
      newErrors.verificationCode = 'Verification code must be 6 digits';
    }

    if (!privacyAgreement) {
      newErrors.privacyAgreement = 'You must agree to the privacy policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Call resetPassword API
      const payload = {
        phone: isPhoneLogin ? `${phoneNumber}` : emailAddress,
        otp_code: verificationCode,
        new_password: password,
        confirmPassword: confirmPassword,
        otp_session_id:forgetResponse?.otpSessionId,
        token:forgetResponse?.resetToken
      };

      let response = await resetPassword(payload);
      
      response = await response.json()
      console.log(response)
      
      // Reset form or redirect to login
      setPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setPrivacyAgreement(false);
      setOtpSent(false);
      setStep(1);
      setPhoneNumber('');
      setEmailAddress('');
      
    } catch (error) {
      setErrors({ api: error.message || 'Failed to reset password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const payload = {
        mobile: isPhoneLogin ? `${countryCode}${phoneNumber}` : emailAddress
      };
      
      await forgotPassword(payload);
      setCountdown(60);
    } catch (error) {
      setErrors({ api: error.message || 'Failed to resend OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `bg-[#333332] text-white text-base rounded-lg block w-full p-3 h-12 border-none outline-none focus:ring-0`;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#242424] w-full">
      <div className="w-full max-w-[400px] mx-auto">
        <Header />
        <div className="bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] w-full px-6 py-2">
          <h1 className="text-lg font-bold text-white mb-1 text-left">
            Forgot Password
          </h1>
          <p className="text-white text-xs sm:text-base leading-tight text-left mb-2">
            {step === 1 
              ? "Enter your phone number to receive OTP"
              : "Enter OTP and set your new password"
            }
          </p>
        </div>

        <div className="bg-[#242424] p-4 w-full max-w-[400px] flex flex-col items-center rounded-lg">
          {/* Show API errors */}
          {errors.api && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.api}
            </div>
          )}

          <div className="flex justify-center gap-12 mb-4 w-full border-b border-gray-600">
            <button
              className={`flex flex-col items-center w-1/2 py-2 font-medium text-xl ${
                isPhoneLogin
                  ? "text-[#d9ac4f] border-b-2 border-[#d9ac4f]"
                  : "text-gray-400"
              }`}
              onClick={() => {
                setIsPhoneLogin(true);
                setErrors({});
                setOtpSent(false);
                setStep(1);
              }}
            >
              <img src={phoneicon} alt="Phone" className="h-8 w-6" />
              <span className="text-lg">phone reset</span>
            </button>
          </div>

          {/* Step 1: Phone Number Input */}
          {step === 1 && (
            <div className="space-y-4 w-full bg-[#242424] p-1 rounded-lg">
              {isPhoneLogin ? (
                <div>
                  <label className="block mb-2 text-sm font-medium text-white mt-3 flex items-center gap-2">
                    <img src={phoneicon} alt="Phone" className="h-6 w-5" />
                    Phone number
                  </label>
                  <div className="flex items-center relative gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative country-code-selector mb-4">
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="bg-[#333332] text-gray-400 rounded-lg py-2 px-4 flex items-center justify-between w-full h-12 border-none"
                      >
                        <span>{countryCode}</span>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {showDropdown && (
                        <div className="absolute left-0 top-full mt-1 w-[250px] bg-[#333332] rounded-md shadow-lg z-10 hide-scrollbar max-h-48 overflow-y-auto">
                          {countryCodes.map(({ code, country }) => (
                            <div
                              key={code}
                              className="px-4 py-3 text-[#a8a5a1] cursor-pointer hover:bg-[#404040] flex items-center justify-between"
                              onClick={() => {
                                setCountryCode(code);
                                setShowDropdown(false);
                              }}
                            >
                              <span className="font-medium">{code}</span>
                              <span className="text-sm text-gray-500">{country}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Phone Number Input */}
                    <input
                      type="text"
                      id="phone"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className={`bg-[#333332] text-gray-400 rounded-lg outline-none block w-full p-2.5 h-12 border-none mb-4 text-sm ${
                        errors.phoneNumber ? 'border-2 border-red-500' : ''
                      }`}
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1 mb-2">{errors.phoneNumber}</p>
                  )}
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
                    className={`${inputClass} ${errors.emailAddress ? 'border-2 border-red-500' : ''}`}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.emailAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isLoading}
                className={`w-full text-lg font-bold mt-8 py-3 rounded-full focus:ring-gray-300 ${
                  isLoading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] hover:opacity-90'
                }`}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-[#d9ac4f] text-sm hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Complete Form */}
          {step === 2 && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-4 w-full bg-[#242424] p-1 rounded-lg"
            >
              {/* Display phone number (read-only) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-white mt-3 flex items-center gap-2">
                  <img src={phoneicon} alt="Phone" className="h-6 w-5" />
                  Phone number
                </label>
                <input
                  type="text"
                  value={`${countryCode}${phoneNumber}`}
                  readOnly
                  className="bg-[#444444] text-gray-300 rounded-lg block w-full p-3 h-12 border-none outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-white flex items-center gap-2" style={{margin:0}}>
                  <img src={lockicon} alt="Lock" className="h-6 w-5" />
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`${inputClass} ${errors.password ? 'border-2 border-red-500' : ''}`}
                  placeholder="Enter new password (min 8 chars, include upper, lower, number, special char)"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm mt-2 font-medium text-white flex items-center gap-2">
                  <img src={lockicon} alt="Lock" className="h-6 w-5" />
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`${inputClass} ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                  placeholder="Confirm new password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
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
                    className={`${inputClass} ${errors.verificationCode ? 'border-2 border-red-500' : ''}`}
                    placeholder="Enter 4-digit verification code"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading || countdown > 0}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 rounded-full text-sm font-medium ${
                      isLoading || countdown > 0
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] hover:opacity-90'
                    }`}
                  >
                    {isLoading ? 'Sending...' : countdown > 0 ? `${countdown}s` : 'Resend'}
                  </button>
                </div>
                {errors.verificationCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.verificationCode}</p>
                )}
              </div>

              <div className="flex items-start">
                <div
                  className="flex items-center cursor-pointer mt-3"
                  onClick={handlePrivacyAgreementChange}
                >
                  <img
                    src={privacyAgreement ? agree : agreeborder}
                    alt="Privacy Agreement Checkbox"
                    className="w-5 h-5"
                  />
                  <label className="ml-2 text-sm text-white cursor-pointer">
                    I have read and agree{" "}
                    <Link to="/privacy-policy" className="text-custom-pink">[Privacy Agreement]</Link>
                  </label>
                </div>
              </div>
              {errors.privacyAgreement && (
                <p className="text-red-500 text-sm">{errors.privacyAgreement}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-lg font-bold mt-8 py-3 rounded-full focus:ring-gray-300 ${
                  isLoading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] hover:opacity-90'
                }`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#d9ac4f] text-sm hover:underline mr-4"
                >
                  Back to Phone
                </button>
                <Link to="/login" className="text-[#d9ac4f] text-sm hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;