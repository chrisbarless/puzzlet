module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:jest/recommended', 'airbnb-base'],
  plugins: ['jest'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {},
};
