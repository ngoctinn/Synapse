# Kế hoạch Đồng nhất Tài liệu Thiết kế KLTN

**Mã phiên:** `KLTN-SYNC-20251219`
**Ngày tạo:** 2025-12-19
**Trạng thái:** THINK (Chờ phê duyệt)

---

## 1. Vấn đề (Problem Statement)

Tài liệu thiết kế trong thư mục `docs/design/` hiện tại có các vấn đề sau:

1. **Không đồng nhất thuật ngữ**: Sử dụng lẫn lộn "phòng", "tài nguyên", "giường", viết tắt không thống nhất.
2. **Quá nhiều tính năng**: Một số tính năng nằm ngoài phạm vi khóa luận (Chatbot AI, Khuyến mãi, Hoa hồng).
3. **Usecase rườm rà**: Mô tả dài dòng, nhiều luồng phụ không cần thiết.
4. **Sequence thiếu/thừa**: Không khớp 1-1 với Usecase cốt lõi.
5. **Ngôn ngữ không học thuật**: Sử dụng ngôn ngữ đời thường thay vì học thuật.

---

## 2. Mục đích (Goals)

1. **Xác định phạm vi MVP** rõ ràng cho khóa luận "Xây dựng hệ thống chăm sóc khách hàng trực tuyến cho Spa".
2. **Đồng nhất thuật ngữ** theo Quy ước đã định trong `database_design.md`.
3. **Đơn giản hóa Usecase** với ngôn ngữ học thuật, ngắn gọn.
4. **Đồng bộ Sequence Diagrams** với Usecase MVP.
5. **Loại bỏ tính năng ngoài phạm vi**: Chatbot AI, Khuyến mãi (C8), Hoa hồng (C12).
6. **Giữ lại tính năng cốt lõi**: Trò chuyện trực tuyến (Live Chat), Cá nhân hóa liệu trình.

---

## 3. Ràng buộc (Constraints)

- **Ngôn ngữ**: Tiếng Việt học thuật, không viết tắt, không dùng ngôn ngữ đời thường.
- **Phạm vi**: Chỉ chỉnh sửa tài liệu thiết kế, không chỉnh sửa mã nguồn.
- **Tính nhất quán**: Thuật ngữ phải thống nhất trên toàn bộ tài liệu.

---

## 4. Phạm vi Tính năng Khóa luận

### 4.1 Tính năng CỐT LÕI (Bắt buộc)

| Nhóm | Mã | Tên chức năng | Ghi chú |
|------|----|---------------|---------|
| **Xác thực** | A1.1 | Đăng ký tài khoản khách hàng | |
| | A1.2 | Đăng nhập | |
| | A1.3 | Khôi phục mật khẩu | |
| | A1.4 | Cập nhật thông tin cá nhân | |
| | A1.5 | Đăng xuất | |
| **Khách hàng** | A2.1 | Xem danh sách dịch vụ | |
| | A2.2 | Xem chi tiết dịch vụ | |
| | A2.4 | Tìm kiếm khung giờ khả dụng | Thuật toán thông minh |
| | A2.5 | Hoàn tất đặt lịch hẹn | |
| | A2.7 | Nhận hỗ trợ qua Trò chuyện trực tuyến | Live Chat (không AI) |
| | A3.1 | Xem lịch sử đặt lịch | |
| | A3.2 | Hủy lịch hẹn | |
| | B1.7 | Theo dõi tiến độ liệu trình | Cá nhân hóa |
| **Lễ tân** | B1.1 | Xem lịch hẹn tổng quan | |
| | B1.2 | Quản lý hồ sơ khách hàng | |
| | B1.3 | Tạo lịch hẹn thủ công | |
| | B1.4 | Xác nhận khách đến (Check-in) | Trừ buổi liệu trình |
| | B1.5 | Xử lý thanh toán | |
| | B1.6 | Phản hồi hỗ trợ qua Trò chuyện trực tuyến | |
| **Kỹ thuật viên** | B2.1 | Xem lịch làm việc cá nhân | |
| | B2.3 | Ghi chú chuyên môn sau buổi hẹn | |
| **Quản trị** | C4 | Cấu hình lịch làm việc nhân viên | |
| | C5 | Quản lý danh mục dịch vụ | |
| | C7 | Quản lý tài nguyên | |

**Tổng: 22 chức năng cốt lõi**

### 4.2 Tính năng LOẠI BỎ (Ngoài phạm vi)

