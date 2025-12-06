# Báo Cáo Đánh Giá: Frontend `/src/app` theo FSD và Next.js 16

**Ngày:** 06/12/2025
**Phạm vi:** `frontend/src/app`
**Loại:** Kiểm tra Tuân thủ Kiến trúc & Clean Code

---

## Tổng Quan

Thư mục `frontend/src/app` chứa các route definitions (pages, layouts, loading states) cho toàn bộ ứng dụng Synapse. Đánh giá này kiểm tra tuân thủ với:
- **Feature-Sliced Design (FSD)** – Thin Pages, Public API, No Deep Imports
- **Next.js 16** – Async Request APIs, Server Components, Parallel Data Fetching

---

## 1. Vi Phạm Kiến Trúc FSD

### 1.1. Deep Imports (Nghiêm Trọng ⚠️)

> [!CAUTION]
> Các import trực tiếp vào file nội bộ thay vì qua Public API (`index.ts`) vi phạm nguyên tắc đóng gói.

| File | Import Vi Phạm | Cách Sửa |
|------|----------------|----------|
| `(dashboard)/treatments/page.tsx:1` | `@/features/customer-dashboard/components/treatment-list` | Sử dụng `@/features/customer-dashboard` |
| `(dashboard)/treatments/page.tsx:2` | `@/features/customer-dashboard/services/api` | Sử dụng `@/features/customer-dashboard` |
| `(dashboard)/layout.tsx:1` | `@/features/customer-dashboard/components/dashboard-nav` | Sử dụng `@/features/customer-dashboard` |
| `(dashboard)/layout.tsx:2` | `@/features/customer-dashboard/components/mobile-nav` | Sử dụng `@/features/customer-dashboard` |
| `(admin)/settings/operating-hours/page.tsx:2` | `@/features/settings/operating-hours/actions` | Export actions qua `index.ts` |
| `(admin)/services/page.tsx:1` | `@/features/resources/actions` | Sử dụng `@/features/resources` |
| `(auth)/layout.tsx:1` | `@/shared/components/layout/components/header/logo` | Sử dụng `@/shared/components/layout` |

### 1.2. Thiếu Public API (index.ts)

| Feature | Trạng Thái | Hành Động |
|---------|------------|-----------|
| `features/settings` | ❌ Thiếu `index.ts` | Tạo Public API file |
| `features/settings/operating-hours` | ✅ Có exports | Cần re-export lên cấp feature |

### 1.3. Thin Pages – Đánh Giá

| Page | Trạng Thái | Ghi Chú |
|------|------------|---------|
| `app/page.tsx` | ✅ Excellent | Chỉ compose components từ features |
| `(admin)/layout.tsx` | ⚠️ Có logic fetch | Nên di chuyển fetch logic vào server action |
| `(dashboard)/page.tsx` | ⚠️ Có logic filter | Dòng 10-11 chứa business logic |
| `(admin)/services/page.tsx` | ✅ Good | Data fetching + pass to page component |
| `(admin)/staff/page.tsx` | ⚠️ Có logic date | Dòng 19-21 tính toán ngày trong page |

---

## 2. Tuân Thủ Next.js 16

### 2.1. Async Request APIs ✅

**Kết quả:** PASS

Tất cả các pages đều xử lý `searchParams` đúng cách với `await`:

```typescript
// (admin)/resources/page.tsx:16 ✅
const searchParams = await props.searchParams

// (admin)/services/page.tsx:15 ✅
const { page: pageParam, search } = await searchParams;

// (admin)/staff/page.tsx:15 ✅
const resolvedSearchParams = await searchParams
```

### 2.2. Parallel Data Fetching ✅

**Kết quả:** PASS – Sử dụng `Promise.all` hoặc concurrent fetching

```typescript
// (dashboard)/page.tsx:4-8 ✅ Parallel fetch
const [appointments, treatments, profile] = await Promise.all([
  getCustomerAppointments(),
  getCustomerTreatments(),
  getCustomerProfile(),
])

// (admin)/services/page.tsx:21-30 ✅ Concurrent promises
const skillsPromise = getSkills();
const roomTypesPromise = getRoomTypes();
const [skills, roomTypes, equipmentList] = await Promise.all([...])
```

### 2.3. useEffect trong App Folder ✅

**Kết quả:** PASS – Không phát hiện `useEffect` nào trong `src/app`

