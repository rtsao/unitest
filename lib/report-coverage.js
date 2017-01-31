'use strict';

var libCoverage = require('istanbul-lib-coverage');

function report(objects) {
  var map = libCoverage.createCoverageMap();
  objects.forEach(function(obj) {
    map.merge(obj);
  });
  global.__coverage__ = map.toJSON();
}

module.exports = report;
