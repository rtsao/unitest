'use strict';

var test = require('tape');
var path = require('path');
var runNode = require('../run-node');
var runElectron = require('../run-electron');

test('test basic node coverage reporting', function (t) {
  t.plan(1);
  var entry = path.join(__dirname, 'fixtures/foo.js');
  runNode(entry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});

test('test basic electron coverage reporting', function (t) {
  t.plan(1);
  var entry = path.join(__dirname, 'fixtures/foo.js');
  runElectron(entry, function onCoverage(coverage) {
    t.deepEqual(coverage, {});
  });
});
