import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import './GuessInput.css';

function GuessInput({ allSolutions, foundSolutions, correctAnswerCallback }) {
  const [labelText, setLabelText] = useState("Make your first guess!");
  const [input, setInput] = useState("");

  function evaluateInput() {
    const normalizedInput = input.toUpperCase();

    const normalizedSolutions = allSolutions.map(word => word.toUpperCase());
    const normalizedFound = foundSolutions.map(word => word.toUpperCase());

    if (normalizedFound.includes(normalizedInput)) {
      setLabelText(`${normalizedInput} has already been found!`);
    } else if (normalizedSolutions.includes(normalizedInput)) {
      correctAnswerCallback(normalizedInput);
      setLabelText(`${normalizedInput} is correct!`);
    } else {
      setLabelText(`${normalizedInput} is incorrect!`);
    }
  }

  function keyPress(e) {
    if (e.key === 'Enter') {
      evaluateInput();
      e.target.value = "";
      setInput("");
    }
  }

  return (
    <div className="Guess-input">
      <div>{labelText}</div>
      <TextField 
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())} // automatically uppercase as you type
        onKeyPress={keyPress}
      />
    </div>
  );
}

export default GuessInput;

