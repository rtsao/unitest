#!/usr/bin/env electron

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('tap-finished', function sendCoverage() {
  ipcRenderer.send('coverage', window.__coverage__);
});
