#!/usr/bin/env electron

var path = require('path');
var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

ipc.on('coverage', function (_,coverage) {
  process.send({'coverage': coverage});
});

app.on('ready', function () {
  var win = new BrowserWindow({show: false});
  win.loadURL('file://' + path.join(__dirname, 'index.html'));

  process.on('message', function(message) {
    if (message.done) {
      win.webContents.send('tap-finished', 'whoooooooh!');
    }
  });

  win.webContents.executeJavaScript('require("' + process.argv[2] + '");');

});
