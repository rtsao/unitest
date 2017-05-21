'use strict';

var test = require('tape');

test('a failing test', t => {
  t.fail('a failing assertion');
  t.end();
});

/**
 * Mock coverage object
 */
global.__coverage__ = {};
