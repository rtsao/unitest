'use strict';

var test = require('tape');

test('test protocol relative url is http', t => {
  t.plan(1);
  var req = new XMLHttpRequest();
  req.addEventListener('load', () => {
    var res = JSON.parse(req.responseText);
    t.equal(res.url, 'https://httpbin.org/get');
    t.end();
  });
  req.open('GET', '//httpbin.org/get');
  req.send();
});
