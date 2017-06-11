// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import connect4eth_artifacts from '../../build/contracts/Connect4eth.json'

window.Connect4eth = contract(connect4eth_artifacts);

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

window.gameAddress = findGetParameter("address");

function populateStaticData() {
  Connect4eth.at(gameAddress).then(function(contractInstance) {
    contractInstance.getPlayer1().then(function(p) {
      $("#player-1").html(p);
    });
    contractInstance.getPlayer2().then(function(p) {
      $("#player-2").html(p);
    });
    contractInstance.getBet().then(function(b) {
      $("#bet-amount").html(b.c[0]);
    });
  });
}

function populateDynamicData() {
  Connect4eth.at(gameAddress).then(function(contractInstance) {
    contractInstance.isStarted().then(function(started) {
      if (started) {
        contractInstance.isFinished().then(function(finished) {
          if (finished) {
            $("#game-state").html("Finished");
          }
          else {
            $("#game-state").html("Running");
          }
          populateTurn(contractInstance);
        });
      }
      else {
        $("#game-state").html("Pending");
      }
    });
    populateGrid(contractInstance);
  });
}

function populateTurn(contractInstance) {
  contractInstance.isPlayer1sTurn().then(function(player1sTurn) {
    if (player1sTurn) {
      $("#current-turn").html("Player 1");
    }
    else {
      $("#current-turn").html("Player 2");
    }
  });
}

function populateGrid(contractInstance) {
  contractInstance.getGrid().then(function(g) {
    $("#grid-rows").html("");
    for (var i = g[0].length - 1; i >= 0; i--) {
      $("#grid-rows").append("<tr>");
      for (var j = 0; j < g.length; j++) {
        $("#grid-rows").append("<td>"+g[j][i]+"</td>");
      }
      $("#grid-rows").append("</tr>");
    }
  });
}

window.joinGame = function joinGame() {
  Connect4eth.at(gameAddress).then(function(contractInstance) {
    let buyIn = $("#bet-amount").html();
    let joinAddress = $("#buy-in-address").val();
    $("#join-msg").html("Request to join submitted...");
    contractInstance.joinGame({value: buyIn, from: joinAddress}).then(function(result) {
      $("#join-msg").html("Joined game.");
      populateDynamicData();
    }).catch(function(e) {
      console.log(e);
      $("#join-msg").html("Failed to join game, are you on the players list and does your account have the required buy in?");
    });
  });
}

window.makeMove = function makeMove(column) {
  Connect4eth.at(gameAddress).then(function(contractInstance) {
    let moveAddress = $("#move-address").val();
    contractInstance.makeMove(column, {from: moveAddress}).then(function(result) {
      $("#move-msg").html("Move made!");
      populateDynamicData();
    }).catch(function(e) {
      console.log(e);
      $("#move-msg").html("Failed to make move. Is the move valid, are you in the game and is it your turn?");
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

  Connect4eth.setProvider(web3.currentProvider);
  populateStaticData();
  populateDynamicData();
});
