# Nghiên Cứu: Hợp Nhất Chế Độ Xem Lịch và Danh Sách (Operating Hours Exceptions)

**Ngày:** 2025-12-06
**Tác giả:** AI Assistant
**Trạng thái:** Draft

## 1. Tổng Quan
Hiện tại, module "Operating Hours Exceptions" có hai chế độ xem tách biệt:
1.  **Calendar View**: Trực quan, tốt cho việc xem phân bố tổng quan và chọn ngày nhanh (drag-select).
2.  **List View**: Chi tiết, tốt cho việc xem thông tin cụ thể và thao tác hàng loạt (bulk delete).

Người dùng mong muốn "hợp nhất" (unify) hai chế độ này để tối ưu hóa trải nghiệm, giảm thao tác chuyển đổi qua lại.

## 2. Phân Tích Hiện Trạng

### 2.1. Codebase
*   **`ExceptionsViewManager`**: Quản lý trạng thái `viewMode` ('calendar' | 'list') và render có điều kiện.
*   **`useExceptionViewLogic`**: Logic lọc dữ liệu và URL params hoạt động tốt cho cả hai view.
*   **`useCalendarSelection`**: Quản lý `selectedDateIds` (Set) cho Calendar.
*   **`ExceptionsTable`**: Có state `selectedIds` riêng cho checkbox hàng loạt. **Đây là điểm chưa đồng bộ.**

### 2.2. Vấn Đề
*   Người dùng phải chuyển đổi qua lại để vừa thấy trực quan, vừa xem chi tiết.
*   Việc chọn ngày trên lịch không phản hồi tương ứng trên danh sách (vì danh sách bị ẩn).
*   Không có sự liên kết giữa việc "Chọn ngày trên lịch" và "Chỉnh sửa trong danh sách" trong cùng một ngữ cảnh.

## 3. Đề Xuất Giải Pháp: "Premium Split View"

Thay vì hợp nhất thành một component duy nhất (phức tạp và rối), chúng ta nên áp dụng mô hình **Master-Detail** hoặc **Split View** linh hoạt.

### 3.1. Chiến Lược Hợp Nhất (Desktop)
Sử dụng layout 2 cột:
*   **Cột Trái (Master - 60-70%)**: **Calendar View**. Giữ nguyên khả năng điều hướng năm/tháng, drag-select.
*   **Cột Phải (Side Panel - 30-40%)**: **Smart List**.
    *   Mặc định: Hiển thị danh sách ngoại lệ trong *tháng/năm đang xem* (thu gọn).
    *   Khi chọn ngày (trên Calendar): Hiển thị danh sách các ngày *đang được chọn*.
    *   Cho phép sửa nhanh (Quick Edit) ngay tại sidebar này.

### 3.2. Chiến Lược Mobile
*   Giữ cơ chế **Toggle (Tabs)** như hiện tại do hạn chế không gian.

### 3.3. Các Thay Đổi Cần Thiết

#### A. Đồng Bộ State Selection
Move state selection từ `ExceptionsTable` ra ngoài hoặc sync với `useCalendarSelection`.
*   Khi click checkbox trong Table -> Update `selectedDateIds`.
*   Khi drag-select trên Calendar -> Update `selectedDateIds` -> Table highlight hoặc filter theo selection.

#### B. Component Refactoring
1.  **Refactor `ExceptionsTable`**:
    *   Chấp nhận prop `selectedIds` và `onSelectionChange` (Controlled Component).
    *   Chế độ "Compact Mode" để hiển thị trong Sidebar (ẩn bớt cột ID, Type icon hóa).
2.  **Refactor `ExceptionsViewManager`**:
    *   Thay đổi layout từ `Check ? A : B` sang `ResizablePanel` hoặc `Grid`.
    *   Logic: Nếu `viewMode === 'split'`, render cả hai.

## 4. Kế Hoạch Triển Khai (Implementation Plan)

1.  **Bước 1: Chuẩn hóa State**
    *   Nâng `selectedIds` của Table lên `ExceptionsViewManager` (khớp với `useCalendarSelection`).
    *   Đảm bảo Table và Calendar cùng thao tác trên một tập `selectedDateIds`.

2.  **Bước 2: Xây dựng "Context-Aware List"**
    *   Sửa `ExceptionsTable` để hỗ trợ `compact` prop.
    *   Tạo logic: Nếu có selection -> List chỉ hiện selection. Nếu không -> List hiện tất cả trong view hiện tại.

3.  **Bước 3: Update Layout**
    *   Sử dụng Grid Layout cho Desktop.
    *   Left: Calendar. Right: List (Scrollable).

## 5. Kết Luận
Giải pháp "Split View" là phương án tốt nhất để đạt được tiêu chuẩn "Premium". Nó tận dụng sức mạnh của cả hai chế độ xem mà không làm mất đi tính năng của cái nào. Dữ liệu và trạng thái chọn (Selection) sẽ là cầu nối duy nhất giữa hai view.
