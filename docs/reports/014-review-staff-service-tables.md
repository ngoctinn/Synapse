# Báo Cáo Đánh Giá & So Sánh: Staff Table vs Service Table

**Ngày:** 30/11/2024
**Người thực hiện:** Antigravity (AI Agent)
**Mục tiêu:** Đánh giá sự không đồng nhất giữa `staff-table.tsx` và `service-table.tsx`, đề xuất giải pháp thống nhất UI/UX và Kiến trúc.

---

## 1. Tổng Quan Vấn Đề

Người dùng nhận thấy sự thiếu đồng nhất giữa hai bảng dữ liệu chính trong hệ thống Admin:
- **Staff Table**: Cấu trúc hợp lý, "full nội dung" (hiển thị đầy đủ, bố cục tốt).
- **Service Table**: Giao diện đẹp hơn (UI/UX), mang cảm giác cao cấp (Premium).

**Mục tiêu:** Kết hợp "Logic & Cấu trúc" của Staff Table với "Vẻ đẹp & Cảm xúc" của Service Table.

---

## 2. Phân Tích Chi Tiết

### 2.1. Kiến Trúc & Code (Architecture)

| Tiêu chí | Staff Table (`staff-table.tsx`) | Service Table (`service-table.tsx`) | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Separation of Concerns** | Tốt. Tách biệt `StaffActions` ra file riêng. | Chưa tốt. Logic Actions, Dialogs nằm chung trong file Table. | **Staff thắng**. Nên tách Actions ra component riêng. |
| **Layout Strategy** | `h-full flex flex-col` + `overflow-auto`. Tự động lấp đầy container cha. | `max-h-[calc(100vh-220px)]`. Sử dụng "Magic Number" cứng nhắc. | **Staff thắng**. Layout linh hoạt và responsive hơn. |
| **Animation** | Sử dụng `framer-motion` (`motion.tr`) cho hiệu ứng xuất hiện mượt mà. | Sử dụng `animate-pulse` cho Skeleton và `animate-ping` cho status. | **Hòa**. Nên kết hợp cả hai: Motion cho row entry và Ping cho status. |
| **Data Formatting** | Tốt. | Inline `Intl.NumberFormat` (lặp lại code). | **Staff thắng**. Nên tách utility format tiền tệ. |

### 2.2. UI/UX & Thẩm Mỹ (Aesthetics)

| Tiêu chí | Staff Table | Service Table | Đánh giá |
| :--- | :--- | :--- | :--- |
| **Visual Style** | Cơ bản. Nền trắng, border chuẩn. | **Premium**. Glassmorphism (`bg-white/80`, `backdrop-blur`), `rounded-xl`, `shadow-sm`. | **Service thắng**. Giao diện hiện đại, ấn tượng hơn. |
| **Hover Effect** | `hover:bg-muted/50` (Màu xám mặc định). | `hover:bg-blue-50/50` (Màu xanh tint nhẹ). | **Service thắng**. Màu xanh tạo cảm giác tươi mới, clean hơn. |
| **Status Indicator** | `Switch` (Toggle). Tiện lợi nhưng hơi "thô" nếu chỉ để xem. | Badge + `animate-ping` (Chấm xanh nhấp nháy). Rất trực quan và sinh động. | **Service thắng về visual**. Staff thắng về interaction (nhanh). -> **Đề xuất**: Kết hợp (Switch có style đẹp hơn hoặc Badge có action). |
| **Empty State** | Không thấy trong file (có thể xử lý bên ngoài hoặc thiếu). | Có Empty State đẹp mắt với icon và hướng dẫn. | **Service thắng**. Trải nghiệm người dùng tốt hơn khi chưa có dữ liệu. |

---

## 3. Đề Xuất Cải Tiến (Action Plan)

Để đạt được sự đồng nhất và chất lượng cao nhất ("Best of Both Worlds"), chúng ta sẽ thực hiện Refactor theo hướng sau:

### 3.1. Chiến Lược Hợp Nhất (The "Unified" Table Pattern)

Chúng ta sẽ tạo ra một chuẩn mực mới cho các bảng trong Admin, gọi là **"Premium Data Table"**, kết hợp:
1.  **Cấu trúc của Staff**: Layout `h-full`, tách biệt Actions component.
2.  **Giao diện của Service**: Glassmorphism, Rounded corners, Blue tint hover.

### 3.2. Kế Hoạch Thực Hiện Cụ Thể

#### Bước 1: Refactor `service-table.tsx` (Về mặt cấu trúc)
-   [ ] Chuyển layout từ `max-h-[calc...]` sang `h-full flex flex-col` (giống Staff).
-   [ ] Tách phần Actions (Dropdown, Dialogs) ra thành `ServiceActions` component (giống Staff).
-   [ ] Sử dụng `motion.tr` cho hiệu ứng xuất hiện các dòng (giống Staff).

#### Bước 2: Refactor `staff-table.tsx` (Về mặt giao diện)
-   [ ] Áp dụng container style: `rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm`.
-   [ ] Thay đổi header style: `bg-white/95 backdrop-blur`.
-   [ ] Thay đổi row hover style: `hover:bg-blue-50/50`.
-   [ ] Cập nhật cột Status: Có thể giữ Switch nhưng thêm hiệu ứng hoặc style lại cho mềm mại hơn, hoặc chuyển sang Badge nếu không cần toggle nhanh (tùy nghiệp vụ). *Đề xuất: Giữ Switch cho Staff vì nghiệp vụ cần bật/tắt nhanh, nhưng bọc trong container đẹp hơn.* (toi nghĩ là nên chuyển sang Badge)
-   [ ] Thêm Empty State (nếu chưa có).

#### Bước 3: Shared Utilities
-   [ ] Tạo `formatCurrency(value)` trong `shared/lib/utils` để dùng chung.
-   [ ] Cân nhắc tạo một wrapper component `DataTableContainer` để tái sử dụng style Glassmorphism.

---

## 4. Kết Luận

Sự "không đồng nhất" mà người dùng nhận thấy là chính xác. `StaffTable` tốt về "Gỗ" (Code, Layout), còn `ServiceTable` tốt về "Nước sơn" (UI/UX). Việc hợp nhất hai điểm mạnh này sẽ tạo ra một trải nghiệm Admin đẳng cấp và code dễ bảo trì.

**Khuyến nghị:** Chạy workflow `/frontend-refactor` với báo cáo này để thực thi các thay đổi trên.
