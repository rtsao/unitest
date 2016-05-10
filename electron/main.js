#!/usr/bin/env electron

var path = require('path');
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

ipc.on('coverage', function (event, coverage) {
  process.send({'coverage': coverage}, function() {
    // exit electron after sending coverage
    app.quit();
  });
});

app.on('ready', function () {
  win = new BrowserWindow({show: false});
  process.on('message', function(message) {
    if (message.done) {
      win.webContents.send('tap-finished', true);
    }
  });
  win.loadURL('file://' + path.join(__dirname, 'index.html'));
  win.webContents.on('did-frame-finish-load', function() {
    require('protocol').interceptHttpProtocol('file', function (request, callback) {
      request.url = request.url.replace(/^file:\/\//, 'http://');
      callback(request);
    });
  });
  win.webContents.executeJavaScript('require("./renderer");');
  win.webContents.executeJavaScript('require("' + process.argv[2] + '");');
});
