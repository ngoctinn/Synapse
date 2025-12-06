# Báo Cáo Đánh Giá Frontend: Services Feature

**Phạm vi**: `frontend/src/features/services`
**Ngày**: 2025-12-06
**Workflows**: `/frontend-review` + `/layout-review`

---

## 1. Tổng Quan Module

| Thuộc tính | Chi tiết |
|------------|----------|
| **Đường dẫn** | `frontend/src/features/services` |
| **Số components** | 13 files |
| **Public API** | ✅ Có `index.ts` với exports đầy đủ |
| **Chức năng** | Quản lý dịch vụ và kỹ năng cho Spa |

### Cấu Trúc Thư Mục

```
services/
├── index.ts                    # Public API ✅
├── types.ts                    # Type definitions
├── schemas.ts                  # Zod validation schemas
├── actions.ts                  # Server Actions
├── data/                       # Mock data
└── components/
    ├── services-page.tsx       # Main page component
    ├── service-table.tsx       # Service list table
    ├── service-form.tsx        # Create/Edit form (445 lines)
    ├── service-filter.tsx      # Filter popover
    ├── service-actions.tsx     # Row actions dropdown
    ├── service-time-visualizer.tsx
    ├── image-upload.tsx
    ├── create-service-dialog.tsx
    ├── edit-service-dialog.tsx
    ├── skill-table.tsx
    ├── skill-form.tsx
    ├── skill-actions.tsx
    └── create-skill-dialog.tsx
```

---

## 2. Đánh Giá Tuân Thủ Kiến Trúc (FSD)

### 2.1. Cấu Trúc Thư Mục ✅ ĐẠT

| Tiêu chí | Trạng thái | Ghi chú |
|----------|------------|---------|
| Public API (`index.ts`) | ✅ Đạt | Exports đầy đủ các components và types |
| Tách biệt types/schemas | ✅ Đạt | Riêng biệt trong `types.ts` và `schemas.ts` |
| Server Actions tách riêng | ✅ Đạt | `actions.ts` với `"use server"` |

### 2.2. Vi Phạm Đóng Gói (Deep Imports)

```typescript
// ⚠️ CẢNH BÁO: Import từ feature khác
// File: components/services-page.tsx, service-form.tsx, service-table.tsx, service-actions.tsx, create-service-dialog.tsx, edit-service-dialog.tsx
import { Resource, RoomType } from "@/features/resources/model/types";
```

> [!WARNING]
> **Deep Import từ module khác**
> Các file trên import trực tiếp từ `@/features/resources/model/types` thay vì thông qua Public API (`@/features/resources`).

**Giải pháp**: Module `resources` cần export `Resource`, `RoomType` qua `index.ts`, sau đó sửa import thành:
```typescript
import { Resource, RoomType } from "@/features/resources";
```

### 2.3. Thin Pages ✅ ĐẠT

`services-page.tsx` đóng vai trò là composition layer, không chứa logic nghiệp vụ nặng.

---

## 3. Đánh Giá Cú Pháp Next.js 16

### 3.1. Server Actions ✅ ĐẠT

```typescript
// ✅ actions.ts đúng chuẩn
"use server";
import "server-only";
```

- ✅ Sử dụng `"use server"` directive
- ✅ Protected với `server-only` package
- ✅ Validation với Zod trước khi gọi API

### 3.2. useEffect Usage ⚠️ CHẤP NHẬN ĐƯỢC

```typescript
// service-filter.tsx (Line 40)
useEffect(() => {
  setLocalPriceRange([minPrice, maxPrice])
}, [minPrice, maxPrice])
```

**Đánh giá**: useEffect này đồng bộ local state với URL params, không phải data fetching. **Chấp nhận được.**

### 3.3. Client-Side Data Fetching ✅ ĐẠT

- Không sử dụng `useEffect` để fetch data
- Sử dụng React 19 `use()` hook đúng cách trong `services-page.tsx`

```typescript
// ✅ React 19 pattern
function ServiceListWrapper({ servicesPromise, ... }) {
  const { data, total } = use(servicesPromise)
  // ...
}
```

---

## 4. Đánh Giá Layout Theo UX Guidelines

### 4.1. Touch & Interaction

| Vấn đề | Severity | File | Mô tả |
|--------|----------|------|-------|
| Thiếu `aria-label` cho icon buttons | 🔴 High | `service-form.tsx` L125 | Button quay lại chỉ có icon `<ArrowLeft>` |
| Thiếu `aria-label` cho color buttons | 🔴 High | `service-form.tsx` L258-268 | Preset color buttons không có label |
| Thiếu `aria-label` cho delete button | 🔴 High | `image-upload.tsx` L47-56 | Button xóa ảnh chỉ có icon `<X>` |
| Touch target nhỏ | 🟡 Medium | `service-form.tsx` L261 | Color buttons `w-5 h-5` (20x20px) < 44x44px |

### 4.2. Focus States

| Vấn đề | Severity | File | Mô tả |
|--------|----------|------|-------|
| Thiếu `focus:ring` | 🔴 High | Toàn module | Không tìm thấy `focus:ring` trong toàn bộ module |
| Color buttons thiếu focus state | 🔴 High | `service-form.tsx` L258-268 | Không có focus-visible indicator |

### 4.3. Reduced Motion

| Vấn đề | Severity | File | Mô tả |
|--------|----------|------|-------|
| Thiếu `motion-safe:` wrapper | 🟡 Medium | `service-form.tsx` | Các animations không được wrap với `motion-safe:` |
| ✅ Đã có `motion-safe:` | ✅ Đạt | `services-page.tsx` L107 | `motion-safe:animate-in motion-safe:fade-in-50` |

### 4.4. Hover States ✅ TỐT

