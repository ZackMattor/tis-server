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

  mapSize: [4000, 4000],
  projectiles: [],
  players: {},
  tick: 0,

  startGameLoop() {
    setInterval(this.gameTick.bind(this), 1000 / 60);

    // Dummy Projectile
    this.projectiles.push(new Projectile());
  },

  gameTick() {
    this.processGameLoop();

    this.net.sendStateToClients(this.generateGameState());

    this.tick++;
  },

  addPlayer(id) {
    var player = new Player(id, this.mapSize);

    player.spawnProjectile = this.spawnProjectile.bind(this);
    this.players[id] = player;
  },

  removePlayer(id) {
    delete this.players[id];
  },

  messageFromPlayer(id, message) {
    this.players[id].digestMessage(message);
  },

  processGameLoop() {
    this.updatePlayers();
    this.updateProjectiles();
  },

  updatePlayers() {
    for(var player_id in this.players) {
      var player = this.players[player_id];

      player.update();
    }
  },

  updateProjectiles() {
    this.projectiles.forEach((projectile, index) => {
      if(projectile.dead_at < Date.now()) {
        this.projectiles.splice(index, 1);
      } else {
        projectile.update();
      }

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
    });
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

    this.projectiles.forEach((projectile) => {
      game_state.projectiles.push(projectile.serialize());
    });

    return game_state;
  }
};

module.exports = GameEngine;
