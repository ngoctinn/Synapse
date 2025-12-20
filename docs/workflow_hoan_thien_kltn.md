# WORKFLOW HOÀN THIỆN KHÓA LUẬN SYNAPSE
## Dựa trên Ma trận Đối chiếu Chương 3 ↔ Chương 4

**Ngày tạo**: 21/12/2025
**Mục tiêu**: Đạt trạng thái "Traceability hoàn chỉnh – Không bị hội đồng bắt bẻ"
**Phạm vi**: Khắc phục 100% thiếu sót được xác định trong Cross-Check Matrix

---

## I. NGUYÊN TẮC HOÀN THIỆN

### 1.1. Nguyên tắc cốt lõi

1. **Không mở rộng scope**: Chỉ hoàn thiện thiếu sót đã xác định, không thêm chức năng mới
2. **Tuân thủ traceability**: Mọi UC phải có chuỗi Spec → Design → Test đầy đủ
3. **Ưu tiên theo rủi ro**: CRITICAL → HIGH → MEDIUM → LOW
4. **Consistency first**: Logic phải nhất quán giữa các artefact
5. **Academic standard**: Tuân thủ chuẩn UML và văn phong học thuật

### 1.2. Phân loại công việc

| Nhóm công việc | Mô tả | Số lượng |
|----------------|-------|----------|
| **A. Bổ sung Test Case** | UC có thiết kế đầy đủ nhưng thiếu test | 4 CRITICAL + 3 HIGH |
| **B. Điều chỉnh Scope** | UC logic không nhất quán (in/out scope) | 2 cases |
| **C. Bổ sung Activity Diagram** | UC thiếu activity (optional cho UC đơn giản) | 11 cases |
| **D. Bổ sung UC Specification** | Test case có nhưng thiếu spec | 1 case |
| **E. Rõ ràng hóa Test Coverage** | Test case không rõ ràng | 7 cases |

---

## II. WORKFLOW HOÀN THIỆN CHI TIẾT

### GIAI ĐOẠN 1: XỬ LÝ CRITICAL GAPS (BẮT BUỘC)

**Timeline**: 2-3 ngày
**Mức độ ưu tiên**: 🔴 URGENT - Phải hoàn thành trước khi nộp

---

#### **STEP 1.1: Bổ sung Test Case cho B1.8 (Tái lập lịch tự động)**

**📋 Thông tin Use Case:**
- **Mã UC**: B1.8
- **Tên**: Tái lập lịch tự động khi có sự cố
- **Hiện trạng**: ✔ UC Spec, ✔ Activity, ✔ Sequence, ❌ Test Case
- **Mức độ Critical**: 🔴 CRITICAL (Core algorithm)

**🎯 Mục tiêu:**
Chứng minh thuật toán Reschedule Solver hoạt động đúng qua test case cụ thể.

**🔧 Hành động:**

1. **Tạo Bảng 4.31 - Kiểm thử chức năng Tái lập lịch tự động**
2. **Thiết kế 4 Test Scenarios**:

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|-------|----------|----------------|-----------------|------------------|--------|
| **RS_01** | Reschedule thành công khi KTV nghỉ | 1. Admin đánh dấu KTV A nghỉ đột xuất ngày mai<br>2. Hệ thống quét lịch bị ảnh hưởng<br>3. Tìm KTV B cùng skill | KTV A: Skilled "Massage"<br>KTV B: Skilled "Massage"<br>Booking: 10:00 ngày mai | Booking tự động chuyển sang KTV B<br>Gửi SMS thông báo khách hàng<br>Trạng thái: RESCHEDULED | Pass |
| **RS_02** | Không tìm được KTV thay thế | 1. Admin đánh dấu KTV A nghỉ<br>2. Hệ thống quét<br>3. Không có KTV nào cùng skill | KTV A: Skilled "Laser"<br>Không KTV nào khác có "Laser" | Đánh dấu Booking là CRITICAL<br>Thông báo Lễ tân xử lý thủ công<br>Email cảnh báo Admin | Pass |
| **RS_03** | Dời giờ do tài nguyên bảo trì | 1. Admin set Phòng VIP 1 bảo trì 9h-12h<br>2. Booking 10h sử dụng Phòng VIP 1<br>3. Hệ thống tìm khung giờ khác | Booking: 10:00, cần Phòng VIP<br>Phòng VIP 1: Maintenance 9-12h<br>Phòng VIP 2: Available | Booking dời sang 14:00 cùng ngày (Phòng VIP 2)<br>SMS thông báo khách hàng | Pass |
| **RS_04** | Xung đột phức tạp không tự động được | 1. KTV A nghỉ<br>2. Nhiều Booking bị ảnh hưởng<br>3. Không đủ tài nguyên thay thế | 5 Bookings cùng lúc<br>Chỉ 2 KTV còn lại | Đánh dấu tất cả 5 Bookings là CRITICAL<br>Gửi danh sách cho Lễ tân<br>Yêu cầu xử lý thủ công | Pass |

