'use strict';

var istanbul = require('istanbul');

function report(objects, reports) {
  var collector = new istanbul.Collector();
  var reporter = new istanbul.Reporter();

  objects.forEach(function(obj) {
    collector.add(obj);
  });
  reporter.addAll(reports);
  reporter.write(collector, true, function() {});
}

module.exports = report;
