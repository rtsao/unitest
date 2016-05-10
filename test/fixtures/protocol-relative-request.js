'use strict';

var test = require('tape');

test('test protocol relative url is http', function (t) {
  t.plan(1);
  var req = new XMLHttpRequest();
  req.addEventListener('load', function () {
    var res = JSON.parse(req.responseText);
    t.equal(res.url, 'http://httpbin.org/get');
    t.end();
  });
  req.open('GET', '//httpbin.org/get');
  req.send();
});
