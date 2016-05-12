'use strict';

var fs = require('fs');
var path = require('path');
var passthrough = require('stream').PassThrough;
var merge = require('tap-merge');
var multistream = require('multistream');

var runNode = require('./lib/run-node');
var runElectron = require('./lib/run-electron');
var reportCoverage = require('./lib/report-coverage');

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

  function runTest(runner, entry) {
    var sub = runner(path.resolve(process.cwd(), entry), coverageHandler);
    var out = passthrough();
    var err = passthrough();
    sub.stdout.pipe(out);
    sub.stderr.pipe(err);
    outputs.push(out, err);
  }

  if (opts.node) {
    runTest(runNode, opts.node);
  }

  if (opts.browser) {
    runTest(runElectron, opts.browser);
  }

  var allOutput = multistream(outputs);
  var merged = merge();

  allOutput.pipe(merged);
  merged.pipe(process.stdout);
  
  if (opts.report) {
    merged.on('end', function() {
      console.log('wtfff');
      reportCoverage(coverageObjects, opts.report);
    });
  }
}

module.exports = run;
