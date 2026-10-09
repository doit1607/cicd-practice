const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Bộ luật khuyến nghị: bắt biến khai báo mà không dùng, biến chưa khai báo, ...
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
];
