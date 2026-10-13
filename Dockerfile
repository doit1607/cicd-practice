# ============================================================
# Bài 8: Đóng gói trang web thành Docker image
# Multi-stage build = nhiều giai đoạn trong 1 Dockerfile:
# - build:   image Node, chạy `npm run build` → ra thư mục dist/.
# - runtime: image nginx, chỉ chép dist/ sang để phục vụ web.
# Image cuối chỉ có nginx + file web. Node, src/, scripts/ nằm lại ở giai đoạn build
# → image nhỏ hơn, ít phần mềm hơn nên cũng ít lỗ hổng bảo mật hơn.
#
# Build: docker build -t cicd-practice:local --build-arg GITHUB_SHA=$(git rev-parse HEAD) .
# Chạy:  docker run -d --name cicd-web -p 8082:80 cicd-practice:local
#        → mở http://localhost:8082
# ============================================================

# ---------- Giai đoạn 1: build ----------
# Cùng Node 24 với CI. Bản alpine nhỏ hơn nhiều so với bản mặc định (Debian).
FROM node:24-alpine AS build
WORKDIR /app

# Chỉ chép những gì build cần. Mỗi lệnh COPY/RUN tạo ra 1 lớp (layer) được cache:
# lần build sau, lớp nào có đầu vào không đổi thì Docker dùng lại (CACHED).
# → sửa test/ hay file workflow không làm các lớp này thay đổi.
# scripts/build.js chỉ dùng thư viện có sẵn của Node → không cần npm ci.
COPY package.json ./
COPY scripts/ scripts/
COPY src/ src/
COPY site/ site/

# build.js đọc GITHUB_SHA để in phiên bản lên trang. Trên GitHub Actions biến này có sẵn,
# còn khi build image phải tự truyền vào bằng --build-arg (không truyền → trang hiện "local").
# Giá trị ARG đổi (mỗi commit một SHA) thì lớp RUN bên dưới cũng chạy lại.
ARG GITHUB_SHA
RUN npm run build

# ---------- Giai đoạn 2: runtime ----------
# Ghim bản 1.31: vẫn nhận bản vá 1.31.x nhưng không tự nhảy lên bản lớn hơn.
FROM nginx:1.31-alpine
# nginx mặc định phục vụ file trong /usr/share/nginx/html.
COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE chỉ là ghi chú "container nghe ở port 80"; muốn vào từ máy vẫn phải chạy với -p.
EXPOSE 80
# Không cần CMD: image nginx đã có sẵn lệnh khởi động nginx.
