'use strict';

require('exit-code');

var fs = require('fs');
var passthrough = require('stream').PassThrough;
var merge = require('tap-merge');
var multistream = require('multistream');

var runNode = require('./run-node');
var runElectron = require('./run-electron');
var reportCoverage = require('./report-coverage');

function run(opts) {
  var coverageObjects = [];
  var outputs = [];

  function coverageHandler(coverage) {
    if (opts.report) {
      coverageObjects.push(coverage);
    }
  }

  if (!opts.node && !opts.browser) {
    fs.createReadStream('./bin/usage.txt').pipe(process.stdout);
    process.exitCode = 1;
    return false;
  }

  if (opts.node) {
    var node = runNode(opts.node, coverageHandler);
    var nodeTap = passthrough();
    node.stdout.pipe(nodeTap);
    outputs.push(nodeTap);
  }

  if (opts.browser) {
    var electron = runElectron(opts.browser, coverageHandler);
    var electronTap = passthrough();
    electron.stdout.pipe(electronTap);
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
