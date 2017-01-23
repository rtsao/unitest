#!/usr/bin/env node

var didSend = false;

process.on('beforeExit', function sendCovereageBeforeExit() {
  if (!didSend) {
    process.send({'coverage': global.__coverage__});
    didSend = true;
  }
});
