'use strict';

var test = require('tape');
var runNode = require('../run-node');
var runElectron = require('../run-electron');

test('test basic node coverage reporting', function (t) {
  t.plan(1);
  runNode('./test/fixtures/foo.js', function onCoverage(coverage) {
    t.equal(coverage, 'mockCoverage');
  });
});

test('test basic electron coverage reporting', function (t) {
  t.plan(1);
  runElectron('./test/fixtures/foo.js', function onCoverage(coverage) {
    t.equal(coverage, 'mockCoverage');
  });
});
