'use strict';

var passthrough = require('stream').PassThrough;
var merge = require('tap-merge');
var multistream = require('multistream');

var runNode = require('./run-node');
var runElectron = require('./run-electron');
var reportCoverage = require('./report-coverage');

function run(opts) {
  if (opts.electron && opts.node) {

    var electron = runElectron(opts.electron, function onCoverage(coverage) {
      addCoverage(coverage);
    });

    var node = runNode(opts.node, function onCoverage(coverage) {
      addCoverage(coverage);
    });

    var nodeTap = passthrough();
    var electronTap = passthrough();

    electron.stdout.pipe(electronTap);
    node.stdout.pipe(nodeTap);

    var allTap = multistream([nodeTap, electronTap]);

    var merged = merge();
    allTap.pipe(merged);

    merged.pipe(process.stdout);
  }
}

module.exports = run;

var coverageObjects = [];

function addCoverage(object) {
  coverageObjects.push(object);
  if (coverageObjects.length === 2) {
    reportCoverage(coverageObjects);
  }
}