3. **Chạy test thực tế trên môi trường dev**
4. **Ghi nhận kết quả vào Chương 4, Section 4.3.2.3**

**📤 Output:**
- File: `chuong4_phan_4.3.2.3_bo_sung.docx`
- Nội dung: Bảng 4.31 với 4 test cases + Screenshot kết quả

**⏱️ Estimated time**: 4-6 giờ (Thiết kế TC + Chạy test + Document)

---

#### **STEP 1.2: Bổ sung Test Case cho A3.6 (Gửi yêu cầu bảo hành)**

**📋 Thông tin Use Case:**
- **Mã UC**: A3.6
- **Tên**: Gửi yêu cầu bảo hành
- **Hiện trạng**: ✔ UC Spec, ✔ Activity, ✔ Sequence, ❌ Test Case
- **Mức độ Critical**: 🔴 CRITICAL (Business logic quan trọng)

**🎯 Mục tiêu:**
Validate luồng warranty request từ submit đến approval/rejection.

**🔧 Hành động:**

1. **Tạo Bảng 4.32 - Kiểm thử chức năng Gửi yêu cầu bảo hành**
2. **Thiết kế 5 Test Scenarios**:

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|-------|----------|----------------|-----------------|------------------|--------|
| **BH_01** | Gửi yêu cầu thành công | 1. Đăng nhập KH<br>2. Vào "Liệu trình đã mua"<br>3. Chọn Treatment còn hạn BH<br>4. Nhập mô tả + Upload ảnh<br>5. Gửi | Treatment: "Trị mụn 10 buổi"<br>Expiry: 30 ngày nữa<br>Mô tả: "Mụn tái phát"<br>Ảnh: 2 files | Thông báo "Đã gửi yêu cầu bảo hành"<br>Tạo Warranty Ticket (Status: PENDING)<br>Email xác nhận gửi cho KH | Pass |
| **BH_02** | Validation: Mô tả quá ngắn | 1. Nhập mô tả \< 10 ký tự<br>2. Gửi | Mô tả: "Mụn" (3 ký tự) | Lỗi: "Mô tả phải có ít nhất 10 ký tự" | Pass |
| **BH_03** | Từ chối: Hết hạn bảo hành | 1. Chọn Treatment hết hạn BH<br>2. Gửi yêu cầu | Treatment: Expiry 60 ngày trước | Thông báo "Liệu trình đã hết hạn bảo hành"<br>Không cho phép gửi | Pass |
| **BH_04** | Admin phê duyệt BH | 1. Admin vào "Quản lý BH"<br>2. Xem Ticket<br>3. Chọn "Phê duyệt"<br>4. Tạo lịch hẹn BH miễn phí | Ticket ID: #123<br>Status: PENDING | Status → APPROVED<br>Tạo Booking miễn phí (Price: 0)<br>Email thông báo KH | Pass |
| **BH_05** | Admin từ chối BH | 1. Admin xem Ticket<br>2. Nhập lý do từ chối<br>3. Gửi | Lý do: "Không thuộc phạm vi BH" | Status → REJECTED<br>Email lý do từ chối cho KH | Pass |

3. **Test cả 2 vai trò: Khách hàng (submit) và Admin (approval)**
4. **Document kết quả**

**📤 Output:**
- File: `chuong4_phan_4.3.2.2_bo_sung.docx`
- Nội dung: Bảng 4.32 với 5 test cases

**⏱️ Estimated time**: 3-4 giờ

---

#### **STEP 1.3: Quyết định Scope cho A3.4 (Đánh giá dịch vụ)**

**📋 Thông tin Use Case:**
- **Mã UC**: A3.4
- **Tên**: Đánh giá dịch vụ
- **Hiện trạng**: ❌ UC Spec (chỉ có trong Phụ lục), ❌ Activity, ✔ Sequence, ✔ Test Case (Bảng 4.16)
- **Vấn đề**: Logic không nhất quán - Out-of-scope nhưng có test case

**🎯 Mục tiêu:**
Giải quyết mâu thuẫn logic giữa scope declaration và implementation.

**🔧 Hành động - OPTION A (Khuyến nghị):**

**Đưa A3.4 vào scope chính thức:**

