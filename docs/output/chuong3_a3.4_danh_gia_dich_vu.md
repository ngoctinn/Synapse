# BỔ SUNG CHƯƠNG 3 - USE CASE A3.4: ĐÁNH GIÁ DỊCH VỤ

---

## BẢNG 3.XX - ĐẶC TẢ USE CASE ĐÁNH GIÁ DỊCH VỤ

**Vị trí chèn**: Sau Bảng 3.14 (Nhận thông báo), trước Bảng 3.15 (Tích lũy và đổi điểm thưởng)

| Thuộc tính | Nội dung |
|------------|----------|
| **Mã chức năng** | A3.4 |
| **Tên chức năng** | Đánh giá dịch vụ |
| **Mô tả** | Khách hàng đánh giá chất lượng dịch vụ sau khi sử dụng để cải thiện trải nghiệm và hỗ trợ quy trình cải tiến chất lượng. |
| **Tác nhân** | Khách hàng |
| **Mức độ ưu tiên** | Trung bình |
| **Sự kiện kích hoạt** | Khách hàng yêu cầu đánh giá một lịch hẹn đã hoàn thành. |
| **Tiền điều kiện** | - Khách hàng đã đăng nhập vào hệ thống<br>- Có ít nhất một lịch hẹn ở trạng thái "Hoàn thành" |
| **Hậu điều kiện** | - Đánh giá của khách hàng được lưu lại trong hệ thống<br>- Điểm trung bình của dịch vụ được cập nhật<br>- Thông báo cảm ơn được gửi cho khách hàng |

### Luồng sự kiện chính

| Bước | Thực hiện bởi | Hành động |
|------|---------------|-----------|
| 1 | Khách hàng | Chọn lịch hẹn đã hoàn thành cần đánh giá |
| 2 | Hệ thống | Kiểm tra điều kiện đánh giá (chưa đánh giá trước đó) |
| 3 | Khách hàng | Chọn số sao (1-5) và nhập nhận xét (optional) |
| 4 | Hệ thống | Lưu đánh giá vào cơ sở dữ liệu |
| 5 | Hệ thống | Cập nhật điểm trung bình (average rating) của dịch vụ |
| 6 | Hệ thống | Gửi thông báo cảm ơn cho khách hàng |

### Luồng sự kiện ngoại lệ

**Ngoại lệ 1: Lịch hẹn đã được đánh giá (Bước 2a)**

| Bước | Thực hiện bởi | Hành động |
|------|---------------|-----------|
| 2a.1 | Hệ thống | Phát hiện lịch hẹn này đã có đánh giá từ trước |
| 2a.2 | Hệ thống | Hiển thị thông báo "Bạn đã đánh giá lịch hẹn này" và không cho phép đánh giá lại |

**Ngoại lệ 2: Thông tin đánh giá không hợp lệ (Bước 3a)**

| Bước | Thực hiện bởi | Hành động |
|------|---------------|-----------|
| 3a.1 | Hệ thống | Phát hiện thông tin đánh giá không hợp lệ (ví dụ: chưa chọn số sao) |
| 3a.2 | Hệ thống | Hiển thị thông báo lỗi chi tiết: "Vui lòng chọn số sao để đánh giá" |

### Quy tắc nghiệp vụ

1. Mỗi lịch hẹn chỉ được đánh giá **một lần duy nhất**
2. Số sao bắt buộc phải chọn (từ 1 đến 5 sao)
3. Nhận xét văn bản là **không bắt buộc** (optional)
4. Chỉ có thể đánh giá các lịch hẹn đã hoàn thành (status = COMPLETED)

---

## BIỂU ĐỒ 3.XX - SƠ ĐỒ HOẠT ĐỘNG ĐÁNH GIÁ DỊCH VỤ

**Vị trí chèn**: Section 3.6.2 (Sơ đồ hoạt động cho khách hàng), sau Biểu đồ 3.19 (Hủy lịch hẹn)

### Mô tả Activity Diagram

```
[Khách hàng] Bắt đầu
    ↓
[Khách hàng] Chọn lịch hẹn "Hoàn thành"
    ↓
[Hệ thống] Kiểm tra: Đã đánh giá chưa?
    ├── [Đã đánh giá] → Thông báo lỗi → [Kết thúc]
    └── [Chưa đánh giá] → Hiển thị form đánh giá
            ↓
[Khách hàng] Chọn rating 1-5 sao + Nhập nhận xét (optional)
    ↓
[Hệ thống] Validate: Đã chọn sao?
    ├── [Chưa chọn] → Hiển thị lỗi validation → Quay lại form
    └── [Đã chọn] → Lưu đánh giá
            ↓
[Hệ thống] Cập nhật avg_rating của Service
    ↓
[Hệ thống] Gửi thông báo cảm ơn
    ↓
[Kết thúc]
```

**Ghi chú thiết kế**:
- Activity Diagram sử dụng swimlanes để phân biệt hành động của Khách hàng và Hệ thống
- Guard conditions rõ ràng tại các decision points
- Luồng ngoại lệ được xử lý đúng chuẩn UML

---

## CẬP NHẬT USE CASE DIAGRAM

**Yêu cầu**: Thêm use case **A3.4 (Đánh giá dịch vụ)** vào **Biểu đồ 3.3 - Sơ đồ phân rã use case cho khách hàng**

**Vị trí**: Trong nhóm **"Quản lý cá nhân"** (A3.x), giữa:
- A3.3 (Nhận thông báo nhắc lịch)
- A3.5 (Tích lũy và đổi điểm thưởng)

**Quan hệ**:
- Actor: **Khách hàng**
- Dependency: Extend từ A3.1 (Xem lịch sử đặt lịch) - do khách hàng thường đánh giá từ trang lịch sử

---

## TRACEABILITY HOÀN CHỈNH CHO A3.4

Sau khi bổ sung, Use Case A3.4 đạt đầy đủ 5 artefacts:

| Artefact | Trạng thái | Vị trí |
|----------|------------|--------|
| ✅ **UC Specification** | Đã bổ sung | Bảng 3.XX (sau Bảng 3.14) |
| ✅ **UC Diagram** | Đã bổ sung | Biểu đồ 3.3 (cập nhật) |
| ✅ **Activity Diagram** | Đã bổ sung | Biểu đồ 3.XX (Section 3.6.2) |
| ✅ **Sequence Diagram** | Đã có sẵn | Biểu đồ 3.66 (Đánh giá dịch vụ) |
| ✅ **Test Case** | Đã có sẵn | Bảng 4.16 (Kiểm thử Đánh giá dịch vụ) |

**Kết luận**: Logic inconsistency đã được giải quyết hoàn toàn. Use Case A3.4 chính thức được đưa vào scope của khóa luận với đầy đủ tài liệu thiết kế và kiểm thử.

---

## XÓA KHỎI PHỤ LỤC

**Hành động bắt buộc**: Xóa A3.4 khỏi phần "Phụ lục: Hướng phát triển" để tránh mâu thuẫn.

**Lý do**: Use case này đã được implement và test đầy đủ, không còn là "future work" nữa.
