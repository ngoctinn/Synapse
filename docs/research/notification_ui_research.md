# Báo Cáo Nghiên Cứu: Giao Diện Thông Báo (Notification UI)

## 1. Tổng Quan & Hiện Trạng
**Mục tiêu**: Xây dựng "Trung tâm Thông báo" (Notification Center) chuyên nghiệp, hiện đại cho dự án Synapse, phục vụ Lễ tân và Kỹ thuật viên.

**Hiện trạng Codebase**:
*   **Settings**: Đã có `notification-list.tsx` trong `features/settings`, dùng để cấu hình bật/tắt kênh gửi (Zalo, SMS, Email).
*   **Header**: File `admin/components/header.tsx` hiện đang có một biểu tượng chuông (`Bell`) tĩnh với chấm đỏ "hardcoded", chưa có chức năng tương tác hay hiển thị danh sách thông báo.

## 2. Phân Tích & Nghiên Cứu Phong Cách (External Research)

### 2.1. Phong cách Linear (Linear-style)
*   **Đặc điểm**: Tối giản, danh sách phẳng, ưu tiên nội dung text, hành động nhanh (hover actions).
*   **Cấu trúc**:
    *   **Header**: Tiêu đề "Thông báo" + Nút "Đánh dấu đã đọc tất cả".
    *   **Tabs (Option)**: "Tất cả" vs "Chưa đọc".
    *   **List**: Các item được nhóm theo ngày (Hôm nay, Hôm qua) hoặc Project.
    *   **Visual**: Icon nhỏ phân loại (Booking, System, Alert), sử dụng dot (chấm xanh) để báo chưa đọc.

### 2.2. Shadcn/UI Best Practices
*   **Component sử dụng**:
    *   `Popover`: Container chính xuất hiện khi click vào chuông.
    *   `ScrollArea`: Để cuộn danh sách thông báo dài mà không vỡ layout.
    *   `Tabs`: Phân loại (Tất cả, Chưa đọc, Lưu trữ).
    *   `Avatar` / `Icon`: Hiển thị người tạo hoặc loại sự kiện.
    *   `Button` (Ghost/Icon): Các nút hành động nhanh (Mark as read, Delete).

## 3. Đề Xuất Giải Pháp (Proposed Solution)

### 3.1. Thiết Kế UI (Mockup Concept)
Nên xây dựng `NotificationPopover` gắn vào `Header`.

```mermaid
graph TD
    A[Bell Icon] -->|Click| B(Popover Content)
    B --> C[Header: 'Thông báo' + 'Đánh đấu đã đọc hết']
    B --> D[Tabs: Tất cả | Chưa đọc]
    D --> E[ScrollArea]
    E --> F[List of Items]
    F --> G[Item: Icon - Title - Time - ActionBtn]
```

**Cấu trúc Item chi tiết**:
*   **Icon trái**: Màu sắc định danh (Xanh dương cho Lịch hẹn, Đỏ cho Cảnh báo, Xám cho Hệ thống).
*   **Nội dung**: Title đậm, description nhạt màu (truncate 2 dòng).
*   **Thời gian**: Relative time (vừa xong, 5 phút trước).
*   **Trạng thái**: Background nhạt cho item chưa đọc, trắng cho item đã đọc.

### 3.2. Kiến Trúc Modular
Tạo feature mới hoặc mở rộng `features/notifications` (hiện tại đang nằm trong settings, nên tách ra hoặc tái cấu trúc).

**Đề xuất cấu trúc thư mục**:
```
src/features/notifications/
├── components/
│   ├── notification-bell.tsx       # Nút chuông + Badge count
│   ├── notification-popover.tsx    # Container chính
│   ├── notification-list.tsx       # Danh sách (ScrollArea)
│   └── notification-item.tsx       # Từng dòng thông báo
├── hooks/
│   └── use-notifications.ts        # Logic fetch & realtime (Supabase)
└── types.ts                        # Type definition
```

### 3.3. Công Nghệ & UX
*   **Realtime**: Sử dụng Supabase Realtime để đẩy thông báo mới ngay lập tức mà không cần reload.
*   **Optimistic UI**: Cập nhật trạng thái "Đã đọc" ngay lập tức trên UI trước khi server phản hồi.
*   **Infinite Scroll**: Load thêm khi cuộn xuống (nếu danh sách dài).

## 4. Kế Hoạch Tiếp Theo
1.  **Refactor**: Di chuyển logic settings hiện tại vào `features/settings/notifications` (giữ nguyên), nhưng tạo `features/notifications` cho phần hiển thị (Center).
2.  **Backend Support**: Đảm bảo bảng `notifications` trong DB có các trường: `read_at`, `type`, `payload`, `actor_id`.
3.  **Implement UI**: Xây dựng bộ component UI theo chuẩn Shadcn + Linear style.

---
*Báo cáo được tổng hợp bởi AI Researcher theo quy trình chuẩn.*
