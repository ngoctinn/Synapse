# BẢNG 4.31 - KIỂM THỬ CHỨC NĂNG TÁI LẬP LỊCH TỰ ĐỘNG (B1.8)

**Use Case**: B1.8 - Tái lập lịch tự động khi có sự cố
**Mức độ ưu tiên**: 🔴 CRITICAL
**Mục đích**: Chứng minh thuật toán Reschedule Solver hoạt động đúng qua test case cụ thể

---

## Bảng 4.31: Kiểm thử chức năng Tái lập lịch tự động

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-------|----------|----------------|-----------------|------------------|---------|
| **RS_01** | Reschedule thành công khi KTV nghỉ | **1.** Admin đánh dấu KTV A nghỉ đột xuất ngày mai<br>**2.** Hệ thống quét lịch bị ảnh hưởng<br>**3.** Tìm KTV B cùng skill | **KTV A**: Skilled "Massage"<br>**KTV B**: Skilled "Massage"<br>**Booking**: 10:00 ngày mai | **✓** Booking tự động chuyển sang KTV B<br>**✓** Gửi SMS thông báo khách hàng<br>**✓** Trạng thái: RESCHEDULED | **Pass** ✅ |
| **RS_02** | Không tìm được KTV thay thế | **1.** Admin đánh dấu KTV A nghỉ<br>**2.** Hệ thống quét<br>**3.** Không có KTV nào cùng skill | **KTV A**: Skilled "Laser"<br>Không KTV nào khác có "Laser" | **✓** Đánh dấu Booking là CRITICAL<br>**✓** Thông báo Lễ tân xử lý thủ công<br>**✓** Email cảnh báo Admin | **Pass** ✅ |
| **RS_03** | Dời giờ do tài nguyên bảo trì | **1.** Admin set Phòng VIP 1 bảo trì 9h-12h<br>**2.** Booking 10h sử dụng Phòng VIP 1<br>**3.** Hệ thống tìm khung giờ khác | **Booking**: 10:00, cần Phòng VIP<br>**Phòng VIP 1**: Maintenance 9-12h<br>**Phòng VIP 2**: Available | **✓** Booking dời sang 14:00 cùng ngày (Phòng VIP 2)<br>**✓** SMS thông báo khách hàng<br>**✓** Lý do: "Bảo trì tài nguyên" | **Pass** ✅ |
| **RS_04** | Xung đột phức tạp không tự động được | **1.** KTV A nghỉ<br>**2.** Nhiều Booking bị ảnh hưởng<br>**3.** Không đủ tài nguyên thay thế | **5 Bookings** cùng lúc<br>Chỉ **2 KTV** còn lại | **✓** Đánh dấu tất cả 5 Bookings là CRITICAL<br>**✓** Gửi danh sách cho Lễ tân<br>**✓** Yêu cầu xử lý thủ công | **Pass** ✅ |

---

## Kết luận

**Tổng số test cases**: 4
**Tỷ lệ Pass**: 4/4 (100%)
**Đánh giá**:
- ✅ Thuật toán Reschedule Solver hoạt động chính xác trong cả 4 scenarios
- ✅ Xử lý đúng trường hợp reschedule thành công (RS_01)
- ✅ Xử lý đúng trường hợp không tìm được thay thế (RS_02)
- ✅ Xử lý đúng trường hợp dời giờ do bảo trì tài nguyên (RS_03)
- ✅ Xử lý đúng trường hợp xung đột phức tạp, fallback về xử lý thủ công (RS_04)

**Kết luận**: Chức năng Tái lập lịch tự động đã được kiểm chứng đầy đủ, đáp ứng yêu cầu nghiệp vụ và đảm bảo tính toàn vẹn dữ liệu.

---

**Vị trí chèn vào khóa luận**: Chương 4, Section 4.3.2.3 (Kiểm thử chức năng Lễ tân - Phân hệ B1)
