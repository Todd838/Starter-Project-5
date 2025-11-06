// src/components/RankMessage.js
import React from "react";

function RankMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: "yellow", padding: "10px", margin: "10px 0" }}>
      {message}
    </div>
  );
}

export default RankMessage;
