'use strict';

var env = process.browser ? 'electron' : 'node';

var test = require('tape');

test(env + ' test 1', function (t) {
  t.pass(env + ' assertion');
  t.end();
});

test(env + ' test 2', function (t) {
  t.plan(1);
  setTimeout(function() {
    t.pass(env + ' async assertion');
  }, process.browser ? 500 : 100);
});

/**
 * Mock coverage object
 */
global.__coverage__ = {};
