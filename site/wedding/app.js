// Trang cưới: dựng nội dung từ window.WEDDING (config.js) bằng các hàm đã qua test
// trong window.wedding (scripts/build.js đóng gói từ src/wedding.js).
const data = window.WEDDING;
const lib = window.wedding;
const coupleNames = `${data.groom.name} & ${data.bride.name}`;

// Tạo thẻ HTML kèm class và chữ. Luôn dùng textContent (không dùng innerHTML) để chữ
// khách gõ vào sổ lưu bút không chèn được mã HTML/JS vào trang.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function link(text, href, className) {
  const anchor = el('a', className, text);
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener';
  return anchor;
}

function image(src, alt, className) {
  const img = el('img', className);
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

function renderHero() {
  document.title = `${coupleNames} · Thiệp cưới`;
  document.getElementById('nav-logo').textContent =
    `${lib.initial(data.groom.name)} ♥ ${lib.initial(data.bride.name)}`;
  document.getElementById('hero-groom').textContent = data.groom.name;
  document.getElementById('hero-bride').textContent = data.bride.name;
  document.getElementById('hero-date').textContent =
    `${lib.formatLongDate(data.date)} · ${lib.formatTime(data.date)}`;
  document.getElementById('footer-names').textContent = coupleNames;

  if (data.cover) {
    const hero = document.getElementById('hero');
    hero.classList.add('has-cover');
    hero.style.backgroundImage =
      `linear-gradient(rgb(30 20 18 / 0.45), rgb(30 20 18 / 0.6)), url("${data.cover}")`;
  }
}

function startCountdown() {
  const cells = document.querySelectorAll('#countdown [data-unit]');
  const tick = () => {
    const left = lib.countdown(data.date, Date.now());
    if (left.done) {
      document.getElementById('countdown').hidden = true;
      document.getElementById('countdown-done').hidden = false;
      clearInterval(timer);
      return;
    }
    cells.forEach((cell) => {
      cell.textContent = String(left[cell.dataset.unit]).padStart(2, '0');
    });
  };
  const timer = setInterval(tick, 1000);
  tick();
}

function renderCouple() {
  const list = document.getElementById('couple-list');
  const people = [['Chú rể', data.groom], ['Cô dâu', data.bride]];
  people.forEach(([role, person], index) => {
    if (index > 0) list.append(el('div', 'couple-amp', '&'));
    const card = el('article', 'person');
    const avatar = person.photo
      ? image(person.photo, person.fullName, 'avatar')
      : el('div', 'avatar avatar-placeholder', lib.initial(person.name));
    card.append(
      avatar,
      el('p', 'person-role', role),
      el('h3', 'person-name', person.fullName),
      el('p', 'person-bio', person.bio),
    );
    list.append(card);
  });
}

function renderStory() {
  const list = document.getElementById('story-list');
  data.story.forEach((item) => {
    const time = el('time', 'timeline-date', lib.formatShortDate(item.date));
    time.dateTime = item.date;
    const entry = el('li', 'timeline-item');
    entry.append(time, el('h3', '', item.title), el('p', '', item.text));
    list.append(entry);
  });
}

// ---------- Album ảnh + xem ảnh phóng to ----------
const viewablePhotos = data.photos.filter((photo) => photo.src);
const lightbox = document.getElementById('lightbox');
let lightboxIndex = 0;

function showPhoto(index) {
  lightboxIndex = (index + viewablePhotos.length) % viewablePhotos.length;
  const photo = viewablePhotos[lightboxIndex];
  const img = document.getElementById('lightbox-image');
  img.src = photo.src;
  img.alt = photo.caption || '';
  document.getElementById('lightbox-caption').textContent = photo.caption || '';
}

function setupLightbox() {
  lightbox.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => showPhoto(lightboxIndex + Number(button.dataset.step)));
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  // Bấm ra vùng tối xung quanh ảnh thì đóng.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showPhoto(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(lightboxIndex + 1);
  });
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  data.photos.forEach((photo, index) => {
    const caption = photo.caption || `Ảnh ${index + 1}`;
    if (!photo.src) {
      const placeholder = el('div', 'photo photo-placeholder');
      placeholder.append(el('span', 'photo-caption', caption));
      grid.append(placeholder);
      return;
    }
    const button = el('button', 'photo');
    button.type = 'button';
    button.setAttribute('aria-label', `Xem ảnh: ${caption}`);
    button.append(image(photo.src, caption), el('span', 'photo-caption', caption));
    button.addEventListener('click', () => {
      showPhoto(viewablePhotos.indexOf(photo));
      lightbox.showModal();
    });
    grid.append(button);
  });
}

