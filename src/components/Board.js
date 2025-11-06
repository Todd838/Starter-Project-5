import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React from 'react';
import './Board.css';

function Board({ board }) {
  function tile(id, letter) {
    return (
      <Grid key={id} item xs={1} className="Tile">
        <Paper elevation={4} className="Tile-paper">{letter}</Paper>
      </Grid>
    );
  }

  function rowOfTiles(id, rowObj) {
    return (
      <Grid key={id} container spacing={1} justifyContent="center">
        {Object.keys(rowObj).map((letterKey) => tile(letterKey + id, rowObj[letterKey]))}
      </Grid>
    );
  }

  function gridOfRows(board) {
    return (
      <Grid item xs={12}>
        {Object.keys(board).map((rowKey) => rowOfTiles(rowKey, board[rowKey]))}
      </Grid>
    );
  }

  return (
    <div className="Board-div">
      <Grid container justifyContent="center">
        {gridOfRows(board)}
      </Grid>
    </div>
  );
}

export default Board;
