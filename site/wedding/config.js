// ============================================================
// Nội dung trang cưới: muốn đổi tên, ngày, ảnh... chỉ cần sửa file này.
// - Thời gian ghi kèm múi giờ +07:00 để ai mở trang ở đâu cũng thấy giờ Việt Nam.
// - Ảnh: chép vào site/wedding/images/ rồi ghi 'images/ten-anh.jpg'.
//   Để trống ('') thì trang hiện ô màu thay cho ảnh.
// ============================================================
window.WEDDING = {
  groom: {
    name: 'Anh Tuấn',
    fullName: 'Nguyễn Anh Tuấn',
    bio: 'Kỹ sư phần mềm, mê cà phê sáng và những chuyến đi xa.',
    photo: '',
  },
  bride: {
    name: 'Ngọc Lan',
    fullName: 'Trần Ngọc Lan',
    bio: 'Cô giáo tiểu học, yêu hoa, yêu mèo và yêu anh.',
    photo: '',
  },

  // Mốc đếm ngược ở đầu trang (thường là giờ làm lễ chính).
  date: '2026-12-20T10:00:00+07:00',
  cover: '', // ảnh nền đầu trang, vd: 'images/cover.jpg'
  music: '', // nhạc nền, vd: 'images/nhac.mp3' (khách bấm nút ♪ mới phát)

  story: [
    {
      date: '2021-09-12',
      title: 'Lần đầu gặp gỡ',
      text: 'Một chiều mưa ở quán cà phê nhỏ, hai người lạ ngồi chung bàn vì hết chỗ.',
    },
    {
      date: '2022-02-14',
      title: 'Lời tỏ tình',
      text: 'Bó hồng đầu tiên và câu trả lời "đồng ý" đầy ngại ngùng.',
    },
    {
      date: '2024-06-01',
      title: 'Chuyến đi đầu tiên',
      text: 'Đà Lạt se lạnh, cùng nhau ngắm bình minh trên đồi chè.',
    },
    {
      date: '2026-05-20',
      title: 'Lời cầu hôn',
      text: 'Chiếc nhẫn nhỏ và lời hứa cùng nhau đi hết quãng đường còn lại.',
    },
  ],

  photos: [
    { src: '', caption: 'Ngày đầu hẹn hò' },
    { src: '', caption: 'Đà Lạt 2024' },
    { src: '', caption: 'Ngày cầu hôn' },
    { src: '', caption: 'Ảnh cưới ngoại cảnh' },
    { src: '', caption: 'Ảnh cưới studio' },
    { src: '', caption: 'Gia đình hai bên' },
  ],

  events: [
    {
      title: 'Lễ Vu Quy',
      start: '2026-12-20T08:00:00+07:00',
      end: '2026-12-20T09:30:00+07:00',
      place: 'Tư gia nhà gái',
      address: '123 Đường ABC, Phường XYZ, TP. Hồ Chí Minh',
    },
    {
      title: 'Lễ Thành Hôn',
      start: '2026-12-20T10:00:00+07:00',
      end: '2026-12-20T11:30:00+07:00',
      place: 'Tư gia nhà trai',
      address: '456 Đường DEF, Phường UVW, TP. Hồ Chí Minh',
    },
    {
      title: 'Tiệc cưới',
      start: '2026-12-20T18:00:00+07:00',
      end: '2026-12-20T21:00:00+07:00',
      place: 'Nhà hàng tiệc cưới ABC',
      address: '789 Đường GHI, Quận 1, TP. Hồ Chí Minh',
    },
  ],

  // Điền accountNo thì trang tự tạo mã QR chuyển khoản (VietQR).
  // bankId là mã ngân hàng của VietQR: VCB, TCB, MB, ACB, BIDV, ICB (VietinBank)...
  gifts: [
    {
      label: 'Mừng cưới chú rể',
      bank: 'Vietcombank',
      bankId: 'VCB',
      accountNo: '',
      accountName: 'NGUYEN ANH TUAN',
    },
    {
      label: 'Mừng cưới cô dâu',
      bank: 'Techcombank',
      bankId: 'TCB',
      accountNo: '',
      accountName: 'TRAN NGOC LAN',
    },
  ],

  // Sổ lưu bút:
  // - null: lời chúc chỉ lưu trong trình duyệt của người gửi (localStorage), dùng để thử.
  // - Điền config Firebase thì mọi người cùng thấy lời chúc (Realtime Database):
  //   Firebase Console → tạo project → Build › Realtime Database → Create database.
  //   Project settings › Your apps › Web app → chép firebaseConfig vào đây (có databaseURL).
  //   Rules gợi ý: ai cũng đọc và THÊM được lời chúc, nhưng không sửa/xoá được:
  //   {
  //     "rules": {
  //       "wishes": {
  //         ".read": true,
  //         "$id": {
  //           ".write": "!data.exists()",
  //           ".validate": "newData.child('name').isString() && newData.child('name').val().length <= 50 && newData.child('message').isString() && newData.child('message').val().length <= 500 && newData.child('createdAt').val() === now"
  //         }
  //       }
  //     }
  //   }
  firebase: null,
};
