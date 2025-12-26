# Quy Tắc Standard UI System (Synapse)

Dựa trên Design System Premium và tài liệu hình ảnh đã cung cấp:

## 1. Quy tắc Chiều cao (Height Standards)

*   **Button Tiêu chuẩn**: `48px` (h-12).
    *   Đây là kích thước mặc định cho mọi nút hành động chính (`variant="default"`).
    *   Padding tiêu chuẩn: `px-8` (30-32px).
*   **Input Tiêu chuẩn (Form)**: `56px` (h-14).
    *   Đây là kích thước mặc định cho các trường nhập liệu trong Form (Create/Edit).
    *   Giúp tạo cảm giác "Premium", thoáng đãng và dễ thao tác.
*   **Input Context (Search/Filter)**: `48px` (h-12).
    *   Khi sử dụng trong **FilterBar** hoặc đặt cạnh Button.
    *   Bắt buộc sử dụng prop `size="md"` để hạ chiều cao xuống 48px, đảm bảo align chuẩn với Button.

## 2. Bảng tham chiếu kích thước

| Component | Size Prop | Height | Class | Context sử dụng |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `default` | **48px** | `h-12` | Actions chính, Save, Submit |
| **Button** | `sm` | **40px** | `h-10` | Nút phụ bên trong bảng, dense UI |
| **Button** | `icon` | **48px** | `h-12` | Icon button tiêu chuẩn (vuông) |
| | | | | |
| **Input** | `default` | **56px** | `h-14` | Form chính (Mặc định) |
| **Input** | `md` | **48px** | `h-12` | **Search Bar**, Toolbar filters |
| **Input** | `sm` | **40px** | `h-10` | Inline edit, bảng dữ liệu mật độ cao |

## 3. Implementation Notes

*   **FilterBar**: input search luôn phải có `size="md"`.
    ```tsx
    <Input
      size="md" // Forces 48px height
      placeholder="Tìm kiếm..."
    />
    <FilterButton /> // Button default is 48px -> Aligned.
    ```
