# Báo Cáo Strategic Review: Admin Layout & Scrolling

## 1. Vấn đề: Có nên cho phép scroll ở phần content admin không?

**Câu trả lời: CÓ.**

### Lý do:
1.  **Khả năng truy cập (Accessibility)**: Trên màn hình nhỏ (laptop 13 inch, tablet) hoặc khi nội dung bị zoom, chiều cao cố định (100vh) sẽ làm mất nội dung bên dưới nếu không có thanh cuộn.
2.  **Tính linh hoạt**: Các trang như Form nhập liệu dài, Báo cáo chi tiết thường vượt quá chiều cao màn hình. Việc ép buộc "internal scrolling" (scroll bên trong từng card) làm trải nghiệm người dùng bị phân mảnh (nhiều thanh cuộn lồng nhau).
3.  **Bảo trì**: Việc tính toán chiều cao thủ công (như `calc(100vh - 6rem)`) rất dễ vỡ (brittle) khi thay đổi kích thước Header hoặc Padding.

## 2. Phân tích Hiện trạng

### `frontend/src/app/(admin)/layout.tsx`
Hiện tại đang sử dụng `overflow-hidden` cho toàn bộ wrapper của content chính:
```tsx
<div className="flex flex-col flex-1 min-w-0 overflow-hidden gap-3">
  <AdminHeader ... />
  <main className="flex-1">
    <div className="w-full h-full">
      {children}
    </div>
  </main>
</div>
```
Điều này ngăn cản việc cuộn tự nhiên của trình duyệt.

### `frontend/src/app/(admin)/admin/services/page.tsx`
Sử dụng "Magic Number" để tính chiều cao:
```tsx
<div className="h-[calc(100vh-6rem)] flex flex-col">
```
Nếu Header thay đổi chiều cao hoặc padding thay đổi, layout này sẽ bị lỗi (thừa hoặc thiếu khoảng trắng).

## 3. Giải pháp Đề xuất (Premium UX)

### Sử dụng `ScrollArea` (Radix UI)
Thay vì sử dụng thanh cuộn mặc định của trình duyệt (có thể thô và không đồng nhất giữa các OS), chúng ta sẽ sử dụng component `ScrollArea` từ `shared/ui`.

**Ưu điểm:**
- **Thẩm mỹ cao**: Thanh cuộn mỏng, tinh tế, bo tròn, tự động ẩn khi không dùng (giống macOS).
- **Đồng nhất**: Trải nghiệm giống nhau trên Windows, Mac, Linux.
- **Hiện đại**: Phù hợp với tiêu chuẩn "Premium Design".

### Cấu trúc Layout Mới
```tsx
<div className="flex h-screen overflow-hidden bg-slate-100 p-3 gap-3 ...">
  {/* Sidebar cố định */}
  <AdminSidebar ... />

  {/* Content Area */}
  <div className="flex flex-col flex-1 min-w-0 overflow-hidden gap-3">
    {/* Header cố định */}
    <AdminHeader ... />

    {/* Scrollable Main Content */}
    <ScrollArea className="flex-1 rounded-2xl border bg-white/50 shadow-sm">
      <main className="p-4">
        {children}
      </main>
    </ScrollArea>
  </div>
</div>
```

## 4. Trạng thái Thực hiện
- [x] **Refactor Layout**: Đã cập nhật `layout.tsx` sử dụng `ScrollArea`.
- [x] **Refactor Services Page**: Đã cập nhật `services/page.tsx` để sử dụng `h-full` và `min-h` thay vì `calc`.
