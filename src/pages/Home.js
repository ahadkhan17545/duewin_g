import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaVolumeUp } from "react-icons/fa";
import gameApi from "../api/gameAPI";
import user1 from "../Assets/Userimg/user1.png";
import user2 from "../Assets/Userimg/user2.png";
import user3 from "../Assets/Userimg/user3.png";
import user4 from "../Assets/Userimg/user4.png";
import user5 from "../Assets/Userimg/user5.png";
import homepartner from "../Assets/newIcon/homepartner.png";
import user6 from "../Assets/Userimg/user6.png";
import user7 from "../Assets/Userimg/user7.png";
import user8 from "../Assets/Userimg/user8.png";
import user9 from "../Assets/Userimg/user9.png";
import user10 from "../Assets/Userimg/user10.png";
import evo from "../Assets/winning-evo.png";
import agreeborder from "../Assets/finalicons/agreeborder.png";
import agree from "../Assets/finalicons/agree.png";
import Footer from "../components/Footer";
import Homeheader from "../components/Homeheader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import speakar from "../Assets/Homeicon/speakar.png";
import hot from "../Assets/Homeicon/hot.svg";
import smallbg from "../Assets/Homeicon/smallbg.png";
import bg from "../Assets/Homeicon/bg.png";
import wingo from "../Assets/lotteryimage/1.jpg";
import wingo1 from "../Assets/lotteryimage/2.jpg";
import wingo3 from "../Assets/lotteryimage/3.jpg";
import wingo5 from "../Assets/lotteryimage/4.jpg";
import D from "../Assets/lotteryimage/5.jpg";
import D1 from "../Assets/lotteryimage/6.jpg";
import D3 from "../Assets/lotteryimage/7.jpg";
import D5 from "../Assets/lotteryimage/8.jpg";
import K from "../Assets/lotteryimage/13.jpg";
import K1 from "../Assets/lotteryimage/14.jpg";
import K3 from "../Assets/lotteryimage/15.jpg";
import K5 from "../Assets/lotteryimage/16.jpg";
import Tir from "../Assets/lotteryimage/9.jpg";
import Tir1 from "../Assets/lotteryimage/10.jpg";
import Tir3 from "../Assets/lotteryimage/11.jpg";
import Tir5 from "../Assets/lotteryimage/12.jpg";
import close from "../Assets/finalicons/close.png";
import lotteryIcon from "../Assets/Gamecategory/lottery1.png";
import originalIcon from "../Assets/Gamecategory/original.png";
import slotsIcon from "../Assets/Gamecategory/slot.png";
import sportsIcon from "../Assets/Gamecategory/sport.png";
import popularIcon from "../Assets/Gamecategory/hotgame1.png";
import casinoIcon from "../Assets/Gamecategory/live-casino.png";
import rank from "../Assets/rank.png";
import crown1 from "../Assets/additionalicons/crown1.png";
import crown2 from "../Assets/additionalicons/crown2.png";
import crown3 from "../Assets/additionalicons/crown3.png";
import place1 from "../Assets/additionalicons/place1.png";
import place2 from "../Assets/additionalicons/place2.png";
import place3 from "../Assets/additionalicons/place3.png";
import manicon from "../Assets/finalicons/manicon.png";
import reload from "../Assets/finalicons/reload.png";
import notify from "../Assets/finalicons/notifyicon.png";
import bannerone from "../Assets/finalicons/Banner1.png";
import bannerthree from "../Assets/finalicons/Banner3.png";
import whitetick from "../Assets/whitetick.png";
import apiServices from "../api/apiServices";
import { useDispatch, useSelector } from "react-redux";
import b2dark from "../Assets/home/b2-dark.png";
import bfdark from "../Assets/home/df-dark.png";
import EBEST from "../Assets/home/eBET.png";
import epdark from "../Assets/home/ep-dark.png";
import esdark from "../Assets/home/es-dark.png";
import ezdark from "../Assets/home/ez-dark.png";
import hadark from "../Assets/home/ha-dark.png";
import jili from "../Assets/home/jili.png";
import leap from "../Assets/home/leap.png";
import live from "../Assets/home/live.png";
import headerLogo from "../Assets/newLogo/newLogo.png";
import { startLoading, stopLoading } from "../redux/Slice/Loader";
import Notification from "./Notification";

import firstDeposit from "../Assets/newIcon/firstDepositS.webp";
import Bonus888 from "../Assets/newIcon/888Bonuss.webp";
import ytS from "../Assets/newIcon/ytS.webp";
import winstreakS from "../Assets/newIcon/winstreakS.webp";
import supportFundsS from "../Assets/newIcon/supportFundsS.webp";
import invitationBonusS from "../Assets/newIcon/invitationBonusS.webp";
import attandenceBonusS from "../Assets/newIcon/attandenceBonusS.webp"
import VIPS from "../Assets/newIcon/VIPS.png"
import avaitorS from "../Assets/newIcon/avaitorS.webp"
import agentS from "../Assets/newIcon/agentS.webp"

