#!/usr/bin/env electron

const path = require('path');
const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const RENDERER_PATH = path.join(__dirname, './renderer');

process.on('uncaughtException', err => {
  process.stderr.write(err.stack);
  process.send({error: true});
});

process.send({ready: true});

process.on('message', message => {
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

ipc.on('coverage', (event, coverage) => {
  process.send({coverage: coverage}, () => {
    // exit electron after sending coverage
    app.quit();
  });
});

app.on('ready', () => {
  win = new BrowserWindow({show: false});
  if (typeof port !== 'undefined') {
    loadPage(port);
  }
});

function loadPage(port) {
  win.loadURL(`http://localhost:${port}`);
  win.webContents.executeJavaScript(`require("${RENDERER_PATH}");`);
  win.webContents.executeJavaScript(`require("${process.argv[2]}");`);
}
