var SessionManager = function() {
  this._sessions = {};
};

SessionManager.prototype = {
  create(name) {
    var id = this._generateId()

    this._sessions[id] = {};
    this._sessions[id].name = name;

    return id;
  },

  find(id) {
    return this._sessions[id];
  },

  all() {
    return this._sessions;
  },

  deleteByConnection(connection) {
    for(var session_id in this._sessions) {
      if(this._sessions[session_id].connection.id == connection.id) {
        console.log('DELETING');
        delete this._sessions[session_id];
      }
    }
  },

  getPlayer(id) {
    return this._sessions[id].player;
  },

  eachPlayer(fn) {
    for(var key in this._sessions) {
      var player = this._sessions[key].player;

      if(player) fn(player);
    }
  },

  _generateId() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
};

module.exports = SessionManager;
