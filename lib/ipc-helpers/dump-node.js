#!/usr/bin/env node

process.on('beforeExit', function sendCovereageBeforeExit() {
  process.send({'coverage': global.__coverage__});
});
