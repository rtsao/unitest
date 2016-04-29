# Code coverage

`unitest` is designed to work with `istanbul`-compatible coverage instrumentation.

For flexibility, simplicity, and easy integration with a wide variety of build processes, the instrumentation itself is out of scope for `unitest`. `istanbul` is a dependency of `unitest` but it is only used for generation of reports. It is recommended you use the [`babel-plugin-__coverage__`](https://github.com/dtinth/babel-plugin-__coverage__) Babel plugin for code coverage instrumentation.

### Reporting options

`unitest` supports all [`istanbul` reporting options](https://github.com/gotwarlost/istanbul/tree/master/lib/report).
