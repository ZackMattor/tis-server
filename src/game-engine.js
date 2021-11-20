import { Net } from './net.js'
import { Player } from './player.js'
import { Projectile } from './projectile.js'
import { Utils } from './utils.js'
import { SessionManager } from './session-manager.js'

export class GameEngine {
  constructor () {
    this.sessions = new SessionManager()
    this.mapSize = [4000, 4000]
    this.projectiles = []
    this.tick = 0

    this.net = new Net(this.sessions)
    this.net.onPlayerConnect = this.addPlayer.bind(this)
    this.net.onPlayerMessage = this.messageFromPlayer.bind(this)

    this.net.on('auth', this.authenticatePlayer.bind(this))
  }

  startGameLoop () {
    setInterval(this.gameTick.bind(this), 1000 / 60)

    // Dummy Projectile
    this.projectiles.push(new Projectile())
  }

  gameTick () {
    this.processGameLoop()

    this.net.sendStateToClients(this.generateGameState())

    this.tick++
  }

  addPlayer (sessionId) {
    const player = new Player(sessionId, this.mapSize)

    player.spawnProjectile = this.spawnProjectile.bind(this)

    const session = this.sessions.find(sessionId)
    player.name = session.name
    session.player = player
  }

  authenticatePlayer (data) {
    if (data.nickname) {
      const sessionId = this.sessions.create(data.nickname)

      return { session_id: sessionId }
    } else {
      return { error: 'No nickname set' }
    }
  }

  messageFromPlayer (id, keyState) {
    this.sessions.getPlayer(id).updateKeyState(keyState)
  }

  processGameLoop () {
    this.updatePlayers()
    this.updateProjectiles()
  }

  updatePlayers () {
    this.sessions.eachPlayer((player) => {
      player.update()
    })
  }

  updateProjectiles () {
    this.projectiles.forEach((projectile, index) => {
      if (projectile.dead_at < Date.now()) {
        this.projectiles.splice(index, 1)
      } else {
        projectile.update()
      }

      // check for collisions with the players
      if (projectile.age > 5) {
        this.sessions.eachPlayer((player) => {
          const d = Utils.distance(player, projectile)

          if (d < 40) {
            this.projectiles.splice(index, 1)
            player.takeDamage(20)
          }
        })
      }
    })
  }

  spawnProjectile (x, y, vx, vy, life) {
    this.projectiles.push(new Projectile(x, y, vx, vy, life))
  }

  generateGameState () {
    return {
      ships: this.sessions.map(player => player.serialize()),
      projectiles: this.projectiles.map(projectile => projectile.serialize())
    }
  }
}
