'use strict';

var test = require('tape');

test('a passing test', function (t) {
  t.pass('a passing assertion');
  t.end();
});

/**
 * Mock coverage object
 */
global.__coverage__ = {};
