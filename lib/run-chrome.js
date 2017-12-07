'use strict';

const fs = require('fs');
const net = require('net');
const path = require('path');
const http = require('http');
const {PassThrough} = require('stream');
const getPort = require('get-port');

const CDP = require('chrome-remote-interface');

const finished = require('tap-finished');

const chromeLauncher = require('chrome-launcher');

module.exports = runChrome;

async function runChrome(entry, cb) {
  let coverage = {};
  let exitCode = 0;

  const outstream = PassThrough();
  const errstream = PassThrough();

  const chromeInstance = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu'],
  });

  const port = chromeInstance.port;
  const client = await CDP({port});

  const serverPort = await getPort({host: 'localhost'});
  const server = startServer(entry);
  server.listen(serverPort, err => {
    if (err) {
      throw err;
    }

    const {Page, Runtime} = client;

    Runtime.exceptionThrown(e => {
      let {description} = e.exceptionDetails.exception;
      const str = description + '\n';
      donestream.write(str);
      outstream.write(str);
      exitCode = 1;
      client.close();
      chromeInstance.kill('SIGINT');
      server.close();
      outstream.end();
      errstream.end();
      Promise.resolve().then(() => {
        cb(coverage, exitCode);
      });
    });

    const donestream = finished(async results => {
      const res = await Runtime.evaluate({
        expression: 'window.__coverage__',
        returnByValue: true,
      });

      coverage = res.result.value;
      client.close();
      chromeInstance.kill('SIGINT');
      server.close();
      if (!results.ok) {
        exitCode = 1;
      }

      Promise.resolve().then(() => {
        cb(coverage, exitCode);
      });

      outstream.end();
      errstream.end();
    });

    Runtime.consoleAPICalled(res => {
      const str = res.args.map(arg => arg.value).join(' ') + '\n';
      donestream.write(str);
      outstream.write(str);
    });

    Promise.all([Page.enable(), Runtime.enable()])
      .then(() => {
        return Page.navigate({url: `http://localhost:${serverPort}`});
      })
      .catch(err => {
        client.close();
      });
  });

  return {stdout: outstream, stderr: errstream};
}

function startServer(entry) {
  return http.createServer((req, res) => {
    if (req.url === '/script.js') {
      return fs.createReadStream(entry).pipe(res);
    }
    res.end(`<!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgo=">
        <title>page</title>
      </head>
      <body>
        <script src="/script.js"></script>
      </body>
      </html>
    `);
  });
}
