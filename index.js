'use strict';

const fs = require('fs');
const path = require('path');
const {PassThrough} = require('stream');
const tapMerge = require('tap-merge');
const merge = require('merge2');
const multistream = require('multistream');
const parallel = require('run-parallel');

const runNode = require('./lib/run-node');
const runElectron = require('./lib/run-electron');
const reportCoverage = require('./lib/report-coverage');

function run(opts, cb) {
  if (!opts.node && !opts.browser) {
    throw Error('No browser or node test entry specified');
  }

  const tests = [];
  const coverageObjects = [];
  const outputs = [];

  function finish(code) {
    reportCoverage(coverageObjects);
    cb(code);
  }

  function runTest(runner, entry) {
    tests.push(done => {
      const out = PassThrough();
      const err = PassThrough();
      const entryPath = path.resolve(process.cwd(), entry);
      const sub = runner(entryPath, (coverage, exitCode) => {
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

  parallel(tests, (err, results) => {
    const finalCode = results.reduce((acc, code) => acc || code, 0);
    finish(finalCode);
  });

  const allOutput = multistream(outputs);
  const merged = tapMerge();
  allOutput.pipe(merged);
  return merged;
}

module.exports = run;
