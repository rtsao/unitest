'use strict';

const libCoverage = require('istanbul-lib-coverage');

function report(objects) {
  const map = libCoverage.createCoverageMap();
  objects.forEach(obj => {
    map.merge(obj);
  });
  global.__coverage__ = map.toJSON();
}

module.exports = report;
