pragma solidity ^0.4.6; // Specify compiler version

import "./Connect4eth.sol";

contract Connect4ethTournament {
  address[] games;
  mapping (address => bytes32) players;
  
  function addGame(address player1, address player2, uint fee) {
    // check listed players are known
    if (players[player1] == bytes32(0x0) || players[player2] == bytes32(0x0)) throw;
    // construct game
    address newGame = new Connect4eth(player1, player2, fee);
    // add game to internal list
    games.push(newGame);
  }
  
  function addPlayer(address player, bytes32 name) {
    if (players[player] == bytes32(0x0)) throw;
    players[player] = name;
  }
  
  function getPlayerName(address playerAddress) constant returns (bytes32) {
    return players[playerAddress];
  }
  
  function getGames() constant returns(address[]) {
    return games;
  }
}
