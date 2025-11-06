import React, { useState, useEffect } from "react";
import ToggleGameState from "./components/ToggleGameState";
import Board from "./components/Board";
import GuessInput from "./components/GuessInput";
import SummaryResults from "./components/SummaryResults";
import FoundSolutions from "./components/FoundSolutions";
import LoadChallenge from "./components/LoadChallenge";
import Leaderboard from "./components/Leaderboard";
import RankMessage from "./components/RankMessage";
import Multiplayer from "./multiplayer/MultiplayerBoard"; // Multiplayer main component
import logo from "./logo.png";
import { GAME_STATE } from "./GameState";
import { auth, provider, db } from "./firebase/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [game, setGame] = useState({});
  const [grid, setGrid] = useState([]);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [allSolutions, setAllSolutions] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [totalTime, setTotalTime] = useState(0);
  const [rankMessage, setRankMessage] = useState("");
  const [multiplayerRoom, setMultiplayerRoom] = useState(null);

  // Convert foundwords string to array
  const convertFoundWords = (s) => {
    if (!s) return [];
    return s
      .replace(/'/g, "")
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
  };

  // Track correct answers
  const correctAnswerFound = (answer) => {
    setFoundSolutions([...foundSolutions, answer]);
  };

  // Google Sign-In
  const handleSignIn = () => {
    signInWithPopup(auth, provider).then((result) => setUser(result.user));
  };

  const handleSignOut = () => {
    signOut(auth).then(() => setUser(null));
  };

  // Send score to Firestore automatically
  const sendScore = async () => {
    if (!user || !game.id) return;
    const score = foundSolutions.length;
    await addDoc(collection(db, "scores"), {
      user: user.displayName,
      challengeId: game.id,
      score,
    });
  };

  // Trigger score submission on game end
  useEffect(() => {
    if (gameState === GAME_STATE.ENDED) {
      sendScore();
    }
  }, [gameState]);

  // Update allSolutions when grid or game changes
  useEffect(() => {
    if (game.foundwords) {
      setAllSolutions(convertFoundWords(game.foundwords));
    }
  }, [grid, game]);

  return (
    <div className="App">
      <img
        src={logo}
        width="25%"
        height="25%"
        className="logo"
        alt="Bison Boggle Logo"
      />

      {/* User Sign-In/Out */}
      {user ? (
        <div>
          <p>Signed in as {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}

      {/* Load Challenge Dropdown */}
      <LoadChallenge
        setGame={setGame}
        setGrid={setGrid}
        setAllSolutions={setAllSolutions}
      />

      {/* Start / Reset Game */}
      <ToggleGameState
        gameState={gameState}
        setGameState={setGameState}
        size={3}
        setTotalTime={setTotalTime}
      />

      {/* Rank Message */}
      {rankMessage && <RankMessage message={rankMessage} />}

      {/* Multiplayer Section */}
      {multiplayerRoom && (
        <Multiplayer
          room={multiplayerRoom}
          user={user}
          setGame={setGame}
          setGrid={setGrid}
          setAllSolutions={setAllSolutions}
        />
      )}

      {/* Single-Player Game Board */}
      {gameState === GAME_STATE.IN_PROGRESS && !multiplayerRoom && (
        <div>
          <Board board={grid} />
          <GuessInput
            allSolutions={allSolutions}
            foundSolutions={foundSolutions}
            correctAnswerCallback={correctAnswerFound}
          />
          <FoundSolutions
            headerText="Solutions you've found"
            words={foundSolutions}
          />
        </div>
      )}

      {/* Game End Screen */}
      {gameState === GAME_STATE.ENDED && (
        <div>
          <Board board={grid} />
          <SummaryResults words={foundSolutions} totalTime={totalTime} />
          <FoundSolutions
            headerText="Missed Words [>3 letters]"
            words={allSolutions.filter((w) => !foundSolutions.includes(w))}
          />
          {game.id && <Leaderboard challengeId={game.id} />}
        </div>
      )}
    </div>
  );
}

export default App;

