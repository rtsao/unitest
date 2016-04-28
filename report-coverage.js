'use strict';

var istanbul = require('istanbul');

var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter();

function report(objects, reports) {
  objects.forEach(function(obj) {
    collector.add(obj);
  });

  reporter.addAll(reports);

// reporter.write(collector, sync, function () {
//   console.log('All reports generated');
// });

}

module.exports = report;