1. **Bổ sung vào Chương 3, Section 3.5.2 (Phân hệ Khách hàng)**
   - Thêm **Bảng 3.XX - Đặc tả Use Case Đánh giá dịch vụ** sau Bảng 3.16:

   | Thuộc tính | Nội dung |
   |------------|----------|
   | **Mã chức năng** | A3.4 |
   | **Tên chức năng** | Đánh giá dịch vụ |
   | **Mô tả** | Khách hàng đánh giá chất lượng dịch vụ sau khi sử dụng để cải thiện trải nghiệm. |
   | **Tác nhân** | Khách hàng |
   | **Tiền điều kiện** | Lịch hẹn đã hoàn thành (Status: COMPLETED) |
   | **Hậu điều kiện** | Đánh giá được lưu trữ; Điểm trung bình của dịch vụ được cập nhật. |

   **Luồng sự kiện chính:**

   | Bước | Tác nhân | Hành động |
   |------|----------|-----------|
   | 1 | Khách hàng | Chọn lịch hẹn đã hoàn thành và nhấn "Đánh giá". |
   | 2 | Khách hàng | Chọn số sao (1-5) và nhập nhận xét (optional). |
   | 3 | Hệ thống | Lưu đánh giá vào cơ sở dữ liệu và cập nhật điểm trung bình. |

   **Luồng ngoại lệ:** Nếu chưa chọn số sao, hệ thống hiển thị lỗi validation.

2. **Bổ sung vào Use Case Diagram** (Biểu đồ 3.X - Sơ đồ phân rã UC Khách hàng)

3. **Bổ sung Activity Diagram** (Biểu đồ 3.XX - Sơ đồ hoạt động Đánh giá dịch vụ):
   ```
   Khách hàng: Chọn lịch "Hoàn thành" → Nhập rating 1-5 sao
   Hệ thống: Validate (Sao > 0?) → Lưu review → Cập nhật avg_rating của Service
   ```

4. **Giữ nguyên** Test Case Bảng 4.16

5. **Xóa khỏi** Phụ lục: Hướng phát triển

**🔧 Hành động - OPTION B (Không khuyến nghị):**

**Loại A3.4 ra khỏi scope:**

1. **Xóa** Test Case Bảng 4.16 khỏi Chương 4
2. **Giữ nguyên** trong Phụ lục: Hướng phát triển
3. **Cập nhật** Use Case Diagram để loại bỏ A3.4 nếu có

**⚠️ Lưu ý:** OPTION B không khuyến nghị vì đã có implementation và test → Lãng phí effort.

**📤 Output (nếu chọn OPTION A):**
- File: `chuong3_section_3.5.2_bo_sung.docx` (UC Spec + Activity Diagram)
- File: `chuong3_usecase_diagram_update.vsdx` (Thêm A3.4 vào diagram)

**⏱️ Estimated time**: 2-3 giờ

---

#### **STEP 1.4: Bổ sung Test Case cho A2.7 & B1.6 (Live Chat)**

**📋 Thông tin Use Case:**
- **Mã UC**: A2.7 (Nhận hỗ trợ), B1.6 (Phản hồi hỗ trợ)
- **Hiện trạng**: ✔ UC Spec, ❌ Activity, ✔ Sequence, ❌ Test Case
- **Mức độ Critical**: 🔴 CRITICAL (Real-time feature)

**🎯 Mục tiêu:**
Chứng minh live chat hoạt động ổn định (connection, message delivery, read status).

**🔧 Hành động:**

1. **Tạo Bảng 4.33 - Kiểm thử chức năng Live Chat**
2. **Thiết kế 6 Test Scenarios**:

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu đầu vào | Kết quả mong đợi | Status |
|-------|----------|----------------|-----------------|------------------|--------|
| **CHAT_01** | Khách hàng gửi tin nhắn | 1. KH đăng nhập<br>2. Nhấn icon Chat<br>3. Gửi "Tôi muốn đặt lịch" | Message: "Tôi muốn đặt lịch" | Chat session được tạo (Status: OPEN)<br>Message hiển thị trong chat box<br>Realtime sync thành công | Pass |
| **CHAT_02** | Lễ tân nhận thông báo | 1. KH gửi tin nhắn (như TC01)<br>2. Lễ tân đang online | N/A | Lễ tân thấy badge số lượng tin nhắn mới<br>Thông báo realtime xuất hiện | Pass |
| **CHAT_03** | Lễ tân phản hồi | 1. Lễ tân mở chat session<br>2. Gõ "Dạ, em giúp anh đặt lịch ạ"<br>3. Gửi | Message: "Dạ, em giúp..." | KH nhận tin nhắn realtime<br>Timestamp hiển thị đúng<br>Avatar Lễ tân hiển thị | Pass |
| **CHAT_04** | Đánh dấu đã đọc | 1. KH đọc tin nhắn từ Lễ tân | N/A | Icon "đã đọc" (2 tích xanh) xuất hiện<br>is_read = TRUE trong DB | Pass |
| **CHAT_05** | Đóng chat session | 1. Lễ tân nhấn "Đóng hội thoại"<br>2. Xác nhận | Session ID: #123 | Status → CLOSED<br>KH không gửi tin nhắn mới được<br>Lịch sử chat vẫn lưu trữ | Pass |
| **CHAT_06** | Xử lý mất kết nối | 1. KH gửi tin nhắn<br>2. Ngắt mạng 5s<br>3. Kết nối lại | Simulate network offline | Tin nhắn tự động gửi lại khi reconnect<br>Không bị mất message | Pass |

