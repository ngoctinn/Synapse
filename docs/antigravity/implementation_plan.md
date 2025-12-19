# Kế hoạch triển khai Antigravity (Implementation Plan) - Hoàn thiện tài liệu KLTN

## 1. Phân tích bối cảnh
Nâng cấp bộ tài liệu thiết kế Synapse để đạt chuẩn Khóa luận tốt nghiệp xuất sắc bằng cách bổ sung các sơ đồ kỹ thuật quan trọng và đặc tả giao diện người dùng.

## 2. Mục tiêu (Goals)
- Bổ sung Sequence Diagrams cho các luồng nghiệp vụ mới cập nhật.
- Tạo mới tài liệu đặc tả Giao diện (UI Design).
- Thể hiện độ phức tạp thuật toán qua Activity Diagram cho luồng Smart Scheduling.

## 3. Chiến lược giải quyết
- **Giai đoạn 1**: Cập nhật `docs/design/sequence_diagrams.md` và các file trong `docs/design/sequences/`.
- **Giai đoạn 2**: Tạo mới `docs/design/ui_design.md` để đặc tả cấu trúc màn hình và luồng UX theo FSD.
- **Giai đoạn 3**: Tạo mới `docs/design/activity_diagrams.md` tập trung vào logic OR-Tools.

## 4. Danh sách nhiệm vụ (Task List)
- [ ] **Bổ sung Sequence Diagrams**:
    - [ ] Luồng B1.8: Tái lập lịch do sự cố (Rescheduling).
    - [ ] Luồng C12: Tính toán và báo cáo hoa hồng.
- [ ] **Khởi tạo UI Design Document**:
    - [ ] Danh mục màn hình (Landing, Auth, Booking Wizard, Admin Dashboard).
    - [ ] Đặc tả Layout & UX Flow.
- [ ] **Vẽ Activity Diagrams**:
    - [ ] Luồng tìm kiếm khung giờ thông minh (Constraint-based search).
    - [x] **Trạng thái**: Completed
- [x] **Kết quả**: Đã đóng băng thiết kế Database v2.2.

## 4. Giai đoạn 4: Thiết kế Thuật toán & Logic (Algorithm Design) - **CURRENT**
- [ ] **Task 4.1**: Tạo tài liệu `docs/design/algorithm_spec.md`.
    - [ ] Di chuyển và chuẩn hóa nội dung từ yêu cầu "Tối ưu hóa Trải nghiệm...".
    - [ ] Định nghĩa chi tiết Ma trận Ràng buộc (Constraint Matrix).
    - [ ] Tích hợp quyết định "Resource = Bed/Chair".
    - [ ] Mô hình hóa toán học cho Hard/Soft Constraints.
- [ ] **Task 4.2**: Cập nhật `docs/design/activity_diagrams.md` nếu cần để phản ánh logic mới.

## 5. Giai đoạn 5: Phát triển Backend (FastAPI Core)

## 5. Ràng buộc & Tiêu chuẩn
- Ngôn ngữ: Tiếng Việt (Vietnamese).
- Diagram: Sử dụng cú pháp Mermaid chuyên nghiệp.
- Kiến trúc: Phải phản ánh đúng Modular Monolith và BFF pattern.
