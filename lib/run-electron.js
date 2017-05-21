'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const spawn = require('child_process').spawn;
const electron = require('electron');
const finished = require('tap-finished');
const getport = require('getport');
const backoff = require('backoff');
const parallel = require('run-parallel');

const INDEX_PATH = path.join(__dirname, './electron/index.html');
const MAIN_PATH = path.join(__dirname, './electron/main.js');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function findPort(cb) {
  const fibonacci = backoff.fibonacci({
    randomisationFactor: 0.1,
    initialDelay: 1,
    factor: 1.1,
    maxDelay: 3000,
  });
  fibonacci.on('ready', (number, delay) => {
    getport(getRandomInt(3000, 10000), (err, port) => {
      if (err) {
        return fibonacci.backoff();
      }
      return cb(null, port);
    });
  });
  fibonacci.on('fail', () => cb('could not find port'));
  fibonacci.backoff();
}

function runElectron(entry, cb) {
  let child;
  let coverage = {};
  let exitCode = 0;
  const tasks = [];
  // ensure child process gets killed
  process.on('exit', () => {
    if (child && child.connected) {
      child.send({exit: true});
    }
  });
  tasks.push(findPort);
  child = spawn(electron, [MAIN_PATH, entry], {
    stdio: [null, null, null, 'ipc'],
  });
  tasks.push(cb => {
    child.on('message', message => {
      if (message.ready) {
        cb();
      }
    });
  });
  child.stdout.pipe(
    finished(results => {
      if (!results.ok) {
        exitCode = 1;
      }
      if (child.connected) {
        child.send({done: true});
      }
    })
  );
  child.on('exit', code => {
    if (code) {
      exitCode = code;
    }
    cb(coverage, exitCode);
  });
  child.on('message', message => {
    if (message.coverage) {
      coverage = message.coverage;
    } else if (message.error) {
      exitCode = 1;
    }
  });
  parallel(tasks, (err, results) => {
    if (err) {
      throw err;
    }
    const port = results[0];
    startServer(port, () => {
      child.send({port});
    });
  });
  return child;
}

function startServer(startport, cb) {
  let port = startport;
  const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(INDEX_PATH).pipe(res);
    try {
      server.close();
    } catch (e) {}
  });
  const fibonacci = backoff.fibonacci({
    randomisationFactor: 0.1,
    initialDelay: 1,
    factor: 1.1,
    maxDelay: 3000,
  });
  server.on('error', err =>
    findPort((portErr, newport) => {
      if (portErr) {
        return cb('could not find new port');
      }
      port = newport;
      fibonacci.backoff();
    })
  );
  fibonacci.on('ready', (number, delay) => {
    server.listen(port, err => {
      if (!err) {
        return cb(null, 'success');
      }
    });
  });
  fibonacci.on('fail', () => cb('could not find port'));
  fibonacci.backoff();
}

module.exports = runElectron;
