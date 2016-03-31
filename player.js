var KEY = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,

  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,

  SPACE: 32

};

var Player = function(id) {
  this.id = id;
};

Player.prototype = {
  id: null,
  keyState: null,
  x: 200,
  y: 200,
  vx: 0,
  vy: 0,
  name: 'george',

  update: function() {
    this.processControls();

    this.x += this.vx;
    this.y += this.vy;
  },

  gameState: function() {
    return {
      x: this.x,
      y: this.y,
      name: this.name
    }
  },

  processControls: function() {
    if(this.keyState === null) return;

    for(var key_code in this.keyState) {

      if(this.keyState[key_code]) {
        switch(parseInt(key_code)) {
          case KEY.W:
          case KEY.UP_ARROW:
            this.vy -= 0.1;
            break;

          case KEY.S:
          case KEY.DOWN_ARROW:
            this.vy += 0.1;
            break;

          case KEY.A:
          case KEY.LEFT_ARROW:
            this.vx -= 0.1;
            break;

          case KEY.D:
          case KEY.RIGHT_ARROW:
            this.vx += 0.1;
            break;
        }
      }
    }
  },

  digestMessage: function(message) {
    this.keyState = JSON.parse(message);
  }
};

module.exports = Player;
