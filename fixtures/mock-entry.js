'use strict';

var env = process.browser ? 'electron' : 'node';

var test = require('tape');

test(env + ' test 1', t => {
  t.pass(env + ' assertion');
  t.end();
});

test(env + ' test 2', t => {
  t.plan(1);
  setTimeout(() => {
    t.pass(env + ' async assertion');
  }, process.browser ? 500 : 100);
});

/**
 * Mock coverage object
 */
global.__coverage__ = {};
