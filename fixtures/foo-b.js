'use strict';

var test = require('tape');
var foo = require('./instrumented/foo');

test('test b', function (t) {
  t.equal(foo.b(), 'b', 'b is b');
  t.end();
});
