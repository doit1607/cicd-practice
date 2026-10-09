const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // dist/ là file sinh ra khi build, không cần kiểm tra.
  { ignores: ['dist/'] },
  // Bộ luật khuyến nghị: bắt biến khai báo mà không dùng, biến chưa khai báo, ...
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  // Code trong site/ chạy trên trình duyệt: có window, document; không có require.
  {
    files: ['site/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: globals.browser,
    },
  },
];
