#!/usr/bin/env node

require('exit-code');

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
  alias: {
    n: 'node',
    b: 'browser',
    r: 'report',
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
  unitest({
    node: argv.node,
    browser: argv.browser,
    report: ensureArray(argv.report)
  });
} else {
  logHelp();
  process.exitCode = 1;
}

function ensureArray(arg) {
  return (arg && typeof arg === 'string') ? [arg] : arg;
}

function logHelp() {
  fs.createReadStream(path.join(__dirname, 'bin/usage.txt'))
    .pipe(process.stdout);
}

function logVersion() {
  var pkg = require('../package.json');
  console.log(pkg.version);
}
