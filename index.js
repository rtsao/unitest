'use strict';

var fs = require('fs');
var path = require('path');
var passthrough = require('stream').PassThrough;
var tapMerge = require('tap-merge');
var merge = require('merge2');
var multistream = require('multistream');
var parallel = require('run-parallel');

var runNode = require('./lib/run-node');
var runElectron = require('./lib/run-electron');
var reportCoverage = require('./lib/report-coverage');

function run(opts, cb) {
  if (!opts.node && !opts.browser) {
    throw Error('No browser or node test entry specified');
  }

  var tests = [];
  var coverageObjects = [];
  var outputs = [];

  function finish(code) {
    reportCoverage(coverageObjects);
    cb(code);
  }

  function runTest(runner, entry) {
    tests.push(function(done) {
      var out = passthrough();
      var err = passthrough();
      var entryPath = path.resolve(process.cwd(), entry);
      var sub = runner(entryPath, function(coverage, exitCode) {
        if (coverage) {
          coverageObjects.push(coverage);
        }
        done(null, exitCode);
      });
      sub.stdout.pipe(out);
      sub.stderr.pipe(err);
      outputs.push(merge([out, err]));
    });
  }

  if (opts.node) {
    runTest(runNode, opts.node);
  }

  if (opts.browser) {
    runTest(runElectron, opts.browser);
  }

  parallel(tests, function(err, results) {
    var finalCode = results.reduce(function(acc, code) {
      return acc || code;
    }, 0);
    finish(finalCode);
  });

  var allOutput = multistream(outputs);
  var merged = tapMerge();
  allOutput.pipe(merged);
  return merged;
}

module.exports = run;
