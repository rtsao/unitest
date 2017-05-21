'use strict';

var test = require('tape');

test('a test with an error', t => {
  t.pass('a passing assertion');
  throw Error('an arror');
  t.end();
});

/**
 * Mock coverage object
 */
global.__coverage__ = {};
