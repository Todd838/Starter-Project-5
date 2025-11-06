import React from 'react';
import './SummaryResults.css';

function SummaryResults({ words, totalTime }) {
  return (
    <div className="Found-solutions-list">
      <h2>SUMMARY</h2>
      <div><li>Total Words Found: {words.length}</li></div>
      <div><li>Total Time: {totalTime} secs</li></div>
    </div>
  );
}

export default SummaryResults;