const bonusIcons = [
  {
    id: 'first-deposit',
    name: 'First Deposit',
    image: firstDeposit,
    link: '/activitygamesrules/first-deposit',
    description: 'Get bonus on your first deposit'
  },
  {
    id: '888-bonus',
    name: '888 Bonus',
    image: Bonus888,
    link: '/activitygamesrules/bonus-888',
    description: 'Daily lucky draw of ₹888'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    image: ytS,
    link: '/activitygamesrules/youtube',
    description: 'Subscribe to our YouTube channel'
  },
  {
    id: 'win-streak',
    name: 'Win Streak',
    image: winstreakS,
    link: '/activitygamesrules/winstreak',
    description: 'Win streak bonus rewards'
  },
  {
    id: 'support-funds',
    name: 'Support Funds',
    image: supportFundsS,
    link: '/activitygamesrules/support-funds',
    description: 'Up to 9% support funds on losses'
  },
  {
    id: 'invitation-bonus',
    name: 'Invitation Bonus',
    image: invitationBonusS,
    link: '/activitygamesrules/invitation-bonus',
    description: 'High invitation bonus for new agents'
  },
  {
    id: 'attendance-bonus',
    name: 'Attendance Bonus',
    image: attandenceBonusS,
    link: '/AttendanceBonus',
    description: 'Daily attendance bonus rewards'
  },
  {
    id: 'VIPS-bonus',
    name: 'VIPS Bonus',
    image: VIPS,
    link: '/vipprofile',
    description: 'Daily VIPS bonus rewards'
  },
  {
    id: 'avaitorS-bonus',
    name: 'avaitorS Bonus',
    image: avaitorS,
    link: '/activitygamesrules/aviator',
    description: 'Daily avaitorS bonus rewards'
  },
    {
    id: 'agentS-bonus',
    name: 'avaitorS Bonus',
    image: agentS,
    link: '/agentcustomer',
    description: 'Daily agentS bonus rewards'
  },
  //     {
  //   id: 'lucky10S-bonus',
  //   name: 'lucky10S Bonus',
  //   image: lucky10S,
  //   link: '/',
  //   description: 'Daily lucky10S bonus rewards'
  // }
];

// Game categories
const gameCategories = [
  { id: 1, title: "Lottery", image: lotteryIcon },
  { id: 2, title: "Hot Games", image: popularIcon },
  { id: 3, title: "Original", image: originalIcon },
  { id: 4, title: "Slots", image: slotsIcon },
  { id: 5, title: "Sports", image: sportsIcon },
  { id: 6, title: "Live Casino", image: casinoIcon },
];

// Array of user images for random selection
const userImages = [
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
];

