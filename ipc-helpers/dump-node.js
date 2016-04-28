#!/usr/bin/env node

process.on('exit', function sendCoverage() {
  process.send({'coverage': global.__coverage__});
});
