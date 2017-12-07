module.exports = {
  env: {
    node: false
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: false
      }
    ]
  }
};
