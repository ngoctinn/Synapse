---
title: Danh Sách Vấn Đề Frontend - Issue Tracker
description: Theo dõi trạng thái giải quyết tất cả 32 vấn đề Frontend
version: 1.0
created_at: 2025-12-12
last_updated: 2025-12-12
---

# 📋 ISSUE TRACKER: Frontend Synapse

> **Tổng số:** 32 issues | **Đã xong:** 2 | **Đang làm:** 0 | **Chờ:** 30

---

## 🔴 CRITICAL (7 issues) - Phải sửa trước Backend

| ID | Module | Vấn đề | Milestone | Trạng thái | Assignee |
|:---|:---|:---|:---:|:---:|:---:|
| C1 | `appointments` | Tính năng core chưa triển khai (chỉ ~5%) | M3 | [ ] TODO | - |
| C2 | `appointments/actions.ts` | Mock Data không persist (createAppointment) | M3 | [ ] TODO | - |
| C3 | `appointments-page.tsx` | Data Waterfall (useEffect fetch) | M3 | [ ] TODO | - |
| C4 | **Toàn bộ Actions** | Response Type không nhất quán | M1 | [x] DONE | AI |
| C5 | `customers`, `staff`, `resources` | Search không kết nối URL Params | M2 | [ ] TODO | - |
| C6 | `billing` | **Module hoàn toàn thiếu** | M5 | [ ] TODO | - |
| C7 | `reviews` | **Module hoàn toàn thiếu** | M5 | [ ] TODO | - |

---

## 🟠 HIGH (10 issues) - Ảnh hưởng nghiệp vụ quan trọng

| ID | Module | Vấn đề | Milestone | Trạng thái | Assignee |
|:---|:---|:---|:---:|:---:|:---:|
| H1 | `customer-dashboard` | Thiếu nút Hủy lịch hẹn | M4 | [ ] TODO | - |
| H2 | `customer-dashboard` | Booking Dialog dùng Mock, không check availability | M4 | [ ] TODO | - |
| H3 | `staff/scheduler` | Thiếu validation endTime > startTime | M2 | [ ] TODO | - |
| H4 | `customers` | Bulk Delete là Mock (chỉ console.log) | M2 | [ ] TODO | - |
| H5 | **Tất cả Sheets/Forms** | Không disable khi isPending | M2 | [ ] TODO | - |
| H6 | `appointments` | Thiếu Check-in Action | M4 | [ ] TODO | - |
| H7 | `appointments` | Thiếu Walk-in Booking Form | M4 | [ ] TODO | - |
| H8 | `services` | Thiếu UI quản lý `service_categories` | M6 | [ ] TODO | - |
| H9 | `services` | Thiếu `proficiency_level` cho service skills | M6 | [ ] TODO | - |
| H10 | `settings` | Operating Hours UI chưa hoàn thiện | M6 | [ ] TODO | - |

---

## 🟡 MEDIUM (10 issues) - Ảnh hưởng UX/DX

| ID | Module | Vấn đề | Milestone | Trạng thái | Assignee |
|:---|:---|:---|:---:|:---:|:---:|
| M1 | `landing-page` | Thiếu Pricing Section | M6 | [ ] TODO | - |
| M2 | `landing-page` | Thiếu FAQ Section | M6 | [ ] TODO | - |
| M3 | `landing-page/service-card` | Fallback Image thiếu | M6 | [ ] TODO | - |
| M4 | `admin` | Thiếu Breadcrumb động | M6 | [ ] TODO | - |
| M5 | `notifications` | Hoàn toàn Mock, không kết nối API | M6 | [ ] TODO | - |
| M6 | `chat` | Chỉ có folder trống (cần AI integration) | M6 | [ ] TODO | - |
| M7 | `customer-dashboard` | Thiếu Treatment Progress UI | M6 | [ ] TODO | - |
| M8 | `customer-dashboard` | Thiếu Loyalty Points Display | M6 | [ ] TODO | - |
| M9 | `analytics` | **Module hoàn toàn thiếu** | M6 | [ ] TODO | - |
| M10 | `DataTable` | API bị bloated (Flat Props + Grouped Config) | M1 | [x] DONE | AI |

---

## 🔵 LOW (5 issues) - Cải thiện nhỏ

| ID | Module | Vấn đề | Milestone | Trạng thái | Assignee |
|:---|:---|:---|:---:|:---:|:---:|
| L1 | Global | prefers-reduced-motion chưa áp dụng đều | M7 | [ ] TODO | - |
| L2 | `staff-form` | Dùng input[type=date] thay vì DatePicker | M7 | [ ] TODO | - |
| L3 | `appointments` | Hardcoded Colors thay vì semantic tokens | M7 | [ ] TODO | - |
| L4 | `auth` | Thiếu Callback URL redirect sau login | M7 | [ ] TODO | - |
| L5 | Global | Toast Messages hardcoded, không centralized | M7 | [ ] TODO | - |

---

## 📊 Thống Kê Theo Milestone

| Milestone | Mô tả | Số Issues | Ước tính | Trạng thái |
|:---|:---|:---:|:---:|:---:|
| **M1** | Foundation & Response Standardization | 2 | 2d | [x] DONE |
| **M2** | Fix Critical UX Bugs | 4 | 3d | [ ] Pending |
| **M3** | Appointments Module Core | 3 | 8d | [ ] Pending |
| **M4** | Appointments Actions & Workflows | 4 | 4d | [ ] Pending |
| **M5** | Missing Modules (Billing, Reviews) | 2 | 6d | [ ] Pending |
| **M6** | Medium Priority Enhancements | 12 | 5d | [ ] Pending |
| **M7** | Low Priority Polish | 5 | 2d | [ ] Pending |

---

## 📝 Ghi Chú Cập Nhật

| Ngày | Issue ID | Thay đổi | Người cập nhật |
|:---|:---|:---|:---|
| 2025-12-12 | - | Tạo issue tracker ban đầu | AI |

---

## 🔗 Tài Liệu Liên Quan

- [Master Plan](./frontend-issues-masterplan.md)
- [Requirements: Frontend Standardization](../requirements/feature-frontend-standardization.md)
- [Requirements: Appointments Completion](../requirements/feature-appointments-completion.md)
- [Requirements: Billing & Reviews](../requirements/feature-billing-reviews.md)
- [Frontend UI Roadmap 2025](./frontend-ui-roadmap-2025.md)

