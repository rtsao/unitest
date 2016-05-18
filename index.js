'use strict';

var fs = require('fs');
var path = require('path');
var passthrough = require('stream').PassThrough;
var tapMerge = require('tap-merge');
var merge = require('merge2');
var reduce = require('stream-reduce');
var multistream = require('multistream');

var runNode = require('./lib/run-node');
var runElectron = require('./lib/run-electron');
var reportCoverage = require('./lib/report-coverage');

function run(opts, cb) {
  if (!opts.node && !opts.browser) {
    throw Error('No browser or node test entry specified');
  }

  var coverageObjects = [];
  var outputs = [];
  var exitCodes = [];

  function finish(code) {
    if (opts.report) {
      reportCoverage(coverageObjects, opts.report);
    }
    cb(code);
  }

  function runTest(runner, entry) {
    var out = passthrough();
    var err = passthrough();
    var code = passthrough({objectMode: true});
    var sub = runner(path.resolve(process.cwd(), entry), function (coverage, exitCode) {
      if (coverage) {
        coverageObjects.push(coverage);
      }
      code.end(exitCode);
    });
    sub.stdout.pipe(out);
    sub.stderr.pipe(err);
    var merged = merge([out, err]);
    outputs.push(merged);
    exitCodes.push(code);
  }

  if (opts.node) {
    runTest(runNode, opts.node);
  }

  if (opts.browser) {
    runTest(runElectron, opts.browser);
  }

  var exitCodeStream = multistream(exitCodes, {objectMode: true});
  exitCodeStream.pipe(reduce(function (acc, code) {
    return acc || code;
  }, 0)).on('data', finish);

  var allOutput = multistream(outputs);
  var merged = tapMerge();
  allOutput.pipe(merged);
  return merged;
}

module.exports = run;
