var HttpServer = require('./http-server');

var Net = function(sessions) {
  this.sessions = sessions;
  this.startServer();
};

Net.prototype = {
  max_index: 0,
  unauth_connections: [],
  server: null,

  callbacks: {},

  // events
  onPlayerConnect: null,
  onPlayerDisconnect: null,
  onPlayerMessage: null,

  startServer: function() {
    var WebSocketServer = require('websocket').server;

    // create our server and wire up our http server to callbacks
    var server = new HttpServer(function(method, data) {
      return this.callbacks[method](data);
    }.bind(this));

    console.log(process.argv);
    server.listen((process.argv[2] || 8080), function() {
      console.log((new Date()) + ' Server is listening on port ' + (process.argv[2] || 8080));
    });

    this.server = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: true
    });

    this.server.on('connect', this.onConnection.bind(this));
    this.server.on('close', this.onClose.bind(this));
  },

  onConnection: function(connection) {
    // Assign the connection an id
    connection.id = this.max_index;
    this.max_index++;

    this.unauth_connections.push(connection);

    connection.on('message', function(message) {
      data = JSON.parse(message.utf8Data);

      var session_id = data.session_id;

      switch(data.type) {
        case 'player-update':
          this.onPlayerMessage(session_id, data.data);
        break;

        case 'auth':
          this.sessions.find(session_id).connection = connection;
          this.onPlayerConnect(session_id);
        break;
      }
    }.bind(this));

    console.log('New connection');
  },

  onClose: function(connection) {
    var session = this.sessions.deleteByConnection(connection);
  },

  sendStateToClients: function(state) {
    var sessions = this.sessions.all();

    for(var key in sessions) {
      var connection = sessions[key].connection;

      if(!connection) continue;

      connection.send(JSON.stringify({
        id: connection.id,
        state: state
      }));
    }
  },

  on: function(event_name, callback) {
    this.callbacks[event_name] = callback;
  }
};

module.exports = Net;
