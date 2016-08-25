var http = require('http');

var HttpServer = function(cb) {
  this.cb = cb;
  this.server = http.createServer(this._onMessage.bind(this));

  return this.server;
};

HttpServer.prototype = {
  route: function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');

    var route_map = {
      '/session/new': 'auth'
    };

    var handled = false;

    var url_parts = request.url.split('?');
    var path = url_parts[0];
    var query_data = this._decodeQueryParams(url_parts[1]);

    for(var key in route_map) {
      var method = route_map[key];

      if(key === path) {
        handled = true;

        var response_data = this.cb(method, query_data);
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

  _decodeQueryParams: function(param_string) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    urlParams = {};
    while (match = search.exec(param_string))
       urlParams[decode(match[1])] = decode(match[2]);

     return urlParams;
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
