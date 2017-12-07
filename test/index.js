'use strict';

const fs = require('fs');
const test = require('tape');
const path = require('path');
const http = require('http');
const spawn = require('child_process').spawn;
const parser = require('tap-parser');
const resolveBin = require('resolve-bin');
const concat = require('concat-stream');

const unitest = require('..');
const runNode = require('../lib/run-node');
const runElectron = require('../lib/run-electron');

const cliPath = path.join(process.cwd(), 'bin/cli.js');
const nycPath = resolveBin.sync('nyc');

const passingEntry = path.resolve(__dirname, '../fixtures/passing.js');
const failingEntry = path.resolve(__dirname, '../fixtures/failing.js');
const mockEntry = path.resolve(__dirname, '../fixtures/mock-entry.js');
const errorEntry = path.resolve(__dirname, '../fixtures/error.js');
const exit123Entry = path.resolve(__dirname, '../fixtures/exit-123.js');
const slowPassingEntry = path.resolve(__dirname, '../fixtures/slow-passing');

test('API w/success', t => {
  t.plan(1);
  unitest({node: passingEntry, browser: passingEntry}, code =>
    t.equal(code, 0)
  );
});

test('API w/error', t => {
  t.plan(1);
  unitest({node: errorEntry, browser: passingEntry}, code =>
    t.notEqual(code, 0)
  );
});

test('API w/multiple', t => {
  t.plan(1);
  unitest(
    {node: [passingEntry, passingEntry], browser: [passingEntry, passingEntry]},
    code => t.equal(code, 0)
  );
});

test('API w/multiple w/node error', t => {
  t.plan(1);
  unitest({node: [errorEntry, passingEntry], browser: passingEntry}, code =>
    t.notEqual(code, 0)
  );
});

test('API w/multiple w/browser error', t => {
  t.plan(1);
  unitest({node: passingEntry, browser: [errorEntry, passingEntry]}, code =>
    t.notEqual(code, 0)
  );
});

test('basic node coverage reporting', t => {
  t.plan(1);
  runNode(mockEntry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});

test('basic electron coverage reporting', t => {
  t.plan(1);
  runElectron(mockEntry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});

test('both passing status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    passingEntry,
    '--browser',
    passingEntry,
  ]);
  child.on('close', code => {
    t.equal(code, 0);
  });
});

test('slow browser', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    passingEntry,
    '--browser',
    slowPassingEntry,
  ]);
  child.on('close', code => {
    t.equal(code, 0);
  });
});

test('slow node', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    slowPassingEntry,
    '--browser',
    passingEntry,
  ]);
  child.on('close', code => {
    t.equal(code, 0);
  });
});

test('node failing only status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    failingEntry,
    '--browser',
    passingEntry,
  ]);
  child.on('close', code => {
    t.ok(code);
  });
});

test('node failing only status code without browser', t => {
  t.plan(1);
  const child = spawn('node', [cliPath, '--node', exit123Entry]);
  child.on('close', code => {
    t.equal(code, 123);
  });
});

test('browser failing only status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    passingEntry,
    '--browser',
    failingEntry,
  ]);
  child.on('close', code => {
    t.ok(code);
  });
});

test('both failing status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    failingEntry,
    '--browser',
    failingEntry,
  ]);
  child.on('close', code => {
    t.ok(code);
  });
});

test('browser error status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    passingEntry,
    '--browser',
    errorEntry,
  ]);
  child.on('close', code => {
    t.ok(code);
  });
});

test('node error status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    errorEntry,
    '--browser',
    passingEntry,
  ]);
  child.on('close', code => {
    t.ok(code);
  });
});

test('both error status code', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    errorEntry,
    '--browser',
    errorEntry,
  ]);
  child.on('close', code => {
    t.ok(code);
  });
});

test('tap merging', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--node',
    passingEntry,
    '--browser',
    passingEntry,
  ]);
  child.stdout.pipe(
    parser(results => {
      t.equal(results.asserts.length, 2);
    })
  );
});

test('redirect protocol relative url to http', t => {
  t.plan(1);
  const child = spawn('node', [
    cliPath,
    '--browser',
    path.resolve(__dirname, '../fixtures/protocol-relative-request.js'),
  ]);
  child.on('close', code => {
    t.equal(code, 0);
  });
});

const expectedOutput = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/expected-coverage-output.txt'),
  'utf8'
);

test('nyc coverage works', t => {
  t.plan(2);
  const child = spawn('node', [
    nycPath,
    cliPath,
    '--node',
    path.resolve(__dirname, '../fixtures/foo-a.js'),
    '--browser',
    path.resolve(__dirname, '../fixtures/foo-b.js'),
  ]);
  child.on('close', code => {
    t.equal(code, 0);
  });
  child.stdout.pipe(
    concat(output => {
      t.equal(
        trim(output.toString()),
        expectedOutput,
        'coverage output matches expected'
      );
    })
  );
});

// hack for xvfb/travis
function trim(str) {
  return str.replace(
    /Xlib:  extension "RANDR" missing on display ":99\.0"\.\n/g,
    ''
  );
}
