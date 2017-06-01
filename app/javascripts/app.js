// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import connect4eth_artifacts from '../../build/contracts/Connect4eth.json'

window.Connect4eth = contract(connect4eth_artifacts);

function populateStaticData() {
  Connect4eth.deployed().then(function(contractInstance) {
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
  Connect4eth.deployed().then(function(contractInstance) {
    contractInstance.isStarted().then(function(started) {
      if (started) {
        contractInstance.isFinished().then(function(finished) {
          if (finished) {
            $("#game-state").html("Finished");
          }
          else {
            $("#game-state").html("Running");
            populateTurn(contractInstance);
          }
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
    for (var i = g[0].length - 1; i >= 0; i--) {
      $("#grid-rows").append("<tr>");
      for (var j = 0; j < g.length; j++) {
        $("#grid-rows").append("<td>"+g[j][i]+"</td>");
      }
      $("#grid-rows").append("</tr>");
    }
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
