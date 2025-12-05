# Báo Cáo Đánh Giá Giao Diện Resources - Sự Đồng Bộ UI

**Ngày:** 05/12/2025
**Phạm vi:** `frontend/src/features/resources`, `frontend/src/app/(admin)/admin/resources`
**Tham chiếu:** `frontend/src/features/staff`, `.agent/rules/frontend.md`, `.agent/rules/althorism.md`

---

## 1. Tổng Quan

Báo cáo này đánh giá sự đồng bộ UI của module **Resources** so với **Staff** (module chuẩn), kiểm tra tuân thủ kiến trúc FSD, và xác định các vấn đề cần khắc phục.

> [!IMPORTANT]
> Module Resources có **9 điểm không đồng nhất nghiêm trọng** với UI hiện tại của Staff, cần refactor để đảm bảo tính nhất quán trải nghiệm người dùng.

---

## 2. Vi Phạm Kiến Trúc FSD

### 2.1. Public API (`index.ts`) Không Đầy Đủ

| Module | Số File Export | Thiếu Export |
|--------|----------------|--------------|
| [staff/index.ts](file:///e:/Synapse/frontend/src/features/staff/index.ts) | 5 exports | ✅ Đầy đủ |
| [resources/index.ts](file:///e:/Synapse/frontend/src/features/resources/index.ts) | 4 exports | ❌ Thiếu `ResourceToolbar`, `ResourceDialog`, `ResourceForm` |

**Vấn đề:**
- [index.ts](file:///e:/Synapse/frontend/src/features/resources/index.ts#L1-6): Thiếu export các component nội bộ khiến [page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx#L2-4) phải deep import trực tiếp.

```diff
// resources/index.ts
export * from "./actions";
export * from "./components/maintenance-timeline";
export * from "./components/resource-table";
export * from "./model/types";
+export * from "./components/resource-toolbar";
+export * from "./components/resource-dialog";
+export * from "./components/resource-form";
```

### 2.2. Deep Imports trong Page

**File:** [admin/resources/page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx#L1-6)

```typescript
// ❌ Vi phạm: Deep imports trực tiếp vào file component
import { ResourceTable } from "@/features/resources/components/resource-table";
import { ResourceToolbar } from "@/features/resources/components/resource-toolbar";
```

**So sánh với Staff (đúng chuẩn):**
```typescript
// ✅ Chuẩn: Import qua index.ts
import { StaffPage } from "@/features/staff"
```

---

## 3. Vấn Đề Đồng Bộ UI Components

### 3.1. Toolbar - Sử Dụng Component Khác Nhau

| Thành phần | Staff (`staff-page.tsx`) | Resources (`resource-toolbar.tsx`) | Vấn đề |
|------------|--------------------------|-----------------------------------|--------|
| Search Input | `<SearchInput />` (shared/ui/custom) | `<Input />` + icon thủ công | ❌ Không nhất quán |
| Filter | `<StaffFilter />` với `<FilterButton />` | Không có | ❌ Thiếu chức năng |
| Button height | `h-9` | `h-9` | ✅ OK |

**Chi tiết:**

[resource-toolbar.tsx:26-33](file:///e:/Synapse/frontend/src/features/resources/components/resource-toolbar.tsx#L26-33):
```tsx
// ❌ Triển khai search thủ công thay vì dùng SearchInput
<div className="relative w-full md:w-[250px]">
  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input placeholder="Tìm kiếm..." className="pl-9 h-9" ... />
</div>
```

**So sánh Staff** ([staff-page.tsx:87-90](file:///e:/Synapse/frontend/src/features/staff/components/staff-page.tsx#L87-90)):
```tsx
// ✅ Sử dụng component chuẩn
<SearchInput placeholder="Tìm kiếm nhân viên..." className="w-full md:w-[250px] h-9" />
```

### 3.2. Table - Không Sử Dụng Các Component Chuẩn

| Thành phần | Staff (`staff-table.tsx`) | Resources (`resource-table.tsx`) | Vấn đề |
|------------|---------------------------|--------------------------------|--------|
| Avatar/Icon | `<Avatar>` component | Icon inline (Bed/Box) | ❌ Không có avatar |
| Status Badge | `<StatusBadge />` | `<Badge />` thủ công với hardcoded colors | ❌ Không nhất quán |
| Skeleton | `<DataTableSkeleton />` | Không có | ❌ Thiếu loading state |
| Empty State icon | LucideIcon component | `Box` directly | ✅ OK |
| Row animation | Via DataTable variant="flush" | Không có | ⚠️ Cần kiểm tra |

**Vấn đề Status Badge:**

[resource-table.tsx:72-89](file:///e:/Synapse/frontend/src/features/resources/components/resource-table.tsx#L72-89):
```tsx
// ❌ Hardcoded styles thay vì dùng StatusBadge
<Badge
  variant={row.status === "ACTIVE" ? "default" : "secondary"}
  className={row.status === "MAINTENANCE" ? "bg-yellow-500/10 text-yellow-700..." : ""}
>
```

**Staff sử dụng component chuẩn** ([staff-table.tsx:129](file:///e:/Synapse/frontend/src/features/staff/components/staff-list/staff-table.tsx#L129)):
```tsx
// ✅ Component tái sử dụng
<StatusBadge isActive={staff.user.is_active} />
```

### 3.3. Table - Thiếu Tính Năng

| Tính năng | Staff | Resources |
|-----------|-------|-----------|
| Pagination | ✅ `page`, `totalPages`, `onPageChange` | ❌ Không có |
| Variant prop | ✅ `variant="flush"` | ❌ Không có |
| Skeleton export | ✅ `StaffTableSkeleton` | ❌ Không có |
| className prop | ✅ | ❌ Không có |

---

## 4. Vấn Đề Layout Page

### 4.1. Sticky Header - Padding Không Nhất Quán

**Resources** ([resources/page.tsx:30](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx#L30)):
```tsx
<div className="sticky top-0 z-40 px-6 py-2 bg-background...">
```

**Staff** ([staff-page.tsx:76](file:///e:/Synapse/frontend/src/features/staff/components/staff-page.tsx#L76)):
```tsx
<div className="sticky top-0 z-40 -mx-4 px-4 py-2 bg-background...">
```

| Thuộc tính | Staff | Resources | Vấn đề |
|------------|-------|-----------|--------|
| Horizontal padding | `px-4` | `px-6` | ❌ Không nhất quán |
| Negative margin | `-mx-4` | Không có | ❌ Không nhất quán |
| Mobile header height var | `--header-height-mobile` | Không có | ❌ Thiếu responsive |

### 4.2. Tabs Trigger - Thiếu Responsive Flex

**Resources** ([resources/page.tsx:32-33](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx#L32-33)):
```tsx
<TabsTrigger value="list" className="...transition-all duration-200">
```

**Staff** ([staff-page.tsx:79-81](file:///e:/Synapse/frontend/src/features/staff/components/staff-page.tsx#L79-81)):
```tsx
<TabsTrigger value="list" className="...flex-1 md:flex-none">
```

❌ Resources thiếu `flex-1 md:flex-none` cho responsive behavior.

### 4.3. Content Area - Wrapper Thừa

**Resources** ([resources/page.tsx:43-48](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx#L43-48)):
```tsx
<TabsContent value="list" className="... p-6 ...">
  <div className="flex-1 bg-card rounded-lg border shadow-sm p-4">  // ❌ Wrapper thừa
    <ResourceTable data={resources} />
  </div>
</TabsContent>
```

**Staff** ([staff-page.tsx:100-107](file:///e:/Synapse/frontend/src/features/staff/components/staff-page.tsx#L100-107)):
```tsx
<TabsContent value="list" className="... p-0 ...">  // ✅ Không có padding
  <StaffListWrapper ... />
</TabsContent>
```

| Thuộc tính | Staff | Resources | Vấn đề |
|------------|-------|-----------|--------|
| TabsContent padding | `p-0` | `p-6` | ❌ Không nhất quán |
| Card wrapper | Không có | Có | ❌ Pattern khác |
| table variant | `variant="flush" className="-mx-4"` | Không có | ❌ Thiếu edge-to-edge |

### 4.4. Footer - Thiếu Component Footer

**Staff** ([staff-page.tsx:59-63, 108](file:///e:/Synapse/frontend/src/features/staff/components/staff-page.tsx#L59-63)):
```tsx
const Footer = () => (
  <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
    © 2025 Synapse. All rights reserved.
  </div>
)
...
<Footer />
```

**Resources:** ❌ Không có Footer component.

---

## 5. Đánh Giá Theo Althorism.md

File `.agent/rules/althorism.md` định nghĩa thuật toán lập lịch đa mục tiêu cho Spa. Mặc dù **không phải là quy tắc UI**, nhưng phần quan trọng liên quan đến Resources:

> **Tài nguyên (Resources):** Bao gồm KTV (nhân lực), **Phòng điều trị** (không gian), và **Thiết bị chuyên dụng** (máy móc).

**Nhận xét:**
- ✅ Resources module đã triển khai đúng 2 loại: `ROOM` và `EQUIPMENT`
- ✅ Có `MaintenanceTimeline` để quản lý lịch bảo trì
- ⚠️ Chưa tích hợp với hệ thống lập lịch (Scheduler) được đề cập trong althorism

---

## 6. Đề Xuất UX/UI Nâng Cao

### 6.1. Resource Table - Bổ Sung Avatar/Icon Column

Theo pattern của Staff, cột đầu tiên nên có:
- Avatar cho phòng (ảnh hoặc icon Bed)
- Avatar cho thiết bị (ảnh hoặc icon Box)
- Text styling: `font-serif text-lg tracking-tight`

### 6.2. Status Badge - Tạo Variant Mới

Thay vì hardcode màu, tạo `ResourceStatusBadge` component:

```tsx
type ResourceStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

const STATUS_CONFIG: Record<ResourceStatus, { label: string; variant: BadgeVariant; className: string }> = {
  ACTIVE: { label: "Hoạt động", variant: "default", className: "" },
  MAINTENANCE: { label: "Bảo trì", variant: "outline", className: "bg-yellow-500/10 text-yellow-700" },
  INACTIVE: { label: "Ngưng", variant: "secondary", className: "" }
};
```

### 6.3. Filter - Thêm ResourceFilter Component

Tương tự `StaffFilter`, cần:
- Filter theo Type (ROOM/EQUIPMENT)
- Filter theo Status (ACTIVE/MAINTENANCE/INACTIVE)

---

## 7. Tóm Tắt Các Vấn Đề

| # | Vấn đề | Mức Độ | File Liên Quan |
|---|--------|--------|----------------|
| 1 | index.ts thiếu exports | 🔴 Cao | [index.ts](file:///e:/Synapse/frontend/src/features/resources/index.ts) |
| 2 | Deep imports trong page | 🔴 Cao | [page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx) |
| 3 | Không dùng SearchInput | 🟡 Trung bình | [resource-toolbar.tsx](file:///e:/Synapse/frontend/src/features/resources/components/resource-toolbar.tsx) |
| 4 | Thiếu FilterButton | 🟡 Trung bình | [resource-toolbar.tsx](file:///e:/Synapse/frontend/src/features/resources/components/resource-toolbar.tsx) |
| 5 | Hardcoded Badge styles | 🟡 Trung bình | [resource-table.tsx](file:///e:/Synapse/frontend/src/features/resources/components/resource-table.tsx) |
| 6 | Thiếu Skeleton component | 🟡 Trung bình | [resource-table.tsx](file:///e:/Synapse/frontend/src/features/resources/components/resource-table.tsx) |
| 7 | Padding layout không nhất quán | 🟡 Trung bình | [page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx) |
| 8 | Thiếu responsive flex cho tabs | 🟢 Thấp | [page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx) |
| 9 | Thiếu Footer component | 🟢 Thấp | [page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx) |

---

## 8. Kế Hoạch Hành Động

### Phase 1: Sửa Vi Phạm Kiến Trúc
1. Cập nhật [index.ts](file:///e:/Synapse/frontend/src/features/resources/index.ts) để export đầy đủ components
2. Refactor [page.tsx](file:///e:/Synapse/frontend/src/app/(admin)/admin/resources/page.tsx) để import qua index

### Phase 2: Đồng Bộ Components
3. Thay thế Input bằng `SearchInput` trong [resource-toolbar.tsx](file:///e:/Synapse/frontend/src/features/resources/components/resource-toolbar.tsx)
4. Tạo `ResourceFilter` component với `FilterButton`
5. Tạo `ResourceStatusBadge` hoặc dùng pattern từ `StatusBadge`
6. Export `ResourceTableSkeleton`

### Phase 3: Chuẩn Hóa Layout
7. Cập nhật padding và margin cho sticky header
8. Xóa wrapper thừa trong TabsContent
9. Thêm Footer component
10. Thêm responsive flex cho TabsTrigger

---

> **Ghi chú:** Để thực hiện các thay đổi, chạy workflow `/frontend-refactor` với đường dẫn báo cáo này.
