'use strict';

var path = require('path');
var spawn = require('child_process').spawn;
var finished = require('tap-finished');

var DUMP_NODE_PATH = path.join(__dirname, './ipc-helpers/dump-node.js');

function runNode(entry, cb) {
  var coverage = {};
  var exitCode = 0;
  var child = spawn('node', [], {stdio: [null, null, null, 'ipc']});
  child.on('message', function(message) {
    coverage = message.coverage;
  });
  child.stdout.pipe(finished(function (results) {
    if (!results.ok) {
      exitCode = 1;
    }
  }));
  child.on('exit', function(code) {
    if (code) {
      exitCode = code;
    }
    cb(coverage, exitCode);
  });
  var script = 'require("' + DUMP_NODE_PATH + '");require("' + entry + '");';
  child.stdin.end(script);
  return child;
}

module.exports = runNode;
