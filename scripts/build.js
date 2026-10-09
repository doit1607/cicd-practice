// Build trang web vào thư mục dist/ để deploy lên GitHub Pages.
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

// 1. Xoá bản build cũ, chép toàn bộ site/ sang dist/.
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'site'), dist, { recursive: true });

// 2. Đóng gói src/calculator.js (CommonJS) để trình duyệt dùng được qua window.calculator.
//    Nhờ vậy code chạy trên web CHÍNH LÀ code đã qua test trong CI.
const calculatorSource = fs.readFileSync(path.join(root, 'src', 'calculator.js'), 'utf8');
fs.writeFileSync(
  path.join(dist, 'calculator.js'),
  `window.calculator = (function () {\nconst module = { exports: {} };\n${calculatorSource}\nreturn module.exports;\n})();\n`,
);

// 3. Ghi phiên bản vào trang. GITHUB_SHA là biến môi trường GitHub Actions tự cung cấp;
//    chạy trên máy mình thì không có nên hiện "local".
const commit = (process.env.GITHUB_SHA || 'local').slice(0, 7);
const buildTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
const indexPath = path.join(dist, 'index.html');
const html = fs
  .readFileSync(indexPath, 'utf8')
  .replace('__COMMIT__', commit)
  .replace('__BUILD_TIME__', buildTime);
fs.writeFileSync(indexPath, html);

console.log(`Build xong → dist/ (commit ${commit})`);
