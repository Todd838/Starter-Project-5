import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

function LoadChallenge({ setGame, setGrid, setFoundSolutions, setSelectedChallenge }) {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function fetchChallenges() {
      const querySnapshot = await getDocs(collection(db, "challenges"));
      const ch = [];
      querySnapshot.forEach((doc) => {
        ch.push({ id: doc.id, ...doc.data() });
      });
      setChallenges(ch);
    }
    fetchChallenges();
  }, []);

  const handleSelect = (challenge) => {
    setSelectedChallenge(challenge);
    setGame(challenge);
    const s = challenge.grid.replace(/'/g, '"');
    setGrid(JSON.parse(s));
    setFoundSolutions([]);
  };

  return (
    <div>
      <h3>Load Challenge</h3>
      <ul>
        {challenges.map(ch => (
          <li key={ch.id}>
            <button onClick={() => handleSelect(ch)}>
              {ch.name} (High Score: {ch.highScore})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LoadChallenge;
