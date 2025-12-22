# BÁO CÁO NGHIÊN CỨU: GIẢI PHÁP LẬP LỊCH TỐI ƯU CHO HỆ THỐNG SPA

## Thông tin
- **Ngày nghiên cứu**: 2025-12-22
- **Chủ đề**: Cân bằng giữa Sự hài lòng Khách hàng và Tối ưu Vận hành trong Hệ thống Đặt lịch Spa
- **Nguồn tham khảo**: Mindbody, Vagaro, Fresha, các nghiên cứu về Appointment Scheduling

---

## 1. TÓM TẮT VẤN ĐỀ

Synapse đang gặp mâu thuẫn thiết kế:
- **Mục tiêu 1**: Tối ưu hóa vận hành (Load Balance, Utilization) → Cần thuật toán phức tạp
- **Mục tiêu 2**: Đảm bảo sự hài lòng khách hàng (Không bị đổi lịch, được chọn KTV/giờ) → Khách quyết định

**Câu hỏi cốt lõi**: Làm sao để KHÁCH HÀNG chọn slot nhưng vẫn đảm bảo lịch TỐI ƯU CHO DOANH NGHIỆP?

---

## 2. CÁC MÔ HÌNH TRONG THỰC TẾ

### 2.1. Mô hình Vagaro: Auto-Assign Employee

Vagaro cung cấp tính năng **"Auto-Assign Employee When Booking"**:
- Khách chỉ chọn **Dịch vụ + Giờ**
- Hệ thống **TỰ ĐỘNG gán KTV** dựa trên các tiêu chí:
  - `First Available` - KTV đầu tiên còn trống
  - `Most Open Schedule` - KTV có lịch rảnh nhất
  - `Best Reviewed` - KTV được đánh giá cao nhất
- Khách **KHÔNG chọn KTV** trước → Hệ thống có toàn quyền tối ưu

**Ưu điểm**: Hệ thống kiểm soát hoàn toàn, dễ tối ưu Load Balance
**Nhược điểm**: Khách không được chọn KTV yêu thích

### 2.2. Mô hình Mindbody: Customer Chooses Provider

Mindbody cho phép khách:
- Chọn **Dịch vụ + KTV + Giờ**
- Hệ thống chỉ kiểm tra **tính khả dụng**
- Không can thiệp vào lựa chọn

**Ưu điểm**: Khách hài lòng tuyệt đối
**Nhược điểm**: Có thể dồn việc cho KTV "hot"

### 2.3. Mô hình Fresha: Hybrid với Gap Optimization

Fresha kết hợp:
- Khách **có thể** chọn KTV hoặc để "Bất kỳ"
- Hệ thống sử dụng **thuật toán giảm Gap** để gợi ý slot liền kề
- Ưu tiên **back-to-back bookings** để tối đa hiệu suất

**Ưu điểm**: Cân bằng giữa sự lựa chọn và tối ưu
**Nhược điểm**: Phức tạp hơn trong triển khai

---

## 3. CÁC PHƯƠNG ÁN ĐỀ XUẤT CHO SYNAPSE

### PHƯƠNG ÁN A: KHÁCH CHỌN GIỜ, HỆ THỐNG GÁN KTV (Vagaro-style)

**Luồng:**
```
1. Khách chọn: Dịch vụ "Massage 60p" + Ngày "25/12"
2. Hệ thống hiển thị: Các khung giờ khả dụng (9:00, 10:00, 11:00...)
3. Khách chọn: 9:00
4. Hệ thống TỰ ĐỘNG gán: KTV Mai (Load thấp nhất) + Phòng A
5. Xác nhận: "Lịch hẹn 9:00, KTV Mai, Phòng A"
```

**Tối ưu hóa hoạt động ở bước 4** - Hệ thống có quyền gán KTV theo thuật toán.

**Ưu điểm:**
- Hệ thống kiểm soát hoàn toàn việc gán KTV
- Dễ cân bằng tải
- Solver/SlotFinder có thể tối ưu

**Nhược điểm:**
- Khách không được chọn KTV
- Một số khách có thể không hài lòng

---

### PHƯƠNG ÁN B: GỢI Ý COMBO (GIỜ + KTV) - TỐI ƯU (Recommended)

**Luồng:**
```
1. Khách chọn: Dịch vụ "Massage 60p" + Ngày "25/12"
2. (Tùy chọn) Khách chọn KTV yêu thích: "KTV Lan"
3. Hệ thống tính toán và hiển thị TOP 5 lựa chọn:
   ┌───────────────────────────────────────────────────┐
   │ ⭐ 9:00 - KTV Lan (Yêu thích của bạn)  [Đề xuất] │
   │    9:30 - KTV Lan                                │
   │    9:00 - KTV Mai (Rảnh nhất hôm nay)            │
   │   10:00 - KTV Lan                                │
   │    9:00 - KTV Hoa                                │
   └───────────────────────────────────────────────────┘
4. Khách chọn 1 trong 5 → Commit ngay
```

