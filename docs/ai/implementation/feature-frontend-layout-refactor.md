---
phase: implementation
title: Hướng dẫn Triển khai - Refactor Frontend Layout
description: Hướng dẫn chi tiết về việc di chuyển và refactor
---

# Hướng dẫn Triển khai

## Thiết lập Phát triển
**Chúng ta bắt đầu như thế nào?**

- Đảm bảo đang ở branch mới hoặc clean state.
- Chạy `pnpm dev` để monitor lỗi realtime.

## Cấu trúc Mã
**Mã được tổ chức như thế nào?**

- **Mới**:
  ```
  frontend/src/features/layout/
  ├── components/
  │   ├── header/
  │   │   ├── index.tsx
  │   │   ├── ...
  │   └── footer/
  ├── index.ts (exports Header, Footer)
  ```

## Ghi chú Triển khai
**Các chi tiết kỹ thuật chính cần nhớ:**

### Di chuyển Component
- Khi di chuyển, chú ý các import bên trong component đó. Ví dụ: nếu `Header` import `../../button`, khi chuyển sang `features/layout/components/header`, đường dẫn có thể thay đổi hoặc nên dùng absolute path (`@/shared/ui/button`).

### Public Interface
- Sử dụng `features/layout/index.ts` để export:
  ```typescript
  export { Header } from './components/header';
  export { Footer } from './components/footer';
  ```
- Các nơi khác chỉ nên import từ `@/features/layout`.

## Điểm Tích hợp
**Các mảnh ghép kết nối như thế nào?**

- `app/layout.tsx` sẽ import `Header` từ `@/features/layout`.

## Xử lý Lỗi
**Chúng ta xử lý thất bại như thế nào?**

- Nếu build lỗi, kiểm tra kỹ các path import.
