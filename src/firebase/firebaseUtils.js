import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc, query, orderBy, limit } from "firebase/firestore";

export async function loadChallenges() {
  const q = query(collection(db, "challenges"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function sendScore(challengeId, userId, score) {
  await setDoc(doc(db, `challenges/${challengeId}/scores/${userId}`), { score }, { merge: true });
}

export async function getLeaderboard(challengeId, topN = 10) {
  const q = query(collection(db, `challenges/${challengeId}/scores`), orderBy("score", "desc"), limit(topN));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ user: doc.id, score: doc.data().score }));
}