3. **Test trên cả Desktop và Mobile**
4. **Capture screenshot realtime messaging**

**📤 Output:**
- File: `chuong4_phan_4.3.2.2_bo_sung_livechat.docx`
- Nội dung: Bảng 4.33 + Screenshots

**⏱️ Estimated time**: 4-5 giờ

---

### GIAI ĐOẠN 2: XỬ LÝ HIGH PRIORITY GAPS

**Timeline**: 2 ngày
**Mức độ ưu tiên**: 🟠 HIGH

---

#### **STEP 2.1: Rõ ràng hóa Test Case cho B1.7 (Theo dõi tiến độ liệu trình)**

**📋 Thông tin Use Case:**
- **Mã UC**: B1.7
- **Hiện trạng**: ✔ UC Spec, ❌ Activity, ✔ Sequence, ⚠️ Test Case không rõ
- **Vấn đề**: Test case có thể đã cover qua Bảng 4.12 nhưng không tường minh

**🔧 Hành động:**

1. **Kiểm tra Bảng 4.12** (Kiểm thử Xem liệu trình)
   - Nếu có TC "CTLT" cover việc xem số buổi còn lại → **Đổi tên bảng**:
     - Từ: "Bảng 4.12 - Kiểm thử chức năng Xem danh sách và chi tiết liệu trình"
     - Thành: "Bảng 4.12 - Kiểm thử chức năng Xem và Theo dõi liệu trình (B1.7)"

2. **Nếu chưa đủ** → Bổ sung thêm 2 TC vào Bảng 4.12:

| Mã TC | Mục đích | Dữ liệu vào | Kết quả mong đợi | Status |
|-------|----------|-------------|------------------|--------|
| **TDLT_01** | Xem tiến độ chính xác | Treatment: 10 buổi, đã dùng 7 | Hiển thị: "7/10 buổi đã sử dụng"<br>Progress bar: 70% | Pass |
| **TDLT_02** | Cảnh báo sắp hết buổi | Treatment: 10 buổi, đã dùng 9 | Badge cảnh báo: "Còn 1 buổi"<br>Gợi ý gia hạn | Pass |

**📤 Output:**
- File: `chuong4_bang_4.12_cap_nhat.docx`

**⏱️ Estimated time**: 1-2 giờ

---

#### **STEP 2.2: Tạo Test Case riêng cho C1 & C2 (Cấu hình giờ hoạt động)**

**📋 Thông tin Use Case:**
- **Mã UC**: C1 (Cấu hình giờ hoạt động), C2 (Quản lý ngày nghỉ lễ)
- **Hiện trạng**: ✔ UC Spec, ✔ Activity, ✔ Sequence, ⚠️ Test không rõ

**🔧 Hành động:**

1. **Tạo Bảng 4.34 - Kiểm thử Cấu hình thời gian hoạt động Spa (C1, C2)**

| Mã TC | UC | Mục đích | Bước thực hiện | Kết quả mong đợi | Status |
|-------|----|----------|----------------|------------------|--------|
| **CFG_01** | C1 | Cập nhật giờ mở cửa | 1. Admin vào "Cấu hình Spa"<br>2. Sửa Thứ 2: 9h-20h<br>3. Lưu | Cập nhật thành công<br>Booking availability tính từ 9h | Pass |
| **CFG_02** | C1 | Validation giờ logic | 1. Nhập Giờ mở: 20h, đóng: 9h<br>2. Lưu | Lỗi: "Giờ đóng phải sau giờ mở" | Pass |
| **CFG_03** | C2 | Thêm ngày nghỉ lễ | 1. Chọn ngày 01/01/2026<br>2. Loại: "Nghỉ lễ"<br>3. Lý do: "Tết Dương lịch"<br>4. Lưu | Ngày được đánh dấu CLOSED<br>Không thể đặt lịch vào ngày này | Pass |
| **CFG_04** | C2 | Cảnh báo xung đột booking | 1. Đánh dấu ngày mai nghỉ<br>2. Đã có 5 bookings ngày mai | Popup cảnh báo: "5 lịch hẹn bị ảnh hưởng"<br>Yêu cầu xử lý thủ công | Pass |

**📤 Output:**
- File: `chuong4_phan_4.3.2.5_bo_sung_cfg.docx`

**⏱️ Estimated time**: 2 giờ

---

#### **STEP 2.3: Tạo Test Case cho C6 (Quản lý gói liệu trình)**

**🔧 Hành động:**

