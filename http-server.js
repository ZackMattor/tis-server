var http = require('http');

var HttpServer = function(cb) {
  this.cb = cb;
  this.server = http.createServer(this._onMessage.bind(this));

  return this.server;
};

HttpServer.prototype = {
  route: function(request, response) {
    var route_map = {
      '/session/new': 'auth'
    };

    var handled = false;

    for(var key in route_map) {
      var method = route_map[key];

      if(key === request.url) {
        handled = true;

        var data = {};

        var response_data = this.cb(method, data);
        this.handleResponse(response, response_data);

        break;
      }
    }

    if(!handled) {
      console.log((new Date()) + ' Received unhandled request for ' + request.url);
      response.writeHead(404);
      response.end();
    }
  },

  handleResponse: function(response, data) {
    var content_type = (typeof data === 'object') ? 'application/json' : 'text/html';
    var data = (typeof data === 'object') ? JSON.stringify(data) : data;

    response.writeHead(200, {'content-Type': content_type});
    console.log('Responding with data: ');
    console.log(data);
    response.end(data);
  },

  _onMessage: function(request, response) {
    this.route(request, response);
  },

  routes: {
    auth: function(request, response) {
      console.log((new Date()) + ' Received request for ' + request.url);
      response.writeHead(404);
      response.end();
    }
  }
};

module.exports = HttpServer;