| Mã | Tên chức năng | Lý do loại bỏ |
|----|---------------|---------------|
| A2.6 | Tham gia danh sách chờ | Phức tạp, ngoài phạm vi |
| A3.3 | Nhận thông báo tự động | Cơ chế nền, không cần sơ đồ |
| A3.4 | Đánh giá dịch vụ | Chức năng phụ trợ |
| A3.5 | Tích lũy và đổi điểm thưởng | Ngoài phạm vi |
| A3.6 | Gửi yêu cầu bảo hành | Ngoài phạm vi |
| B1.8 | Tái lập lịch tự động | Phức tạp, ghi nhận hướng phát triển |
| C1 | Quản lý tài khoản người dùng | Supabase Auth xử lý |
| C2 | Phân quyền hệ thống | RLS xử lý ngầm |
| C3 | Quản lý nhân viên | Gộp vào C4 |
| C6 | Quản lý gói liệu trình | Phức tạp |
| **C8** | **Quản lý chương trình khuyến mãi** | **Ngoài phạm vi** |
| **C12** | **Tính toán hoa hồng nhân viên** | **Ngoài phạm vi** |

---

## 5. Chiến lược Thực hiện

### Phase A: Chuẩn hóa Usecase
- [ ] **A.1**: Loại bỏ các Usecase ngoài phạm vi (C8, C12, A2.6, A3.3-6, B1.8, C1-3, C6)
- [ ] **A.2**: Viết lại mô tả theo ngôn ngữ học thuật, không viết tắt
- [ ] **A.3**: Rút gọn luồng sự kiện (tối đa 1 luồng thay thế + 1 luồng ngoại lệ)
- [ ] **A.4**: Thống nhất thuật ngữ (Tài nguyên, Lịch hẹn, Khách hàng...)

### Phase B: Chuẩn hóa Sequence Diagrams
- [ ] **B.1**: Xóa sơ đồ của C8, C12 trong `sequences/admin_flows.md`
- [ ] **B.2**: Đổi tên hàm/API sang tiếng Việt học thuật (participant labels)
- [ ] **B.3**: Bổ sung sơ đồ còn thiếu (B1.2, B1.6, B1.7)
- [ ] **B.4**: Thống nhất thuật ngữ trong mô tả

### Phase C: Chuẩn hóa các tài liệu khác
- [ ] **C.1**: Cập nhật `architecture_v2.md` - Loại bỏ module không dùng
- [ ] **C.2**: Cập nhật `data_specification.md` - Thống nhất thuật ngữ
- [ ] **C.3**: Cập nhật `ui_design.md` - Chỉ giữ màn hình MVP
- [ ] **C.4**: Cập nhật `activity_diagrams.md` - Loại bỏ luồng ngoài phạm vi

---

## 6. Quy ước Thuật ngữ Học thuật

| Thuật ngữ Cũ | Thuật ngữ Mới (Học thuật) |
|--------------|---------------------------|
| Phòng/Giường | Tài nguyên |
| Thợ/KTV | Kỹ thuật viên |
| Khách | Khách hàng |
| Lịch | Lịch hẹn |
| Check-in | Xác nhận khách đến |
| No-show | Khách không đến |
| Slot | Khung giờ |
| Booking | Đặt lịch hẹn |
| Live Chat | Trò chuyện trực tuyến |
| Chatbot | (Loại bỏ - không dùng AI) |

---

## 7. Danh sách File Cần Sửa

| File | Hành động |
|------|-----------|
| `usecase.md` | Loại bỏ, viết lại, rút gọn |
| `sequences/admin_flows.md` | Xóa C8, C12; chuẩn hóa |
| `sequences/authentication.md` | Chuẩn hóa thuật ngữ |
| `sequences/customer_flows.md` | Chuẩn hóa thuật ngữ |
| `sequences/receptionist_flows.md` | Thêm B1.2, B1.6, B1.7; chuẩn hóa |
| `sequences/technician_flows.md` | Chuẩn hóa thuật ngữ |
| `sequence_diagrams.md` | Cập nhật mục lục |
| `architecture_v2.md` | Loại bỏ module không dùng |
| `data_specification.md` | Chuẩn hóa thuật ngữ |
| `ui_design.md` | Chỉ giữ màn hình MVP |
| `activity_diagrams.md` | Loại bỏ luồng ngoài phạm vi |
| `database_design.md` | Đã chuẩn (giữ nguyên) |
| `algorithm_spec.md` | Đã chuẩn (giữ nguyên) |

---

**⏸️ TRẠNG THÁI: Đang chờ phê duyệt từ người dùng để tiếp tục.**
