---
phase: design
title: Thiết kế Hệ thống & Kiến trúc - Refactor Frontend Layout
description: Thiết kế cấu trúc thư mục mới cho layout feature
---

# Thiết kế Hệ thống & Kiến trúc

## Tổng quan Kiến trúc
**Cấu trúc hệ thống cấp cao là gì?**

- Chuyển đổi từ cấu trúc hiện tại sang cấu trúc Feature-Based cho Layout.
- **Hiện tại**:
  - `frontend/src/shared/ui/custom/header`
  - `frontend/src/shared/ui/custom/footer` (nếu có)
- **Mới**:
  - `frontend/src/features/layout/`
    - `components/`
      - `header/`
      - `footer/`
    - `index.ts` (public interface)

## Mô hình Dữ liệu
**Chúng ta cần quản lý dữ liệu gì?**

- Không thay đổi mô hình dữ liệu.

## Thiết kế API
**Các thành phần giao tiếp như thế nào?**

- Không thay đổi API.

## Phân rã Thành phần
**Các khối xây dựng chính là gì?**

- **Feature Layout**:
  - `Header`: Chứa logic điều hướng, user dropdown, theme toggle.
  - `Footer`: Chứa thông tin chân trang.
  - `Sidebar` (nếu có và thuộc layout chung, hoặc dashboard layout). *Lưu ý: Dashboard layout có thể là feature riêng hoặc con của layout.*

## Các Quyết định Thiết kế
**Tại sao chúng ta chọn cách tiếp cận này?**

- **Feature-Sliced Design / Vertical Slice**: Layout chứa logic nghiệp vụ (ví dụ: hiển thị thông tin user, menu động) nên được coi là một feature thay vì chỉ là UI shared.
- `shared/ui` chỉ nên chứa các component "dumb" (không có logic nghiệp vụ, tái sử dụng cao như Button, Input).

## Yêu cầu Phi chức năng
**Hệ thống nên hoạt động như thế nào?**

- Refactor không được làm giảm hiệu năng.
- Đảm bảo không gãy vỡ giao diện (Visual Regression).
