pragma solidity ^0.4.6; // Specify compiler version

contract Connect4eth {
  address player1;
  address player2;
  bool player1sTurn;

  bool player1Paid;
  bool player2Paid;
  bool gameOver;

  uint bet;

  uint8[7][] grid;
  
  function Connect4eth(address firstPlayer, address secondPlayer, uint b) {
    player1 = firstPlayer;
    player2 = secondPlayer;
    player1Paid = false;
    player2Paid = false;
    player1sTurn = true;
    gameOver = false;
    bet = b;
    for (uint8 i = 0; i < 7; i++) {
      grid.push([0,0,0,0,0,0]);
    }
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
}
