# unitest
Seamless node and browser unit testing with code coverage

*NOTE: This is a work in progress. Not ready for use yet.*

Features

- Unified TAP and code coverage output for node and browser tests.
- Works with coverage instrumentation Babel plugins. This means faster coverage  instrumentation if you are already using Babel.
- Electron-powered browser testing for a fast, modern, headless browser environment.
- Bundler-agnostic usage. Use browserify/webpack or something else.

## Usage

### Run node and browser tests

1. Transpile source code to ES5 with `babel-cli`
2. Bundle browser code *(this step is possibly optional since `require` works in electron)*
3. Run `unitest`, specifying test entry files

```
babel src -d build
browserify build/test/browser.js > build/test/browser-bundle.js
unitest --browser=build/test/browser-bundle.js --node=build/test/node.js
```

### Run node and browser tests with coverage report

Running tests with coverage involves the exact same steps, but with an additional coverage instrumentation plugin.

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

