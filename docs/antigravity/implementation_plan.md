# Kế Hoạch Triển Khai: Badge Color Standardization (Synapse)

**Ngày tạo**: 2025-12-15
**Cập nhật**: 2025-12-15 16:10
**Trạng thái**: 🔄 CHỜ PHÊ DUYỆT
**Vai trò**: UI/UX Specialist & Design System Auditor

---

## 1. Vấn Đề (Problem)

### 1.1. Tình Huống Từ Người Dùng

Người dùng phát hiện **màu sắc Badge không nhất quán** trong Resource Table và yêu cầu kiểm tra toàn bộ dự án.

### 1.2. Phân Tích Screenshot

| Badge | Hiển Thị | Variant Code | Vấn Đề |
|-------|----------|--------------|--------|
| 🔵 **Phòng** | Xanh dương nhạt | `soft` | Không khớp semantic - `soft` dùng primary color |
| ⚪ **Thiết bị** | Xám outline | `outline` | KHÁC BIỆT với "Phòng" dù cùng cột "Loại" |
| 🟢 **Hoạt động** | Xanh lá | `success` | ✅ OK |
| 🟡 **Bảo trì** | Cam nhạt | `warning` | ✅ OK (nhưng cần verify toàn bộ) |
| 🔵 **Laser, Skin Care** | Xanh dương nhạt | `secondary` | ❌ BUG: Code là `secondary` (xám) nhưng hiển thị giống `info` (xanh) |

### 1.3. Phạm Vi Kiểm Tra

**Files chứa Badge Usage cần audit:**
- `features/resources/components/resource-table.tsx`
- `features/staff/components/staff-list/staff-table.tsx`
- `features/staff/components/permissions/permission-matrix.tsx`
- `features/settings/operating-hours/exceptions-panel.tsx`
- `features/settings/notifications/components/`
- `features/customers/` (customer-history.tsx, customer-table.tsx)
- `features/appointments/` (nhiều files)
- `features/services/` (service-table.tsx)
- `features/billing/` (invoice-table.tsx)
- `features/reviews/` (reviews-admin-page.tsx)
- `shared/ui/custom/tag-input.tsx`

---

## 2. Mục Đích (Goal)

1. **Audit**: Kiểm tra tất cả nơi sử dụng Badge component
2. **Standardize**: Đảm bảo màu sắc nhất quán theo semantic meaning
3. **Fix Bugs**: Sửa các badge sử dụng variant sai
4. **Document**: Bổ sung preset cho Resource Type nếu cần

### Quy Tắc Màu Chuẩn (Từ Design System)

| Semantic | Variant | Dùng Cho |
|----------|---------|----------|
| 🟢 Success | `success` | Active, Available, Completed, Paid |
| 🟡 Warning | `warning` | Pending, In Use, Maintenance |
| 🔴 Destructive | `destructive` | Cancelled, Inactive, Refunded |
| 🔵 Info | `info` | Confirmed, Connected |
| ⚪ Secondary | `secondary` | Tags, Skills, No-Show, Silver Tier |
| 🔷 Primary/Soft | `soft` | Highlighted categories |
| 🟣 Purple | `purple` | Admin Role |
| 🟤 Outline | `outline` | Neutral chips, Neutral status |

---

## 3. Ràng Buộc (Constraints)

- ✅ Không thay đổi logic nghiệp vụ
- ✅ Backward compatible
- ✅ `pnpm lint` và `pnpm build` phải pass
- ✅ Giữ nguyên text Tiếng Việt
- ✅ Tuân thủ preset system đã có trong `badge.tsx`

---

## 4. Chiến Lược (Strategy)

### Phase 1: Audit - Thu thập tất cả Badge usage
1. Tìm tất cả files import Badge
2. Liệt kê variant đang dùng
3. So sánh với quy tắc semantic

### Phase 2: Fix - Sửa các vi phạm
1. Resource Type: Chuẩn hóa cả "Phòng" và "Thiết bị" dùng cùng 1 variant style
2. Tags (Equipment): Đảm bảo dùng `info` nếu muốn xanh dương, hoặc `secondary` nếu muốn xám
3. Status mapping: Verify `warning` cho "Bảo trì", `destructive` cho "Ngưng hoạt động"

### Phase 3: Enhance Badge Presets
1. Thêm preset cho Resource Type nếu cần
2. Thêm preset cho Tags nếu cần

---

## 5. Task Breakdown

### Task 1: Full Audit (Priority: High)
- [ ] Scan toàn bộ `*.tsx` có Badge
- [ ] Tạo bảng tổng hợp variant usage

### Task 2: Fix Resource Table Badges (Priority: High)
- [ ] Resource Type: Đồng bộ Phòng/Thiết bị
- [ ] Equipment Tags: Xác định màu đúng

### Task 3: Fix Staff/Customer Tables (Priority: Medium)
- [ ] Verify role badges
- [ ] Verify tier badges

### Task 4: Badge Preset Enhancement (Priority: Low)
- [ ] Thêm preset `resource-room`, `resource-equipment` nếu cần
- [ ] Thêm preset `tag-info`, `tag-neutral` nếu cần

---

## 6. Definition of Done

- [ ] Tất cả Badge sử dụng đúng semantic variant
- [ ] Không có sự khác biệt màu giữa các badge cùng loại
- [ ] `pnpm lint` pass
- [ ] `pnpm build` pass
- [ ] `change-log.md` ghi nhận thay đổi
- [ ] `dashboard.md` cập nhật

---

## ⏸️ DỪNG LẠI - CHỜ XÁC NHẬN

**Câu hỏi cần làm rõ trước khi thực thi:**

1. **Resource Type Badge**: Bạn muốn cả "Phòng" và "Thiết bị" dùng:
   - **Cùng variant** (ví dụ: cả 2 dùng `info` hoặc `outline` với icon)?
   - **Khác variant** nhưng cùng tone màu (ví dụ: `info` và `secondary`)?

2. **Equipment Tags** ("Laser", "Skin Care"): Bạn muốn màu:
   - **Xanh dương nhạt** (`info`) như trong screenshot?
   - **Xám nhạt** (`secondary`) như code hiện tại?

3. **Có scope nào cần ưu tiên** (chỉ Resources, hay toàn bộ dự án)?

Xin hãy confirm để tôi tiến hành thực thi!
