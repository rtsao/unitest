'use strict';

require('exit-code');

var path = require('path');
var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');
var finished = require('tap-finished');

var MAIN_PATH = path.join(__dirname, './electron/main.js');

function runElectron(entry, cb) {
  var child = spawn(electron, [MAIN_PATH, entry], {
    stdio: [null, null, null, 'ipc']
  });
  child.stdout.pipe(finished(function (results) {
    if (!results.ok) {
      process.exitCode = 1;
    }
    if (child.connected) {
      child.send({done: true});
    }
  }));
  child.on('exit', function(code) {
    if (code) {
      process.exitCode = code;
    }
  });
  child.on('message', function(message) {
    cb(message.coverage);
  });
  return child;
}

module.exports = runElectron;
