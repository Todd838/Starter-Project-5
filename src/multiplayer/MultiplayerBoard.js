// multiplayer/MultiplayerBoard.js
import React, { useState, useEffect } from "react";
import { useMultiplayer } from "./useMultiplayer";
import GuessInput from "../components/GuessInput";
import Board from "../components/Board";

export default function MultiplayerBoard({ gameId, userId }) {
  const { gameState, players, updatePlayer } = useMultiplayer(gameId, userId);
  const [foundWords, setFoundWords] = useState([]);

  const handleGuess = (word) => {
    if (!foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);

      // Update player's score in Firestore
      const newScore = (players[userId]?.score || 0) + 1; // 1 point per word
      updatePlayer({ score: newScore, foundWords: [...foundWords, word] });
    }
  };

  return (
    <div>
      <Board board={gameState.grid || []} />
      <GuessInput
        allSolutions={gameState.solutions || []}
        foundSolutions={foundWords}
        correctAnswerCallback={handleGuess}
      />
      <h4>Current Scores:</h4>
      <ul>
        {Object.entries(players).map(([id, player]) => (
          <li key={id}>
            {id} - Score: {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
