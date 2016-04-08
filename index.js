'use strict';

var passthrough = require('stream').PassThrough;
var merge = require('tap-merge');
var multistream = require('multistream');

var runNode = require('./run-node');
var runElectron = require('./run-electron');

function run(opts) {
  if (opts.electron && opts.node) {

    var electron = runElectron(opts.electron, function onCoverage(coverage) {
      // do something with coverage
    });

    var node = runNode(opts.node, function onCoverage(coverage) {
      // do something with coverage
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
