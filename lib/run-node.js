'use strict';

const path = require('path');
const {spawn} = require('child_process');
const finished = require('tap-finished');

const DUMP_NODE_PATH = path.join(__dirname, './ipc-helpers/dump-node.js');

function runNode(entry, cb) {
  let coverage = {};
  let exitCode = 0;
  const child = spawn('node', [], {stdio: [null, null, null, 'ipc']});
  child.on('message', message => {
    coverage = message.coverage;
  });
  child.stdout.pipe(
    finished(results => {
      if (!results.ok) {
        exitCode = 1;
      }
    })
  );
  // On Travis CI on Node 0.10, 0.12, and 5, 'exit' is fired before 'message'
  // 'close' seems to always happen after 'message'
  child.on('close', code => {
    if (typeof code !== 'number') {
      exitCode = 1;
    } else if (code) {
      exitCode = code;
    }
    cb(coverage, exitCode);
  });
  const script = `require("${DUMP_NODE_PATH}");require("${entry}");`;
  child.stdin.end(script);
  return child;
}

module.exports = runNode;
