# Change Log - Hoàn thiện tài liệu thiết kế KLTN

## [2025-12-19] - Rollback: Giữ nguyên Code-style cho Sequence Diagrams

### Đã hủy bỏ (Reverted)
- **Chuẩn hóa nhãn thông điệp tiếng Việt** trong 5 files `sequences/`

### Lý do Rollback
1. **Sequence Diagram ≠ Activity Diagram**: Sequence thể hiện **giao tiếp giữa các đối tượng** (Ai nói gì với ai), cần giữ tên method/API để trace ngược về code.
2. **Activity Diagram đã có sẵn** cho mục đích mô tả quy trình nghiệp vụ.
3. **Giữ tính kỹ thuật** cho tài liệu thiết kế hệ thống.

### Các fix nghiệp vụ vẫn được giữ lại
- ✅ Sơ đồ Đăng ký (3.7): Bước tạo `Customer Profile`
- ✅ Sơ đồ Check-in (3.35): Logic trừ buổi `customer_treatments`

---

## [2025-12-19] - Phiên KLTN-FIX: Sửa 5 Vấn đề Nhất quán

### Đã thêm (Added)
- **PostgreSQL Exclusion Constraints** (`database_design.md`):
    - Extension `btree_gist` để hỗ trợ so sánh khoảng thời gian.
    - Constraint `no_overlap_staff_booking`: Ngăn chặn đặt trùng lịch cho cùng một nhân viên.
    - Constraint `no_overlap_resource_booking`: Ngăn chặn đặt trùng lịch cho cùng một tài nguyên.
- **Mục 3: Chiến lược Kiểm soát Đồng thời** (`database_design.md`):
    - Giải thích vấn đề Race Condition trong đặt lịch.
    - Hướng dẫn xử lý lỗi Exclusion Violation ở Backend.
- **Mục 4: Quy ước Thuật ngữ** (`database_design.md`):
    - Bảng quy ước thuật ngữ kỹ thuật và hiển thị giao diện.
    - Định nghĩa rõ "Resource" bao gồm: Phòng, Giường/Ghế, Thiết bị lớn.

### Đã thay đổi (Changed)
- **Sơ đồ Đăng ký (Hình 3.7)** (`sequences/authentication.md`):
    - Bổ sung bước `Create Customer Profile` sau khi tạo User thành công.
    - Thêm các participant: API Router, CustomerService, Database.
    - Xử lý ngoại lệ khi email đã tồn tại.
- **Sơ đồ Check-in (Hình 3.35)** (`sequences/receptionist_flows.md`):
    - Bổ sung logic **trừ buổi liệu trình** khi check-in.
    - Thêm vòng lặp xử lý từng `booking_item` có `treatment_id`.
    - Kiểm tra và cập nhật trạng thái liệu trình (COMPLETED nếu hết buổi).

### Lý do (Rationale)
1. **Vấn đề 1 (Concurrency)**: Giải quyết triệt để bài toán "đặt trùng lịch" bằng PostgreSQL Exclusion Constraints thay vì logic phức tạp ở tầng code.
2. **Vấn đề 2 (User-Customer)**: Sơ đồ cũ thiếu bước tạo Customer, dẫn đến lỗi khi đặt lịch (bảng `bookings` yêu cầu `customer_id`).
3. **Vấn đề 3 (Check-in)**: Sơ đồ cũ không phản ánh quy trình nghiệp vụ "trừ buổi liệu trình" như Activity Diagram đã mô tả.
4. **Vấn đề 5 (Thuật ngữ)**: Thống nhất dùng "Tài nguyên (Resource)" trong tài liệu kỹ thuật.

### Vấn đề chưa xử lý (Deferred)
- **Vấn đề 4 (Sync vs Async)**: Các sơ đồ tuần tự cho tác vụ nặng (OR-Tools) cần vẽ lại theo mô hình Bất đồng bộ (Job Queue + Polling). Sẽ xử lý trong phiên Antigravity riêng.

---

## [2025-12-19] - Đánh giá và bổ sung tài liệu thiết kế

### Đã thêm (Added)
- **Sequence Diagrams**:
    - Bổ sung luồng `B1.8: Tái lập lịch do sự cố` vào `docs/design/sequences/receptionist_flows.md`.
    - Bổ sung luồng `C12: Tính toán và báo cáo hoa hồng` vào `docs/design/sequences/admin_flows.md`.
- **UI Design Spec**: Tạo mới `docs/design/ui_design.md` đặc tả danh mục màn hình, layout và UX Flows chính.
- **Activity Diagrams**: Tạo mới `docs/design/activity_diagrams.md` mô tả logic chi tiết cho Smart Scheduling, Rescheduling và Commission.

### Đã thay đổi (Changed)
- **Implementation Plan**: Cập nhật mục tiêu đánh giá bộ tài liệu thiết kế.
- **Analysis Log**: Ghi nhận kết quả rà soát tính đầy đủ và nhất quán của bộ Design.

### Lý do (Rationale)
- Chuẩn bị hồ sơ thiết kế đầy đủ cho Khóa luận tốt nghiệp (KLTN).
- Làm nổi bật tính "thông minh" (Smart) của hệ thống thông qua các sơ đồ hoạt động và tuần tự phức tạp.
- Cung cấp cái nhìn trực quan về giao diện người dùng để hội đồng dễ hình dung sản phẩm.

---
# Change Log - Backend Module Refactoring

## [2025-12-19] - Hệ thống hóa Module Lập lịch

### Đã thay đổi (Changed)
- **Rename Folder**: `backend/src/modules/scheduling` -> `backend/src/modules/scheduling_engine`.
  - Mục đích: Tránh nhầm lẫn với module `schedules` (Dữ liệu).
- **Backend Entry Point**: Cập nhật `backend/src/app/main.py` để sử dụng `scheduling_engine`.
- **API Documentation**:
  - Cập nhật Swagger tags trong `router.py` thành `Scheduling Engine`.
  - Cập nhật `__init__.py` docstring.
- **Tài liệu Hệ thống**: Cập nhật `docs/ai/implementation/knowledge-schedules-scheduling.md` để khớp với tên module mới.

### Lý do (Rationale)
- Theo kiến trúc **Modular Monolith- **Refinement**: Điều chỉnh Use Case để phản ánh đúng thực tế nghiệp vụ (như đã phân tích ở trên).

### 2025-12-19: Algorithm & Scheduling Logic Design
- **New Feature**: Tạo tài liệu `docs/design/algorithm_spec.md`.
    - Định nghĩa **Synapse Intelligent Scheduling Framework (SISF)**.
    - Đặc tả chi tiết 9 Ràng buộc Cứng (Hard Constraints) và 5 Ràng buộc Mềm (Soft Constraints).
    - Thống nhất mô hình quản lý tài nguyên theo đơn vị **Giường/Ghế (Bed/Chair)** thay vì Phòng.
    - Cập nhật mô hình toán học và chiến lược Tái lập lịch (Rescheduling).g_engine` thể hiện rõ đây là logic xử lý (Engine), phân biệt với thực thể lưu trữ lịch làm việc (`schedules`).

### Tác động (Impact)
- **Frontend**: Không thay đổi API URL (`/scheduling` vẫn được giữ nguyên).
- **Backend Internal**: Tất cả các tham chiếu import đã được cập nhật. Tính đóng gói của module được bảo toàn.
