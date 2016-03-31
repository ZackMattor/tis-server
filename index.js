#!/usr/bin/env node

var GameEngine = require('./game-engine.js');

var game_server = new GameEngine();
console.log(game_server.foo);

var clients = [];
var game_state = {
  ships: [{
    x: 20,
    y: 50,
    vx: 1,
    vy: 0
  }],
  projectiles: [{
    x: 209,
    y: 500,
    vx: 1,
    vy: 0
  }],
};

setInterval(function() {
  processGameLoop();

  sendStateToClients();
}, 1000/60);

function processGameLoop() {
  updateShips();
  updatePlayers();
}

function sendStateToClients() {
  var state_string = JSON.stringify(game_state);

  clients.forEach(function(connection) {
    connection.send(state_string);
  });
}

function updateShips() {
  game_state.ships.forEach(function(entity) {
    entity.x += entity.vx;
    entity.y += entity.vy;
  });
}

function updatePlayers() {
  game_state.projectiles.forEach(function(entity) {
    entity.x += entity.vx;
    entity.y += entity.vy;
  });
}
