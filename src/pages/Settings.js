import React, { useState, useEffect } from "react";
import { ChevronRight, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import settingicon from "../Assets/settingicon.png";
import SettingHeader from "../components/SettingHeader";
import infoicon from "../Assets/settingicon/infoicon.png";
import kiginpasswordicon from "../Assets/settingicon/kiginpasswordicon.png";
import resetemailicon from "../Assets/settingicon/resetemailicon.png";
import BackButton from "../components/BackButton";
import user1 from "../Assets/Userimg/user1.png";
import user2 from "../Assets/Userimg/user2.png";
import user3 from "../Assets/Userimg/user3.png";
import user4 from "../Assets/Userimg/user4.png";
import user5 from "../Assets/Userimg/user5.png";
import user6 from "../Assets/Userimg/user6.png";
import user7 from "../Assets/Userimg/user7.png";
import user8 from "../Assets/Userimg/user8.png";
import user9 from "../Assets/Userimg/user9.png";
import user10 from "../Assets/Userimg/user10.png";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [showAvatarPage, setShowAvatarPage] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(settingicon);
  const [showNicknamePopup, setShowNicknamePopup] = useState(false);
  const [nickname, setNickname] = useState("MemberNNGHEGCK");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile (unchanged)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        if (data.avatar) {
          const avatarMap = {
            "user1.png": user1,
            "user2.png": user2,
            "user3.png": user3,
            "user4.png": user4,
            "user5.png": user5,
            "user6.png": user6,
            "user7.png": user7,
            "user8.png": user8,
            "user9.png": user9,
            "user10.png": user10,
          };
          setSelectedAvatar(avatarMap[data.avatar] || settingicon);
        }
      } catch (err) {
        setError("Error fetching profile: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAvatarChange = async (avatar) => {
    try {
      setLoading(true);
      setError(null);

      const avatarMap = {
        [user1]: "user1.png",
        [user2]: "user2.png",
        [user3]: "user3.png",
        [user4]: "user4.png",
        [user5]: "user5.png",
        [user6]: "user6.png",
        [user7]: "user7.png",
        [user8]: "user8.png",
        [user9]: "user9.png",
        [user10]: "user10.png",
      };

      const avatarFileName = avatarMap[avatar] || "default.png";
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarFileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      setSelectedAvatar(avatar);
      setShowAvatarPage(false);
    } catch (err) {
      setError("Error updating avatar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleConfirm = () => {
    setShowNicknamePopup(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showAvatarPage) {
    return (
      <div className="bg-[#3f3f3f] text-white min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[400px] bg-[#242424] px-4 py-3 flex items-center justify-between">
          <BackButton onClick={() => navigate("/settingsprofile")} />
          <h2 className="text-lg font-medium text-white">Change avatar</h2>
          <div className="w-6"></div>
        </div>
        <div className="w-full max-w-[400px] p-4 rounded-b-lg">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-3 gap-4">
            {[
              user1,
              user2,
              user3,
              user4,
              user5,
              user6,
              user7,
              user8,
              user9,
              user10,
            ].map((avatar, index) => (
              <div
                key={index}
                className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-yellow-500"
                onClick={() => handleAvatarChange(avatar)}
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-auto aspect-square rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#242424] text-white min-h-screen mt-10 w-full mx-auto relative">
      <SettingHeader />
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="relative">
        <div className="bg-gradient-to-r from-[#f0d68a] to-[#e0b548] h-52 w-full absolute -top-10 left-0 rounded-b-3xl"></div>

        <div className="relative bg-[#4d4d4c] rounded-lg p-6 mx-auto w-[90%] max-w-[400px] mt-14 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-500 overflow-hidden">
              <img
                src={selectedAvatar}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="text-gray-300 flex items-center text-base hover:text-white"
              onClick={() => setShowAvatarPage(true)}
            >
              Change avatar
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <div
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => setShowNicknamePopup(true)}
          >
            <div className="text-gray-300 text-lg">Nickname</div>
            <div className="flex items-center">
              <span className="mr-2 text-lg font-normal">{nickname}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-300 text-lg">UID</div>
            <div className="flex items-center">
              <span
                className="mr-3 text-white text-normal font-normal cursor-pointer"
                onClick={() => handleCopy("1952877")}
              >
                1952877
              </span>
              <button
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600"
                onClick={() => handleCopy("1952877")}
              >
                <Copy className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[400px] mx-auto mt-10 px-4">
        <h2 className="flex items-center mb-5 text-xl font-medium">
          <span className="w-1 h-6 bg-amber-500 mr-3"></span>
          Security information
        </h2>

        {[
          {
            icon: kiginpasswordicon,
            title: "Login password",
            action: "Edit",
            path: "/passwordchangeform",
          },
          {
            icon: resetemailicon,
            title: "Bind mailbox",
            action: "to bind",
            path: "/resetemail",
          },
          {
            icon: infoicon,
            title: "Updated version",
            action: "1.0.9",
            path: null,
          },
        ].map(({ icon, title, action, path }, index) => {
          const content = (
            <div className="bg-[#333333] rounded-lg p-4 mb-4 flex items-center justify-between w-full cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <img src={icon} alt={title} className="w-12 h-12" />
                </div>
                <span className="text-lg">{title}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <span className="mr-3 text-base">{action}</span>
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          );
          return path ? (
            <Link to={path} key={index}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>

      {showNicknamePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#1d1d1d] rounded-xl w-[90%] max-w-[380px] p-6 shadow-lg relative">
            <div className="bg-[#2f2f2f] rounded-xl px-6 pt-10 pb-12 min-h-[400px] flex flex-col justify-between">
              <div className="text-center mb-8 relative">
                <div className="absolute left-0 top-1/2 h-[1px] w-16 bg-[#777]"></div>
                <h2 className="text-white text-xl font-semibold">
                  Change Nickname
                </h2>
                <div className="absolute right-0 top-1/2 h-[1px] w-16 bg-[#777]"></div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <label className="text-white text-sm">Nickname</label>
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  className="w-full py-3 px-5 bg-[#1b1b1b] text-white rounded-full mb-8 border border-[#444] focus:outline-none text-base"
                />
              </div>
              <button
                className="w-full py-3 bg-gradient-to-r from-[#e0b548] to-[#f0d68a] text-black font-medium rounded-full hover:opacity-90 transition"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
              <button
                className="w-9 h-9 rounded-full border-2 border-white text-white flex items-center justify-center bg-[#1d1d1d] hover:bg-[#2a2a2a]"
                onClick={() => setShowNicknamePopup(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg flex flex-col items-center w-32 h-32">
            <svg
              className="w-20 h-20 text-white mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M10 24l10 10L38 14"
              ></path>
            </svg>
            <span className="text-sm font-sans text-center">
              Copy successful
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;