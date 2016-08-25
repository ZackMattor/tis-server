var Net = require('./net.js');
var Player = require('./player.js');
var Projectile = require('./projectile.js');
var Utils = require('./utils.js');
var SessionManager = require('./session-manager.js');

var GameEngine = function() {
  this.sessions = new SessionManager();

  this.net = new Net(this.sessions);
  this.net.onPlayerConnect = this.addPlayer.bind(this);
  this.net.onPlayerMessage = this.messageFromPlayer.bind(this);

  this.net.on('auth', this.authenticatePlayer.bind(this));
};

GameEngine.prototype = {
  net: null,

  mapSize: [4000, 4000],
  projectiles: [],
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

  addPlayer(session_id) {
    var player = new Player(session_id, this.mapSize);

    player.spawnProjectile = this.spawnProjectile.bind(this);

    var session = this.sessions.find(session_id);
    player.name = session.name;
    session.player = player;
  },

  authenticatePlayer(data) {
    if(data['nickname']) {
      var session_id = this.sessions.create(data['nickname']);

      return { session_id: session_id };
    } else {
      return { error: 'No nickname set' };
    }
  },

  messageFromPlayer(id, keyState) {
    this.sessions.getPlayer(id).updateKeyState(keyState);
  },

  processGameLoop() {
    this.updatePlayers();
    this.updateProjectiles();
  },

  updatePlayers() {
    this.sessions.eachPlayer((player) => {
      player.update();
    });
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
        this.sessions.eachPlayer((player) => {
          var d = Utils.distance(player, projectile);

          if(d < 40) {
            this.projectiles.splice(index, 1);
            player.takeDamage(20);
          }
        });
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

    this.sessions.eachPlayer((player) => {
      game_state.ships.push(player.serialize());
    });

    for(var session_id in this.sessions.all()) {
      var player = this.sessions.find(session_id).player;

    }

    this.projectiles.forEach((projectile) => {
      game_state.projectiles.push(projectile.serialize());
    });

    return game_state;
  }
};

module.exports = GameEngine;
