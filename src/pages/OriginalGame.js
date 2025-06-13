import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import gameApi from "../api/gameAPI";
import { isAuthenticated } from "../api/auth";
import OriginalGameHeader from "../components/OriginalGameHeader";

function OriginalGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const provider = "spribe"; // Fixed provider for Original Games

  const fetchGamesForProvider = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameApi.fetchGames(provider);
      const gamesArray = Array.isArray(response?.games) ? response.games : [];

      // Create a Set to track unique game names
      const seenNames = new Set();
      const processedGames = gamesArray.reduce((uniqueGames, game) => {
        // Normalize game name to avoid case-sensitive duplicates
        const gameName = (game.name || "").toLowerCase().trim();

        // Only include the game if its name hasn't been seen
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
            name: game.name,
            imagePortrait,
          });
        }
        return uniqueGames;
      }, []);

      setGames(processedGames);
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
    fetchGamesForProvider();
  }, [navigate]);

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <OriginalGameHeader/>

      <div className="bg-[#242424] p-3 w-full max-w-md mx-auto flex flex-col mt-12">
        <h2 className="text-white text-xl font-bold text-center mb-4">Original Games</h2>

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
        <p className="text-white text-center">{game.name || "Game Title"}</p>
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

export default OriginalGames;