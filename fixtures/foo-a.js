'use strict';

var test = require('tape');
var foo = require('./instrumented/foo');

test('test a', function (t) {
  t.equal(foo.a(), 'a', 'a is a');
  t.end();
});
