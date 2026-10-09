// Dùng test runner có sẵn của Node (node:test), không cần cài Jest.
const test = require('node:test');
const assert = require('node:assert/strict');
const { add, subtract, multiply, divide } = require('../src/calculator');

test('add cộng hai số', () => {
  assert.equal(add(2, 3), 5);
});

test('subtract trừ hai số', () => {
  assert.equal(subtract(10, 4), 6);
});

test('multiply nhân hai số', () => {
  assert.equal(multiply(3, 4), 12);
});

test('divide chia hai số', () => {
  assert.equal(divide(10, 2), 5);
});

test('divide báo lỗi khi chia cho 0', () => {
  assert.throws(() => divide(1, 0), /chia cho 0/);
});
