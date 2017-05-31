var Connect4eth = artifacts.require("./Connect4eth.sol");
module.exports = function(deployer) {
  deployer.deploy(Connect4eth, "0x595e14fca98be4106c6016d5f89201f478f4002b", "0x31b2fbc9fc27a799f6c83b499f0fd15f7246b3c1", 1);
};
