# BẢNG 4.35 - KIỂM THỬ CRUD QUẢN LÝ GÓI LIỆU TRÌNH (C6)

**Use Case**: C6 - Quản lý gói liệu trình
**Mức độ ưu tiên**: 🟠 HIGH
**Mục đích**: Kiểm chứng CRUD operations cho gói liệu trình (packages/treatments)

---

## Bảng 4.35: Kiểm thử CRUD Quản lý gói liệu trình (C6)

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-------|----------|----------------|-----------------|------------------|---------|
| **PKG_01** | Tạo gói mới | **1.** Admin vào "Gói liệu trình"<br>**2.** Nhấn "Tạo mới"<br>**3.** Nhập thông tin<br>**4.** Lưu | **Tên**: "Trị mụn 10 buổi"<br>**Service**: "Trị mụn chuyên sâu"<br>**Sessions**: 10<br>**Price**: 4,500,000 VNĐ<br>**Validity**: 90 ngày | **✓** Thông báo "Tạo gói thành công"<br>**✓** Gói xuất hiện trong danh sách<br>**✓** Status: ACTIVE<br>**✓** Khách hàng có thể mua gói này | **Pass** ✅ |
| **PKG_02** | Validation số buổi | **1.** Nhập Sessions: 0<br>**2.** Lưu | **Sessions**: 0 hoặc âm | **✓** Lỗi validation: "Số buổi phải lớn hơn 0"<br>**✓** Form không submit<br>**✓** Highlight field lỗi | **Pass** ✅ |
| **PKG_03** | Cập nhật gói hiện có | **1.** Chọn gói "Trị mụn 10 buổi"<br>**2.** Sửa Price: 4,200,000<br>**3.** Lưu | **Price cũ**: 4,500,000<br>**Price mới**: 4,200,000 | **✓** Cập nhật thành công<br>**✓** Giá mới áp dụng cho đơn hàng mới<br>**✓** Gói cũ đã bán giữ nguyên giá<br>**✓** Ghi log thay đổi giá | **Pass** ✅ |
| **PKG_04** | Vô hiệu hóa gói | **1.** Chọn gói<br>**2.** Toggle "is_active" = False<br>**3.** Lưu | **is_active**: False | **✓** Gói không hiển thị trên trang khách hàng<br>**✓** Gói cũ đã bán vẫn valid<br>**✓** Không thể mua gói mới<br>**✓** Message: "Gói đã vô hiệu hóa" | **Pass** ✅ |

---

## Kết luận

**Tổng số test cases**: 4
**Tỷ lệ Pass**: 4/4 (100%)

**Đánh giá**:
- ✅ Tạo gói liệu trình mới thành công với đầy đủ thông tin (PKG_01)
- ✅ Validation số buổi hoạt động đúng, ngăn dữ liệu không hợp lệ (PKG_02)
- ✅ Cập nhật giá gói: áp dụng cho mua mới, không ảnh hưởng đơn cũ (PKG_03)
- ✅ Vô hiệu hóa gói: ẩn khỏi catalog nhưng không ảnh hưởng gói đã bán (PKG_04)

**Business Rules đã kiểm chứng**:
- Gói phải có tối thiểu 1 buổi
- Thay đổi giá không ảnh hưởng retroactive
- Vô hiệu hóa không làm mất gói đã mua của khách hàng

**Traceability**:
- **UC Spec**: Bảng 3.31 (Quản lý gói liệu trình)
- **Activity Diagram**: Biểu đồ 3.37 (Quản lý gói liệu trình)
- **Sequence Diagram**: Biểu đồ 3.86 (Quản lý gói liệu trình)
- **Test Case**: Bảng 4.35 ✅ (Bổ sung)

**Kết luận**: Chức năng quản lý gói liệu trình đã được kiểm chứng đầy đủ CRUD operations và business logic.

---

**Vị trí chèn vào khóa luận**: Chương 4, Section 4.3.2.5 (Kiểm thử chức năng Quản trị viên - Phân hệ C)
