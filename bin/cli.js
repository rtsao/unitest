#!/usr/bin/env node

var fs = require('fs');
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
  fs.createReadStream('bin/usage.txt').pipe(process.stdout);
} else if (argv.version) {
  var pkg = require('../package.json');
  console.log(pkg.version);
} else {
  var unitest = require('../');
  unitest({
    node: argv.node,
    browser: argv.browser,
    report: ensureArray(argv.report)
  });
}

function ensureArray(arg) {
  return (arg && typeof arg === 'string') ? [arg] : arg;
}