function renderEvents() {
  const list = document.getElementById('event-list');
  data.events.forEach((item) => {
    const card = el('article', 'card');
    const actions = el('div', 'card-actions');
    actions.append(
      link('Xem bản đồ', lib.mapsUrl(item.address), 'btn'),
      link('Thêm vào lịch', lib.googleCalendarUrl({
        title: `${item.title} · ${coupleNames}`,
        start: item.start,
        end: item.end,
        location: `${item.place}, ${item.address}`,
      }), 'btn btn-primary'),
    );
    card.append(
      el('h3', 'card-title', item.title),
      el('p', 'event-time', `${lib.formatTime(item.start)} – ${lib.formatTime(item.end)}`),
      el('p', 'event-date', lib.formatLongDate(item.start)),
      el('p', 'event-place', item.place),
      el('p', 'event-address', item.address),
      actions,
    );
    list.append(card);
  });
}

function renderGifts() {
  const list = document.getElementById('gift-list');
  data.gifts.forEach((gift) => {
    const card = el('article', 'card');
    card.append(el('h3', 'card-title', gift.label));
    card.append(gift.accountNo
      ? image(lib.vietQrUrl(gift), `Mã QR chuyển khoản ${gift.bank} ${gift.accountNo}`, 'qr')
      : el('div', 'qr qr-placeholder', 'Điền số tài khoản trong config.js để hiện mã QR'));

    const info = el('dl', 'gift-info');
    [['Ngân hàng', gift.bank], ['Số tài khoản', gift.accountNo || 'Chưa điền'], ['Chủ tài khoản', gift.accountName]]
      .forEach(([label, value]) => {
        const row = el('div');
        row.append(el('dt', '', label), el('dd', '', value));
        info.append(row);
      });
    card.append(info);

    if (gift.accountNo) {
      const copy = el('button', 'btn', 'Chép số tài khoản');
      copy.type = 'button';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(gift.accountNo);
          copy.textContent = 'Đã chép ✓';
        } catch {
          copy.textContent = 'Không chép được';
        }
        setTimeout(() => {
          copy.textContent = 'Chép số tài khoản';
        }, 2000);
      });
      card.append(copy);
    }
    list.append(card);
  });
}

// ---------- Sổ lưu bút ----------
// Hai nơi lưu có cùng cách dùng (subscribe + add), nên phần giao diện không cần biết
// đang lưu ở đâu.
const WISHES_KEY = 'wedding-wishes';

function createLocalStore() {
  const listeners = [];
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(WISHES_KEY)) || [];
    } catch {
      return [];
    }
  };
  return {
    mode: 'local',
    subscribe(callback) {
      listeners.push(callback);
      callback(read());
    },
    async add(wish) {
      const wishes = [...read(), { ...wish, createdAt: Date.now() }];
      localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
      listeners.forEach((callback) => callback(wishes));
    },
  };
}