### 2.4. useActionState ⚠️

**Kết quả:** Không phát hiện sử dụng trong `src/app` – cần xác nhận đã được sử dụng trong `features/`

---

## 3. Clean Code

### 3.1. Console Statements ⚠️

| File | Dòng | Loại | Hành Động |
|------|------|------|-----------|
| `(admin)/layout.tsx` | 32 | `console.error` | Thay bằng structured logging hoặc xóa |

### 3.2. Comments

**Kết quả:** PASS – Comments được viết bằng Tiếng Việt và giải thích "Why" thay vì "What"

```typescript
// (dashboard)/layout.tsx:15-20 ✅
{/* Left Sidebar (Card) */}
{/* Main Content */}

// (admin)/services/page.tsx:18-20 ✅
// Parallel data fetching
// We await skills immediately for initial render (dialogs/filters need it)
```

### 3.3. Hardcoded Values

| File | Vấn Đề | Đề Xuất |
|------|--------|---------|
| `(auth)/layout.tsx:13` | URL hình ảnh Unsplash hardcoded | Di chuyển vào constants hoặc env |
| `(auth)/layout.tsx:46` | Copyright year `2024` | Sử dụng `new Date().getFullYear()` |

---

## 4. Đề Xuất UX/UI

### 4.1. Typography

Dự án đã sử dụng **Be Vietnam Pro** (Vietnamese Friendly pairing #21 trong typography.csv) – Đây là lựa chọn tối ưu cho tiếng Việt.

```typescript
// layout.tsx:6-10 ✅
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: [...],
});
```

### 4.2. Loading States

| Page | Loading State | Hành Động |
|------|---------------|-----------|
| `(admin)` | ✅ `loading.tsx` | Đã có |
| `(dashboard)` | ✅ `loading.tsx` | Đã có |
| `(auth)` | ❌ Thiếu | Thêm skeleton loading |

### 4.3. Accessibility Improvements (từ ux-guidelines.csv)

| Guideline | Trạng Thái | Hành Động |
|-----------|------------|-----------|
| #29: Hover States | ⚠️ | Kiểm tra tất cả interactive elements có `cursor-pointer` |
| #36: Color Contrast | ✅ | Sử dụng theme colors |
| #9: Reduced Motion | ⚠️ | Kiểm tra `prefers-reduced-motion` cho animations |

---

## 5. Kế Hoạch Hành Động

### Ưu Tiên Cao (Sửa Ngay)

1. **Tạo `features/settings/index.ts`**
   - Export tất cả components/actions từ `operating-hours`

2. **Sửa Deep Imports trong `(dashboard)/layout.tsx`**
   ```diff
   - import { DashboardNav } from "@/features/customer-dashboard/components/dashboard-nav"
   - import { MobileNav } from "@/features/customer-dashboard/components/mobile-nav"
   + import { DashboardNav, MobileNav } from "@/features/customer-dashboard"
   ```

3. **Sửa Deep Imports trong `(dashboard)/treatments/page.tsx`**
   ```diff
   - import { TreatmentList } from "@/features/customer-dashboard/components/treatment-list"
   - import { getCustomerTreatments } from "@/features/customer-dashboard/services/api"
   + import { TreatmentList, getCustomerTreatments } from "@/features/customer-dashboard"
   ```

4. **Xóa `console.error` trong `(admin)/layout.tsx:32`**

### Ưu Tiên Trung Bình

5. **Di chuyển business logic ra khỏi pages**
   - `(dashboard)/page.tsx:10-11` → Tạo helper function trong feature
   - `(admin)/staff/page.tsx:19-21` → Di chuyển date calculation vào utils

6. **Thêm `loading.tsx` cho `(auth)` route group**

### Ưu Tiên Thấp

7. **Cập nhật copyright year động**
8. **Di chuyển Unsplash URL vào constants**

---

## Kết Luận

Frontend `/src/app` tuân thủ **tốt** với Next.js 16 async APIs và parallel data fetching. Các vấn đề chính cần giải quyết là **7 Deep Imports** và **1 feature thiếu Public API**. Code sạch, không có `useEffect` fetch hay `console.log` debug.

> Để thực hiện sửa đổi, hãy chạy workflow `/frontend-refactor` và cung cấp đường dẫn file báo cáo này: `docs/reports/071-frontend-review-app-folder.md`
