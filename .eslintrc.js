module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "semi": ["off", "always"],
    "no-plusplus": ["off", "always"],
    "no-use-before-define": ["off", "always"],
    "prefer-const": ["off", "always"]

  },
};
