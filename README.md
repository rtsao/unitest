# unitest

[![build status][build-badge]][build-href]
[![dependencies status][deps-badge]][deps-href]
[![npm version][npm-badge]][npm-href]

Seamless node and browser unit testing with code coverage

##### Features

- Unified TAP and code coverage output for node and browser tests.
- Works with coverage instrumentation Babel plugins. This means faster coverage  instrumentation if you are already using Babel.
- Electron-powered browser testing for a fast, modern, headless browser environment.
- Bundler-agnostic usage. Use browserify/webpack or something else.

## Usage
```
Usage: unitest {OPTIONS}

Options:

    --version, -v  Print version and exit

       --help, -h  Print usage information

       --node, -n  Path to node test entry file

    --browser, -c  Path to browser test entry file

     --report, -r  Istanbul coverage report
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

Running tests with coverage involves the exact same steps, but with an additional [coverage instrumentation Babel plugin](https://github.com/dtinth/babel-plugin-__coverage__).

```
babel src -d build --plugins=__coverage__
browserify build/test/browser.js > build/test/browser-bundle.js
unitest --browser=build/test/browser.js --node=build/test/node.js --report=html
```

#### Merged test output

The separate TAP and coverage output along with exit code for your node and browser tests will be merged intelligently.

## Debugging

### Debug node tests

No magic here, just use [`node-inspector`](https://github.com/node-inspector/node-inspector).

```
npm i -g node-inspector
node-debug build/test/node.js
```

### Debug browser (electron) tests

No magic here, just use [`devtool`](https://github.com/Jam3/devtool).

```
npm i -g devtool
devtool build/test/browser-bundle.js
```

[build-badge]: https://travis-ci.org/rtsao/unitest.svg?branch=master
[build-href]: https://travis-ci.org/rtsao/unitest
[deps-badge]: https://david-dm.org/rtsao/unitest.svg
[deps-href]: https://david-dm.org/rtsao/unitest
[npm-badge]: https://badge.fury.io/js/unitest.svg
[npm-href]: https://www.npmjs.com/package/unitest
