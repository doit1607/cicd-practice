// Đánh dấu từ khoá trong câu, vd: highlight('1+1=2', '1+1') → '[1+1]=2'
function highlight(text, keyword) {
  const pattern = new RegExp(RegExp.escape(keyword), 'g');
  return text.replace(pattern, `[${keyword}]`);
}

module.exports = { highlight };