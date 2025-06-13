import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gameApi from "../api/gameAPI";
import { isAuthenticated } from "../api/auth";
import SportHeader from "../components/SportsHeader";

const providers = [
  { key: "digitain", name: "Digitain Games" },
  { key: "inplaynet", name: "Inplaynet Games" },
];

function SportsGame() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const seenIds = new Set();
      let allGames = [];

      for (const provider of providers) {
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await gameApi.fetchGames(provider.key, page);
          console.log(`API response for ${provider.key}, page ${page}:`, response);

          const gamesArray = Array.isArray(response?.games) ? response.games : [];
          totalPages = response?.pages || 1;

          const processedGames = gamesArray.reduce((uniqueGames, game) => {
            const gameId = game.id || "";
            if (!seenIds.has(gameId) && gameId) {
              seenIds.add(gameId);
              let imagePortrait = game.image_portrait || null;

              if (!imagePortrait && game.details) {
                try {
                  const parsedDetails = JSON.parse(game.details);
                  imagePortrait = parsedDetails.image_portrait || null;
                } catch (err) {
                  console.error(`Error parsing details for game ${gameId}:`, err);
                }
              }

              uniqueGames.push({
                id: gameId,
                name: game.name || "Unnamed Game",
                imagePortrait,
              });
            }
            return uniqueGames;
          }, []);

          allGames = [...allGames, ...processedGames];
          page++;
        }
      }

      console.log("Processed games:", allGames);
      setGames(allGames);
    } catch (error) {
      console.error("Error fetching games:", error);
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

  useEffect(() => {
    if (!isAuthenticated()) {
      setError("Please log in to access games.");
      navigate("/login");
      return;
    }
    fetchAllGames();
  }, [navigate]);

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <SportHeader />

      <div className="bg-[#242424] p-3 w-full max-w-md mx-auto flex flex-col mt-12">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <p className="text-white text-center">Loading games...</p>
        ) : Array.isArray(games) && games.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {games.map((game) => (
              <div key={game.id} className="flex flex-col items-center">
                {game.imagePortrait ? (
                  <img
                    src={game.imagePortrait}
                    alt={game.name || "Game Image"}
                    className="w-full h-auto object-contain rounded-md mb-2"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=Image+Not+Found";
                    }}
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-500 rounded-md mb-2">
                    <span className="text-gray-300">No Image</span>
                  </div>
                )}
                <p className="text-white text-center text-sm">{game.name || "Game Title"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No games found.</p>
        )}
      </div>
    </div>
  );
}

export default SportsGame;