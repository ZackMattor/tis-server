import http from 'http'

export class HttpServer {
  constructor (cb) {
    this.cb = cb
    this.server = http.createServer(this._onMessage.bind(this))

    return this.server
  }

  route (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*')

    const routeMap = {
      '/api/session/new': 'auth'
    }

    let handled = false

    const urlParts = request.url.split('?')
    const path = urlParts[0]
    const queryData = this._decodeQueryParams(urlParts[1])

    for (const key in routeMap) {
      const method = routeMap[key]

      if (key === path) {
        handled = true

        const responseData = this.cb(method, queryData)
        this.handleResponse(response, responseData)

        break
      }
    }

    if (!handled) {
      console.log((new Date()) + ' Received unhandled request for ' + request.url)
      response.writeHead(404)
      response.end()
    }
  }

  handleResponse (response, data) {
    const contentType = (typeof data === 'object') ? 'application/json' : 'text/html'
    data = (typeof data === 'object') ? JSON.stringify(data) : data

    response.writeHead(200, { 'content-Type': contentType })
    console.log('Responding with data: ')
    console.log(data)
    response.end(data)
  }

  _onMessage (request, response) {
    this.route(request, response)
  }

  _decodeQueryParams (paramString) {
    const params = new URLSearchParams(paramString)
    const ret = {}

    for (const [key, value] of params.entries()) {
      ret[key] = value
    }

    return ret
  }
//
//  routes: {
//    auth: function(request, response) {
//      console.log((new Date()) + ' Received request for ' + request.url);
//      response.writeHead(404);
//      response.end();
//    }
//  }
}
