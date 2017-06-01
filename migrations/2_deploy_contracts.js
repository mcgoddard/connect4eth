var Connect4ethTournament = artifacts.require("./Connect4ethTournament.sol");
module.exports = function(deployer) {
  deployer.deploy(Connect4ethTournament);
};