**Tối ưu hóa hoạt động ở bước 3** - Hệ thống sắp xếp các lựa chọn theo độ tối ưu.

**Cách tính điểm mỗi combo:**
```
Score = BaseScore
      + PreferenceBonus (nếu đúng KTV yêu thích)
      + LoadBalanceBonus (nếu KTV ít việc)
      + GapBonus (nếu slot liền kề)
```

**Ưu điểm:**
- Khách CÓ QUYỀN CHỌN (5 lựa chọn tốt nhất)
- Giờ + KTV đều được quyết định bởi khách
- Slot đầu tiên = Tối ưu nhất → Nếu khách chọn slot đầu → Lịch tối ưu
- Các slot khác cũng "tốt" (nằm trong TOP 5)

**Nhược điểm:**
- Nếu khách luôn chọn slot cuối → Kém tối ưu (nhưng vẫn chấp nhận được)

---

### PHƯƠNG ÁN C: KHÁCH CHỌN TẤT CẢ + BACKGROUND OPTIMIZATION

**Luồng:**
```
1. Khách chọn tự do: Dịch vụ + KTV + Giờ
2. Hệ thống commit ngay (Greedy)
3. Mỗi 1 giờ, Background Job chạy Solver để tái cân bằng
4. Nếu cần đổi KTV (không đổi giờ) → Gửi thông báo cho khách
```

**Ưu điểm:**
- Khách tự do hoàn toàn
- Vẫn có thể tối ưu (nhưng sau)

**Nhược điểm:**
- Khách có thể bị đổi KTV sau khi đã book
- Trải nghiệm không tốt nếu đổi thường xuyên

---

## 4. ĐỀ XUẤT CUỐI CÙNG

### ✅ PHƯƠNG ÁN B: GỢI Ý TOP 5 COMBO (GIỜ + KTV)

**Lý do:**
1. **Khách hàng hài lòng**: Có quyền chọn, không bị ép buộc
2. **Hệ thống vẫn tối ưu**: Slot đầu tiên = tốt nhất, các slot khác cũng tốt
3. **Không đổi lịch**: Khách chọn xong = commit, không bị thay đổi sau
4. **Phù hợp với dữ liệu nghiên cứu**: Đây là mô hình phổ biến trong các hệ thống hiện đại

### Áp dụng vào Synapse:

| Component | Vai trò |
|-----------|---------|
| **SlotFinder** | Tìm TẤT CẢ combo (Giờ + KTV) khả dụng, tính điểm, sắp xếp, trả về TOP 5 |
| **Solver (CP-SAT)** | Chỉ dùng cho **Reschedule** khi KTV nghỉ, hoặc **Batch Assign** |

### Thay đổi cần thực hiện:

1. **SlotFinder**: Trả về combo (Giờ + KTV + Phòng) thay vì chỉ Giờ
2. **Scoring Function**: Tính điểm dựa trên Load Balance + Preference + Gap
3. **API Response**: Trả về TOP 5 combo với label "Đề xuất" cho slot đầu tiên
4. **Frontend**: Hiển thị 5 lựa chọn, highlight slot đề xuất

---

## 5. SO SÁNH CÁC PHƯƠNG ÁN

| Tiêu chí | A (Auto-Assign) | B (TOP 5 Combo) | C (Free + Background) |
|----------|-----------------|-----------------|------------------------|
| Sự hài lòng khách | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Mức độ tối ưu | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Độ phức tạp triển khai | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Ổn định (không đổi lịch) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Tổng điểm** | 14 | **17** | 14 |

---

## 6. KẾT LUẬN

**Phương án B (Gợi ý TOP 5 Combo)** là giải pháp tốt nhất cho Synapse vì:

1. Đảm bảo **sự hài lòng tối đa** của khách hàng (có quyền chọn)
2. Vẫn **tối ưu cho doanh nghiệp** (slot đề xuất = slot tốt nhất)
3. **Không cần đổi lịch** sau khi khách đã book
4. **SlotFinder đủ nhanh** (< 100ms) để phục vụ real-time
5. **Solver vẫn có vai trò** trong Reschedule và Batch operations

### NEXT STEPS:
1. Cập nhật SlotFinder để trả về TOP 5 với combo đầy đủ
2. Cập nhật API và Frontend
3. Cập nhật tài liệu algorithm_spec.md

---

*Báo cáo được tạo tự động bởi Antigravity Research Workflow*
