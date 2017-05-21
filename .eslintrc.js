module.exports = {
  env: {
    node: false
  },
  parserOptions: {
    ecmaVersion: 6
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
