export class SessionManager {
  constructor () {
    this._sessions = {}
  }

  create (name) {
    const id = this._generateId()

    this._sessions[id] = {}
    this._sessions[id].name = name

    return id
  }

  find (id) {
    return this._sessions[id]
  }

  all () {
    return this._sessions
  }

  map (cb) {
    let arr = []

    this.eachPlayer(p => arr.push(cb(p)))

    return arr
  }

  deleteByConnection (connection) {
    for (const sessionId in this._sessions) {
      if (this._sessions[sessionId].connection.id === connection.id) {
        console.log('DELETING')
        delete this._sessions[sessionId]
      }
    }
  }

  getPlayer (id) {
    return this._sessions[id].player
  }

  eachPlayer (fn) {
    for (const key in this._sessions) {
      const player = this._sessions[key].player

      if (player) fn(player)
    }
  }

  _generateId () {
    const s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
  }
}
