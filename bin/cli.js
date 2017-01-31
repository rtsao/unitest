#!/usr/bin/env node

require('exit-code');

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
  alias: {
    n: 'node',
    b: 'browser',
    h: 'help',
    v: 'version'
  }
});

if (argv.help) {
  logHelp();
} else if (argv.version) {
  logVersion();
} else if (argv.node || argv.browser) {
  var unitest = require('../');
  var output = unitest({
    node: argv.node,
    browser: argv.browser
  }, function (exitCode) {
    process.exitCode = exitCode;
  });
  output.pipe(process.stdout);
} else {
  logHelp();
  process.exitCode = 1;
}

function logHelp() {
  fs.createReadStream(path.join(__dirname, 'usage.txt'))
    .pipe(process.stdout);
}

function logVersion() {
  var pkg = require('../package.json');
  console.log(pkg.version);
}
