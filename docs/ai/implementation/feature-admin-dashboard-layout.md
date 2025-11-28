---
phase: implementation
title: Hướng dẫn Triển khai Admin Dashboard
description: Chi tiết kỹ thuật cho việc code
---

## Thay đổi Cấu trúc Thư mục

```
src/
├── app/
│   └── (admin)/          # [NEW] Route Group
│       ├── layout.tsx    # [NEW] Admin Layout
│       └── admin/
│           └── overview/
│               └── page.tsx # [NEW] Overview Page
└── features/
    └── admin/            # [NEW] Feature Slice
        ├── components/
        │   ├── sidebar.tsx
        │   ├── header.tsx
        │   └── nav-item.tsx
        └── index.ts
```

## Chi tiết Component

### `AdminSidebar`
- Sử dụng thẻ `<aside>`.
- Width: `w-64` (desktop), `w-0` (mobile - hidden).
- Props: `className`.

### `AdminHeader`
- Sử dụng thẻ `<header>`.
- Height: `h-16`.
- Flexbox: `justify-between`.

### `AdminLayout`
- Wrapper: `flex h-screen overflow-hidden`.
- Sidebar: Fixed left.
- Main: `flex-1 overflow-y-auto`.
