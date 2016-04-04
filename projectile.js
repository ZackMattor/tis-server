var Projectile = function(id, x, y, vx, vy) {
  this.id = id;

  this.x  = x  || 200;
  this.y  = x  || 200;
  this.vx = vx || 0;
  this.vy = vy || 0;
};

Projectile.prototype = {
  id: null,
  x:  null,
  y:  null,
  vx: null,
  vy: null,

  update: function(key_state) {
    this.x += this.vx;
    this.y += this.vy;
  },

  // TODO: Rename to serialize??
  gameState: function() {
    return {
      x: this.x,
      y: this.y
    }
  }
};

module.exports = Projectile;
