---
title: Lập Kế Hoạch Tái Cấu Trúc Clean Code Frontend
status: Draft
priority: Medium
assignee: AI Agent
---

# Lập Kế Hoạch: Tái Cấu Trúc Clean Code Frontend

## 1. Phân Chia Nhiệm Vụ

### Giai Đoạn 1: Tính Năng Staff
- [ ] **Nhiệm vụ 1.1**: Phân tích các import của `features/staff` trong codebase.
- [ ] **Nhiệm vụ 1.2**: Tạo `src/features/staff/index.ts` và export các component được sử dụng.
- [ ] **Nhiệm vụ 1.3**: Tái cấu trúc các consumer để sử dụng `@/features/staff`.

### Giai Đoạn 2: Tính Năng Landing Page
- [ ] **Nhiệm vụ 2.1**: Phân tích các import của `features/landing-page`.
- [ ] **Nhiệm vụ 2.2**: Tạo `src/features/landing-page/index.ts`.
- [ ] **Nhiệm vụ 2.3**: Tái cấu trúc các consumer để sử dụng `@/features/landing-page`.

### Giai Đoạn 3: Tính Năng Admin
- [ ] **Nhiệm vụ 3.1**: Phân tích các import của `features/admin`.
- [ ] **Nhiệm vụ 3.2**: Tạo `src/features/admin/index.ts`.
- [ ] **Nhiệm vụ 3.3**: Tái cấu trúc các consumer để sử dụng `@/features/admin`.

### Giai Đoạn 4: Xác Minh
- [ ] **Nhiệm vụ 4.1**: Chạy `pnpm build` để kiểm tra lỗi phụ thuộc vòng.
- [ ] **Nhiệm vụ 4.2**: Kiểm tra thủ công các trang bị ảnh hưởng (Staff, Landing, Admin Dashboard).

## 2. Sự Phụ Thuộc
- Không có phụ thuộc bên ngoài.
- Phụ thuộc vào cấu trúc codebase hiện có.

## 3. Ước Tính Nỗ Lực
- Giai đoạn 1: 15 phút
- Giai đoạn 2: 10 phút
- Giai đoạn 3: 10 phút
- Giai đoạn 4: 10 phút
- **Tổng cộng**: ~45 phút

## 4. Rủi Ro
- **Phụ Thuộc Vòng**: Việc tổng hợp các export có thể làm lộ hoặc tạo ra các vòng lặp.
    - *Giảm thiểu*: Nếu xảy ra vòng lặp, hãy chia nhỏ `index.ts` hoặc tái cấu trúc mã chung vào `src/shared`.
- **Xung Đột Tên**: Export các tên chung chung như `Header` có thể gây xung đột.
    - *Giảm thiểu*: Sử dụng named exports hoặc aliasing (ví dụ: `StaffHeader`).
