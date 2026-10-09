const test = require('node:test');
const assert = require('node:assert/strict');
const {
  NAME_MAX,
  formatLongDate,
  formatShortDate,
  formatTime,
  countdown,
  validateWish,
  sortWishes,
  googleCalendarUrl,
  mapsUrl,
  vietQrUrl,
  initial,
} = require('../src/wedding');

const WEDDING = '2026-12-20T10:00:00+07:00';

test('countdown tách thời gian còn lại thành ngày, giờ, phút, giây', () => {
  const left = 2 * 86400e3 + 3 * 3600e3 + 4 * 60e3 + 5e3;
  const now = new Date(WEDDING).getTime() - left;
  assert.deepEqual(countdown(WEDDING, now), { days: 2, hours: 3, minutes: 4, seconds: 5, done: false });
});

test('countdown trả về 0 và done khi đã qua ngày cưới', () => {
  assert.deepEqual(countdown(WEDDING, '2027-01-01T00:00:00+07:00'), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: true,
  });
});

test('formatLongDate dùng giờ Việt Nam kể cả khi giờ UTC vẫn là hôm trước', () => {
  // 00:30 ngày 20 ở Việt Nam = 17:30 ngày 19 theo giờ UTC (giờ của runner CI).
  assert.equal(formatLongDate('2026-12-20T00:30:00+07:00'), 'Chủ nhật, 20 tháng 12 năm 2026');
});

test('formatShortDate và formatTime thêm số 0 phía trước', () => {
  assert.equal(formatShortDate('2022-03-05'), '05/03/2022');
  assert.equal(formatTime('2026-12-20T08:05:00+07:00'), '08:05');
});

test('ngày không hợp lệ thì báo lỗi', () => {
  assert.throws(() => formatLongDate('không phải ngày'), /Ngày không hợp lệ/);
});

test('validateWish bỏ khoảng trắng thừa', () => {
  assert.deepEqual(validateWish({ name: '  Ngọc   Lan ', message: '\n Chúc mừng! ' }), {
    ok: true,
    wish: { name: 'Ngọc Lan', message: 'Chúc mừng!' },
  });
});

test('validateWish bắt buộc có tên và lời chúc', () => {
  assert.match(validateWish({ name: ' ', message: 'Chúc mừng' }).error, /tên/);
  assert.match(validateWish({ name: 'Lan', message: '' }).error, /lời chúc/);
  assert.equal(validateWish({}).ok, false);
});

test('validateWish chặn tên quá dài', () => {
  assert.equal(validateWish({ name: 'a'.repeat(NAME_MAX + 1), message: 'Hi' }).ok, false);
});

test('sortWishes đưa lời chúc mới nhất lên đầu và không sửa mảng gốc', () => {
  const wishes = [{ name: 'A', createdAt: 1 }, { name: 'B', createdAt: 3 }, { name: 'C', createdAt: 2 }];
  assert.deepEqual(sortWishes(wishes).map((wish) => wish.name), ['B', 'C', 'A']);
  assert.equal(wishes[0].name, 'A');
});

test('googleCalendarUrl đổi giờ sang UTC theo định dạng của Google Calendar', () => {
  const url = new URL(googleCalendarUrl({
    title: 'Tiệc cưới',
    start: '2026-12-20T18:00:00+07:00',
    end: '2026-12-20T21:00:00+07:00',
    location: 'Nhà hàng ABC',
  }));
  assert.equal(url.searchParams.get('dates'), '20261220T110000Z/20261220T140000Z');
  assert.equal(url.searchParams.get('text'), 'Tiệc cưới');
  assert.equal(url.searchParams.get('location'), 'Nhà hàng ABC');
});

test('mapsUrl mã hoá địa chỉ có dấu và ký tự đặc biệt', () => {
  const address = '123 Đường ABC, Phường 1 & 2';
  assert.equal(new URL(mapsUrl(address)).searchParams.get('query'), address);
});

test('vietQrUrl tạo link ảnh QR chuyển khoản', () => {
  assert.equal(
    vietQrUrl({ bankId: 'VCB', accountNo: '0123456789', accountName: 'NGUYEN ANH TUAN' }),
    'https://img.vietqr.io/image/VCB-0123456789-compact.png?accountName=NGUYEN%20ANH%20TUAN',
  );
});

test('initial lấy chữ cái đầu của từ cuối cùng', () => {
  assert.equal(initial(' Nguyễn Anh tuấn '), 'T');
});