**Tạo Bảng 4.35 - Kiểm thử CRUD Quản lý gói liệu trình (C6)**

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu vào | Kết quả mong đợi | Status |
|-------|----------|----------------|-------------|------------------|--------|
| **PKG_01** | Tạo gói mới | 1. Admin vào "Gói liệu trình"<br>2. Nhấn "Tạo mới"<br>3. Nhập thông tin<br>4. Lưu | Tên: "Trị mụn 10 buổi"<br>Service: "Trị mụn chuyên sâu"<br>Sessions: 10<br>Price: 4,500,000 VNĐ<br>Validity: 90 ngày | Thông báo "Tạo gói thành công"<br>Gói xuất hiện trong danh sách | Pass |
| **PKG_02** | Validation số buổi | 1. Nhập Sessions: 0<br>2. Lưu | Sessions: 0 | Lỗi: "Số buổi phải lớn hơn 0" | Pass |
| **PKG_03** | Cập nhật gói hiện có | 1. Chọn gói "Trị mụn 10 buổi"<br>2. Sửa Price: 4,200,000<br>3. Lưu | Price: 4,200,000 | Cập nhật thành công<br>Giá mới áp dụng cho đơn hàng sau | Pass |
| **PKG_04** | Vô hiệu hóa gói | 1. Chọn gói<br>2. Toggle "is_active" = False<br>3. Lưu | is_active: False | Gói không hiển thị trên trang khách hàng<br>Gói cũ đã bán vẫn valid | Pass |

**📤 Output:**
- File: `chuong4_phan_4.3.2.5_bo_sung_pkg.docx`

**⏱️ Estimated time**: 2 giờ

---

#### **STEP 2.4: Tạo Test Case cho C8 (Quản lý khuyến mãi)**

**🔧 Hành động:**

**Tạo Bảng 4.36 - Kiểm thử CRUD Chương trình khuyến mãi (C8)**

| Mã TC | Mục đích | Bước thực hiện | Dữ liệu vào | Kết quả mong đợi | Status |
|-------|----------|----------------|-------------|------------------|--------|
| **PROMO_01** | Tạo mã giảm giá | 1. Admin vào "Khuyến mãi"<br>2. Tạo mới<br>3. Lưu | Code: "NEWYEAR2026"<br>Type: Percentage<br>Value: 20%<br>Min order: 500k<br>Valid: 01-31/01/2026 | Mã được tạo thành công<br>Hiển thị trong danh sách active | Pass |
| **PROMO_02** | Áp dụng mã hợp lệ | 1. Lễ tân thanh toán 600k<br>2. Nhập mã "NEWYEAR2026"<br>3. Tính tiền | Order: 600,000 VNĐ<br>Code: "NEWYEAR2026" | Giảm 20% = 120k<br>Tổng: 480,000 VNĐ | Pass |
| **PROMO_03** | Từ chối mã hết hạn | 1. Nhập mã đã hết hạn<br>2. Apply | Code: "OLDCODE"<br>Expired: 01/12/2025 | Lỗi: "Mã đã hết hạn" | Pass |
| **PROMO_04** | Validation giá trị min | 1. Order: 300k<br>2. Nhập mã min 500k | Order: 300k<br>Min: 500k | Lỗi: "Đơn hàng phải tối thiểu 500,000 VNĐ" | Pass |

**📤 Output:**
- File: `chuong4_phan_4.3.2.5_bo_sung_promo.docx`

**⏱️ Estimated time**: 2 giờ

---

### GIAI ĐOẠN 3: XỬ LÝ MEDIUM/LOW PRIORITY

**Timeline**: 1-2 ngày (Optional - Nếu có thời gian)
**Mức độ ưu tiên**: 🟡 MEDIUM / 🟢 LOW

---

#### **STEP 3.1: Bổ sung Activity Diagram cho Live Chat (A2.7, B1.6)**

**📋 Mức độ**: 🟡 MEDIUM

**🔧 Hành động:**

Tạo **Biểu đồ 3.XX - Sơ đồ hoạt động Hỗ trợ qua trò chuyện trực tuyến**

```mermaid
flowchart TD
    subgraph KhachHang ["Khách hàng"]
        Start([Bắt đầu]) --> OpenChat[Nhấn icon Chat]
        OpenChat --> TypeMsg[Nhập tin nhắn]
        TypeMsg --> SendMsg[Gửi tin nhắn]
    end

    subgraph HeThong ["Hệ thống"]
        SendMsg --> CreateSession{Session tồn tại?}
        CreateSession -- "[Chưa có]" --> NewSession[Tạo Chat Session mới]
        CreateSession -- "[Đã có]" --> SaveMsg[Lưu tin nhắn]

        NewSession --> SaveMsg
        SaveMsg --> NotifyReceptionist[Thông báo Lễ tân realtime]
    end

    subgraph LeTan ["Lễ tân"]
        NotifyReceptionist --> ViewMsg[Lễ tân xem tin nhắn]
        ViewMsg --> Reply[Soạn và gửi phản hồi]
    end

    subgraph HeThong2 ["Hệ thống"]
        Reply --> DeliverMsg[Gửi tin nhắn cho KH realtime]
        DeliverMsg --> MarkRead{KH đọc tin nhắn?}
        MarkRead -- "[Đọc]" --> UpdateStatus[Cập nhật is_read = TRUE]
    end

    UpdateStatus --> End([Kết thúc])
```