function Home() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("Lottery");
  const [hotGames, setHotGames] = useState([]);
  const [originalGames, setOriginalGames] = useState([]);
  const [sportsGames, setSportsGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [launchingGame, setLaunchingGame] = useState(null);
  const navigate = useNavigate();
  const gameSectionRef = React.useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);

  const fetchAllGame = async () => {
    try {
      const data = await apiServices?.getGames();
      return data;
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // State for winners carousel
  const [winners, setWinners] = useState([
    { id: 1, name: "Mem***WOK", amount: 352.0, image: user1 },
    { id: 2, name: "Mem***VLG", amount: 1520.0, image: user2 },
    { id: 3, name: "Mem***MBK", amount: 122.2, image: user3 },
    { id: 4, name: "Mem***DCV", amount: 116.0, image: user4 },
    { id: 5, name: "Mem***BFE", amount: 446.0, image: user5 },
  ]);

  // Function to generate random winner
  const generateRandomWinner = () => {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase();
    const randomAmount = (Math.random() * (2000 - 100) + 100).toFixed(2);
    const randomImage =
      userImages[Math.floor(Math.random() * userImages.length)];
    return {
      id: Date.now(),
      name: `Mem***${randomString}`,
      amount: parseFloat(randomAmount),
      image: randomImage,
    };
  };

  const getUserData = async () => {
    let data = await apiServices.getUserProfile();
    setUser(data?.user);
  };

  useEffect(() => {
    getUserData();
    // fetchAllGame()
    const interval = setInterval(() => {
      setWinners((prevWinners) => {
        const newWinners = [
          generateRandomWinner(),
          ...prevWinners.slice(0, -1),
        ];
        return newWinners;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Get token from localStorage or context
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };

  const slidesettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
    touchMove: true,
    swipe: true,
    touchThreshold: 5,
    responsive: [
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    ],
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    swipeToSlide: true,
    touchMove: true,
    swipe: true,
    touchThreshold: 5,
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setTimeout(() => {
      if (gameSectionRef.current) {
        gameSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    console.log(category, category == "Live Casino");
    if (category === "Slots" || category == "Live Casino") {
      if (category == "Live Casino") {
        navigate("/casino-games");
      } else {
        const routes = { Slots: "/SlotGame", Casino: "/casino-games" };
        navigate(routes[category] || "/");
      }
    }
  };

  const fetchGames = async (category) => {
    let fewNeededGames = ["aviator", "mines", "dice", "plinko", "hilo", "keno"];
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      let games = [];

      if (category === "Hot Games") {
        const response = await fetch(
          "https://api.strikecolor1.com/api/seamless/hot-games",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let filteredGames = [];
        // let dataOfOriginal = await fetchAllGame();
        // if (dataOfOriginal?.success) {
        //   const seenNames = new Set();
        //   const normalizedNeeded = fewNeededGames.map((id) =>
        //     id.replace("-", "").toLowerCase()
        //   );
        //   filteredGames = dataOfOriginal?.games?.filter((game) =>
        //     normalizedNeeded.includes(game.id.replace("-", "").toLowerCase())
        //   );
        //   const processedGames = filteredGames.reduce((uniqueGames, game) => {
        //     const gameName = (game.name || "").toLowerCase().trim();
        //     if (!seenNames.has(gameName) && gameName && game.isActive) {
        //       seenNames.add(gameName);
        //       uniqueGames.push({
        //         id: game.id,
        //         name: game.name || "Unnamed Game",
        //         thumbnailUrl: game.thumbnailUrl || null,
        //         provider: game.provider || "spribe_crypto",
        //       });
        //     }
        //     return uniqueGames;
        //   }, []);
        //   setOriginalGames(processedGames);
        // }
        const data = await response.json();
        if (data.success) {
          const gamesArray = data.games || [];
          console.log("Before", filteredGames);
          const seenNames = new Set();
          const processedGames = gamesArray.reduce((uniqueGames, game) => {
            const gameName = (game.name || "").toLowerCase().trim();
            if (!seenNames.has(gameName) && gameName) {
              seenNames.add(gameName);
              let imagePortrait = game.image_portrait || null;
              if (!imagePortrait && game.details) {
                try {
                  const parsedDetails = JSON.parse(game.details);
                  imagePortrait = parsedDetails.image_portrait || null;
                } catch (err) {
                  console.error(
                    `Error parsing details for game ${game.id}:`,
                    err
                  );
                }
              }
              uniqueGames.push({
                id: game.id,
                name: game.name || "Unnamed Game",
                imagePortrait,
                provider: game.provider || "unknown",
              });
            }
            return uniqueGames;
          }, []);
          return processedGames;
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } else if (category === "Original") {
        let data = await fetchAllGame();
        const gamesArray = Array.isArray(data.games)
          ? data.games
          : Array.isArray(data)
            ? data
            : [];
        const seenNames = new Set();
        const processedGames = gamesArray.reduce((uniqueGames, game) => {
          const gameName = (game.name || "").toLowerCase().trim();
          if (!seenNames.has(gameName) && gameName && game.isActive) {
            seenNames.add(gameName);
            uniqueGames.push({
              id: game.id,
              name: game.name || "Unnamed Game",
              thumbnailUrl: game.thumbnailUrl || null,
              provider: game.provider || "spribe_crypto",
            });
          }
          return uniqueGames;
        }, []);
        return processedGames;
      } else if (category === "Sports") {
        const providers = ["digitain"];
        let allGames = [];
        const seenNames = new Set();
        for (const provider of providers) {
          try {
            const res = await gameApi.fetchGames(provider);
            const gamesArray = Array.isArray(res?.games) ? res.games : [];
            const processedGames = gamesArray.reduce((uniqueGames, game) => {
              const gameName = (game.name || "").toLowerCase().trim();
              if (!seenNames.has(gameName) && gameName) {
                seenNames.add(gameName);
                let imagePortrait = game.image_portrait || null;
                if (!imagePortrait && game.details) {
                  try {
                    const parsedDetails = JSON.parse(game.details);
                    imagePortrait = parsedDetails.image_portrait || null;
                  } catch (err) {
                    console.error(
                      `Error parsing details for game ${game.id}:`,
                      err
                    );
                  }
                }
                uniqueGames.push({
                  id: game.id,
                  name: game.name || "Unnamed Game",
                  imagePortrait,
                  provider: provider,
                });
              }
              return uniqueGames;
            }, []);
            allGames = [...allGames, ...processedGames];
          } catch (providerError) {
            console.error(
              `Failed to fetch games from provider ${provider}:`,
              providerError
            );
          }
        }
        return allGames;
      }
    } catch (err) {
      setError(err.message);
      console.error(`Failed to fetch ${category} games:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGameLaunch = async (game, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!getAuthToken()) {
      setError("Please log in to play games.");
      navigate("/login");
      return;
    }

    setLaunchingGame(game.id);
    setError(null);

    try {
      console.log(
        "Launching game:",
        game.name,
        "ID:",
        game.id,
        "Provider:",
        game.provider
      );

      let launchResponse;
      if (game.provider.includes("spribe")) {
        const token = getAuthToken();
        const response = await fetch(
          `https://api.strikecolor1.com/api/spribe/launch/${game.id}?userId=${user?.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        launchResponse = await response.json();
      } else {
        launchResponse = await gameApi.launchGame(game.id);
      }

      const gameUrl =
        launchResponse?.url ||
        launchResponse?.gameUrl ||
        launchResponse?.game_url ||
        launchResponse?.launchUrl ||
        launchResponse?.redirect_url;

      if (gameUrl) {
        // console.log("Game URL received:", gameUrl);
        // const gameWindow = window.open(
        //   gameUrl,
        //   "_blank",
        //   "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no"
        // );

        // if (!gameWindow) {
        //   window.location.href = gameUrl;
        // }
        window.location.href = gameUrl;
      } else {
        console.error(
          "No game URL received from API. Response:",
          launchResponse
        );
        setError("Unable to launch game. No URL received from server.");
      }
    } catch (error) {
      console.error("Error launching game:", error);
      if (error.response?.status === 401 || error.status === 401) {
        setError("Please log in to play games.");
        navigate("/login");
      } else if (error.response?.status === 403 || error.status === 403) {
        setError("Insufficient balance or access denied.");
      } else if (error.response?.status === 404 || error.status === 404) {
        setError("Game not found or launch endpoint unavailable.");
      } else {
        setError(error.message || "Failed to launch game. Please try again.");
      }
    } finally {
      setLaunchingGame(null);
    }
  };

  useEffect(() => {
    if (activeCategory === "Hot Games") {
      fetchGames("Hot Games").then(setHotGames);
    } else if (activeCategory === "Original") {
      fetchGames("Original").then(setOriginalGames);
    } else if (activeCategory === "Sports") {
      fetchGames("Sports").then(setSportsGames);
    }
  }, [activeCategory]);

  useEffect(() => {
    // iOS Safari specific fixes
    const preventHorizontalSwipe = (e) => {
      // Only prevent horizontal swipes on the main container
      const target = e.target;
      const isSlider = target.closest('.slick-slider') || target.closest('.slick-track');

      if (!isSlider) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;

        // Allow vertical scrolling, prevent horizontal
        if (Math.abs(e.movementX) > Math.abs(e.movementY)) {
          e.preventDefault();
        }
      }
    };

    // Add passive: false only for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const options = isIOS ? { passive: false } : { passive: true };

    document.addEventListener("touchmove", preventHorizontalSwipe, options);

    // Force repaint on iOS to fix rendering issues
    if (isIOS) {
      const forceRepaint = () => {
        document.body.style.display = 'none';
        // Trigger reflow by accessing offsetHeight
        const _ = document.body.offsetHeight;
        document.body.style.display = '';
      };

      // Force repaint after component mounts
      setTimeout(forceRepaint, 100);
    }

    return () => {
      document.removeEventListener("touchmove", preventHorizontalSwipe, options);
    };
  }, []);

  const [checked, setChecked] = useState(false);

  const earnings = [
    { id: 1, name: "Mem***AXT", amount: 213289650, rank: "N01" },
    { id: 2, name: "Mem***Y1R", amount: 174203429, rank: "N02" },
    { id: 3, name: "Mem***BBM", amount: 114002435, rank: "N03" },
    { id: 4, name: "Mem***ZJ0", amount: 106615180.0 },
    { id: 5, name: "Mem***Q21", amount: 541543016.0 },
    { id: 6, name: "Sah***dhi", amount: 528783489.0 },
    { id: 7, name: "Mem***ZJ0", amount: 106615180.0 },
    { id: 8, name: "Mem***Q21", amount: 541543016.0 },
    { id: 9, name: "Sah***dhi", amount: 528783489.0 },
    { id: 10, name: "Ram***dhi", amount: 5287832134.0 },
  ];

  const [lotterycardData] = useState([
    {
      id: 1,
      imgSrc: wingo,
      alt: "Wingo Image",
      title: "Win Go",
      link: "/lotterywingo",
      value: 0,
    },
    {
      id: 2,
      imgSrc: wingo1,
      alt: "Wingo 1Min Image",
      title: "Win Go 1Min",
      link: "/lotterywingo",
      value: 1,
    },
    {
      id: 3,
      imgSrc: wingo3,
      alt: "Wingo 3Min Image",
      title: "Win Go 3Min",
      link: "/lotterywingo",
      value: 2,
    },
    {
      id: 4,
      imgSrc: wingo5,
      alt: "Wingo 5Min Image",
      title: "Win Go 5Min",
      link: "/lotterywingo",
      value: 3,
    },
    {
      id: 5,
      imgSrc: K,
      alt: "K3 Image",
      title: "K3 1Min",
      link: "/lotteryK3",
      value: 0,
    },
    {
      id: 6,
      imgSrc: K1,
      alt: "K3 3Min Image",
      title: "K3 3Min",
      link: "/lotteryK3",
      value: 1,
    },
    {
      id: 7,
      imgSrc: K3,
      alt: "K3 5Min Image",
      title: "K3 5 Min",
      link: "/lotteryK3",
      value: 2,
    },
    {
      id: 8,
      imgSrc: K5,
      alt: "K3 10Min Image",
      title: "K3 10 Min",
      link: "/lotteryK3",
      value: 3,
    },
    {
      id: 9,
      imgSrc: D,
      alt: "5D Image",
      title: "5D 1 Min",
      link: "/lottery5d",
      value: 0,
    },
    {
      id: 10,
      imgSrc: D1,
      alt: "5D 3Min Image",
      title: "5D 3 Min",
      link: "/lottery5d",
      value: 1,
    },
    {
      id: 11,
      imgSrc: D3,
      alt: "5D 5Min Image",
      title: "5D 5 Min",
      link: "/lottery5d",
      value: 2,
    },
    {
      id: 12,
      imgSrc: D5,
      alt: "5D 10Min Image",
      title: "5D 10 Min",
      link: "/lottery5d",
      value: 3,
    },
    {
      id: "1",
      imgSrc: Tir,
      alt: "Trx Image",
      title: "Trx 1min",
      link: "/lotterytrxwing",
      value: 0,
    },
    {
      id: 14,
      imgSrc: Tir1,
      alt: "Trx 3min Image",
      title: "Trx 3min",
      link: "/lotterytrxwing",
      value: 1,
    },
    {
      id: 15,
      imgSrc: Tir3,
      alt: "Trx 5min Image",
      title: "Trx 5 min",
      link: "/lotterytrxwing",
      value: 2,
    },
    {
      id: 16,
      imgSrc: Tir5,
      alt: "Trx 10min Image",
      title: "Trx 10 Min",
      link: "/lotterytrxwing",
      value: 3,
    },
  ]);
  const staticUserData = [
    { img: live, color: "bg-red-500" },
    { img: leap, color: "bg-blue-500" },
    { img: jili, color: "bg-green-500" },
    { img: hadark, color: "bg-yellow-500" },
    { img: esdark, color: "bg-purple-500" },
    { img: ezdark, color: "bg-pink-500" },
    { img: epdark, color: "bg-orange-500" },
    { img: EBEST, color: "bg-teal-500" },
    { img: bfdark, color: "bg-indigo-500" },
    { img: b2dark, color: "bg-emerald-500" },
  ];

  const [showFirstPopup, setShowFirstPopup] = useState(true);
  const [showSecondPopup, setShowSecondPopup] = useState(true);

  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [displayedWinners, setDisplayedWinners] = useState([]);
  const [userData, setUserData] = useState(null);
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
      } catch (err) { }
    };

    fetchUserProfile();
  }, []);
  useEffect(() => {
    const storedTime = localStorage.getItem("noReminderUntil");

    if (storedTime && parseInt(storedTime) > Date.now()) {
      setShowSecondPopup(false);
    } else {
      setShowSecondPopup(true);
      localStorage.removeItem("noReminderUntil"); // Cleanup if expired
    }
  }, []);

  // Create rotated winners array for carousel effect
  useEffect(() => {
    const rotatedWinners = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentWinnerIndex + i) % winners.length;
      rotatedWinners.push(winners[index]);
    }
    setDisplayedWinners(rotatedWinners);
  }, [currentWinnerIndex, winners]);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinnerIndex((prevIndex) => (prevIndex + 1) % winners.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [winners.length]);

  const groupedLotteryGames = {
    Wingo: lotterycardData
      .filter((game) => game.title.startsWith("Win Go"))
      .slice(0, 4),
    K3: lotterycardData
      .filter((game) => game.title.startsWith("K3"))
      .slice(0, 4),
    "5D": lotterycardData
      .filter((game) => game.title.startsWith("5D"))
      .slice(0, 4),
    Trx: lotterycardData
      .filter((game) => game.title.startsWith("Trx"))
      .slice(0, 4),
  };

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (newChecked) {
      // Store current timestamp
      const now = new Date().getTime();
      localStorage.setItem("noReminderUntil", now + 24 * 60 * 60 * 1000); // 24 hours ahead
    } else {
      localStorage.removeItem("noReminderUntil");
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-[#242424] min-h-screen w-full max-w-full md:max-w-[400px] mx-auto overflow-x-hidden">
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 bg-red-700 px-2 py-1 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}
      <div
        className={
          showFirstPopup || showSecondPopup
            ? "opacity-50 w-full"
            : "opacity-100 w-full"
        }
      >
        <Homeheader />
        <div className="w-full flex flex-col overflow-x-hidden p-3 mt-20">
          <div className="w-full py-2 overflow-hidden">
            <Slider {...settings}>
              {bonusIcons.map((bonus, index) => (
                <div key={bonus.id} className="px-1">
                  <Link to={bonus.link} className="block hover:opacity-80 transition-opacity">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={bonus.image}
                        alt={bonus.name}
                        className="w-full h-44 object-contain rounded-lg"
                      />

                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
          <div className="w-full -mt-4">
            <div className="p-2 rounded-xl shadow-md">
              <div className="flex justify-between items-center w-full">
                <img src={speakar} alt="Speaker Icon" className="w-6 h-6" />
                <div
                  className="h-6 relative"
                  style={{
                    width: "100%",
                    zIndex: 0,
                  }}
                >
                  <Notification />
                </div>
                <Link to="/notificationsService">
                  <button className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] rounded-md px-4 py-1 flex items-center justify-center">
                    <img src={hot} alt="Hot Icon" className="w-3 h-3" />

                    <span className="ml-1 text-xs font-semibold">Detail</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full relative -mt-1">
            {showPopup && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-black bg-opacity-80 px-6 py-4 rounded-xl flex flex-col items-center text-white">
                  <img
                    src={whitetick}
                    alt="Success"
                    className="w-10 h-10 mb-2 object-contain"
                  />
                  <p className="text-sm">Refresh successfully</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-full py-2 mt-4">
            <div className="flex w-full gap-2 mb-4">
              {gameCategories.slice(0, 2).map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryChange(category.title)}
                  className={`flex-1 h-[120px] flex items-start justify-between cursor-pointer rounded-lg relative overflow-hidden transition-all duration-300 ${activeCategory === category.title
                    ? "opacity-100"
                    : "opacity-80"
                    }`}
                  style={{
                    background: `linear-gradient(60deg, ${category.title === "Lottery"
                      ? "#323838, #30413B,#2D4D40"
                      : "#323838, #3B3541,#542E57"
                      })`,
                  }}
                >
                  <div className="w-full h-full flex flex-row items-center justify-between p-4 relative">
                    <span className="text-white text-sm font-bold self-start">
                      {category.title}
                    </span>
                    <img
                      src={category.image}
                      alt={category.title}
                      className={`w-[220px] object-contain -mt-4 -mr-4 ${category.title === "Hot Games"
                        ? "h-[300px]"
                        : "h-[220px] -mt-9"
                        }`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full gap-2">
              {gameCategories.slice(2, 6).map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryChange(category.title)}
                  className={`flex-1 h-[80px] flex items-center justify-center cursor-pointer rounded-lg relative overflow-hidden transition-all duration-300 ${activeCategory === category.title
                    ? "opacity-100"
                    : "opacity-80"
                    }`}
                  style={{
                    background: `linear-gradient(90deg, ${category.title === "Live Casino"
                      ? "#323838,#433767"
                      : category.title === "Sports"
                        ? "#323838, #303D36,#2E4A33"
                        : category.title === "Slots"
                          ? "#323838,#4B3F31"
                          : "#323838,#333937,#404D33"
                      })`,
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-[60px] object-contain"
                    />
                    <div className="w-full text-center -mt-1">
                      <span className="text-white text-xs font-bold">
                        {category.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={gameSectionRef} className="w-full py-2 overflow-hidden">
            {activeCategory === "Lottery" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Lottery
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    when you win a super jackpot, you will receive additional
                    rewards
                  </p>
                </div>
                <div className="w-full py-2">
                  {["Wingo", "K3", "5D", "Trx"].map((groupName) => (
                    <div key={groupName} className="w-full mb-4">
                      <h3 className="text-base font-semibold flex items-center gap-2 text-white mt-4 mb-2">
                        <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                        {groupName}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {groupedLotteryGames[groupName].map((slide) => (
                          <div key={slide.id} className="w-full">
                            <Link
                              to={slide.link}
                              className="block relative hover:scale-105 transition-transform duration-200"
                              state={slide?.value}
                            >
                              <img
                                src={slide.imgSrc}
                                alt={slide.alt}
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 p-1 rounded-b-lg"></div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeCategory === "Hot Games" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Hot Games
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    Popular games trending now
                  </p>
                </div>
                <div className="w-full py-2">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {loading ? (
                    <p className="text-white text-center">Loading games...</p>
                  ) : Array.isArray(hotGames) && hotGames.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {hotGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-auto object-contain rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}

                      {originalGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-40 object-cover rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-center">No games found.</p>
                  )}
                </div>
              </div>
            )}
            {activeCategory === "Original" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Original Games
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    Exclusive in-house games
                  </p>
                </div>
                <div className="w-full py-2">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {loading ? (
                    <p className="text-white text-center">Loading games...</p>
                  ) : Array.isArray(originalGames) &&
                    originalGames.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {originalGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-40 object-cover rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-center">No games found.</p>
                  )}
                </div>
              </div>
            )}
            {activeCategory === "Sports" && (
              <div className="w-full">
                <div className="w-full">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-white">
                    <span className="w-1 h-4 bg-[#C4933F] inline-block rounded-sm"></span>
                    Sports
                  </h2>
                  <p className="text-xs text-gray-400 ml-2">
                    Bet on your favorite sports events
                  </p>
                </div>
                <div className="w-full py-2">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {loading ? (
                    <p className="text-white text-center">Loading games...</p>
                  ) : Array.isArray(sportsGames) && sportsGames.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {sportsGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col items-center cursor-pointer relative"
                          onClick={(e) => handleGameLaunch(game, e)}
                        >
                          {launchingGame === game.id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                              <div className="text-white text-sm">
                                Launching...
                              </div>
                            </div>
                          )}
                          {game.imagePortrait ? (
                            <img
                              src={game.imagePortrait}
                              alt={game.name || "Game Image"}
                              className="w-full h-40 object-cover rounded-md mb-2"
                              loading="lazy"
                              onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/150?text=Image+Not+Found")
                              }
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                              <span className="text-gray-300">No Image</span>
                            </div>
                          )}
                          <p className="text-white text-center text-sm">
                            {game.name || "Game Title"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white text-center">No games found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-full  bg-[#242424] rounded-lg shadow-lg mb-3">
            <h2 className="text-lg font-bold text-[#C4933F] mb-2 border-l-4 ml-1 border-[#C4933F] pl-2">
              Winning Information
            </h2>
            <div
              className="space-y-2 relative"
              style={{
                height: "320px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div className="relative w-[96%] h-[320px] overflow-hidden rounded-lg p-2">
                {winners.map((winner, index) => (
                  <div
                    key={winner.id}
                    className="absolute left-0 right-0 mx-auto flex items-center bg-[#333332] p-2 rounded-lg transition-all duration-500 ease-in-out"
                    style={{
                      top: `${index * 65}px`,
                      opacity: 1 - index * 0.1,
                      // transform: `scale(${1 - index * 0.02})`,
                      zIndex: winners.length - index,
                      animation:
                        index === 0 ? "slideDown 0.4s ease-out" : "none",
                      maxHeight: "57px",
                      minWidth: "336px",
                      gap: window.innerWidth < 380 ? '10%' : '15%'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={winner.image}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-[#a8a5a1] font-medium text-xs">
                        {winner.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        src={evo}
                        alt="Icon"
                        className="w-14 h-10 rounded-sm object-cover"
                      />
                      <div className="text-right">
                        <p className="text-[#C4933F] font-semibold text-xs">
                          Receive ₹{winner.amount.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-xs">Winning amount</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full py-1 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold text-[#C4933F] mb-4 border-l-4 border-[#C4933F] pl-2 mt-4">
                Today's Earnings Chart
              </h2>
              <div
                className="relative w-full h-32 bg-cover bg-center mb-6 mt-24 text-xs"
                style={{ backgroundImage: `url(${rank})` }}
              >
                {earnings.slice(0, 3).map((earner, index) => (
                  <div
                    key={earner.id}
                    className="absolute text-center text-[#8f5206]"
                    style={{
                      top: index === 0 ? "10%" : "20%",
                      left: index === 0 ? "50%" : index === 1 ? "15%" : "85%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      <img
                        src={
                          index === 0 ? crown1 : index === 1 ? crown2 : crown3
                        }
                        alt={`Crown ${index + 1}`}
                        className="w-12 h-12 mx-auto absolute -top-8 left-1/2 transform -translate-x-1/2 z-10"
                      />
                      <img
                        src={userImages[index]}
                        alt="User"
                        className="w-16 h-16 rounded-full object-cover mx-auto relative z-0"
                      />
                    </div>
                    <img
                      src={index === 0 ? place1 : index === 1 ? place2 : place3}
                      alt={`Place ${index + 1}`}
                      className="w-12 h-4 mx-auto mt-0"
                    />
                    <p className="font-medium mt-4 text-xs">{earner.name}</p>
                    <p className="text-[#8f5206] font-medium rounded-full px-2 py-0.5 bg-gradient-to-r from-[#fae59f] to-[#c4933f] mt-2 text-xs">
                      ₹{earner.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pb-10">
                {earnings.slice(0, 5).map((earner, index) => (
                  <div
                    key={earner.id}
                    className="flex items-center justify-between bg-[#333332] p-2 rounded-lg text-xs w-56%"
                  >
                    <div className="flex items-center gap-1">
                      <p className="text-[#a8a5a1] text-base font-semibold">
                        {index + 1}
                      </p>
                      <img
                        src={userImages[index % userImages.length]}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover ml-3"
                      />
                      <span className="text-[#a8a5a1] text-xs ml-3">
                        {earner.name}
                      </span>
                    </div>
                    <p className="text-[#8f5206] text-base px-6 py-0.5 rounded-full font-semibold bg-gradient-to-r from-[#fae59f] to-[#c4933f] text-sm">
                      ₹{earner.amount.toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="bg-[#333332] px-2 py-1 rounded-lg text-white space-y-4">
                  {/* Full Width Image */}
                  <img src={homepartner} alt="image" className="w-full mt-2 h-[475px] object-cover" />

                  {/* 📝 Bottom Paragraphs (Styled Like the Image) */}
                  <div className="space-y-3 text-sm text-[#d9d7d3]">
                    <p className="flex gap-2">
                      <span className="text-[#c38d2f]">◆</span>
                      The platform advocates fairness, justice, and openness. We
                      mainly operate fair lottery, blockchain games, live
                      casinos, and slot machine games.
                    </p>
                    <p className="flex gap-2">
                      <span className="text-[#c38d2f]">◆</span>
                      strike works with more than 10,000 online live game
                      dealers and slot games, all of which are verified fair
                      games.
                    </p>
                    <p className="flex gap-2">
                      <span className="text-[#c38d2f]">◆</span>
                      Strike supports fast deposit and withdrawal, and looks
                      forward to your visit.
                    </p>
                    <p className="text-[#ff4c4c] pt-2">
                      Gambling can be addictive, please play rationally.
                    </p>
                    <p className="text-[#ff4c4c]" style={{ paddingBottom: '30px' }}>
                      Strike only accepts customers above the age of{" "}
                      <span className="font-bold">18</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {(showFirstPopup || showSecondPopup) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-center pt-[10vh] px-2">
          {!userData?.has_received_first_bonus &&
            showSecondPopup &&
            !showFirstPopup && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 overflow-y-auto">
                <div className="relative flex flex-col items-center mb-12">
                  <div className="w-[90vw] max-w-[350px] max-h-[90vh] bg-[#333332] rounded-lg shadow-lg text-white flex flex-col">
                    <div className="w-full bg-[#4d4d4c] text-center py-2 rounded-t-lg">
                      <h2 className="text-base font-bold">
                        Extra First Deposit Bonus
                      </h2>
                      <p className="text-xs text-gray-300 mt-1">
                        Each account can only receive rewards once
                      </p>
                    </div>
                    <div
                      className="overflow-y-auto px-2 pb-4"
                      style={{ maxHeight: "60vh", paddingTop: "20px" }}
                    >
                      {[
                        { deposit: 200000, bonus: 10000 },
                        { deposit: 100000, bonus: 5000 },
                        { deposit: 30000, bonus: 2000 },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-[#4d4d4c] p-2 rounded-lg mb-2"
                        >
                          <p className="text-sm flex justify-between">
                            <span>
                              First Deposit{" "}
                              <span className="text-[#dd9138]">
                                {item.deposit}
                              </span>
                            </span>
                            <span className="text-[#dd9138]">
                              + ₹{item.bonus}
                            </span>
                          </p>
                          <p className="text-xs text-[#a8a5a1]">
                            Deposit {item.deposit} for the first time and
                            receive ₹{item.bonus} bonus.
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="relative w-[70%] h-4 bg-[#242424] rounded-full">
                              <div className="absolute top-0 left-0 h-full w-0 bg-yellow-400 rounded-full"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-sm z-10">0/{item.deposit}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate("/deposit")}
                              className="ml-2 px-2 py-1 text-[#ed9138] border-2 text-xs rounded-md"
                            >
                              Deposit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center bg-[#4d4d4c] text-[#a8a5a1] py-4 px-4 rounded-b-lg">
                      <label
                        className="flex items-center text-xs cursor-pointer"
                        onClick={handleCheckboxChange}
                      >
                        <img
                          src={checked ? agree : agreeborder}
                          alt="agree"
                          className="w-6 h-6"
                        />
                        <span className="ml-1">No more reminders today</span>
                      </label>

                      <button
                        onClick={() => navigate("/activityPage")}
                        className="bg-gradient-to-r from-[#FAE59F] to-[#C4933F] text-[#8f5206] px-8 py-2 rounded-full font-bold text-xs"
                      >
                        Activity
                      </button>
                    </div>
                  </div>
                  <button
                    className="mt-3 bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all duration-200"
                    onClick={() => setShowSecondPopup(false)}
                  >
                    <img src={close} alt="close" className="w-7 h-7" />
                  </button>
                </div>
              </div>
            )}
          {showFirstPopup && (
            <div className="w-full max-w-[350px] h-auto max-h-[90vh] bg-[#333] rounded-lg shadow-lg text-white p-0 relative overflow-hidden flex flex-col items-center">
              <h2
                className="text-lg font-bold text-white py-3 w-full text-center"
                style={{
                  background:
                    "linear-gradient(to bottom, #6F6F6F 0%, #404040 100%)",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  margin: "0",
                }}
              >
                Login Welcome
              </h2>
              <div className="flex-1 overflow-y-auto max-h-[400px] px-3 pb-3 w-full flex flex-col items-center text-center">
                {/* Header */}
                <div
                  className="text-black text-xs font-semibold text-center mt-4 w-fit px-2 font-[Arial] py-1"
                  style={{ backgroundColor: "rgb(255, 255, 0)" }}
                >
                  Login Welcome
                </div>

                {/* Main Title */}
                <div className="text-white text-lg font-bold mt-3 mb-2">
                  🌟 STRIKEGAME.LIVE 🌟
                </div>

                {/* Description */}
                <p className="text-white text-sm font-[Arial] leading-relaxed mt-2 px-2">
                  📌 Strike is the digital evolution of a legendary Goa-based casino, trusted since 2016. Known for its thrilling in-house action and high-stakes excitement, Strike is now launching online — bringing the casino floor straight to your screen.
                </p>

                {/* Official Services */}
                <div className="flex flex-col gap-2 mt-4 text-base">
                  {[
                    { title: "Official Telegram Group", link: "https://t.me/killer_mao" },
                    { title: "Official Customer Service", link: "https://t.me/killer_mao" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="text-green-500 text-lg">✅</span>
                      <a href={item.link} target="_blank" className="text-[#0000EE] font-bold text-sm">
                        {item.title}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <div className="mt-4 text-sm font-medium space-y-1">
                  <p className="text-white">⭐ High invitation bonus for new agents</p>
                  <p className="text-white">⭐ Up to 9% support funds on user losses</p>
                  <p className="text-white">⭐ Daily Lucky Draw of ₹888 for 3 lucky users</p>
                  <p className="text-white">⭐ Instant withdrawals anytime</p>
                  <p className="text-white">⭐ 24×7 customer service support</p>
                  <p className="text-white">⭐ The most professional action gaming experience</p>
                  <p className="text-white">⭐ High-quality agent benefits & earnings</p>
                  <p className="text-white">⭐ The number one casino-action game platform</p>
                </div>

                {/* Promotion Section */}
                <div className="mt-4 space-y-1">
                  <p className="flex items-center justify-center">
                    💎{" "}
                    <span className="text-white font-medium text-sm font-[Arial] mx-1">
                      Click to promote – become an agent
                    </span>{" "}
                    💎
                  </p>
                  <p className="text-white text-sm font-[Arial]">
                    💎 Earn income every day
                  </p>
                  <p className="text-white text-sm font-[Arial]">
                    💎 Official Telegram id ......................
                  </p>
                </div>
              </div>
              <div className="mt-2 pb-3">
                <button
                  className="px-8 py-2 rounded-full font-bold text-white text-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #FAE59F 0%, #C4933F 100%)",
                  }}
                  onClick={() => {
                    setShowFirstPopup(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
