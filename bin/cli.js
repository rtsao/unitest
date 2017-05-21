#!/usr/bin/env node

require('exit-code');

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  alias: {
    n: 'node',
    b: 'browser',
    h: 'help',
    v: 'version',
  },
});

if (argv.help) {
  logHelp();
} else if (argv.version) {
  logVersion();
} else if (argv.node || argv.browser) {
  const unitest = require('../');
  const output = unitest(
    {
      node: argv.node,
      browser: argv.browser,
    },
    exitCode => {
      process.exitCode = exitCode;
    }
  );
  output.pipe(process.stdout);
} else {
  logHelp();
  process.exitCode = 1;
}

function logHelp() {
  fs.createReadStream(path.join(__dirname, 'usage.txt')).pipe(process.stdout);
}

function logVersion() {
  const pkg = require('../package.json');
  console.log(pkg.version);
}
