#!/usr/bin/env electron

var path = require('path');
var electron = require('electron');
var ipc = electron.ipcMain;
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var RENDERER_PATH = path.join(__dirname, './renderer');

process.on('uncaughtException', function (err) {
  process.stderr.write(err.stack);
  process.send({error: true});
});

process.send({ready: true});

process.on('message', function (message) {
  if (message.port) {
    if (typeof win !== 'undefined') {
      loadPage(message.port);
    } else {
      port = message.port;
    }
  } else if (message.done) {
    win.webContents.send('tap-finished', true);
  } else if (message.exit) {
    app.quit();
  }
});

ipc.on('coverage', function (event, coverage) {
  process.send({'coverage': coverage}, function() {
    // exit electron after sending coverage
    app.quit();
  });
});

app.on('ready', function () {
  win = new BrowserWindow({show: false});
  if (typeof port !== 'undefined') {
    loadPage(port);
  }
});

function loadPage(port) {
  win.loadURL('http://localhost:' + port);
  win.webContents.executeJavaScript('require("' + RENDERER_PATH + '");');
  win.webContents.executeJavaScript('require("' + process.argv[2] + '");');
}
