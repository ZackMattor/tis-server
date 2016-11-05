var Utils = require('./utils.js');

var KEY = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  R: 82,

  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,

  SPACE: 32
  // https://css-tricks.com/snippets/javascript/javascript-keycodes/
};

var Player = function(id, map_size) {
  this.id = id;
  this.mapSize = map_size;
};

Player.prototype = {
  speed: 0.3,
  breakingPower: 0.95,
  rotationalSpeed: 0.08,

  last_fire: 0,
  fire_rate: 200,
  health: 100,

  // set by parent
  spawnProjectile: null,

  id: null,
  keyState: null,
  x: 200,
  y: 200,
  vx: 0,
  vy: 0,
  rotation: 0,
  name: null,
  inBounds: true,

  update() {
    this.processBoundries();
    this.processControls();

    this.x += this.vx;
    this.y += this.vy;
  },

  serialize() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      health: this.health,
      name: this.name,
      inBounds: this.inBounds
    }
  },

  processControls() {
    if(this.keyState === null) return;

    for(var key_code in this.keyState) {

      if(this.keyState[key_code]) {
        switch(parseInt(key_code)) {
          // Forward
          case KEY.W:
          case KEY.UP_ARROW:
            var x = Math.sin(this.rotation);
            var y = Math.cos(this.rotation);

            this.vx -= x * this.speed;
            this.vy += y * this.speed;
            break;

          // Breaks
          case KEY.S:
          case KEY.DOWN_ARROW:
            this.vx *= this.breakingPower;
            this.vy *= this.breakingPower;
            break;

          // Rotate Left
          case KEY.A:
          case KEY.LEFT_ARROW:
            this.rotation -= this.rotationalSpeed;
            break;

          // Rotate Right
          case KEY.D:
          case KEY.RIGHT_ARROW:
            this.rotation += this.rotationalSpeed;
            break;

          // Fire Cannon
          case KEY.SPACE:
            this.fireCannon();
            break;
        }
      }
    }
  },

  processBoundries() {
    var in_bounds = Utils.inBounds(this.mapSize[0], this.mapSize[1], this.x, this.y);

    if(!in_bounds) {
      this.takeDamage(1);
    }
  },

  fireCannon() {
    if(this.last_fire + this.fire_rate > Date.now()) return;

    var vx = this.vx - Math.sin(this.rotation) * 10;
    var vy = this.vy + Math.cos(this.rotation) * 10;
    this.spawnProjectile(this.x, this.y, vx, vy, 2000);

    this.last_fire = Date.now();
  },

  respawn() {
    this.x = Utils.getRandomInt(200, this.mapSize[0] - 200);
    this.y = Utils.getRandomInt(200, this.mapSize[1] - 500);
    this.vy = 0;
    this.vx = 0;
    this.rotation = 0;
    this.health = 100;
  },

  takeDamage(damage) {
    this.health -= damage;

    if(this.health <= 0) {
      this.respawn();
    }
  },

  updateKeyState(keyState) {
    this.keyState = keyState;
  }
};

module.exports = Player;
