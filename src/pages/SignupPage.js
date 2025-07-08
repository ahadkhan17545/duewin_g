import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetError } from "../redux/Slice/signupSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header";
import lockicon from "../Assets/loginicons/lockicon.png";
import phoneicon from "../Assets/loginicons/phoneicon.png";
import invitecodeicon from "../Assets/loginicons/invitecodeicon.png";
import { startLoading, stopLoading } from "../redux/Slice/Loader";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+971", country: "UAE" },
];

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralFromURL = searchParams.get("referralCode");
  const { loading, error, user } = useSelector((state) => state.signup);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCode, setSelectedCode] = useState("+91");
  const [showDropdown, setShowDropdown] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 if(loading){
    dispatch(startLoading());
  }else {
    dispatch(stopLoading());
  }

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleInputChange = (setter) => (e) => {
    if (setter === setPhoneNumber) {
      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
      setter(value);
    } else {
      setter(e.target.value);
    }
  };

  const handleCheckboxChange = (setter) => (e) => setter(e.target.checked);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (referralFromURL) {
      setInviteCode(referralFromURL);
    }
  }, [referralFromURL]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".country-code-selector")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      dispatch({
        type: "signup/signupUser/rejected",
        payload: "Phone number must be exactly 10 digits",
      });
      return;
    }
    if (password !== confirmPassword) {
      dispatch({
        type: "signup/signupUser/rejected",
        payload: "Passwords do not match",
      });
      return;
    }
    if (password.length < 6) {
      dispatch({
        type: "signup/signupUser/rejected",
        payload: "Password must be at least 6 characters long",
      });
      return;
    }
    if (!inviteCode) {
      dispatch({
        type: "signup/signupUser/rejected",
        payload: "Invite code is required",
      });
      return;
    }
    if (!privacyAgreement) {
      dispatch({
        type: "signup/signupUser/rejected",
        payload: "Please agree to the Privacy Agreement",
      });
      return;
    }

    const signupData = {
      phoneNumber,
      password,
      inviteCode,
    };

    console.log("Dispatching signup with:", signupData);
    try {
      await dispatch(signupUser(signupData)).unwrap();
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  // Customize error messages
  let displayError = error;
  if (typeof error === "string") {
    if (error.includes("Phone number already exists")) {
      displayError =
        "This phone number is already registered. Please use a different number or log in.";
    } else if (
      error.includes("Referral code is required") ||
      error.includes("Invalid referral code")
    ) {
      displayError =
        "The invite code is invalid or required. Please check and try again.";
    } else if (error.includes("Password")) {
      displayError =
        "Password does not meet requirements. Please try a different password.";
    }
  }

  return (
  <div className="bg-[#333332] w-full flex flex-col items-center justify-center min-h-screen" >
       <Header />
      <div className="w-full mx-auto p-3 flex-1">
       
        <div className="text-left mb-0 w-full px-4 sm:px-10 mt-2">
          <h1 className="text-sm font-bold text-white mb-1">Register</h1>
          <p className="text-white text-sm sm:text-base">
            Please register by phone number
          </p>
        </div>

        <div className="bg-[#242424] p-4 sm:p-8 shadow-md w-full min-h-full mt-10 flex flex-col justify-center">
          <div className="text-center pb-2 w-full mb-3">
            <div className="flex justify-center mb-2">
              <img src={phoneicon} alt="Phone" className="w-6 h-6" />
            </div>
            <span className="text-yellow-500 font-medium text-lg">
              Register your phone
            </span>
            <div className="border-b-2 border-yellow-500 w-full mt-2"></div>
          </div>

          {displayError && (
            <p className="text-red-500 mt-4 text-center">{displayError}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-md text-white flex items-center gap-2"
              >
                <img src={phoneicon} alt="Phone" className="w-5 h-6" />
                Phone number
              </label>
              <div className="flex items-center relative">
                <div className="relative country-code-selector">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="bg-[#333332] text-gray-400 rounded-l-lg py-2 px-4 flex items-center gap-1 h-12 border-none"
                  >
                    {selectedCode}
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
                    <div className="absolute left-0 top-full mt-1 w-80 bg-[#333332] rounded-md shadow-lg z-10">
                      {countryCodes.map(({ code, country }) => (
                        <div
                          key={code}
                          className="px-5 py-3 text-[#a8a5a1] cursor-pointer flex items-center gap-4"
                          onClick={() => {
                            setSelectedCode(code);
                            setShowDropdown(false);
                          }}
                        >
                          <span>{code}</span>
                          <span className="text-base">{country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  id="phone"
                  value={phoneNumber}
                  onChange={handleInputChange(setPhoneNumber)}
                  className="bg-[#333332] text-gray-400 rounded-r-lg outline-none block w-full p-2.5 h-12 border-none"
                  placeholder="Enter 10-digit phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-md text-white flex items-center gap-2"
              >
                <img src={lockicon} alt="Lock" className="w-5 h-6" />
                Set password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Set password (min 6 characters)"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  className="bg-[#333332] text-gray-400 rounded-lg outline-none block w-full p-2.5 pr-10"
                  style={{ border: "none" }}
                  required
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-md text-white flex items-center gap-2"
              >
                <img src={lockicon} alt="Lock" className="w-5 h-6" />
                Confirm password
              </label>
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                  className="bg-[#333332] text-gray-400 rounded-lg outline-none block w-full p-2.5 pr-10"
                  style={{ border: "none" }}
                  required
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="inviteCode"
                className="block mb-2 text-md  text-white flex items-center gap-2"
              >
                <img
                  src={invitecodeicon}
                  alt="Invite Code"
                  className="w-5 h-6"
                />
                Invite code
              </label>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={handleInputChange(setInviteCode)}
                className="bg-[#333332] text-gray-400 rounded-lg outline-none block w-full p-2.5"
                placeholder="Enter invitation code (required)"
                style={{ border: "none" }}
                required
              />
            </div>

            <div className="flex items-start mb-4">
              <div className="relative">
                <input
                  id="privacyAgreement"
                  type="checkbox"
                  checked={privacyAgreement}
                  onChange={handleCheckboxChange(setPrivacyAgreement)}
                  className="appearance-none w-5 h-5 rounded-full bg-[#333332] checked:bg-[#d9ac4f] relative cursor-pointer mt-5"
                  style={{ border: "1px solid #6b7280" }}
                />
                <div className="absolute top-1 left-1 mt-5  pointer-events-none ">
                  {privacyAgreement && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor="privacyAgreement"
                className="ml-2 text-sm text-white mt-5"
              >
                I have read and agree{" "}
                <span className="text-custom-pink">[Privacy Agreement]</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-[linear-gradient(90deg,#FAE59F_0%,#C4933F_100%)] text-[#8f5206] py-3 rounded-full focus:outline-none ${
                loading ||
                !phoneNumber ||
                !password ||
                !confirmPassword ||
                !inviteCode ||
                !privacyAgreement
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                loading ||
                !phoneNumber ||
                !password ||
                !confirmPassword ||
                !inviteCode ||
                !privacyAgreement
              }
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <Link to="/login">
              <button
                type="button"
                className="w-full border mt-4 border-[#d9ac4f] text-[#a8a5a1] py-3 rounded-full focus:outline-none"
              >
                I have an account,{" "}
                <span className="font-bold text-[#d9ac4f]">Login</span>
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
