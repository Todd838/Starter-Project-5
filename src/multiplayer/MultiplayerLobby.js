// multiplayer/MultiplayerLobby.js
import React, { useState } from "react";
import { useMultiplayer } from "./useMultiplayer";

export default function MultiplayerLobby({ userId }) {
  const [gameId, setGameId] = useState("");
  const [joined, setJoined] = useState(false);
  const { players, updatePlayer } = useMultiplayer(gameId, userId);

  const handleJoin = () => {
    if (gameId.trim() === "") return;
    updatePlayer({ score: 0, status: "joined" });
    setJoined(true);
  };

  return (
    <div>
      {!joined ? (
        <div>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <button onClick={handleJoin}>Join Game</button>
        </div>
      ) : (
        <div>
          <h3>Game ID: {gameId}</h3>
          <h4>Players in lobby:</h4>
          <ul>
            {Object.entries(players).map(([id, player]) => (
              <li key={id}>
                {id} - Score: {player.score} - Status: {player.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
