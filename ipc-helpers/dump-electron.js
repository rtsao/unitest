#!/usr/bin/env electron

var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('tap-finished', function sendCoverage() {
  ipcRenderer.send('coverage', window.__coverage__);
  require('remote').require('app').quit();
});
