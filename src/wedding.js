// Logic của trang cưới (site/wedding/). Chỉ gồm hàm thuần, không đụng tới DOM,
// nên test được bằng node:test; scripts/build.js đóng gói file này thành window.wedding.

const NAME_MAX = 50;
const MESSAGE_MAX = 500;

// Việt Nam dùng UTC+7 quanh năm (không có giờ mùa hè), nên cộng thẳng 7 tiếng rồi đọc
// các trường UTC. Nhờ vậy ngày giờ luôn hiện theo giờ Việt Nam, dù trình duyệt của khách
// hay runner CI (chạy giờ UTC) đang ở múi giờ nào.
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;
const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

function toDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Ngày không hợp lệ: ${value}`);
  }
  return date;
}

function vietnamParts(value) {
  const date = new Date(toDate(value).getTime() + VIETNAM_OFFSET_MS);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  };
}

function pad(number) {
  return String(number).padStart(2, '0');
}

// '2026-12-20T10:00:00+07:00' → 'Chủ nhật, 20 tháng 12 năm 2026'
function formatLongDate(value) {
  const { year, month, day, weekday } = vietnamParts(value);
  return `${WEEKDAYS[weekday]}, ${day} tháng ${month} năm ${year}`;
}

// '2022-03-05' → '05/03/2022'
function formatShortDate(value) {
  const { year, month, day } = vietnamParts(value);
  return `${pad(day)}/${pad(month)}/${year}`;
}

// '2026-12-20T18:00:00+07:00' → '18:00'
function formatTime(value) {
  const { hours, minutes } = vietnamParts(value);
  return `${pad(hours)}:${pad(minutes)}`;
}

// Thời gian còn lại tới `target`. Đã qua mốc thì mọi số bằng 0 và done = true.
function countdown(target, now) {
  const ms = Math.max(0, toDate(target).getTime() - toDate(now).getTime());
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done: ms === 0,
  };
}

// Kiểm tra lời chúc trước khi lưu: bỏ khoảng trắng thừa, bắt buộc có tên và nội dung,
// giới hạn độ dài (khớp với maxlength trên form và rules của Firebase).
function validateWish({ name, message }) {
  const cleanName = String(name ?? '').trim().replace(/\s+/g, ' ');
  const cleanMessage = String(message ?? '').trim();

  if (!cleanName) {
    return { ok: false, error: 'Bạn chưa nhập tên' };
  }
  if (!cleanMessage) {
    return { ok: false, error: 'Bạn chưa nhập lời chúc' };
  }
  if (cleanName.length > NAME_MAX) {
    return { ok: false, error: `Tên tối đa ${NAME_MAX} ký tự` };
  }
  if (cleanMessage.length > MESSAGE_MAX) {
    return { ok: false, error: `Lời chúc tối đa ${MESSAGE_MAX} ký tự` };
  }
  return { ok: true, wish: { name: cleanName, message: cleanMessage } };
}

// Lời chúc mới nhất lên đầu. Không sửa mảng gốc.
function sortWishes(wishes) {
  return [...wishes].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

// Google Calendar cần dạng 20261220T030000Z: giờ UTC, bỏ dấu - : và phần mili giây.
function toCalendarStamp(value) {
  return toDate(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Link mở Google Calendar với sự kiện điền sẵn, khách chỉ việc bấm Lưu.
function googleCalendarUrl({ title, start, end, location = '', details = '' }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function mapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Ảnh mã QR chuyển khoản theo chuẩn VietQR (app ngân hàng nào ở Việt Nam cũng quét được).
// bankId là mã ngân hàng của VietQR, vd: VCB, TCB, MB, ACB, BIDV, ICB (VietinBank).
function vietQrUrl({ bankId, accountNo, accountName }) {
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?accountName=${encodeURIComponent(accountName)}`;
}

// Chữ cái đầu của tên gọi, dùng làm ảnh đại diện tạm: 'Nguyễn Anh Tuấn' → 'T'
function initial(name) {
  const words = String(name).trim().split(/\s+/);
  return words[words.length - 1].charAt(0).toUpperCase();
}

module.exports = {
  NAME_MAX,
  MESSAGE_MAX,
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
};
