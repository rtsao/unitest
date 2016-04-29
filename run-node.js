'use strict';

var spawn = require('child_process').spawn;
var finished = require('tap-finished');

function runNode(entry, cb) {
  var script = 'require("./ipc-helpers/dump-node.js");require("' + entry + '");';
  var child = spawn('node', [], {stdio: [null, null, null, 'ipc']});
  child.on('message', function(message) {
    cb(message.coverage);
  });

  child.stdout.pipe(finished(function (results) {
    if (!results.ok) {
      process.exitCode = 1;
    }
  }));

  child.stdin.end(script);
  return child;
}

module.exports = runNode;
