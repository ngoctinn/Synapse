# BẢNG 4.12 (CẬP NHẬT) - KIỂM THỬ XEM VÀ THEO DÕI LIỆU TRÌNH (B1.7)

**Use Cases liên quan**:
- **B1.7** - Theo dõi tiến độ liệu trình (Bổ sung)
- Xem danh sách liệu trình (Đã có)

**Cập nhật**: Đổi tên bảng và bổ sung 2 test cases để cover rõ ràng UC B1.7

---

## Đổi tên Bảng 4.12

**Từ**: "Bảng 4.12 - Kiểm thử chức năng Xem danh sách và chi tiết liệu trình"
**Thành**: "Bảng 4.12 - Kiểm thử chức năng Xem và Theo dõi liệu trình (B1.7)"

---

## Bổ sung 2 Test Cases vào Bảng 4.12

**Vị trí chèn**: Sau các test cases hiện có (CTLT_XX)

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-----------|----------|----------------|-----------------|------------------|---------|
| **TDLT_01** | Xem tiến độ chính xác | **1.** Lễ tân đăng nhập<br>**2.** Vào "Quản lý liệu trình"<br>**3.** Chọn khách hàng<br>**4.** Xem chi tiết liệu trình | **Treatment**: 10 buổi<br>**Đã sử dụng**: 7 buổi | **✓** Hiển thị: "7/10 buổi đã sử dụng"<br>**✓** Progress bar: 70%<br>**✓** Còn lại: 3 buổi<br>**✓** Lịch sử sử dụng hiển thị đầy đủ | **Pass** ✅ |
| **TDLT_02** | Cảnh báo sắp hết buổi | **1.** Lễ tân xem liệu trình<br>**2.** Kiểm tra liệu trình sắp hết | **Treatment**: 10 buổi<br>**Đã sử dụng**: 9 buổi | **✓** Badge cảnh báo: "⚠️ Còn 1 buổi"<br>**✓** Hiển thị màu vàng/cam<br>**✓** Gợi ý: "Khách hàng có thể muốn gia hạn" | **Pass** ✅ |

---

## Giải thích cập nhật

**Vấn đề trước đây**:
- Bảng 4.12 chỉ test "Xem danh sách liệu trình" (CTLT_XX)
- **Không rõ ràng** có cover UC B1.7 (Theo dõi tiến độ) hay không

**Giải pháp**:
1. **Đổi tên bảng** để phản ánh đúng scope: "Xem **và Theo dõi** liệu trình"
2. **Bổ sung 2 TCs** explicitly test việc tracking progress:
   - **TDLT_01**: Verify số buổi đã dùng/còn lại tính chính xác
   - **TDLT_02**: Verify hệ thống cảnh báo khi sắp hết buổi

**Kết quả**:
- UC B1.7 giờ có test coverage rõ ràng ✅
- Traceability được cải thiện
- Business logic quan trọng (progress tracking) được kiểm chứng

---

## Traceability cho B1.7

| Artefact | Trạng thái | Vị trí |
|----------|------------|--------|
| ✅ **UC Specification** | Đã có | Không liệt kê riêng (gộp trong quản lý liệu trình) |
| ✅ **UC Diagram** | Đã có | Biểu đồ 3.4 (Lễ tân) |
| ❌ **Activity Diagram** | Thiếu | (Acceptable - query function) |
| ✅ **Sequence Diagram** | Đã có | Biểu đồ 3.74 (Theo dõi tiến độ liệu trình) |
| ✅ **Test Case** | Đã bổ sung | Bảng 4.12 (cập nhật) ✅ |

**Kết luận**: UC B1.7 đã có đủ test coverage với 2 TCs bổ sung vào Bảng 4.12.

---

**Vị trí cập nhật**: Chương 4, Bảng 4.12 (Kiểm thử chức năng Khách hàng/Lễ tân)
