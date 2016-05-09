#!/usr/bin/env electron

var path = require('path');
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

ipc.on('coverage', function (event, coverage) {
  process.send({'coverage': coverage}, function() {
    // exit electron after sending coverage
    require('app').quit();
  });
});

app.on('ready', function () {
  win = new BrowserWindow({show: false});
  win.loadURL('file://' + path.join(__dirname, 'index.html'));
  process.on('message', function(message) {
    if (message.done) {
      win.webContents.send('tap-finished', true);
    }
  });
  win.webContents.executeJavaScript('require("./renderer");');
  win.webContents.executeJavaScript('require("' + process.argv[2] + '");');
});