**📤 Output:**
- File: `chuong3_activity_livechat.vsdx`
- Thêm vào Section 3.6.3 (Sơ đồ hoạt động cho Khách hàng)

**⏱️ Estimated time**: 1 giờ

---

#### **STEP 3.2: Bổ sung Activity cho các UC Query-Only**

**📋 Mức độ**: 🟢 LOW (Optional)

**Danh sách UC cần Activity:**
- A1.4 (Cập nhật thông tin cá nhân)
- A1.5 (Đăng xuất)
- A2.1 (Xem danh sách dịch vụ)
- A2.2 (Xem chi tiết dịch vụ)
- A3.1 (Xem lịch sử đặt lịch)
- A3.3 (Nhận thông báo)
- B1.1 (Xem lịch hẹn tổng quan)

**🔧 Hành động:**
Tạo Activity diagram đơn giản cho từng UC (chỉ 2-3 bước).

**⏱️ Estimated time**: 3-4 giờ (Nếu làm hết 7 UC)

**Khuyến nghị**: **SKIP** - Các UC này đơn giản, không ảnh hưởng đến đánh giá của Hội đồng.

---

#### **STEP 3.3: Bổ sung Test Case cho C3 (Mời nhân viên qua Email)**

**📋 Mức độ**: 🟡 MEDIUM

**🔧 Hành động:**

Kiểm tra Bảng 4.24 (Kiểm thử quản lý nhân viên) → Nếu chưa có TC về "Email invitation", bổ sung:

| Mã TC | Mục đích | Bước thực hiện | Kết quả mong đợi | Status |
|-------|----------|----------------|------------------|--------|
| **NV_05** | Gửi email mời thành công | 1. Admin vào "Nhân viên"<br>2. Nhấn "Mời qua email"<br>3. Nhập email mới<br>4. Chọn vai trò<br>5. Gửi | Email gửi thành công<br>Nhân viên nhận link kích hoạt<br>Tài khoản tạo ở trạng thái PENDING | Pass |
| **NV_06** | Từ chối email trùng | 1. Nhập email đã tồn tại<br>2. Gửi | Lỗi: "Email này đã được sử dụng" | Pass |

**📤 Output:**
- File: `chuong4_bang_4.24_cap_nhat.docx`

**⏱️ Estimated time**: 1 giờ

---

#### **STEP 3.4: Xử lý C11 (Quản lý chính sách bảo hành)**

**📋 Thông tin:**
- **Mã UC**: C11
- **Hiện trạng**: ⚠️ UC Spec không rõ, ❌ Sequence, ✔ Activity, ❌ Test

**🔧 Hành động:**

**Option 1: Gộp vào A3.6**
- C11 là master data config cho warranty policy
- Logic đã cover trong A3.6 (Gửi yêu cầu bảo hành)
- **Khuyến nghị**: Không cần UC riêng, chỉ cần note trong A3.6 spec rằng "Chính sách BH được cấu hình bởi Admin"

**Option 2: Bổ sung đầy đủ artefact**
- Tạo UC Spec cho C11
- Tạo Sequence Diagram
- Tạo Test Case CRUD warranty policy

**Khuyến nghị**: Chọn **Option 1** để tránh phức tạp hóa.

**⏱️ Estimated time**: 30 phút (Option 1) hoặc 3 giờ (Option 2)

---

### GIAI ĐOẠN 4: REVIEW & FINALIZE

**Timeline**: 1 ngày
**Mức độ ưu tiên**: ✅ FINAL CHECK

---

#### **STEP 4.1: Cập nhật lại Cross-Check Matrix**

**🔧 Hành động:**

1. Chạy lại toàn bộ workflow cross-check
2. Cập nhật cột status cho các UC đã bổ sung
3. Tính lại thống kê:
   - Use Case có đầy đủ 5 artefact
   - Tỷ lệ Traceability
   - Tỷ lệ Verifiability

**📤 Output:**
- File: `cross_check_matrix_v2.md`

**⏱️ Estimated time**: 1 giờ

---

#### **STEP 4.2: Tổng hợp tất cả file bổ sung**

**🔧 Hành động:**

1. Merge tất cả file Word bổ sung vào bản chính:
   - `chuong3_section_3.5.2_bo_sung.docx` → Merge vào Chương 3 chính
   - `chuong4_phan_4.3.2.3_bo_sung.docx` → Merge vào Chương 4 chính
   - Các bảng test mới → Insert vào đúng section

2. Đánh số lại tất cả Bảng và Biểu đồ

3. Cập nhật Mục lục

**⏱️ Estimated time**: 2-3 giờ

---

#### **STEP 4.3: Chuẩn bị câu trả lời cho Hội đồng**

**🔧 Hành động:**

Tạo file `FAQ_hoi_dong.docx` chứa:

