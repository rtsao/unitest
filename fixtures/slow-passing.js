'use strict';

var test = require('tape');

test('a slow passing test', t => {
  setTimeout(() => {
    t.pass('a slow passing assertion');
    t.end();
  }, 500);
});

/**
 * Mock coverage object
 */
global.__coverage__ = require('./big-coverage.json');
