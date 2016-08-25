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
    for(var i=0; i<this._sessions.length; i++) {
      if(this._sessions[i].connection.id == connection.id) {
        delete this._sessions[i];
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