1. **Q: Tại sao một số UC không có Activity Diagram?**
   - A: "Các UC query-only đơn giản (A2.1, A2.2, A3.1...) không cần activity vì chỉ có 1-2 bước. Em tập trung vào các UC nghiệp vụ phức tạp như Đặt lịch, Reschedule..."

2. **Q: Test Case cho Reschedule Solver ở đâu?**
   - A: "Dạ, em đã bổ sung vào Bảng 4.31 với 4 test scenarios cover cả trường hợp reschedule thành công, thất bại, và xung đột phức tạp."

3. **Q: Use Case A3.4 ban đầu out-of-scope, sao lại có test?**
   - A: "Dạ, ban đầu team em dự định để ngoài scope, nhưng do tính năng đơn giản nên em triển khai luôn. Sau đó em đã bổ sung đầy đủ UC Spec và Activity Diagram vào Chương 3 để đảm bảo tính nhất quán."

**⏱️ Estimated time**: 1 giờ

---

## III. BẢNG TỔNG HỢP: UC → THIẾU SÓT → HÀNH ĐỘNG → OUTPUT

| STT | Mã UC | Tên UC | Thiếu sót ban đầu | Priority | Hành động | Artefact được bổ sung | Step |
|-----|-------|--------|-------------------|----------|-----------|----------------------|------|
| **CRITICAL GAPS** |||||||
| 1 | B1.8 | Tái lập lịch tự động | ❌ Test Case | 🔴 CRITICAL | Tạo Bảng 4.31 với 4 TCs | Test Case | 1.1 |
| 2 | A3.6 | Gửi yêu cầu bảo hành | ❌ Test Case | 🔴 CRITICAL | Tạo Bảng 4.32 với 5 TCs | Test Case | 1.2 |
| 3 | A3.4 | Đánh giá dịch vụ | ❌ UC Spec<br>❌ Activity<br>⚠️ Logic inconsistent | 🔴 CRITICAL | Bổ sung UC Spec (Bảng 3.XX)<br>Bổ sung Activity (Biểu đồ 3.XX)<br>Cập nhật UC Diagram | UC Spec<br>Activity Diagram<br>UC Diagram | 1.3 |
| 4 | A2.7 | Nhận hỗ trợ qua live chat | ❌ Activity<br>❌ Test Case | 🔴 HIGH | Tạo Bảng 4.33 với 6 TCs<br>(Optional: Activity Diagram) | Test Case<br>(Activity) | 1.4<br>(3.1) |
| 5 | B1.6 | Phản hồi hỗ trợ live chat | ❌ Activity<br>❌ Test Case | 🔴 HIGH | Gộp với A2.7 (cùng test) | Test Case | 1.4 |
| **HIGH PRIORITY GAPS** |||||||
| 6 | B1.7 | Theo dõi tiến độ liệu trình | ❌ Activity<br>⚠️ Test không rõ | 🟠 HIGH | Rõ ràng hóa Bảng 4.12<br>Bổ sung 2 TCs nếu cần | Test Case clarity | 2.1 |
| 7 | C1 | Cấu hình giờ hoạt động | ⚠️ Test không rõ | 🟠 HIGH | Tạo Bảng 4.34 (gộp C1+C2) | Test Case | 2.2 |
| 8 | C2 | Quản lý ngày nghỉ lễ | ⚠️ Test không rõ | 🟠 HIGH | Gộp vào Bảng 4.34 | Test Case | 2.2 |
| 9 | C6 | Quản lý gói liệu trình | ⚠️ Test không rõ | 🟠 HIGH | Tạo Bảng 4.35 CRUD | Test Case | 2.3 |
| 10 | C8 | Quản lý khuyến mãi | ⚠️ Test không rõ | 🟠 HIGH | Tạo Bảng 4.36 CRUD | Test Case | 2.4 |
| **MEDIUM/LOW PRIORITY** |||||||
| 11 | C3 | Mời nhân viên qua Email | ❌ Activity<br>⚠️ Test không rõ | 🟡 MEDIUM | Bổ sung 2 TCs vào Bảng 4.24 | Test Case | 3.3 |
| 12 | C11 | Quản lý chính sách BH | ⚠️ UC Spec không rõ<br>❌ Sequence<br>❌ Test | 🟡 MEDIUM | **Khuyến nghị**: Gộp vào A3.6, không cần UC riêng | N/A | 3.4 |
| 13-19 | A1.4, A1.5, A2.1, A2.2, A3.1, A3.3, B1.1 | Các UC Query-Only | ❌ Activity | 🟢 LOW | **Khuyến nghị**: SKIP (không ảnh hưởng bảo vệ) | N/A | 3.2 |

**Tổng công việc theo loại:**

