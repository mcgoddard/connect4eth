// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  build: {
    "index.html": "index.hmtl",
    "game.html": "game.html",
    "javascripts/game.js": [
      "javascripts/game.js"
    ],
    "images/empty.png": [
      "images/empty.png"
    ],
    "images/player1.png": [
      "images/player1.png"
    ],
    "images/player2.png": [
      "images/player2.png"
    ]
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
}
