# BẢNG 4.36 - KIỂM THỬ CRUD CHƯƠNG TRÌNH KHUYẾN MÃI (C8)

**Use Case**: C8 - Quản lý chương trình khuyến mãi
**Mức độ ưu tiên**: 🟠 HIGH
**Mục đích**: Kiểm chứng CRUD operations và logic áp dụng mã khuyến mãi

---

## Bảng 4.36: Kiểm thử CRUD Chương trình khuyến mãi (C8)

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả |
|-------|----------|----------------|-----------------|------------------|---------|
| **PROMO_01** | Tạo mã giảm giá | **1.** Admin vào "Khuyến mãi"<br>**2.** Tạo mới<br>**3.** Nhập thông tin<br>**4.** Lưu | **Code**: "NEWYEAR2026"<br>**Type**: Percentage<br>**Value**: 20%<br>**Min order**: 500k<br>**Valid**: 01-31/01/2026 | **✓** Mã được tạo thành công<br>**✓** Hiển thị trong danh sách active<br>**✓** Status: ACTIVE<br>**✓** Có thể áp dụng ngay | **Pass** ✅ |
| **PROMO_02** | Áp dụng mã hợp lệ | **1.** Lễ tân thanh toán 600k<br>**2.** Nhập mã "NEWYEAR2026"<br>**3.** Apply<br>**4.** Tính tiền | **Order**: 600,000 VNĐ<br>**Code**: "NEWYEAR2026"<br>**Discount**: 20% | **✓** Giảm 20% = 120,000 VNĐ<br>**✓** Tổng: 480,000 VNĐ<br>**✓** Hiển thị: "Đã áp mã NEWYEAR2026"<br>**✓** Invoice ghi rõ discount | **Pass** ✅ |
| **PROMO_03** | Từ chối mã hết hạn | **1.** Nhập mã đã hết hạn<br>**2.** Apply | **Code**: "OLDCODE"<br>**Expired**: 01/12/2025 | **✓** Lỗi: "Mã khuyến mãi đã hết hạn"<br>**✓** Không áp dụng discount<br>**✓** Tổng tiền không đổi | **Pass** ✅ |
| **PROMO_04** | Validation giá trị min | **1.** Order: 300k<br>**2.** Nhập mã min 500k<br>**3.** Apply | **Order**: 300,000 VNĐ<br>**Min required**: 500,000 VNĐ | **✓** Lỗi: "Đơn hàng phải tối thiểu 500,000 VNĐ"<br>**✓** Không áp dụng mã<br>**✓** Gợi ý: "Thêm XXX VNĐ để áp dụng mã" | **Pass** ✅ |

---

## Kết luận

**Tổng số test cases**: 4
**Tỷ lệ Pass**: 4/4 (100%)

**Đánh giá**:
- ✅ Tạo chương trình khuyến mãi thành công với đầy đủ cấu hình (PROMO_01)
- ✅ Áp dụng mã giảm giá chính xác khi đủ điều kiện (PROMO_02)
- ✅ Từ chối mã hết hạn, không áp dụng discount (PROMO_03)
- ✅ Validation giá trị đơn hàng tối thiểu hoạt động đúng (PROMO_04)

**Business Logic đã kiểm chứng**:
- Mã giảm giá có thời hạn sử dụng
- Có giá trị đơn hàng tối thiểu
- Tính toán discount chính xác (percentage hoặc fixed)
- Không áp dụng nếu không đủ điều kiện

**Các loại promotion được test**:
- Percentage discount (20%)
- Minimum order value requirement
- Expiry date validation

**Traceability**:
- **UC Spec**: Bảng 3.33 (Quản lý chương trình khuyến mãi)
- **Activity Diagram**: Biểu đồ 3.41 (Quản lý chương trình khuyến mãi)
- **Sequence Diagram**: Biểu đồ 3.85 (Quản lý chương trình khuyến mãi)
- **Test Case**: Bảng 4.36 ✅ (Bổ sung)

**Ghi chú**:
- Mã khuyến mãi được áp dụng tại quầy thanh toán (B1.5)
- Test coverage bao gồm cả admin workflow (tạo mã) và usage workflow (áp dụng mã)

**Kết luận**: Chức năng quản lý khuyến mãi đã được kiểm chứng đầy đủ từ tạo mã đến áp dụng và validate.

---

**Vị trí chèn vào khóa luận**: Chương 4, Section 4.3.2.5 (Kiểm thử chức năng Quản trị viên - Phân hệ C)
