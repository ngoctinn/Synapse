---
phase: planning
title: Kế hoạch Triển khai Phase 2 - Hoàn Thiện Appointments
description: Phân rã nhiệm vụ chi tiết cho Module Appointments
status: active
priority: P1
sprint: Sprint 3-5
created_at: 2025-12-11
---

# Kế hoạch Triển khai Phase 2: Appointments

> **Mục tiêu:** Hoàn thiện UI/UX cho Module Lịch hẹn
> **Timeline ước lượng:** 3-4 giờ (thay vì 13.5 ngày vì đã có base)
> **Độ ưu tiên:** P1

---

## Các Mốc Quan Trọng

- [ ] **M1:** Walk-in Booking Form hoạt động
- [ ] **M2:** Check-in/No-Show actions hoạt động
- [ ] **M3:** Cancel Dialog với policy hoàn thành
- [ ] **M4:** Filter/Search UI hoạt động
- [ ] **M5:** Status indicators hiển thị đúng

---

## Phân Rã Nhiệm Vụ Chi Tiết

### 🔧 Task 2.2: Walk-in Booking Dialog
**Độ ưu tiên:** 🔴 Critical
**Ước lượng:** 45 phút
**Mô tả:** Tạo dialog đơn giản để Lễ tân nhanh chóng tạo lịch cho khách vãng lai

#### Subtasks:
- [ ] **2.2.1** Tạo file `walk-in-dialog.tsx` trong `components/sheet/`
- [ ] **2.2.2** Design form đơn giản: customer_name, phone, service, staff
- [ ] **2.2.3** Auto-fill startTime = NOW
- [ ] **2.2.4** Validate phone format Việt Nam (0[0-9]{9})
- [ ] **2.2.5** Kết nối với `createAppointment` action
- [ ] **2.2.6** Thêm button "Walk-in" vào toolbar

#### Code Structure:
```typescript
// walk-in-dialog.tsx
interface WalkInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const walkInSchema = z.object({
  customerName: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  customerPhone: z.string().regex(/^0[0-9]{9}$/, "SĐT không hợp lệ"),
  serviceId: z.string().min(1, "Chọn dịch vụ"),
  staffId: z.string().min(1, "Chọn nhân viên"),
});
```

---

### 🔧 Task 2.3: Check-in Action Button
**Độ ưu tiên:** 🔴 Critical
**Ước lượng:** 30 phút
**Mô tả:** Thêm button Check-in trên event card để cập nhật trạng thái

#### Subtasks:
- [ ] **2.3.1** Tìm component hiển thị event card
- [ ] **2.3.2** Thêm Check-in button (chỉ hiện khi status=confirmed)
- [ ] **2.3.3** Tạo action `checkInAppointment` trong actions.ts
- [ ] **2.3.4** Thêm No-Show button (cho lịch đã qua)
- [ ] **2.3.5** Toast thông báo thành công
- [ ] **2.3.6** Refresh calendar sau action

#### Logic:
```typescript
// Hiển thị Check-in khi:
const canCheckIn =
  status === "confirmed" &&
  differenceInMinutes(startTime, new Date()) <= 15 && // Trong vòng 15 phút
  differenceInMinutes(startTime, new Date()) >= -30;  // Không quá 30 phút sau

// Hiển thị No-Show khi:
const canMarkNoShow =
  status === "confirmed" &&
  differenceInMinutes(new Date(), startTime) > 15; // Quá 15 phút không đến
```

---

### 🔧 Task 2.5: Cancel Booking Dialog
**Độ ưu tiên:** 🟡 High
**Ước lượng:** 35 phút
**Mô tả:** Dialog xác nhận hủy với cảnh báo chính sách

#### Subtasks:
- [ ] **2.5.1** Tạo file `cancel-dialog.tsx`
- [ ] **2.5.2** Hiển thị thông tin cuộc hẹn
- [ ] **2.5.3** Policy warning: "Hủy trước 2 giờ miễn phí"
- [ ] **2.5.4** Alert warning nếu hủy sát giờ (< 2h)
- [ ] **2.5.5** Input lý do hủy (optional)
- [ ] **2.5.6** Kết nối với `updateAppointment` (status=cancelled)

