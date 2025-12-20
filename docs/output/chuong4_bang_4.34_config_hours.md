# BẢNG 4.34 - KIỂM THỬ CẤU HÌNH THỜI GIAN HOẠT ĐỘNG SPA (C1, C2)

**Use Cases**:
- **C1** - Cấu hình giờ hoạt động Spa
- **C2** - Quản lý ngày nghỉ lễ và ngày đặc biệt

**Mức độ ưu tiên**: 🟠 HIGH
**Mục đích**: Kiểm chứng việc cấu hình thời gian hoạt động ảnh hưởng đúng đến booking availability

---

## Bảng 4.34: Kiểm thử Cấu hình thời gian hoạt động Spa (C1, C2)

| Mã TC | UC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-------|----|----------|----------------|-----------------|------------------|---------|
| **CFG_01** | C1 | Cập nhật giờ mở cửa | **1.** Admin vào "Cấu hình Spa"<br>**2.** Sửa Thứ 2: 9h-20h<br>**3.** Lưu | **Thứ 2**:<br>Giờ mở: 09:00<br>Giờ đóng: 20:00 | **✓** Cập nhật thành công<br>**✓** Booking availability tính từ 9h<br>**✓** Không cho đặt lịch trước 9h hoặc sau 20h<br>**✓** Thông báo: "Đã lưu cấu hình" | **Pass** ✅ |
| **CFG_02** | C1 | Validation giờ logic | **1.** Nhập Giờ mở: 20h, Giờ đóng: 9h<br>**2.** Lưu | **Giờ mở**: 20:00<br>**Giờ đóng**: 09:00 | **✓** Lỗi validation: "Giờ đóng phải sau giờ mở"<br>**✓** Form không submit được<br>**✓** Highlight field lỗi | **Pass** ✅ |
| **CFG_03** | C2 | Thêm ngày nghỉ lễ | **1.** Chọn ngày 01/01/2026<br>**2.** Loại: "Nghỉ lễ"<br>**3.** Lý do: "Tết Dương lịch"<br>**4.** Lưu | **Ngày**: 01/01/2026<br>**Loại**: Public Holiday<br>**Lý do**: "Tết Dương lịch" | **✓** Ngày được đánh dấu CLOSED<br>**✓** Không thể đặt lịch vào ngày này<br>**✓** Calendar UI hiển thị ngày nghỉ<br>**✓** Message: "Spa đóng cửa vào ngày này" | **Pass** ✅ |
| **CFG_04** | C2 | Cảnh báo xung đột booking | **1.** Đánh dấu ngày mai nghỉ<br>**2.** Đã có 5 bookings ngày mai | **Ngày**: Ngày mai<br>**Bookings hiện có**: 5 | **✓** Popup cảnh báo: "⚠️ 5 lịch hẹn bị ảnh hưởng"<br>**✓** Hiển thị danh sách bookings<br>**✓** Yêu cầu xác nhận: "Bạn có muốn tiếp tục?"<br>**✓** Nếu xác nhận → Tạo task thủ công | **Pass** ✅ |

---

## Kết luận

**Tổng số test cases**: 4
**Tỷ lệ Pass**: 4/4 (100%)

**Đánh giá**:
- ✅ Cập nhật giờ hoạt động thành công, ảnh hưởng đến availability (CFG_01)
- ✅ Validation logic giờ mở/đóng hoạt động đúng (CFG_02)
- ✅ Thêm ngày nghỉ lễ thành công, block booking (CFG_03)
- ✅ Cảnh báo conflict khi đánh dấu nghỉ vào ngày có booking (CFG_04)

**Business Impact**:
- Đảm bảo khách hàng không đặt được lịch ngoài giờ hoạt động
- Ngăn chặn tình trạng đặt lịch vào ngày nghỉ lễ
- Quản lý proactive conflicts khi thay đổi lịch

**Traceability**:
- **UC Spec**:
  - C1: Không có bảng riêng (gộp trong quản lý cấu hình)
  - C2: Không có bảng riêng
- **Activity Diagram**: Biểu đồ 3.47 (Cấu hình thời gian hoạt động spa)
- **Sequence Diagram**:
  - Biểu đồ 3.81 (Cấu hình thời gian hoạt động spa)
  - Biểu đồ 3.82 (Quản lý ngày nghỉ lễ)
- **Test Case**: Bảng 4.34 ✅ (Bổ sung)

**Kết luận**: Chức năng cấu hình thời gian hoạt động đã được kiểm chứng đầy đủ, đảm bảo business rules được enforce chính xác.

---

**Vị trí chèn vào khóa luận**: Chương 4, Section 4.3.2.5 (Kiểm thử chức năng Quản trị viên - Phân hệ C)
