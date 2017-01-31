'use strict';

var fs = require('fs');
var test = require('tape');
var path = require('path');
var http = require('http');
var spawn = require('child_process').spawn;
var parser = require('tap-parser');
var resolveBin = require('resolve-bin');
var concat = require('concat-stream');

var runNode = require('../lib/run-node');
var runElectron = require('../lib/run-electron');

var cliPath = path.join(process.cwd(), 'bin/cli.js');
var nycPath = resolveBin.sync('nyc');

var passingEntry = path.resolve(__dirname, '../fixtures/passing.js');
var failingEntry = path.resolve(__dirname, '../fixtures/failing.js');
var mockEntry = path.resolve(__dirname, '../fixtures/mock-entry.js');
var errorEntry = path.resolve(__dirname, '../fixtures/error-entry.js');
var exit123Entry = path.resolve(__dirname, '../fixtures/exit-123.js');
var slowPassingEntry = path.resolve(__dirname, '../fixtures/slow-passing');

test('basic node coverage reporting', function (t) {
  t.plan(1);
  runNode(mockEntry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});

test('basic electron coverage reporting', function (t) {
  t.plan(1);
  runElectron(mockEntry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});

test('both passing status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', passingEntry
  ]);
  child.on('close', function (code) {
    t.equal(code, 0);
  });
});

test('slow browser', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', slowPassingEntry
  ]);
  child.on('close', function (code) {
    t.equal(code, 0);
  });
});

test('slow node', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', slowPassingEntry,
    '--browser', passingEntry
  ]);
  child.on('close', function (code) {
    t.equal(code, 0);
  });
});

test('node failing only status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', failingEntry,
    '--browser', passingEntry
  ]);
  child.on('close', function (code) {
    t.ok(code);
  });
});

test('node failing only status code without browser', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', exit123Entry,
  ]);
  child.on('close', function (code) {
    t.equal(code, 123);
  });
});

test('browser failing only status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', failingEntry
  ]);
  child.on('close', function (code) {
    t.ok(code);
  });
});

test('both failing status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', failingEntry,
    '--browser', failingEntry
  ]);
  child.on('close', function (code) {
    t.ok(code);
  });
});

test('browser error status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', errorEntry
  ]);
  child.on('close', function (code) {
    t.ok(code);
  });
});

test('node error status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', errorEntry,
    '--browser', passingEntry
  ]);
  child.on('close', function (code) {
    t.ok(code);
  });
});

test('both error status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', errorEntry,
    '--browser', errorEntry
  ]);
  child.on('close', function (code) {
    t.ok(code);
  });
});

test('tap merging', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', passingEntry
  ]);
  child.stdout.pipe(parser(function (results) {
    t.equal(results.asserts.length, 2);
  }));
});

test('redirect protocol relative url to http', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--browser', path.resolve(__dirname, '../fixtures/protocol-relative-request.js')
  ]);
  child.on('close', function (code) {
    t.equal(code, 0);
  });
});

var expectedOutput = fs.readFileSync(path.resolve(__dirname, '../fixtures/expected-coverage-output.txt'), 'utf8');

test('nyc coverage works', function (t) {
  t.plan(2);
  var child = spawn('node', [nycPath, cliPath,
    '--node', path.resolve(__dirname, '../fixtures/foo-a.js'),
    '--browser', path.resolve(__dirname, '../fixtures/foo-b.js')
  ]);
  child.on('close', function (code) {
    t.equal(code, 0);
  });
  child.stdout.pipe(concat(function(output) {
    t.equal(trim(output.toString()), expectedOutput, 'coverage output matches expected');
  }));
});

// hack for xvfb/travis
function trim(str) {
  return str.replace(/Xlib:  extension "RANDR" missing on display ":99\.0"\.\n/g, '');
}
