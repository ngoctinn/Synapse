---
phase: requirements
title: Yêu cầu Refactor Giao diện Giờ Hoạt Động (Operating Hours UI)
description: Tái cấu trúc hoàn toàn giao diện quản lý giờ làm việc và ngày ngoại lệ để đạt chuẩn đơn giản, nhất quán với các trang khác
feature: operating-hours-refactor
status: draft
created: 2025-12-14
---

# Yêu cầu Refactor Giao Diện Operating Hours

## 1. Tuyên Bố Vấn Đề

### 1.1. Vấn Đề Cốt Lõi
Giao diện quản lý giờ hoạt động và ngày ngoại lệ hiện tại **quá phức tạp, không nhất quán** với các trang feature khác (Services, Staff, Customers) trong dự án Synapse.

### 1.2. Các Điểm Đau (Pain Points)
| # | Vấn đề | Chi tiết | Mức độ |
|---|--------|----------|--------|
| 1 | **Quá nhiều files** | 26 files trong `operating-hours/` vs 21 files trong `services/` | 🔴 Critical |
| 2 | **Component overengineered** | `year-view-grid.tsx` (382 lines), `exceptions-view-manager.tsx` (332 lines) | 🔴 Critical |
| 3 | **Logic phức tạp không cần thiết** | Drag-select, cursor follower tooltip, complex modifiers | 🟡 Medium |
| 4 | **Không sử dụng mock data chuẩn** | Mock data không khớp với database schema mới | 🔴 Critical |
| 5 | **UI không nhất quán** | Không dùng `PageHeader`, `SurfaceCard` chuẩn như các trang khác | 🟡 Medium |
| 6 | **Animation quá nhiều** | Framer Motion everywhere, gây lag trên thiết bị yếu | 🟢 Low |

### 1.3. Ai Bị Ảnh Hưởng
- **Admin/Receptionist**: Khó sử dụng, UI phức tạp gây nhầm lẫn
- **Developer**: Khó maintain do code base quá lớn và phức tạp
- **System**: Performance giảm do nhiều re-renders không cần thiết

---

## 2. Mục Tiêu & Mục Đích

### 2.1. Mục Tiêu Chính (MUST HAVE)
1. **Đơn giản hóa giao diện** xuống còn ≤10 component files
2. **Đạt nhất quán UI/UX** với patterns của Services, Staff, Customers pages
3. **Xóa bỏ 100% dead code** và files thừa
4. **Zero lint errors** sau mỗi bước refactor

### 2.2. Mục Tiêu Phụ (NICE TO HAVE)
1. Tăng performance (giảm bundle size)
2. Cải thiện accessibility (WCAG AA)
3. Mobile-first responsive design

### 2.3. Phi Mục Tiêu (OUT OF SCOPE)
- ❌ Thay đổi logic backend/API
- ❌ Thay đổi database schema (đã thiết kế xong)
- ❌ Thêm tính năng mới ngoài scope hiện có

---

## 3. Câu Chuyện Người Dùng

### 3.1. User Stories Chính
| ID | Vai trò | Hành động | Lợi ích |
|----|---------|-----------|---------|
| US-01 | Admin | Xem/Sửa lịch làm việc 7 ngày | Quản lý giờ mở cửa hàng ngày |
| US-02 | Admin | Thêm/Sửa/Xóa ngày ngoại lệ | Cấu hình nghỉ lễ, bảo trì |
| US-03 | Admin | Xem tổng quan ngày nghỉ trên lịch | Nắm bắt nhanh các ngày đặc biệt |
| US-04 | Admin | Copy lịch từ ngày này sang ngày khác | Tiết kiệm thời gian cấu hình |

### 3.2. Edge Cases
- Nhập giờ không hợp lệ (close < open)  
- Thêm ngày ngoại lệ trùng lặp
- Mobile: Thao tác trên màn hình nhỏ

---

## 4. Tiêu Chí Thành Công

### 4.1. Định Lượng
| Metric | Hiện tại | Mục tiêu |
|--------|----------|----------|
| Số files trong `operating-hours/` | 26 | ≤10 |
| Lines of code (components/) | ~1500 | ≤700 |
| Lint errors | 0 | 0 |
| Bundle size (estimated) | N/A | Giảm 30% |

### 4.2. Định Tính
- ✅ UI nhất quán với Services page
- ✅ Responsive trên mobile
- ✅ Tất cả User Stories hoạt động đúng
- ✅ Build thành công không lỗi

---

## 5. Ràng Buộc & Giả Định

### 5.1. Ràng Buộc Kỹ Thuật
- Phải sử dụng components từ `shared/ui` có sẵn
- Tuân thủ FSD (Feature-Sliced Design) architecture
- Phải pass lint & build sau mỗi phase

### 5.2. Ràng Buộc Thời Gian
- Ước tính: 1-2 ngày làm việc
- Thực hiện theo workflow atomic (commit thường xuyên)

### 5.3. Giả Định
- Database schema đã được thiết kế xong (`docs/research/operating-hours-design.md`)
- Mock data có thể được cập nhật để match schema mới
- Backend API chưa sẵn sàng (vẫn dùng mock)

---

## 6. Câu Hỏi Mở

| # | Câu hỏi | Trạng thái | Ghi chú |
|---|---------|------------|---------|
| Q1 | Có cần giữ Year View (lịch năm) không? | 🟡 Pending | Suggest: Xóa để đơn giản |
| Q2 | Exception form dùng Dialog hay Sheet? | ✅ Resolved | Dùng Sheet như các feature khác |
| Q3 | Có cần bulk action (chọn nhiều ngày)? | 🟡 Pending | Suggest: Không, quá phức tạp |
