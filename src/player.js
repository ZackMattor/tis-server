import { Utils } from './utils.js'

const KEY = {
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
}

export class Player {
  constructor (id, mapSize) {
    this.id = id
    this.mapSize = mapSize

    this.speed = 0.3
    this.breakingPower = 0.95
    this.rotationalSpeed = 0.08

    this.last_fire = 0
    this.fire_rate = 200
    this.health = 100

    // set by parent
    this.spawnProjectile = null

    this.keyState = null
    this.x = 200
    this.y = 200
    this.vx = 0
    this.vy = 0
    this.rotation = 0
    this.name = null
    this.inBounds = true
  }

  update () {
    this.processBoundries()
    this.processControls()

    this.x += this.vx
    this.y += this.vy
  }

  serialize () {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      health: this.health,
      name: this.name,
      inBounds: this.inBounds
    }
  }

  processControls () {
    if (this.keyState === null) return

    for (const keyCode in this.keyState) {
      if (this.keyState[keyCode]) {
        switch (parseInt(keyCode)) {
          // Forward
          case KEY.W:
          case KEY.UP_ARROW: {
            const x = Math.sin(this.rotation)
            const y = Math.cos(this.rotation)

            this.vx -= x * this.speed
            this.vy += y * this.speed
            break
          }

          // Breaks
          case KEY.S:
          case KEY.DOWN_ARROW:
            this.vx *= this.breakingPower
            this.vy *= this.breakingPower
            break

          // Rotate Left
          case KEY.A:
          case KEY.LEFT_ARROW:
            this.rotation -= this.rotationalSpeed
            break

          // Rotate Right
          case KEY.D:
          case KEY.RIGHT_ARROW:
            this.rotation += this.rotationalSpeed
            break

          // Fire Cannon
          case KEY.SPACE:
            this.fireCannon()
            break
        }
      }
    }
  }

  processBoundries () {
    const inBounds = Utils.inBounds(this.mapSize[0], this.mapSize[1], this.x, this.y)

    if (!inBounds) {
      this.takeDamage(1)
    }
  }

  fireCannon () {
    if (this.last_fire + this.fire_rate > Date.now()) return

    const vx = this.vx - Math.sin(this.rotation) * 10
    const vy = this.vy + Math.cos(this.rotation) * 10
    this.spawnProjectile(this.x, this.y, vx, vy, 2000)

    this.last_fire = Date.now()
  }

  respawn () {
    this.x = Utils.getRandomInt(200, this.mapSize[0] - 200)
    this.y = Utils.getRandomInt(200, this.mapSize[1] - 500)
    this.vy = 0
    this.vx = 0
    this.rotation = 0
    this.health = 100
  }

  takeDamage (damage) {
    this.health -= damage

    if (this.health <= 0) {
      this.respawn()
    }
  }

  updateKeyState (keyState) {
    this.keyState = keyState
  }
}
