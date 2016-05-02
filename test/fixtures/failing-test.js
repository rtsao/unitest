'use strict';

var test = require('tape');

test('a failing test', function (t) {
  t.fail('a failing assertion');
  t.end();
});

/**
 * Mock coverage object
 */
global.__coverage__ = {};
