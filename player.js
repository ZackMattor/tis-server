var Player = function(id) {
  this.id = id;
};

Player.prototype = {
  id: null,
  x: 200,
  y: 200,
  vx: 1,
  vy: 0,
  name: 'george',

  update: function(key_state) {
    this.x += this.vx;
    this.y += this.vy;
  },

  gameState: function() {
    return {
      x: this.x,
      y: this.y,
      name: this.name
    }
  }
};

module.exports = Player;
