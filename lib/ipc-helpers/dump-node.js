#!/usr/bin/env node

let didSend = false;

process.on('unhandledRejection', reason => {
  if (reason.stack) {
    console.error(reason.stack);
  } else {
    console.error('Unhandled promise rejection with reason:', reason);
    console.error(
      `Note: use async functions instead of promises for stack traces.`
    );
  }
  process.exit(1);
});

// process.send takes a callback on Node 4+ and should be called in beforeExit
// process.send will schedule more work, so we check to only send once
process.on('beforeExit', function sendCovereageOnBeforeExit() {
  if (!didSend) {
    didSend = true;
    process.send({coverage: global.__coverage__});
  }
});