Module đã implement hover effects cho nhiều elements:
- Table rows: `group-hover:text-primary`
- Badges: `hover:bg-secondary/60`
- Buttons: `hover:bg-destructive/90`
- Image upload: `hover:bg-primary/5`

### 4.5. Animation & Performance

| Vấn đề | Severity | File | Mô tả |
|--------|----------|------|-------|
| Animation duration hợp lý | ✅ Đạt | Các files | Sử dụng `duration-200`, `duration-300`, `duration-500` |
| Shimmer effect | ✅ Đạt | `service-time-visualizer.tsx` | `group-hover:animate-shimmer` |

---

## 5. Đánh Giá Clean Code

### 5.1. Component Size

| File | Lines | Đánh giá |
|------|-------|----------|
| `service-form.tsx` | 445 | ⚠️ Lớn, cân nhắc tách |
| `service-table.tsx` | 257 | ✅ Chấp nhận được |
| `skill-table.tsx` | 207 | ✅ Tốt |

> [!NOTE]
> `service-form.tsx` có 445 dòng. Cân nhắc tách thành các sub-components như `ServiceGeneralTab`, `ServiceSettingsTab` để dễ maintain.

### 5.2. Comments & Naming

- ✅ Tên biến/hàm rõ ràng bằng tiếng Anh
- ✅ Error messages bằng tiếng Việt
- ⚠️ Một số comments còn bằng tiếng Anh (Line 122-128 trong `services-page.tsx`)

### 5.3. Duplicate Code Patterns

```typescript
// Pattern lặp lại trong service-actions.tsx và skill-actions.tsx
const handleDelete = async () => {
  startTransition(async () => {
    const result = await deleteService(service.id)
    if (result.success) {
      toast.success("Đã xóa dịch vụ")
      // ...
    }
  })
}
```

**Đề xuất**: Tạo custom hook `useDeleteAction` để tái sử dụng logic.

---

## 6. Đề Xuất Cải Tiến UX/UI

### 6.1. Accessibility Improvements (Priority: High)

```typescript
// service-form.tsx - Back button
<Button
  variant="ghost"
  size="icon"
  type="button"
  onClick={() => router.back()}
  className="rounded-full"
  aria-label="Quay lại trang trước"  // ← THÊM
>
  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
</Button>

// service-form.tsx - Color buttons
<button
  key={color}
  type="button"
  aria-label={`Chọn màu ${color}`}  // ← THÊM
  className="... focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"  // ← THÊM
  // ...
/>

// image-upload.tsx - Delete button
<Button
  type="button"
  variant="destructive"
  size="icon"
  onClick={handleRemove}
  disabled={disabled}
  aria-label="Xóa ảnh đại diện"  // ← THÊM
  className="..."
>
  <X className="h-4 w-4" />
</Button>
```

### 6.2. Touch Target Improvements

```typescript
// Tăng kích thước color buttons
<button
  // Từ: w-5 h-5 (20x20px)
  // Thành: w-8 h-8 min-w-[44px] min-h-[44px] (44x44px touch area)
  className="w-8 h-8 min-w-[44px] min-h-[44px] rounded-full ..."
/>
```

### 6.3. Animation with Reduced Motion

```typescript
// service-form.tsx - Wrap animations
<TabsContent
  value="general"
  className="motion-safe:animate-fade-in space-y-8"  // ← THÊM motion-safe:
>
```

### 6.4. Typography Enhancement

Dựa trên `typography.csv`, module này phù hợp với **"Premium Spa" aesthetic**:
- ✅ Đã sử dụng `font-serif` cho headings (service names)
- ✅ Sử dụng `Be Vietnam Pro` từ globals.css

---

## 7. Kế Hoạch Hành Động (Input cho `/frontend-refactor`)

### Priority 1: Accessibility (High)

- [ ] Thêm `aria-label` cho tất cả icon-only buttons:
  - `service-form.tsx`: Back button (L125)
  - `service-form.tsx`: Color preset buttons (L258-268)
  - `image-upload.tsx`: Delete button (L47)

- [ ] Thêm `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` cho:
  - Color picker buttons
  - Image upload area

### Priority 2: Touch Targets (Medium)

- [ ] Tăng kích thước color buttons từ `w-5 h-5` thành `w-8 h-8` với padding touch area

### Priority 3: Architecture (Medium)

- [ ] Sửa deep imports từ `@/features/resources/model/types`:
  - Cập nhật `resources/index.ts` để export types
  - Đổi import path trong 6 files

### Priority 4: Reduced Motion (Medium)

- [ ] Wrap animations trong `service-form.tsx` với `motion-safe:`

### Priority 5: Code Organization (Low)

- [ ] Cân nhắc tách `service-form.tsx` thành các sub-components
- [ ] Tạo shared hook `useDeleteAction` cho pattern delete

---

## 8. Tổng Kết

| Phân loại | Điểm | Ghi chú |
|-----------|------|---------|
| **Kiến trúc FSD** | 8/10 | ✅ Cấu trúc tốt, ⚠️ Deep imports cần sửa |
| **Next.js 16 Syntax** | 10/10 | ✅ Sử dụng Server Actions và `use()` đúng cách |
| **Accessibility** | 5/10 | 🔴 Thiếu aria-labels và focus states |
| **Touch & Interaction** | 7/10 | ⚠️ Một số touch targets nhỏ |
| **Animation** | 8/10 | ✅ Tốt, cần thêm `motion-safe:` |
| **Code Quality** | 7/10 | ⚠️ `service-form.tsx` lớn |

**Điểm tổng thể: 7.5/10**

---

> [!IMPORTANT]
> **Bước tiếp theo**: Chạy workflow `/frontend-refactor` với file báo cáo này để thực hiện các sửa đổi.
