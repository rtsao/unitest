'use strict';

var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');

var finished = require('tap-finished');

function runElectron(entry, cb) {
  var child = spawn(electron, ['./electron-main-script.js', entry], {stdio: [null, null, null, 'ipc']});
  var stream = finished(function (results) {
    child.send({done: true});
  });
  child.stdout.pipe(stream);


  child.on('message', function(message) {
    cb(message.coverage);
  });

  return child;
}

module.exports = runElectron;
