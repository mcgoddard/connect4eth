pragma solidity ^0.4.6; // Specify compiler version

contract Connect4eth {
  address player1;
  address player2;
  bool player1sTurn;

  bool player1Paid;
  bool player2Paid;
  bool gameOver;

  uint bet;

  uint8[6][7] grid;
  
  function Connect4eth(address firstPlayer, address secondPlayer, uint b) {
    player1 = firstPlayer;
    player2 = secondPlayer;
    player1Paid = false;
    player2Paid = false;
    player1sTurn = true;
    gameOver = false;
    bet = b;
  }

  function joinGame() payable {
    if (msg.sender == player1 && !player1Paid && msg.value == bet) {
      player1Paid = true;
    }
    else if (msg.sender == player2 && !player2Paid && msg.value == bet) {
      player2Paid = true;
    }
    else {
      throw;
    }
  }

  function isStarted() returns (bool) {
    return player1Paid && player2Paid;
  }

  function isFinished() returns (bool) {
    return gameOver;
  }

  function isPlayer1sTurn() returns (bool) {
    if (!player1Paid || !player2Paid || gameOver) throw;
    return player1sTurn;
  }

  function makeMove(uint8 col) {
    // check the game is in the correct state
    if (!isStarted() || gameOver) throw;
    // check the correct player is making the move
    uint8 player = 0;
    if (player1sTurn && msg.sender == player1) {
      player = 1;
    }
    else if (!player1sTurn && msg.sender == player2) {
      player = 2;
    }
    if (player == 0) throw;
    // check the column passed
    if (col > 6) throw;
    // try to make the move, will throw if the column is full
    for (uint8 i = 0; i < 8; i++) {
      if (grid[col][i] == 0) {
        grid[col][i] = player;
        break;
      }
    }
    // check if the game is won
    //for (uint8 i = 0; i < 7; i++) {
    //  for (uint8 j = 0; j < 6; j++) {
    //    grid[i][j] =
    //  }
    //}
    // let the other player go
    player1sTurn = !player1sTurn;
  }

  function getGrid() returns (uint8[6][7]) {
    return grid;
  }
}
