#!/usr/bin/env electron

process.browser = true;
process.exit = require('electron').remote.app.exit;
// redirect log to stdout
console.log = require('console').log;
// redirect errors to stderr
window.addEventListener('error', function (e) {
  e.preventDefault();
  require('console').error(e.error.stack || 'Uncaught ' + e.error);
  process.exit(1);
});
// setup stuff
require('../ipc-helpers/dump-electron');
