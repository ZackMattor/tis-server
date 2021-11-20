import { HttpServer } from './http-server.js'
import { server as WebSocketServer } from 'websocket'

export class Net {
  constructor (sessions) {
    this.sessions = sessions
    this.startServer()

    this.max_index = 0
    this.server = null

    this.callbacks = {}

    // events
    this.onPlayerConnect = null
    this.onPlayerDisconnect = null
    this.onPlayerMessage = null
  }

  startServer () {
    // create our server and wire up our http server to callbacks
    const server = new HttpServer((method, data) => {
      return this.callbacks[method](data)
    })

    console.log(process.argv)
    server.listen((process.argv[2] || 8080), () => {
      console.log((new Date()) + ' Server is listening on port ' + (process.argv[2] || 8080))
    })

    this.server = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: true
    })

    this.server.on('connect', this.onConnection.bind(this))
    this.server.on('close', this.onClose.bind(this))
  }

  onConnection (connection) {
    // Assign the connection an id
    connection.id = this.max_index
    this.max_index++

    connection.on('message', (message) => {
      const data = JSON.parse(message.utf8Data)

      const sessionId = data.session_id

      switch (data.type) {
        case 'player-update':
          this.onPlayerMessage(sessionId, data.data)
          break

        case 'auth': {
          const session = this.sessions.find(sessionId)

          if (session) {
            session.connection = connection
            this.onPlayerConnect(sessionId)
          } else {
            connection.close()
          }

          break
        }
      }
    })

    console.log('New connection')
  }

  onClose (connection) {
    console.log('END OF CONNECTION')
    this.sessions.deleteByConnection(connection)
  }

  sendStateToClients (state) {
    const sessions = this.sessions.all()

    for (const key in sessions) {
      const connection = sessions[key].connection

      if (!connection) continue

      connection.send(JSON.stringify({
        id: connection.id,
        state: state
      }))
    }
  }

  on (eventName, callback) {
    this.callbacks[eventName] = callback
  }
}
