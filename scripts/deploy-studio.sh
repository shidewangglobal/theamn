#!/bin/bash
# One-time setup: login Google + deploy CMS cho team
# Chạy: npm run studio:setup

set -e
cd "$(dirname "$0")/.."

echo ""
echo "=== THE AMN — Deploy Sanity Studio ==="
echo ""
echo "Bước 1/2: Trình duyệt sẽ mở."
echo "→ Chọn đăng nhập bằng Google (cùng tài khoản đã tạo project Sanity)"
echo ""
read -p "Nhấn Enter để tiếp tục..."

npx sanity login

echo ""
echo "Bước 2/2: Deploy lên https://theamn.sanity.studio ..."
echo ""

npm run studio:deploy

echo ""
echo "✓ Xong! Gửi link này cho team: https://theamn.sanity.studio"
echo ""
