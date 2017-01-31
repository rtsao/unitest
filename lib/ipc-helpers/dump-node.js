#!/usr/bin/env node

var didSend = false;

// Node 0.10 does not have 'beforeExit'
// process.send is synchronous on 0.10 and 0.12
process.on('exit', function sendCovereageOnExit() {
  if (!didSend) {
    didSend = true;
    process.send({'coverage': global.__coverage__});
  }
});

// process.send takes a callback on Node 4+ and should be called in beforeExit
// process.send will schedule more work, so we check to only send once
process.on('beforeExit', function sendCovereageOnBeforeExit() {
  if (!didSend) {
    didSend = true;
    process.send({'coverage': global.__coverage__});
  }
});
