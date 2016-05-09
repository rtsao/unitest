#!/usr/bin/env electron

var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('tap-finished', function sendCoverage() {
  ipcRenderer.sendSync('coverage', window.__coverage__);
});
