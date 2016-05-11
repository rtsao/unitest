#!/usr/bin/env electron

var path = require('path');
var electron = require('electron');
var ipc = electron.ipcMain;
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

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
    electron.protocol.interceptHttpProtocol('file', function (request, callback) {
      request.url = request.url.replace(/^file:\/\//, 'http://');
      callback(request);
    });
  });
  win.webContents.executeJavaScript('require("./renderer");');
  win.webContents.executeJavaScript('require("' + process.argv[2] + '");');
});
