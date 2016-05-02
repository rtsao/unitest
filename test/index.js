'use strict';

var test = require('tape');
var path = require('path');
var spawn = require('child_process').spawn;
var parser = require('tap-parser');

var runNode = require('../run-node');
var runElectron = require('../run-electron');

var cliPath = path.join(process.cwd(), 'bin/cli.js');
var passingEntry = path.join(__dirname, 'fixtures/passing-test.js');
var failingEntry = path.join(__dirname, 'fixtures/failing-test.js');

test('basic node coverage reporting', function (t) {
  t.plan(1);
  var entry = path.join(__dirname, 'fixtures/mock-test-entry.js');
  runNode(entry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});

test('basic electron coverage reporting', function (t) {
  t.plan(1);
  var entry = path.join(__dirname, 'fixtures/mock-test-entry.js');
  runElectron(entry, function onCoverage(coverage) {
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
    t.equal(code, 1);
  });
});

test('browser failing only status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', failingEntry
  ]);
  child.on('close', function (code) {
    t.equal(code, 1);
  });
});

test('both failing status code', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', failingEntry,
    '--browser', failingEntry
  ]);
  child.on('close', function (code) {
    t.equal(code, 1);
  });
});

test('tap merging', function (t) {
  t.plan(1);
  var child = spawn('node', [cliPath,
    '--node', passingEntry,
    '--browser', passingEntry
  ]);
  child.stdout.pipe(parser(function (results) {
    t.equal(results.count, 2);
  }));
});