async function createFirebaseStore(config) {
  const cdn = 'https://www.gstatic.com/firebasejs/13.0.0';
  const { initializeApp } = await import(`${cdn}/firebase-app.js`);
  const { getDatabase, ref, push, onValue, query, limitToLast, serverTimestamp } =
    await import(`${cdn}/firebase-database.js`);
  const wishesRef = ref(getDatabase(initializeApp(config)), 'wishes');
  return {
    mode: 'firebase',
    subscribe(callback) {
      onValue(query(wishesRef, limitToLast(200)), (snapshot) => {
        const wishes = [];
        // Không return gì: forEach của Firebase dừng lại nếu callback trả về true.
        snapshot.forEach((child) => {
          wishes.push(child.val());
        });
        callback(wishes);
      }, (error) => console.error(error));
    },
    // push() tự sinh key không trùng nhau, nên 2 người gửi cùng lúc không ghi đè lên nhau.
    add(wish) {
      return push(wishesRef, { ...wish, createdAt: serverTimestamp() });
    },
  };
}

function renderWishes(wishes) {
  const items = lib.sortWishes(wishes).map((wish) => {
    const item = el('li', 'wish');
    item.append(el('strong', 'wish-name', wish.name), el('p', 'wish-message', wish.message));
    return item;
  });
  if (items.length === 0) {
    items.push(el('li', 'wish wish-empty', 'Hãy là người đầu tiên gửi lời chúc!'));
  }
  document.getElementById('wish-list').replaceChildren(...items);
}

async function setupWishes() {
  const form = document.getElementById('wish-form');
  const status = document.getElementById('wish-status');
  const submit = form.querySelector('button');
  const setStatus = (text, kind) => {
    status.textContent = text;
    status.dataset.kind = kind;
  };

  let store;
  try {
    store = data.firebase ? await createFirebaseStore(data.firebase) : createLocalStore();
  } catch (error) {
    console.error('Không kết nối được Firebase, chuyển sang lưu trong trình duyệt.', error);
    store = createLocalStore();
  }
  document.getElementById('wish-mode').hidden = store.mode !== 'local';
  store.subscribe(renderWishes);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = lib.validateWish({
      name: document.getElementById('wish-name').value,
      message: document.getElementById('wish-message').value,
    });
    if (!result.ok) {
      setStatus(result.error, 'error');
      return;
    }
    submit.disabled = true;
    try {
      await store.add(result.wish);
      form.reset();
      setStatus(`Cảm ơn ${result.wish.name} đã gửi lời chúc ♥`, 'ok');
    } catch (error) {
      console.error(error);
      setStatus('Chưa gửi được, bạn thử lại sau nhé.', 'error');
    } finally {
      submit.disabled = false;
    }
  });
}

// ---------- Nhạc nền + hoa rơi ----------
function setupMusic() {
  if (!data.music) return;
  const button = document.getElementById('music-toggle');
  const audio = new Audio(data.music);
  audio.loop = true;
  button.hidden = false;
  // Trình duyệt chặn tự phát nhạc, nên chỉ phát khi khách bấm nút.
  button.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch((error) => console.error(error));
    } else {
      audio.pause();
    }
  });
  audio.addEventListener('play', () => button.setAttribute('aria-pressed', 'true'));
  audio.addEventListener('pause', () => button.setAttribute('aria-pressed', 'false'));
}

function startPetals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.getElementById('petals');
  for (let i = 0; i < 14; i++) {
    const petal = el('span', 'petal');
    petal.style.setProperty('--x', `${Math.random() * 100}%`);
    petal.style.setProperty('--size', `${8 + Math.random() * 8}px`);
    petal.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
    petal.style.setProperty('--duration', `${12 + Math.random() * 10}s`);
    // Delay âm: cánh hoa đã rơi sẵn giữa chừng ngay khi mở trang.
    petal.style.setProperty('--delay', `${-Math.random() * 20}s`);
    box.append(petal);
  }
}

renderHero();
startCountdown();
renderCouple();
renderStory();
renderGallery();
setupLightbox();
renderEvents();
renderGifts();
setupMusic();
startPetals();
setupWishes();
