var Projectile = function(x, y, vx, vy, life) {
  this.id = this._generateId();

  this.dead_at = Date.now() + (life || 2000);
  this.x  = x  || 200;
  this.y  = y  || 200;
  this.vx = vx || 0;
  this.vy = vy || 0;
  this.age = 0;
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
    this.age++;
  },

  // TODO: Rename to serialize??
  serialize: function() {
    return {
      id: this.id,
      x: this.x,
      y: this.y
    }
  },

  _generateId: function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4();
  }
};

module.exports = Projectile;
