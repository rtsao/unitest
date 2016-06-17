'use strict';

var test = require('tape');
var path = require('path');
var http = require('http');
var spawn = require('child_process').spawn;
var parser = require('tap-parser');

var runNode = require('../lib/run-node');
var runElectron = require('../lib/run-electron');

var cliPath = path.join(process.cwd(), 'bin/cli.js');

var passingEntry = path.join(__dirname, 'fixtures/passing.js');
var failingEntry = path.join(__dirname, 'fixtures/failing.js');
var mockEntry = path.join(__dirname, 'fixtures/mock-entry.js');
var errorEntry = path.join(__dirname, 'fixtures/error-entry.js');
var exit123Entry = path.join(__dirname, 'fixtures/exit-123.js');

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
    '--browser', path.join(__dirname, 'fixtures/protocol-relative-request.js')
  ]);
  child.on('close', function (code) {
    t.equal(code, 0);
  });
});
