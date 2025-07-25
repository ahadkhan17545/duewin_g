import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Import icons
import icons8Activity from "./../Assets/icons8-activity.png";
import icons8Diamond from "./../Assets/icons8-diamond.png";
import icons8Wallet from "./../Assets/icons8-wallet.png";
import icons8man from "./../Assets/icons8-man.png";
import home from "./../Assets/Summer.png";

// Active icons
import icons8ActivityActive from "../Icons/active.png";
import icons8DiamondActive from "../Icons/icons8-diamond-64.png";
import icons8WalletActive from "../Icons/icons8-wallet-68.png";
import icons8manActive from "../Icons/icons8-man-48.png";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: "promotion",
      path: "/promotionpage",
      icon: icons8Diamond,
      activeIcon: icons8DiamondActive,
      label: "Promotion",
    },
    {
      id: "activity",
      path: "/activitypage",
      icon: icons8Activity,
      activeIcon: icons8ActivityActive,
      label: "Activity",
    },
    { id: "home", path: "/", icon: home, activeIcon: home, label: "" },
    {
      id: "wallet",
      path: "/wallet",
      icon: icons8Wallet,
      activeIcon: icons8WalletActive,
      label: "Wallet",
    },
    {
      id: "account",
      path: "/profilepage",
      icon: icons8man,
      activeIcon: icons8manActive,
      label: "Account",
    },
  ];

  const getActiveTabFromPath = (pathname) => {
    const tab = tabs.find((tab) => pathname === tab.path);
    return tab ? tab.id : "home";
  };

  const [activeTab, setActiveTab] = useState(
    getActiveTabFromPath(location.pathname)
  );

  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    const tabData = tabs.find((t) => t.id === tab);
    if (tabData) {
      navigate(tabData.path);
      setActiveTab(tab);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-50"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="relative footer-responsive"
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "70px",
        }}
      >
        {/* Main navigation bar with curved cutout */}
        <div
          className="bg-[#333332] shadow-lg rounded-t-3xl relative"
          style={{
            width: "100%",
            height: "70px",
            display: "flex",
            alignItems: "center",
            overflow: "visible",
            WebkitMask:
              "radial-gradient(circle at 50% 0%, transparent 43px, white 47px)",
            mask: "radial-gradient(circle at 50% 0%, transparent 43px, white 47px)",
          }}
        >
          <div className="relative w-full h-full flex justify-around items-center">
            {tabs.map(
              (tab) =>
                tab.id !== "home" && (
                  <div
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex flex-col items-center justify-center cursor-pointer px-2"
                    style={{
                      flex: 1,
                      maxWidth: "22%",
                      marginLeft:
                        tab.id === "activity"
                          ? "-13%"
                          : tab.id === "promotion"
                            ? "-5%"
                            : "",

                      marginRight:
                        tab.id === "wallet"
                          ? "-13%"
                          : tab.id === "account"
                            ? "-5%"
                            : "",
                    }}
                  >
                    <img
                      src={activeTab === tab.id ? tab.activeIcon : tab.icon}
                      alt={tab.label}
                      className={`${tab.id === "wallet" || tab.id === "account" ? "w-8 h-8" : "w-10 h-10"}`}
                    />
                    <span
                      className="text-xs font-medium tracking-wide whitespace-nowrap"
                      style={{
                        color: activeTab === tab.id ? "#d9ac4f" : "#d1d5db",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Home button positioned inside the curved cutout */}
        <div
          onClick={() => handleTabClick("home")}
          className="absolute left-1/2 cursor-pointer"
          style={{
            top: "-35px", // Position it inside the curve
            transform: "translateX(-50%)",
            zIndex: 20,
            background: "#323232",
            borderRadius: "50%",
          }}
        >
          <img
            src={home}
            alt="Home"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Footer;
