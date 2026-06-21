# the amn Website

Website giới thiệu **the amn** tại [theamn.network](https://theamn.network). Đơn giản, tối ưu SEO, dễ chỉnh sửa nội dung.

## Công nghệ

- **Astro**: framework tạo website tĩnh, nhanh và thân thiện với SEO
- **Tailwind CSS**: giao diện đẹp, dễ tùy chỉnh
- **Sitemap tự động**: giúp Google tìm và lập chỉ mục trang web

## Yêu cầu

- [Node.js](https://nodejs.org/) phiên bản 18 trở lên
- npm (đi kèm Node.js)

## Cài đặt lần đầu

Mở Terminal, vào thư mục dự án và chạy:

```bash
cd ~/Projects/company-website
npm install
```

## Chạy website trên máy (xem trước)

```bash
npm run dev
```

Mở trình duyệt tại địa chỉ: **http://localhost:4321**

Mỗi khi bạn sửa nội dung, trang web sẽ tự động cập nhật.

## Xuất bản website (đưa lên internet)

```bash
npm run build
```

File website hoàn chỉnh sẽ nằm trong thư mục `dist/`. Bạn có thể đưa thư mục này lên các dịch vụ hosting như Netlify, Vercel, hoặc Cloudflare Pages (miễn phí).

Xem trước bản build:

```bash
npm run preview
```

## Chỉnh sửa nội dung

Các trang chính nằm trong thư mục `src/pages/`:

| File | Trang |
|------|-------|
| `index.astro` | Trang chủ |
| `about.astro` | Giới thiệu |
| `services.astro` | Dịch vụ |
| `contact.astro` | Liên hệ |

### Cách sửa nội dung trang

1. Mở file `.astro` tương ứng bằng Cursor hoặc trình soạn thảo văn bản
2. Tìm phần văn bản tiếng Việt (giữa các thẻ HTML như `<h1>`, `<p>`)
3. Sửa nội dung, lưu file
4. Xem kết quả tại `http://localhost:4321` (nếu đang chạy `npm run dev`)

### Đổi thông tin liên hệ

Mở file `src/pages/contact.astro` và sửa email, số điện thoại, địa chỉ.

### Cấu hình SEO

Website đã cấu hình cho **https://theamn.network**. Nếu đổi tên miền, cập nhật `astro.config.mjs` và `public/robots.txt`.

## Cấu trúc thư mục

```
company-website/
├── public/           # Hình ảnh, favicon, robots.txt
├── src/
│   ├── layouts/      # Khung trang (header, footer, SEO)
│   ├── pages/        # Các trang website
│   └── styles/       # CSS toàn cục
├── astro.config.mjs  # Cấu hình Astro
└── package.json      # Thông tin dự án
```

## Hỗ trợ

Nếu cần thêm trang mới hoặc tính năng (gửi form liên hệ, blog, v.v.), hãy nhờ người hỗ trợ kỹ thuật hoặc dùng Cursor để yêu cầu thêm.
