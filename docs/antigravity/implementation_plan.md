# Frontend Features Code Review & Refactor Plan

## Mục tiêu
Dọn dẹp code dư thừa, logic trùng lặp, và gộp file phân mảnh trong `frontend/src/features`.

---

## 1. VẤN ĐỀ PHÁT HIỆN

### 1.1. Mock Data phân tán (12 file)
| Feature | File Mock | Vấn đề |
|---------|-----------|--------|
| appointments | `mock-data.ts` | OK - Tập trung |
| billing | `mock-data.ts` | OK |
| chat | `data/mock-data.ts` | Tổ chức khác biệt (`data/` subfolder) |
| customer-dashboard | `services/mock-data.ts` | OK - Đã gộp |
| customers | `model/mocks.ts` | Tổ chức khác biệt (`model/` subfolder) |
| notifications | `model/mocks.ts` | Tổ chức khác biệt |
| resources | `data/mocks.ts` | Tổ chức khác biệt |
| reviews | `mock-data.ts` | OK |
| services | `data/mocks.ts` | Tổ chức khác biệt |
| settings/notifications | `data/mock-data.ts` | Nested feature |
| settings/operating-hours | `mocks.ts` | Khác naming convention |
| staff | `model/mocks.ts` | Tổ chức khác biệt |

**Hành động**: Chuẩn hóa tất cả về convention `mock-data.ts` ở root của feature.

### 1.2. Logic `formatCurrency` trùng lặp
| File | Vấn đề |
|------|--------|
| `billing/components/sheet/invoice-details.tsx` | **Tự định nghĩa lại** `formatCurrency` local |
| `appointments/components/dashboard/metrics-cards.tsx` | **Tự định nghĩa lại** `formatCurrency` local |
| `booking-wizard/components/step-services/*.tsx` | ✅ Dùng từ `@/shared/lib/utils` |
| `services/components/service-table.tsx` | ✅ Dùng từ `@/shared/lib/utils` |

**Hành động**: Xóa `formatCurrency` local, import từ `@/shared/lib/utils`.

### 1.3. STATUS_TO_PRESET trùng lặp
3 file định nghĩa `STATUS_TO_PRESET` giống nhau:
- `appointments/components/sheet/appointment-sheet.tsx` (Line 47)
- `appointments/components/event/event-card.tsx` (Line 31)
- `billing/components/invoice-status-badge.tsx` (Line 8)

**Hành động**: Gộp vào constants chung.

### 1.4. Cấu trúc thư mục không nhất quán
| Pattern | Features áp dụng |
|---------|-----------------|
| `model/` subfolder | customers, notifications, staff |
| `data/` subfolder | chat, resources, services, settings |
| Root level | appointments, billing, reviews |
| `services/` subfolder | customer-dashboard |

**Hành động**: Không cần thay đổi (chấp nhận sự linh hoạt theo FSD).

### 1.5. File `schemas.ts` + `schemas/` subfolder
`customer-dashboard` có cả:
- `schemas.ts` (root)
- `schemas/booking-schema.ts` (subfolder)

**Hành động**: Gộp vào một nơi.

### 1.6. File `constants.ts` + `constants/` subfolder
`customer-dashboard` có cả:
- `constants.ts` (root) - export từ `constants/nav-items.ts` + định nghĩa PROFILE_*
- `constants/nav-items.ts`

**Hành động**: Giữ nguyên pattern này (barrel export đúng).

---

## 2. KẾ HOẠCH THỰC THI

### Phase 1: Xử lý Logic Trùng Lặp (High Priority)
- [ ] **Task 1.1**: Xóa `formatCurrency` local trong `invoice-details.tsx`
- [ ] **Task 1.2**: Xóa `formatCurrency` local trong `metrics-cards.tsx`
- [ ] **Task 1.3**: Tạo `appointments/constants/status-presets.ts` để gộp `STATUS_TO_PRESET`

### Phase 2: Gộp File Schemas (Medium Priority)
- [ ] **Task 2.1**: Gộp `customer-dashboard/schemas/booking-schema.ts` vào `schemas.ts`
- [ ] **Task 2.2**: Xóa folder `schemas/` sau khi gộp

### Phase 3: Chuẩn hóa Mock Data Naming (Low Priority)
- [ ] **Task 3.1**: Rename `mocks.ts` → `mock-data.ts` trong các feature còn lại
  - `settings/operating-hours/mocks.ts`
  - `customers/model/mocks.ts`
  - `notifications/model/mocks.ts`
  - `staff/model/mocks.ts`
  - Cập nhật imports tương ứng

---

## 3. ƯU TIÊN THỰC THI

| Priority | Task | Lý do |
|----------|------|-------|
| 🔴 High | Task 1.1, 1.2 | Code trùng lặp rõ ràng, dễ gây bug khi update |
| 🟡 Medium | Task 1.3, 2.1, 2.2 | Cải thiện maintainability |
| 🟢 Low | Task 3.1 | Chỉ là naming convention |

---

## 4. KHÔNG CẦN THAY ĐỔI

- **Billing feature**: Thiếu `index.ts` nhưng không export public API nên OK.
- **Notifications feature**: Thiếu `index.ts` nhưng chỉ dùng internal.
- **EmptyState components**: Mỗi feature có EmptyState riêng là hợp lý (customization khác nhau).
- **Skeleton components**: Pattern `*TableSkeleton` nhất quán, không cần thay đổi.
