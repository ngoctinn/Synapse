# Báo cáo Đánh giá Feature: Waitlist (Danh sách chờ)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `WaitlistTable`, `WaitlistSheet`.
- **Bố cục:** Bảng dữ liệu hiển thị thông tin khách hàng, dịch vụ quan tâm và thời gian mong muốn.
- **Thao tác:** Sử dụng `DropdownMenu` cho các hành động nhanh (Cập nhật trạng thái, Xóa).

## 2. Câu hỏi Phản biện
1. **Về Trải nghiệm Người dùng (UX):**
   - Tại sao hành động xóa lại sử dụng `window.confirm` (`if (!confirm(...))`)? Đây là một cách tiếp cận cũ và không đồng bộ với phong cách UI hiện đại của `shadcn/ui`. Tại sao không sử dụng `DeleteConfirmDialog` như trong các feature khác?
   - Khi cập nhật trạng thái, thông báo toast hiển thị `status` thô (ví dụ: "Đã cập nhật trạng thái: COMPLETED"). Tại sao không chuyển ngữ các trạng thái này sang tiếng Việt (ví dụ: "Đã hoàn thành") để thân thiện hơn?

2. **Về Nhất quán:**
   - Tại sao `WaitlistTable` lại sử dụng `DropdownMenu` cho các hành động, trong khi `ServiceTable` hay `PackageTable` lại có các nút hành động trực tiếp hoặc `TableActionBar`? Sự thay đổi về pattern tương tác này có làm người dùng bối rối không?

---

# Báo cáo Đánh giá Feature: Warranty (Bảo hành)

## 1. Phân tích Giao diện & Style
- **Thành phần chính:** `WarrantyTable`, `WarrantySheet`.
- **Bố cục:** Bảng dữ liệu hiển thị mã bảo hành, khách hàng, dịch vụ và thời hạn.
- **Thẩm mỹ:** Mã bảo hành sử dụng `font-mono` để phân biệt với các dữ liệu văn bản khác.

## 2. Câu hỏi Phản biện
1. **Về Hiển thị Dữ liệu:**
   - Logic tính toán `daysLeft` nằm trực tiếp trong hàm `cell` của cột "Thời hạn". Tại sao không tách logic này ra một helper function hoặc xử lý từ phía server?
   - Tại sao mã bảo hành lại dùng `font-mono`? Liệu người dùng có cần copy-paste mã này thường xuyên không? Nếu không, việc dùng font Mono có thể làm bảng trông "kỹ thuật" quá mức cần thiết.

2. **Về UX & Trạng thái:**
   - Cột "Thời hạn" hiển thị "Còn X ngày" hoặc "Đã hết hạn". Tại sao không có cảnh báo màu sắc (ví dụ: màu vàng) khi bảo hành sắp hết hạn (ví dụ: còn dưới 3 ngày)?
   - Tại sao không có tính năng tìm kiếm nhanh theo mã bảo hành ngay trên đầu bảng?

3. **Về Clean Code:**
   - `WarrantyTable` không sử dụng `useTableSelection` dù nó là một bảng dữ liệu có thể cần thao tác hàng loạt (ví dụ: gia hạn hàng loạt). Tại sao pattern này không được áp dụng đồng nhất?
   - Tại sao `isPending` từ `useTransition` được khai báo nhưng không thấy sử dụng để disable các nút bấm trong lúc đang xử lý API?
