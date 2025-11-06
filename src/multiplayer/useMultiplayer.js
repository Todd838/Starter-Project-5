// multiplayer/useMultiplayer.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export function useMultiplayer(gameId, userId) {
  const [gameState, setGameState] = useState({});
  const [players, setPlayers] = useState({});

  // Listen to real-time updates of the game document
  useEffect(() => {
    if (!gameId) return;

    const gameRef = doc(db, "multiplayerGames", gameId);

    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setGameState(data.game || {});
        setPlayers(data.players || {});
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  // Update player state in the game
  const updatePlayer = async (newPlayerState) => {
    if (!gameId || !userId) return;
    const gameRef = doc(db, "multiplayerGames", gameId);

    await setDoc(
      gameRef,
      {
        players: {
          [userId]: newPlayerState,
        },
      },
      { merge: true }
    );
  };

  // Update global game state
  const updateGameState = async (newGameState) => {
    if (!gameId) return;
    const gameRef = doc(db, "multiplayerGames", gameId);

    await setDoc(gameRef, { game: newGameState }, { merge: true });
  };

  return { gameState, players, updatePlayer, updateGameState };
}
