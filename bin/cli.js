#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var unitest = require('../');

var report = (argv.report && typeof argv.report === 'string') ?
  [argv.report] : argv.report;

unitest({node: argv.node, browser: argv.browser, report: report});
