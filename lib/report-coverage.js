'use strict';

var istanbul = require('istanbul-api');
var libCoverage = require('istanbul-lib-coverage');

function report(objects, reports, reportDir) {
  var map = libCoverage.createCoverageMap();

  objects.forEach(function(obj) {
    map.merge(obj);
  });

  var reporter = istanbul.createReporter();
  reporter.addAll(reports);
  reporter.write(map);
}

module.exports = report;
