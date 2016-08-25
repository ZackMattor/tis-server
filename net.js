var HttpServer = require('./http-server');

var Net = function() {
  this.startServer();
};

Net.prototype = {
  max_index: 0,
  connections: [],
  server: null,

  callbacks: {},

  // events
  onPlayerConnect: null,
  onPlayerDisconnect: null,
  onPlayerMessage: null,

  startServer: function() {
    var WebSocketServer = require('websocket').server;

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

    this.onPlayerConnect(connection.id);

    this.connections.push(connection);

    connection.on('message', function(message) {
      this.onPlayerMessage(connection.id, message.utf8Data);
    }.bind(this));

    console.log('New connection');
  },

  onClose: function(connection) {
    // TODO: Look up efficiency of indexOf vs hash of IDs
    var index = this.connections.indexOf(connection);

    this.onPlayerDisconnect(connection.id);

    this.connections.splice(index, 1);
    console.log('connection closed');
  },

  sendStateToClients: function(state) {
    this.connections.forEach(function(connection) {
      connection.send(JSON.stringify({
        id: connection.id,
        state: state
      }));
    });
  },

  on: function(event_name, callback) {
    this.callbacks[event_name] = callback;
  }
};

module.exports = Net;
