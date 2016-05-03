'use strict';

require('exit-code');

var path = require('path');
var spawn = require('child_process').spawn;
var finished = require('tap-finished');

var DUMP_NODE_PATH = path.join(__dirname, './ipc-helpers/dump-node.js');

function runNode(entry, cb) {
  var child = spawn('node', [], {stdio: [null, null, null, 'ipc']});
  child.on('message', function(message) {
    cb(message.coverage);
  });
  child.on('exit', function(code) {
    if (code) {
      process.exitCode = code;
    }
  });
  child.stdout.pipe(finished(function (results) {
    if (!results.ok) {
      process.exitCode = 1;
    }
  }));
  var script = 'require("' + DUMP_NODE_PATH + '");require("' + entry + '");';
  child.stdin.end(script);
  return child;
}

module.exports = runNode;
