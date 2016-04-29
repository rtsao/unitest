'use strict';

var passthrough = require('stream').PassThrough;
var merge = require('tap-merge');
var multistream = require('multistream');

var runNode = require('./run-node');
var runElectron = require('./run-electron');
var reportCoverage = require('./report-coverage');

var coverageObjects = [];

function run(opts) {
  function coverageHandler(coverage) {
    if (opts.report) {
      addCoverage(coverage, opts.report);
    }
  }

  if (opts.browser && opts.node) {
    var electron = runElectron(opts.browser, coverageHandler);
    var node = runNode(opts.node, coverageHandler);

    var nodeTap = passthrough();
    var electronTap = passthrough();

    electron.stdout.pipe(electronTap);
    node.stdout.pipe(nodeTap);

    var allTap = multistream([nodeTap, electronTap]);

    var merged = merge();
    allTap.pipe(merged);

    merged.pipe(process.stdout);
    merged.on('end', function() {
      reportCoverage(coverageObjects, opts.report);
    });
  }
}

module.exports = run;

function addCoverage(object, report) {
  coverageObjects.push(object);
}
