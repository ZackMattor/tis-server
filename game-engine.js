var Net = require('./net.js');
var Player = require('./player.js');
var Projectile = require('./projectile.js');
var Utils = require('./utils.js');

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
  tick: 0,

  startGameLoop: function() {
    setInterval(this.gameTick.bind(this), 1000 / 60);

    // Dummy Projectile
    this.projectiles.push(new Projectile());
  },

  gameTick: function() {
    this.processGameLoop();

    this.net.sendStateToClients(this.generateGameState());

    this.tick++;
  },

  addPlayer(id) {
    var player = new Player(id);

    player.spawnProjectile = this.spawnProjectile.bind(this);
    this.players[id] = player;
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
    this.projectiles.forEach(function(projectile, index) {
      // check for collisions with the players
      if(projectile.age > 5) {
        for(var player_id in this.players) {
          var player = this.players[player_id];
          var d = Utils.distance(player, projectile);

          if(d < 40) {
            this.projectiles.splice(index, 1);
            player.takeDamage(20);
          }
        }
      }

      if(projectile.dead_at < Date.now()) {
        this.projectiles.splice(index, 1);
      } else {
        projectile.update();
      }
    }.bind(this));
  },

  spawnProjectile(x, y, vx, vy, life) {
    this.projectiles.push(new Projectile(x, y, vx, vy, life));
  },

  generateGameState() {
    var game_state = {
      ships: [],
      projectiles: []
    };

    for(var player_id in this.players) {
      var player_game_state = this.players[player_id].serialize();
      game_state.ships.push(player_game_state);
    }

    this.projectiles.forEach(function(projectile) {
      game_state.projectiles.push(projectile.serialize());
    });

    return game_state;
  }
};

module.exports = GameEngine;
