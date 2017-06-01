var Connect4eth = artifacts.require("./Connect4eth.sol");
module.exports = function(deployer) {
  deployer.deploy(Connect4eth, "0xeb940c72650ecc2d38413d4008369461763b60c3", "0x1406f09b734fa749d1f32ff48fdd08a208c7d77b", 2);
};
