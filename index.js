'use strict';

const fs = require('fs');
const path = require('path');
const {PassThrough} = require('stream');
const tapMerge = require('tap-merge');
const merge = require('merge2');
const multistream = require('multistream');
const parallel = require('run-parallel');

const runNode = require('./lib/run-node');
const runChrome = require('./lib/run-chrome');
const reportCoverage = require('./lib/report-coverage');

async function run(opts, cb) {
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

  function runTest(runner, paths) {
    if (typeof paths === 'string') {
      paths = [paths];
    }
    if (!Array.isArray(paths)) {
      throw new Error(
        'invalid test - expected paths as string or string array but got ' +
          paths
      );
    }
    tests.push.apply(
      tests,
      paths.map(entry => async done => {
        const out = PassThrough();
        const err = PassThrough();
        outputs.push(merge([out, err]));
        const entryPath = path.resolve(process.cwd(), entry);
        const sub = await runner(entryPath, (coverage, exitCode) => {
          if (coverage) {
            coverageObjects.push(coverage);
          }
          done(null, exitCode);
        });
        sub.stdout.pipe(out);
        sub.stderr.pipe(err);
      })
    );
  }

  if (opts.node) {
    runTest(runNode, opts.node);
  }

  if (opts.browser) {
    runTest(runChrome, opts.browser);
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
