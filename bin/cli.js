#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var unitest = require('../');

unitest({node: argv.node, electron: argv.electron});
