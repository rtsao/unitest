var test = require('tape');

var env = process.browser ? 'electron' : 'node';

test(env + ' test 1', function (t) {
  t.pass(env + ' assertion');
  t.end();
});

test(env + ' test2', function (t) {
  t.plan(1);
  setTimeout(function() {
    t.pass(env + ' async assertion');
  }, process.browser ? 500 : 100);
});
