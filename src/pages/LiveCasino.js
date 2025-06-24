import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gameApi from "../api/gameAPI";
import { isAuthenticated } from "../api/auth";
import CasinoHeader from "../components/CasinoHeader";

const providers = [
  { key: "bombaylive", name: "Bombay Live" },
  { key: "lg", name: "Live G24" },
  { key: "es", name: "Evolution" },
  { key: "ez", name: "Ezugi" },
  { key: "cl", name: "Betconstruct Live Games" },
];


const CasinoGames = () => {
  const [activeTab, setActiveTab] = useState(providers[0].key);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [launchingGame, setLaunchingGame] = useState(null);
  const navigate = useNavigate();

  // Fetch games for the active provider
  const fetchGamesForProvider = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameApi.fetchGames(provider);
      const gamesArray = Array.isArray(response?.games) ? response.games : [];

      // Create a Set to track unique game names
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
              console.error(`Error parsing details for game ${game.id}:`, err);
            }
          }
          uniqueGames.push({
            id: game.id,
            name: game.name || "Unnamed Game",
            imagePortrait,
            provider, // Add provider info for launch
          });
        }
        return uniqueGames;
      }, []);

      setGames(processedGames);
    } catch (error) {
      console.error(`Error fetching ${provider} games:`, error);
      if (error.response?.status === 401) {
        setError("Please log in to access games.");
        navigate("/login");
      } else {
        setError(error.message || "Failed to fetch games. Please try again.");
      }
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Launch game function
  const handleGameLaunch = async (game, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!isAuthenticated()) {
      setError("Please log in to play games.");
      navigate("/login");
      return;
    }

    setLaunchingGame(game.id);
    setError(null);

    try {
      console.log("Launching game:", game.name, "ID:", game.id, "Provider:", game.provider);

      const launchResponse = await gameApi.launchGame(game.id);

      const gameUrl =
        launchResponse?.url ||
        launchResponse?.gameUrl ||
        launchResponse?.game_url ||
        launchResponse?.launchUrl ||
        launchResponse?.redirect_url;

      if (gameUrl) {
        console.log("Game URL received:", gameUrl);
        const gameWindow = window.open(
          gameUrl,
          "_blank",
          "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no"
        );

        if (!gameWindow) {
          window.location.href = gameUrl;
        }
      } else {
        console.error("No game URL received from API. Response:", launchResponse);
        setError("Unable to launch game. No URL received from server.");
      }
    } catch (error) {
      console.error("Error launching game:", error);
      if (error.response?.status === 401 || error.status === 401) {
        setError("Please南海1Please log in to play games.");
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

  // Fetch games when the active tab changes or on initial load
  useEffect(() => {
    if (!isAuthenticated()) {
      setError("Please log in to access games.");
      navigate("/login");
      return;
    }
    fetchGamesForProvider(activeTab);
  }, [activeTab, navigate]);
  const handleImageError = (gameId) => {
    setGames(prevGames => prevGames.filter(game => game.id !== gameId));
  };


  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <CasinoHeader />
      <div className="bg-[#242424] p-3 w-full max-w-md mx-auto flex flex-col mt-12">
        {/* Horizontal scrollable tabs */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide">
          {providers.map((provider) => (
            <button
              key={provider.key}
              onClick={() => setActiveTab(provider.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-white whitespace-nowrap ${activeTab === provider.key
                  ? "bg-[#ff4d4d]"
                  : "bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                }`}
            >
              {provider.name}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <p className="text-white text-center">Loading games...</p>
        ) : Array.isArray(games) && games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="flex flex-col items-center cursor-pointer relative"
                onClick={(e) => handleGameLaunch(game, e)}
              >
                {/* Loading overlay */}
                {launchingGame === game.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-10">
                    <div className="text-white text-sm">Launching...</div>
                  </div>
                )}
                {game.imagePortrait ? (
                  <img
                    src={game.imagePortrait}
                    alt={game.name || "Game Image"}
                    className="w-full h-auto object-contain rounded-md mb-2"
                    loading="lazy"
                    onError={() => handleImageError(game.id)}
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
  );
};

export default CasinoGames;