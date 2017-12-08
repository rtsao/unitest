'use strict';

var test = require('tape');

test('a test with an unhandled rejection', async t => {
  t.pass('a passing assertion');
  await throws();
  t.end();
});

async function throws() {
  // return Promise.reject({some: 'rejection'});
  throw new Error('an async error');
}

/**
 * Mock coverage object
 */
global.__coverage__ = {};
