# Báo Cáo Đánh Giá: Module Thiết Bị (Resources Refactor)

**Ngày:** 2025-12-05
**Mục tiêu:** Đánh giá tính nhất quán của trang Equipment và đề xuất tái cấu trúc thành Resources theo tài liệu `althorism.md`.

## 1. Tổng Quan
Trang hiện tại `src/app/(admin)/admin/equipment` đang tồn tại nhiều vấn đề về kiến trúc và giao diện người dùng, không đồng nhất với các module đã được nâng cấp (Services, Staff). Quan trọng hơn, khái niệm "Thiết bị" (Equipment) đang ngăn cản khả năng mở rộng để quản lý các tài nguyên khác như Phòng (Rooms) hay Giường (Beds), vốn là yêu cầu cốt lõi của thuật toán xếp lịch (RCPSP) trong `althorism.md`.

## 2. Vi Phạm Kiến Trúc & Code
### 2.1. Feature-Sliced Design (FSD) Violation
- **Page Logic:** File `page.tsx` chứa toàn bộ logic trạng thái (`useState`, handlers) và render UI chi tiết. Theo chuẩn FSD/Next.js App Router, `page.tsx` chỉ nên là Server Component thực hiện việc fetch dữ liệu và truyền xuống Feature Component.
- **Client Component:** `page.tsx` đang sử dụng `"use client"`, làm mất đi lợi ích của Server Components (SEO, Performance).

### 2.2. Hardcoded & Mock Data
- Dữ liệu đang được import cứng từ `mockEquipment`. Cần chuyển sang mô hình Async Data Fetching tại Server Component và truyền xuống dưới dạng Promise hoặc Initial Data.

### 2.3. Layout Logic
- Cấu trúc layout đang được hardcode (`flex flex-col h-[calc(100vh-2rem)]`), không tái sử dụng được các layout chuẩn của Admin Dashboard.

## 3. Phân Tích Chiến Lược (Strategic Alignment)
Dựa trên tài liệu `.agent/rules/althorism.md`:
- **Problem:** Thuật toán xếp lịch (RCPSP) yêu cầu quản lý **Tài nguyên (Resources)** chung, bao gồm:
    - **Phòng (Rooms)**: Không gian điều trị.
    - **Thiết bị (Devices)**: Máy móc chuyên dụng.
    - **Nhân viên (Staff)**: (Đã có module riêng).
- **Hiện tại:** Module `equipment` chỉ quản lý thiết bị.
- **Đề xuất:** Đổi tên và mở rộng phạm vi module thành **Resources (Tài nguyên)**.

## 4. Đánh Giá UI/UX (Premium Aesthetic)
So sánh với `Services` và `Staff` page:
- **Typography:** Chưa sử dụng font Serif cho tiêu đề chính.
- **Spacing:** Sử dụng padding/gap chưa đồng nhất với hệ thống design token mới.
- **Components:** Các Modal, Button, và Card chưa sử dụng style glassmorphism và shadow cao cấp ("Premium").

## 5. Kế Hoạch Hành Động (Action Plan)

### Bước 1: Rename & Restructure (Tái cấu trúc)
1. Đổi tên thư mục: `frontend/src/features/equipment` -> `frontend/src/features/resources`.
2. Đổi tên thư mục route: `frontend/src/app/(admin)/admin/equipment` -> `frontend/src/app/(admin)/admin/resources`.

### Bước 2: Refactor Data Model
Cập nhật Types/Interfaces để hỗ trợ `ResourceType`:
```typescript
export type ResourceType = 'ROOM' | 'DEVICE';

export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    status: 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE';
    // ... các trường khác
}
```

### Bước 3: Implement Server Component Page
Viết lại `src/app/(admin)/admin/resources/page.tsx`:
- Loại bỏ `"use client"`.
- Fetch dữ liệu (Resources, Maintenance Schedules) từ API/Mock function (async).
- Import và render `ResourcesPage` từ feature.

### Bước 4: Premium UI Implementation
- Xây dựng `ResourcesPage` (Client Component) tại `features/resources/routes/resources-page.tsx`.
- Thiết kế lại danh sách tài nguyên và lịch bảo trì sử dụng các component UI chuẩn (Table, Cards, Dialogs) với phong cách Premium.

### Bước 5: Verify
- Kiểm tra lại luồng hoạt động.
- Đảm bảo responsive và Dark Mode.

## Kết luận
Cần thực hiện workflow `/frontend-refactor` để chuyển đổi toàn bộ module `equipment` sang `resources`, áp dụng chuẩn kiến trúc mới và nâng cấp giao diện.