| Loại công việc | Số lượng | Priority | Timeline |
|----------------|----------|----------|----------|
| **Bổ sung Test Case** | 9 bảng | 4 CRITICAL + 5 HIGH | 3 ngày |
| **Bổ sung UC Spec + Activity** | 1 UC (A3.4) | CRITICAL | 3 giờ |
| **Rõ ràng hóa Test** | 3 UC | HIGH | 4 giờ |
| **Bổ sung Activity (Optional)** | 8 UC | LOW | 4 giờ |
| **Review & Finalize** | All | FINAL | 1 ngày |

---

## IV. KẾT LUẬN: MỨC ĐỘ SẴN SÀNG BẢO VỆ

### 4.1. Trước khi thực hiện Workflow

**Trạng thái hiện tại:**
- ❌ **KHÔNG SẴN SÀNG bảo vệ**
- Traceability: 44.7% đầy đủ
- Verifiability: 68.4% có test case
- **4 Critical Gaps** chưa fix
- Nguy cơ bị Hội đồng chất vấn về Reschedule Solver và Warranty logic

**Xác suất bảo vệ thành công**: **60%** (RỦI RO CAO)

---

### 4.2. Sau khi hoàn thành GIAI ĐOẠN 1 (Critical Only)

**Trạng thái:**
- ✅ **SẴN SÀNG bảo vệ** (mức tối thiểu)
- Traceability: ~75% đầy đủ
- Verifiability: ~85% có test case
- 4 Critical Gaps đã fix
- Vẫn còn một số test case không rõ ràng (C1, C2, C6, C8)

**Xác suất bảo vệ thành công**: **85%** (AN TOÀN)

**Thời gian cần**: 2-3 ngày

---

### 4.3. Sau khi hoàn thành GIAI ĐOẠN 1 + 2 (Critical + High)

**Trạng thái:**
- ✅✅ **RẤT SẴN SÀNG bảo vệ**
- Traceability: ~90% đầy đủ
- Verifiability: ~95% có test case
- Tất cả Critical & High gaps đã fix
- Chỉ còn một số Activity Diagram optional chưa làm (không ảnh hưởng)

**Xác suất bảo vệ thành công**: **95%** (RẤT AN TOÀN)

**Thời gian cần**: 4-5 ngày

---

### 4.4. Khuyến nghị Timeline

**Kịch bản 1: Thời gian gấp (< 1 tuần)**
- Chỉ làm **GIAI ĐOẠN 1** (Critical)
- Focus vào B1.8, A3.6, A3.4, Live Chat
- Bỏ qua các bảng test không rõ ràng
- **Timeline**: 3 ngày
- **Kết quả**: 85% success rate

**Kịch bản 2: Thời gian vừa đủ (1-2 tuần)**
- Làm **GIAI ĐOẠN 1 + 2** (Critical + High)
- Bổ sung đầy đủ test case cho C1, C2, C6, C8
- **Timeline**: 5 ngày
- **Kết quả**: 95% success rate (**KHUYẾN NGHỊ**)

**Kịch bản 3: Thời gian dư (> 2 tuần)**
- Làm hết cả 4 GIAI ĐOẠN
- Bổ sung cả Activity Diagram cho UC đơn giản
- **Timeline**: 7-8 ngày
- **Kết quả**: 98% success rate (Perfect)

---

### 4.5. Checklist cuối cùng trước nộp

- [ ] **GIAI ĐOẠN 1 hoàn thành 100%** (4 Critical gaps)
- [ ] Đã chạy lại Cross-Check Matrix → Tỷ lệ traceability ≥ 85%
- [ ] Tất cả bảng test mới đã merge vào Chương 4
- [ ] Đánh số lại Bảng và Biểu đồ đúng thứ tự
- [ ] Cập nhật Mục lục
- [ ] Chuẩn bị FAQ trả lời Hội đồng
- [ ] Print 1 bản thử → Review toàn bộ lần cuối
- [ ] Backup tất cả file nguồn (.docx, .vsdx, .md)

---

**Lời kết:**

> Workflow này được thiết kế dựa trên phân tích chi tiết 38 Use Cases với 190 artefacts. Mục tiêu không phải là "hoàn hảo 100%" mà là **"đủ tốt để bảo vệ thành công"**.
>
> Ưu tiên cao nhất là làm xong **GIAI ĐOẠN 1** - 4 Critical Gaps. Nếu làm xong phần này, các bạn đã có thể tự tin bảo vệ trước Hội đồng.
>
> Chúc các bạn hoàn thiện tốt và bảo vệ thành công! 🎓

---

**Metadata:**
- **Tổng số gaps cần fix**: 19 items
- **Critical gaps**: 4 items (BẮT BUỘC)
- **High priority gaps**: 5 items (NÊN LÀM)
- **Medium/Low gaps**: 10 items (OPTIONAL)
- **Estimated total time**: 3 ngày (Critical only) đến 8 ngày (Full completion)

---

*Workflow được tạo bởi KLTN Completion Agent v1.0*
*Dựa trên Cross-Check Matrix v1.0*
*Cập nhật lần cuối: 21/12/2025 01:00*
