'use strict';

var fs = require('fs');
var passthrough = require('stream').PassThrough;
var merge = require('tap-merge');
var multistream = require('multistream');

var runNode = require('./run-node');
var runElectron = require('./run-electron');
var reportCoverage = require('./report-coverage');

function run(opts) {
  if (!opts.node && !opts.browser) {
    throw Error('No browser or node test entry specified');
  }

  var coverageObjects = [];
  var outputs = [];

  function coverageHandler(coverage) {
    if (opts.report && coverage) {
      coverageObjects.push(coverage);
    }
  }

  if (opts.node) {
    var node = runNode(opts.node, coverageHandler);
    var nodeTap = passthrough();
    node.stdout.pipe(nodeTap);
    node.stderr.pipe(process.stderr);
    outputs.push(nodeTap);
  }

  if (opts.browser) {
    var electron = runElectron(opts.browser, coverageHandler);
    var electronTap = passthrough();
    electron.stdout.pipe(electronTap);
    electron.stderr.pipe(process.stderr);
    outputs.push(electronTap);
  }

  var allTap = multistream(outputs);

  var merged = merge();
  allTap.pipe(merged);

  merged.pipe(process.stdout);

  if (opts.report) {
    merged.on('end', function() {
      reportCoverage(coverageObjects, opts.report);
    });
  }
}

module.exports = run;
