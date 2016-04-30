'use strict';

require('exit-code');
var path = require('path');
var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');
var finished = require('tap-finished');
var cwd = process.cwd();

function runElectron(entry, cb) {
  var absoluteEntryPath = path.resolve(cwd, entry);
  var mainPath = path.join(__dirname, './electron/main.js');
  var child = spawn(electron, [mainPath, absoluteEntryPath], {
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

  child.on('message', function(message) {
    cb(message.coverage);
  });

  return child;
}

module.exports = runElectron;