#### UI Reference:
```
┌─────────────────────────────────────┐
│ ⚠️ Xác nhận hủy lịch hẹn            │
├─────────────────────────────────────┤
│ Khách hàng: Nguyễn Văn A            │
│ Dịch vụ: Massage cổ vai gáy         │
│ Thời gian: 14:00 - 15:00            │
├─────────────────────────────────────┤
│ 📋 Chính sách hủy:                  │
│ • Hủy trước 2 giờ: Miễn phí         │
│ • Hủy trong 2 giờ: Phí 50%          │
│                                     │
│ ⚠️ Bạn đang hủy trong vòng 2 giờ!   │
├─────────────────────────────────────┤
│ Lý do hủy (tùy chọn):               │
│ [________________________]          │
├─────────────────────────────────────┤
│           [Hủy bỏ] [Xác nhận hủy]   │
└─────────────────────────────────────┘
```

---

### 🔧 Task 2.6: Filter Bar
**Độ ưu tiên:** 🟡 High
**Ước lượng:** 40 phút
**Mô tả:** Thêm bộ lọc cho lịch hẹn

#### Subtasks:
- [ ] **2.6.1** Tạo component `appointment-filter.tsx`
- [ ] **2.6.2** Multi-select cho Staff
- [ ] **2.6.3** Multi-select cho Service
- [ ] **2.6.4** Multi-select cho Status
- [ ] **2.6.5** URL params sync
- [ ] **2.6.6** Clear all button
- [ ] **2.6.7** Tích hợp vào toolbar

---

### 🔧 Task 2.7: Status Badges
**Độ ưu tiên:** 🟢 Medium
**Ước lượng:** 20 phút
**Mô tả:** Cải thiện visual indicators cho trạng thái

#### Subtasks:
- [ ] **2.7.1** Tạo `appointment-status-badge.tsx`
- [ ] **2.7.2** Map status → color/icon
- [ ] **2.7.3** Pulse animation cho "pending"
- [ ] **2.7.4** Áp dụng vào event cards và sheet

#### Status Mapping:
```typescript
const STATUS_CONFIG = {
  pending: { color: "warning", icon: Clock, label: "Chờ xác nhận" },
  confirmed: { color: "info", icon: CheckCircle, label: "Đã xác nhận" },
  in_progress: { color: "success", icon: Play, label: "Đang thực hiện" },
  completed: { color: "default", icon: CheckCheck, label: "Hoàn thành" },
  cancelled: { color: "destructive", icon: X, label: "Đã hủy" },
  no_show: { color: "destructive", icon: UserX, label: "Không đến" },
};
```

---

## Thứ Tự Thực Hiện

```
1. Task 2.7 (Status Badges)    → Foundation cho các task khác
2. Task 2.3 (Check-in Action)  → Quick win, visible
3. Task 2.5 (Cancel Dialog)    → Đi kèm Check-in
4. Task 2.2 (Walk-in Dialog)   → Feature mới
5. Task 2.6 (Filter Bar)       → Polish
```

---

## Thời Gian & Ước Tính

| Task | Ước lượng | Thực tế | Trạng thái |
|------|-----------|---------|------------|
| 2.7 Status Badges | 20 phút | - | ⏳ Pending |
| 2.3 Check-in Action | 30 phút | - | ⏳ Pending |
| 2.5 Cancel Dialog | 35 phút | - | ⏳ Pending |
| 2.2 Walk-in Dialog | 45 phút | - | ⏳ Pending |
| 2.6 Filter Bar | 40 phút | - | ⏳ Pending |
| **TỔNG** | **~2.8 giờ** | - | - |

---

## Files Sẽ Tạo/Sửa

### Tạo Mới:
- [ ] `components/sheet/walk-in-dialog.tsx`
- [ ] `components/sheet/cancel-dialog.tsx`
- [ ] `components/event/appointment-status-badge.tsx`
- [ ] `components/toolbar/appointment-filter.tsx`

### Sửa:
- [ ] `components/appointments-page.tsx` - Thêm Walk-in button
- [ ] `components/event/...` - Thêm Check-in/No-Show buttons
- [ ] `components/sheet/appointment-sheet.tsx` - Thêm Cancel button
- [ ] `actions.ts` - Thêm checkIn, markNoShow actions

---

## Checklist Trước Khi Merge

- [ ] Tất cả subtasks hoàn thành
- [ ] `pnpm lint` pass với 0 errors
- [ ] `pnpm type-check` pass
- [ ] Kiểm tra thủ công `/admin/appointments`
- [ ] UI consistency với Services/Staff/Customers
- [ ] Tiếng Việt cho tất cả text
