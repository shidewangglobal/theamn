# Design snapshots — AMN website

Lưu các phiên bản layout để có thể quay lại sau.

## Snapshots

| Thư mục | Mô tả | Ngày |
|---------|--------|------|
| `pre-tubik/` | Layout trước khi áp dụng Tubik (bento tách ảnh/chữ dọc, gap lớn) | 2026-06-20 |

Mỗi snapshot gồm bản copy đầy đủ của `src/` và `tailwind.config.mjs` tại thời điểm lưu.

## Quay lại thiết kế cũ (`pre-tubik`)

### Cách 1 — Copy thủ công (nhanh nhất)

```bash
cd ~/Projects/company-website

# Backup tubik hiện tại (tùy chọn)
cp -R src design-snapshots/tubik-backup-$(date +%Y%m%d)

# Khôi phục pre-tubik
rm -rf src
cp -R design-snapshots/pre-tubik/src ./src
cp design-snapshots/pre-tubik/tailwind.config.mjs ./tailwind.config.mjs

npm run dev
```

### Cách 2 — Git (sau khi đã commit)

Nếu bạn đã chạy các lệnh git bên dưới, có thể dùng:

```bash
# Xem các nhánh / tag
git branch -a
git tag -l "design-*"

# Quay lại snapshot
git checkout design/pre-tubik

# Hoặc chỉ xem file cũ mà không đổi nhánh
git show design/pre-tubik:src/components/About.astro
```

Để quay lại Tubik sau khi checkout pre-tubik:

```bash
git checkout main
```

## Thiết kế hiện tại: Tubik

- Gap tiles: **10px** (`gap-2.5`)
- Section padding tối thiểu (`tubik-section`)
- Ảnh + chữ **cùng viewport** (pair row, không stack ảnh trống)
- Hero: rounded container + text overlay trên ảnh
- Classes chính: `tubik-shell`, `tubik-section`, `tubik-pair`, `bento-solid`, `bento-image`

File CSS: `src/styles/global.css` (block `tubik-*` và `bento-*`).

## Lưu snapshot mới

Khi muốn chốt một phiên bản:

```bash
mkdir -p design-snapshots/ten-phien-ban
cp -R src design-snapshots/ten-phien-ban/
cp tailwind.config.mjs design-snapshots/ten-phien-ban/
```

Ghi tên và ngày vào bảng ở đầu file README này.
