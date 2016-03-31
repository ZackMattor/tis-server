var Projectile = function(id) {
  this.id = id;
};

Projectile.prototype = {
  id: null,
  x: 200,
  y: 200,
  vx: 1,
  vy: 0,

  update: function(key_state) {
    this.x += this.vx;
    this.y += this.vy;
  },

  gameState: function() {
    return {
      x: this.x,
      y: this.y
    }
  }
};

module.exports = Projectile;
