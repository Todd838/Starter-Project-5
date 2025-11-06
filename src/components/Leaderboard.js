import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

function Leaderboard({ challengeId }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      if (!challengeId) return;
      const q = query(
        collection(db, "scores"),
        where("challengeId", "==", challengeId),
        orderBy("score", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      setLeaders(snapshot.docs.map(doc => doc.data()));
    }
    fetchScores();
  }, [challengeId]);

  return (
    <div>
      <h3>Leaderboard</h3>
      <ol>
        {leaders.map((l, idx) => (
          <li key={idx}>{l.userName}: {l.score}</li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
