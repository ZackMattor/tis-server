export class Projectile {
  constructor (x, y, vx, vy, life) {
    this.id = this._generateId()

    this.dead_at = Date.now() + (life || 2000)
    this.x = x || 200
    this.y = y || 200
    this.vx = vx || 0
    this.vy = vy || 0
    this.age = 0
  }

  update () {
    this.x += this.vx
    this.y += this.vy
    this.age++
  }

  serialize () {
    return {
      id: this.id,
      x: this.x,
      y: this.y
    }
  }

  _generateId () {
    const s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return s4() + s4()
  }
}
