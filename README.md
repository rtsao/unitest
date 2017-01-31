# [![unitest logo](https://cdn.rawgit.com/rtsao/unitest/logo/logo.svg "unitest")](https://github.com/rtsao/unitest)

[![build status][build-badge]][build-href]
[![dependencies status][deps-badge]][deps-href]
[![npm version][npm-badge]][npm-href]

Seamless node and browser unit testing with code coverage

##### Features

- Unified node and browser tests with merged TAP output, code coverage reports, and exit status codes.
- [Electron](https://github.com/electron/electron)-powered browser testing for a fast, modern browser testing environment.
- Bundler-agnostic usage. Use browserify, webpack, or something else.
- Designed to be used with [Babel-powered coverage instrumentation](https://github.com/istanbuljs/babel-plugin-istanbul) for fast, efficient testing with code coverage.
- Works seamlessly with [nyc](https://github.com/istanbuljs/nyc), the official Istanbul CLI.

## Usage
```
Usage: unitest {OPTIONS}

Options:

    --version, -v  Print version and exit

       --help, -h  Print usage information

       --node, -n  Path to node test entry file

    --browser, -c  Path to browser test entry file
```

## Getting Started

### Run node and browser tests

1. Transpile source code with Babel *(optional)*
2. Bundle browser code *(this step is possibly optional since `require` works in electron)*
3. Run `unitest`, specifying test entry files

```
babel src -d build
browserify build/test/browser.js > build/test/browser-bundle.js
unitest --browser=build/test/browser-bundle.js --node=build/test/node.js
```

### Run node and browser tests with coverage report

Unitest works with [`nyc`](https://github.com/istanbuljs/nyc), the Istanbul CLI. To run unitest with coverage, add the [Istanbul instrumentation Babel plugin](https://github.com/istanbuljs/babel-plugin-istanbul) then run unitest with nyc on the instrumented code:

```
babel src -d build --plugins=istanbul
browserify build/test/browser.js > build/test/browser-bundle.js
nyc --report=html unitest --browser=build/test/browser-bundle.js --node=build/test/node.js
```

#### Merged test output

The separate TAP and coverage output along with exit code for your node and browser tests will be merged seamlessly.

## Debugging

### Debug node tests

No magic here, just use [`node-inspector`](https://github.com/node-inspector/node-inspector) or plain node.

```
npm install node-inspector -g
node-debug build/test/node.js
```

### Debug browser (electron) tests

No magic here, just use [`devtool`](https://github.com/Jam3/devtool).

```
npm install devtool -g
devtool build/test/browser-bundle.js
```

[build-badge]: https://travis-ci.org/rtsao/unitest.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/unitest
[deps-badge]: https://david-dm.org/rtsao/unitest.svg
[deps-href]: https://david-dm.org/rtsao/unitest
[npm-badge]: https://badge.fury.io/js/unitest.svg
[npm-href]: https://www.npmjs.com/package/unitest
