# Báo Cáo Đánh Giá Frontend: Service Form - Layout & UX/UI Toàn Diện

**Ngày:** 2025-12-02
**Người thực hiện:** AI Assistant
**Phạm vi:** `frontend/src/features/services/components/service-form.tsx` (Toàn bộ component)

## 1. Tổng Quan Kiến Trúc & Code Quality

### 1.1. Tuân thủ FSD & Next.js 16
*   **Structure**: Component được đặt đúng vị trí trong `features/services/components`.
*   **Client Component**: Sử dụng `"use client"` hợp lý cho Form tương tác.
*   **Async/Await**: Xử lý `onSubmit` với `startTransition` là chuẩn xác cho Next.js 15/16 để giữ UI responsive.
*   **Dependencies**: Sử dụng `react-hook-form`, `zod`, `sonner` đúng chuẩn dự án.

### 1.2. Clean Code & Naming
*   **Naming**: Tên biến rõ ràng (`isPending`, `skillOptions`).
*   **Comments**: Một số comment vẫn bằng tiếng Anh (VD: `// Transform availableSkills for TagInput`, `// Left Column: General Information`). **Cần chuyển sang Tiếng Việt.**
*   **Separation of Concerns**: Logic `onSubmit` hơi dài, có thể tách ra custom hook nếu phức tạp hơn, nhưng hiện tại chấp nhận được.

## 2. Phân Tích Chi Tiết UX/UI & Layout

Bố cục hiện tại sử dụng **Grid 2 Cột (Desktop)** và **Stack (Mobile)**.

### 2.1. Section 1: Thông Tin Chung (Cột Trái)
*   **Hiện trạng**: Xếp chồng dọc (Vertical Stack). `ImageUpload` chiếm nhiều diện tích chiều cao.
*   **Vấn đề**: Lãng phí không gian, thiếu sự liên kết giữa Ảnh và Tên dịch vụ. Field "Trạng thái" dùng border kép chưa tinh tế.
*   **Đề Xuất (High Priority)**:
    *   **Chuyển sang Layout "Media Object"**: Đặt `ImageUpload` sang bên trái (fixed size ~140px), các trường Tên, Giá, Trạng thái nằm bên phải.
    *   **Refine Status Field**: Sử dụng style mềm mại hơn (nền màu, bỏ border cứng) để phân biệt trạng thái Active/Inactive rõ ràng.

### 2.2. Section 2: Cấu Hình Thời Gian (Cột Phải - Phần trên)
*   **Hiện trạng**: 2 `TimePicker` (Thời lượng, Nghỉ) + `ServiceTimeVisualizer`.
*   **Đánh giá**:
    *   `ServiceTimeVisualizer` là một điểm cộng lớn (WOW factor), giúp người dùng hình dung trực quan.
    *   Vị trí đặt ngay dưới input là hợp lý.
*   **Đề Xuất**:
    *   Đảm bảo `ServiceTimeVisualizer` có animation mượt mà khi thay đổi giá trị input.

### 2.3. Section 3: Yêu Cầu Kỹ Năng (Cột Phải - Phần dưới)
*   **Hiện trạng**: Sử dụng `TagInput`.
*   **Đánh giá**: Component gọn gàng.
*   **Đề Xuất**:
    *   Nếu danh sách kỹ năng dài, `TagInput` cần hỗ trợ search tốt (đã có trong component gốc).

### 2.4. Action Bar (Nút Lưu)
*   **Hiện trạng**: Nằm cuối form, căn phải.
*   **Vấn đề**: Khi form dài, người dùng phải cuộn xuống cuối mới thấy nút.
*   **Đề Xuất**:
    *   Rút ngắn form để nút Save nằm ngay dưới `TagInput`..

## 3. Đề Xuất Cải Tiến Visual (Premium Feel)

Để đạt chuẩn "Premium SaaS", giao diện cần "thoáng" và "sạch" hơn:

1.  **Card Styling**:
    *   Hiện tại: `rounded-lg border p-4 bg-white shadow-sm`.
    *   Cải tiến: Tăng padding lên `p-6` để tạo không gian thở (white space). Sử dụng `shadow-sm` nhẹ hơn hoặc bỏ shadow, chỉ dùng border màu nhạt (`border-slate-100`) nếu nền page đã là màu xám nhẹ.

2..

3.  **Micro-interactions**:
    *   Hover effect vào các Input/Card.
    *   Smooth transition khi switch trạng thái.

## 4. Kế Hoạch Hành Động (Refactor Plan)

1.  **Refactor Layout "Thông Tin Chung"**: Thực hiện layout Media Object (Ảnh trái, Info phải).
2.  **Style lại Field "Trạng thái"**: UI Compact, visual feedback tốt hơn.
3.  **Việt hóa Comment**: Chuyển toàn bộ comment trong code sang Tiếng Việt.
4.  **Polish UI**: Tăng padding Card

---
*Báo cáo này thay thế cho báo cáo trước đó và bao trùm toàn bộ Service Form.*
