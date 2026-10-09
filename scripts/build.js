// Build trang web vào thư mục dist/ để deploy lên GitHub Pages.
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

// 1. Xoá bản build cũ, chép toàn bộ site/ sang dist/.
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'site'), dist, { recursive: true });

// 2. Đóng gói file CommonJS trong src/ để trình duyệt dùng được qua window.<tên>.
//    Nhờ vậy code chạy trên web CHÍNH LÀ code đã qua test trong CI.
function bundle(srcFile, outFile, globalName) {
  const source = fs.readFileSync(path.join(root, 'src', srcFile), 'utf8');
  fs.writeFileSync(
    path.join(dist, outFile),
    `window.${globalName} = (function () {\nconst module = { exports: {} };\n${source}\nreturn module.exports;\n})();\n`,
  );
}
bundle('calculator.js', 'calculator.js', 'calculator');
bundle('wedding.js', 'wedding/wedding.js', 'wedding');

// 3. Ghi phiên bản vào các trang. GITHUB_SHA là biến môi trường GitHub Actions tự cung cấp;
//    chạy trên máy mình thì không có nên hiện "local".
const commit = (process.env.GITHUB_SHA || 'local').slice(0, 7);
const buildTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
for (const page of ['index.html', 'wedding/index.html']) {
  const pagePath = path.join(dist, page);
  const html = fs
    .readFileSync(pagePath, 'utf8')
    .replace('__COMMIT__', commit)
    .replace('__BUILD_TIME__', buildTime);
  fs.writeFileSync(pagePath, html);
}

console.log(`Build xong → dist/ (commit ${commit})`);
