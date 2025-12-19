# Kế hoạch Triển khai Antigravity - Sửa Lỗi KLTN

**Mã phiên:** `KLTN-FIX-20251219`
**Ngày tạo:** 2025-12-19
**Trạng thái:** THINK (Chờ phê duyệt)

---

## 1. Vấn đề (Problem Statement)

Sau quá trình thẩm định kiến trúc, cơ sở dữ liệu và sơ đồ tuần tự, đã phát hiện **5 vấn đề lớn** cần điều chỉnh trong tài liệu KLTN để đảm bảo tính logic và nhất quán:

| # | Vấn đề | Mức độ | File Ảnh hưởng |
|---|--------|--------|----------------|
| 1 | Thiếu cơ chế chống đặt trùng lịch (Concurrency Control) | **Nghiêm trọng** | `database_design.md` |
| 2 | Mâu thuẫn Kiến trúc Sync vs Async (Sơ đồ vs Kiến trúc) | Cao | `sequences/*.md`, `architecture_v2.md` |
| 3 | Đứt gãy logic User-Customer trong luồng Đăng ký | Cao | `sequences/authentication_flows.md` |
| 4 | Thiếu logic trừ buổi liệu trình khi Check-in | Trung bình | `sequences/receptionist_flows.md` |
| 5 | Bất nhất thuật ngữ "Phòng/Tài nguyên/Giường" | Thấp | Nhiều file tài liệu |

---

## 2. Mục đích (Goals)

1. **Bổ sung PostgreSQL Exclusion Constraints** vào `database_design.md` để ngăn chặn việc đặt trùng lịch ở mức Database.
2. **Thống nhất tài liệu** để phản ánh đúng kiến trúc đã thiết kế.
3. **Bổ sung các bước nghiệp vụ còn thiếu** trong sơ đồ tuần tự.
4. **Chuẩn hóa thuật ngữ** trong toàn bộ tài liệu thiết kế.

---

## 3. Ràng buộc (Constraints)

- **Ngôn ngữ:** Tiếng Việt (Vietnamese) cho toàn bộ tài liệu.
- **Cú pháp:** Mermaid cho sơ đồ, SQL chuẩn PostgreSQL.
- **Phạm vi:** Chỉ chỉnh sửa file tài liệu thiết kế, không chỉnh sửa code triển khai.

---

## 4. Chiến lược Giải quyết (Strategy)

### **Phase A: Database Enhancement (Ưu tiên cao nhất)**
- Bổ sung extension `btree_gist` vào `database_design.md`.
- Thêm 2 Exclusion Constraints cho bảng `booking_items`:
  - `no_overlap_staff_booking` (Nhân viên)
  - `no_overlap_resource_booking` (Tài nguyên)
- Thêm phần giải thích kỹ thuật về Concurrency Control.

### **Phase B: Sequence Diagram Fixes**
1. **Luồng Đăng ký (Hình 3.7)**: Thêm bước `Create Customer Profile` sau khi tạo User.
2. **Luồng Check-in (Hình 3.35)**: Thêm bước `update_treatment_usage()` nếu có liệu trình.
3. **Ghi chú:** Đánh dấu các luồng nặng (OR-Tools) cần chuyển sang Async Pattern (cho lần cập nhật sau).

### **Phase C: Terminology Standardization**
- Thống nhất sử dụng thuật ngữ **"Tài nguyên (Resource)"** trong các tài liệu kỹ thuật.
- Định nghĩa rõ Tài nguyên bao gồm: Phòng, Giường/Ghế, Thiết bị lớn.

---

## 5. Danh sách Nhiệm vụ (Task List)

### Phase A: Database Enhancement
- [ ] **A.1:** Bổ sung `CREATE EXTENSION IF NOT EXISTS btree_gist;`
- [ ] **A.2:** Thêm Exclusion Constraint `no_overlap_staff_booking`
- [ ] **A.3:** Thêm Exclusion Constraint `no_overlap_resource_booking`
- [ ] **A.4:** Thêm mục giải thích "Concurrency Control Strategy" vào phần đầu file

### Phase B: Sequence Diagram Fixes
- [ ] **B.1:** Cập nhật `sequences/authentication_flows.md` - Thêm bước tạo Customer Profile
- [ ] **B.2:** Cập nhật `sequences/receptionist_flows.md` - Thêm logic trừ buổi liệu trình khi Check-in

### Phase C: Terminology Standardization
- [ ] **C.1:** Thêm phần "Quy ước Thuật ngữ" vào `database_design.md`

---

## 6. Rủi ro & Giảm thiểu (Risks)

| Rủi ro | Xác suất | Giảm thiểu |
|--------|----------|------------|
| Extension `btree_gist` không có sẵn trên Supabase | Thấp | Supabase hỗ trợ native, chỉ cần enable trong Dashboard |
| Sơ đồ tuần tự mới không đồng bộ với code thực tế | Trung bình | Giai đoạn này chỉ sửa tài liệu, code sẽ được cập nhật sau |

---

## 7. Output Dự kiến

1. **File `database_design.md`**: Có thêm phần Exclusion Constraints và Quy ước Thuật ngữ.
2. **File `sequences/authentication_flows.md`**: Sơ đồ Đăng ký hoàn chỉnh.
3. **File `sequences/receptionist_flows.md`**: Sơ đồ Check-in hoàn chỉnh.
4. **Change Log**: Ghi nhận tất cả thay đổi.

---

**⏸️ TRẠNG THÁI: Đang chờ phê duyệt từ người dùng để tiếp tục.**
