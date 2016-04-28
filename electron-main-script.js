#!/usr/bin/env electron

var path = require('path');
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

ipc.on('coverage', function (_, coverage) {
  process.send({'coverage': coverage});
});

app.on('ready', function () {
  win = new BrowserWindow({show: false});
  win.loadURL('file://' + path.join(__dirname, 'index.html'));
  process.on('message', function(message) {
    if (message.done) {
      win.webContents.send('tap-finished', true);
    }
  });
  win.webContents.executeJavaScript('require("./electron-renderer-script");');
  win.webContents.executeJavaScript('require("' + process.argv[2] + '");');
});
