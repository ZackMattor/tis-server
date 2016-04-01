var Net = require('./net.js');
var Player = require('./player.js');
var Projectile = require('./projectile.js');

var GameEngine = function() {
  // Setup out network interface
  this.net = new Net();
  this.net.onPlayerConnect = this.addPlayer.bind(this);
  this.net.onPlayerDisconnect = this.removePlayer.bind(this);
  this.net.onPlayerMessage = this.messageFromPlayer.bind(this);
};

GameEngine.prototype = {
  net: null,

  projectiles: [],
  players: {},

  startGameLoop: function() {
    setInterval(this.gameTick.bind(this), 1000 / 60);

    // Dummy Projectile
    this.projectiles.push(new Projectile());
  },

  gameTick: function() {
    this.processGameLoop();

    this.net.sendStateToClients(this.generateGameState());
  },

  addPlayer(id) {
    this.players[id] = new Player(id);
  },

  removePlayer(id) {
    delete this.players[id];
  },

  messageFromPlayer(id, message) {
    this.players[id].digestMessage(message);
  },

  processGameLoop: function() {
    this.updatePlayers();
    this.updateProjectiles();
  },

  updatePlayers: function() {
    for(var player_id in this.players) {
      this.players[player_id].update();
    }
  },

  updateProjectiles: function() {
    this.projectiles.forEach(function(projectile) {
      projectile.update();
    });
  },

  generateGameState() {
    var game_state = {
      ships: [],
      projectiles: []
    };

    for(var player_id in this.players) {
      var player_game_state = this.players[player_id].gameState();
      game_state.ships.push(player_game_state);
    }

    this.projectiles.forEach(function(projectile) {
      game_state.projectiles.push(projectile.gameState());
    });

    return game_state;
  }
};

module.exports = GameEngine;
