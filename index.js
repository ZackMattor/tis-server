#!/usr/bin/env node

var GameEngine = require('./game-engine.js');

var engine = new GameEngine();

engine.startGameLoop();
