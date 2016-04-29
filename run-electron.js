'use strict';

require('exit-code');

var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');
var finished = require('tap-finished');

function runElectron(entry, cb) {
  var child = spawn(electron, ['./electron/main.js', entry], {stdio: [null, null, null, 'ipc']});
  child.stdout.pipe(finished(function (results) {
    if (!results.ok) {
      process.exitCode = 1;
    }
    if (child.connected) {
      child.send({done: true});
    }
  }));

  child.on('message', function(message) {
    cb(message.coverage);
  });

  return child;
}

module.exports = runElectron;
