'use strict';

var spawn = require('child_process').spawn;

function runNode(entry, cb) {
  var script = 'require("./ipc-helpers/dump-node.js");require("' + entry + '");';
  var child = spawn('node', [], {stdio: [null, null, null, 'ipc']});
  
  // TOOD merge TAP 
  // child.stdout.pipe(process.stdout);
  child.on('message', function(message) {
    cb(message.coverage);
  });

  child.stdin.end(script);
}

module.exports = runNode;
