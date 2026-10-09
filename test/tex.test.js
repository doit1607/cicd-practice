const test = require('node:test');
const assert = require('node:assert/strict');
const { highlight } = require('../src/text');

test('highlight đánh dấu từ khoá có ký tự đặc biệt', () => {
  assert.equal(highlight('1+1=2', '1+1'), '[1+1]=2');
});