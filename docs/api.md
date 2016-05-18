# API Usage

```
var unitest = require('unitest');

var opts = {
  browser: 'test/browser.js',
  node: 'test/node.js'
};

var outputStream = unitest(opts, function(statusCode) {
  process.exitCode = statusCode;
});
outputStream.pipe(process.stdout);
```
