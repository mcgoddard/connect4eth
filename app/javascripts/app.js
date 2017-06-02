// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import connect4ethTournament_artifacts from '../../build/contracts/Connect4ethTournament.json'

window.Connect4ethTournament = contract(connect4ethTournament_artifacts);

function populateGamesData(contractInstance) {
  contractInstance.getGames().then(function(g) {
    $("#games-rows").html("");
    for (var i = 0; i < g.length; i++) {
      let gameAddress = g[i];
      contractInstance.getGameName(g[i]).then(function(name) {
        $("#games-rows").append("<tr>");
        $("#games-rows").append("<td>"+web3.toAscii(name)+"</td>");
        $("#games-rows").append("</tr>");
      });
    }
  });
}

function populatePlayersData(contractInstance) {
  contractInstance.getPlayers().then(function(ps) {
    $("#player-rows").html("");
    for (var i = 0; i < ps.length; i++) {
      let playerAddress = ps[i];
      contractInstance.getPlayerName(playerAddress).then(function(name) {
        $("#player-rows").append("<tr><td>"+web3.toAscii(name)+"</td><td>"+playerAddress+"</td></tr>");
      });
    }
  });
}

window.addGame = function addGame() {
  Connect4ethTournament.deployed().then(function(contractInstance) {
    let p1 = $("#add-game-p1").val();
    let p2 = $("#add-game-p2").val();
    let gameName = $("#add-game-name").val();
    let fee = $("#add-game-entry-fee").val();
      $("#add-game-msg").html("Adding game...");
    contractInstance.addGame(gameName, p1, p2, fee, {from: web3.eth.accounts[0]}).then(function(r) {
      $("#add-game-msg").html("Game added.");
      populatePlayersData(contractInstance);
      populateGamesData(contractInstance);
    }).catch(function(e) {
      console.log(e);
      $("#add-game-msg").html("Failed to add game. Are the players registered?");
    });
  });
}

window.addPlayer = function addPlayer() {
  Connect4ethTournament.deployed().then(function(contractInstance) {
    let playerName = $("#add-player-name").val();
    let playerAddress = $("#add-player-address").val();
    $("#add-player-msg").html("Adding player...");
    contractInstance.addPlayer(playerAddress, playerName, {from: web3.eth.accounts[0]}).then(function(v) {
      $("#add-player-msg").html("Player added.");
      populatePlayersData(contractInstance);
      populateGamesData(contractInstance);
    }).catch(function(e) {
      console.log(e);
      $("#add-player-msg").html("Failed to add the player, are they already added?");
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Connect4ethTournament.setProvider(web3.currentProvider);
  Connect4ethTournament.deployed().then(function(contractInstance) {
    //populateGamesData();
    populatePlayersData(contractInstance);
  });
});
