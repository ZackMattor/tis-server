var Projectile = function(x, y, vx, vy, life) {
  //this.id = id;

  this.dead_at = Date.now() + (life || 2000);
  this.x  = x  || 200;
  this.y  = y  || 200;
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
  serialize: function() {
    return {
      x: this.x,
      y: this.y
    }
  }
};

module.exports = Projectile;
