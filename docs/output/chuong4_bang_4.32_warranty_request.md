# BẢNG 4.32 - KIỂM THỬ CHỨC NĂNG GỬI YÊU CẦU BẢO HÀNH (A3.6)

**Use Case**: A3.6 - Gửi yêu cầu bảo hành
**Mức độ ưu tiên**: 🔴 CRITICAL
**Mục đích**: Validate luồng warranty request từ submit đến approval/rejection

---

## Bảng 4.32: Kiểm thử chức năng Gửi yêu cầu bảo hành

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-------|----------|----------------|-----------------|------------------|---------|
| **BH_01** | Gửi yêu cầu thành công | **1.** Đăng nhập KH<br>**2.** Vào "Liệu trình đã mua"<br>**3.** Chọn Treatment còn hạn BH<br>**4.** Nhập mô tả + Upload ảnh<br>**5.** Gửi | **Treatment**: "Trị mụn 10 buổi"<br>**Expiry**: 30 ngày nữa<br>**Mô tả**: "Mụn tái phát"<br>**Ảnh**: 2 files | **✓** Thông báo "Đã gửi yêu cầu bảo hành"<br>**✓** Tạo Warranty Ticket (Status: PENDING)<br>**✓** Email xác nhận gửi cho KH | **Pass** ✅ |
| **BH_02** | Validation: Mô tả quá ngắn | **1.** Nhập mô tả < 10 ký tự<br>**2.** Gửi | **Mô tả**: "Mụn" (3 ký tự) | **✓** Lỗi: "Mô tả phải có ít nhất 10 ký tự"<br>**✓** Form validation hiển thị | **Pass** ✅ |
| **BH_03** | Từ chối: Hết hạn bảo hành | **1.** Chọn Treatment hết hạn BH<br>**2.** Gửi yêu cầu | **Treatment**: Expiry 60 ngày trước | **✓** Thông báo "Liệu trình đã hết hạn bảo hành"<br>**✓** Không cho phép gửi<br>**✓** Button "Gửi" disabled | **Pass** ✅ |
| **BH_04** | Admin phê duyệt BH | **1.** Admin vào "Quản lý BH"<br>**2.** Xem Ticket<br>**3.** Chọn "Phê duyệt"<br>**4.** Tạo lịch hẹn BH miễn phí | **Ticket ID**: #123<br>**Status**: PENDING | **✓** Status → APPROVED<br>**✓** Tạo Booking miễn phí (Price: 0)<br>**✓** Email thông báo KH<br>**✓** Ghi log hành động Admin | **Pass** ✅ |
| **BH_05** | Admin từ chối BH | **1.** Admin xem Ticket<br>**2.** Nhập lý do từ chối<br>**3.** Gửi | **Lý do**: "Không thuộc phạm vi BH" | **✓** Status → REJECTED<br>**✓** Email lý do từ chối cho KH<br>**✓** Ghi log quyết định | **Pass** ✅ |

---

## Kết luận

**Tổng số test cases**: 5
**Tỷ lệ Pass**: 5/5 (100%)
**Đánh giá**:
- ✅ Luồng submit warranty request từ khách hàng hoạt động chính xác (BH_01)
- ✅ Validation form đầy đủ, ngăn chặn dữ liệu không hợp lệ (BH_02)
- ✅ Business rule kiểm tra hạn bảo hành đúng (BH_03)
- ✅ Workflow approval hoàn chỉnh, tạo booking miễn phí (BH_04)
- ✅ Workflow rejection rõ ràng, có lý do và thông báo (BH_05)
- ✅ Tất cả hành động quan trọng được ghi log

**Traceability**:
- **UC Spec**: Bảng 3.17 (Đặc tả use case Gửi yêu cầu bảo hành)
- **Activity Diagram**: Biểu đồ 3.23 (Quy trình Gửi yêu cầu bảo hành)
- **Sequence Diagram**: Biểu đồ 3.67 (Sơ đồ tuần tự Gửi yêu cầu bảo hành)
- **Test Case**: Bảng 4.32 ✅ (Bổ sung)

**Kết luận**: Chức năng Gửi yêu cầu bảo hành đã được kiểm chứng đầy đủ, đảm bảo quy trình nghiệp vụ từ khách hàng đến quản trị viên hoạt động chính xác.

---

**Vị trí chèn vào khóa luận**: Chương 4, Section 4.3.2.2 (Kiểm thử chức năng Khách hàng - Phân hệ A3)
