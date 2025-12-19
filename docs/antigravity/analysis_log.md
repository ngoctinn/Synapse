# Nhật ký phân tích (Analysis Log) - Đánh giá tài liệu thiết kế Synapse

## 1. Danh sách tài liệu đã rà soát
- `docs/design/usecase.md`: Đặc tả 38 Use Case (v2.2).
- `docs/design/database_design.md`: ERD và SQL Script (v2.2).
- `docs/design/data_specification.md`: Đặc tả chi tiết từng bảng (v2.1).
- `docs/design/architecture_v2.md`: Kiến trúc hệ thống tổng quan.
- `docs/design/sequence_diagrams.md` & `docs/design/sequences/`: Sơ đồ tuần tự các luồng chính.

## 2. Đánh giá tính đầy đủ (Completeness)
- **Đã có**:
    - Đặc tả Use Case chi tiết (Luồng chính/Thay thế/Ngoại lệ).
    - Thiết kế Database chuẩn hóa, hỗ trợ Audit Log và RLS.
    - Kiến trúc Modular Monolith hiện đại.
    - Sơ đồ tuần tự cho ~70% các tính năng quan trọng.
- **Còn thiếu (Cần cho KLTN)**:
    - **UI Mockups/Wireframes**: Chưa có tài liệu trực quan hóa giao diện.
    - **Activity Diagram**: Cần sơ đồ hoạt động cho luồng "Smart Scheduling" (xử lý ràng buộc OR-Tools).
    - **Class Diagram**: Cần sơ đồ lớp để thể hiện cấu trúc mã nguồn (Entities, Services).
    - **Deployment Diagram**: Mô tả môi trường vận hành (Next.js on Vercel, FastAPI on Fly.io/Docker, Supabase).

## 3. Đánh giá tính nhất quán (Consistency)
- **Use Case vs Database**:
    - Khớp tốt các thực thể chính (Customer, Staff, Booking, Service).
    - Tính năng Commission (C12) đã có trường `commission_rate` trong `staff_profiles` nhưng thiếu bảng logic tính toán lịch sử hoa hồng (nên bổ sung bảng `commissions` hoặc logic trong `invoices`).
    - Tính năng Warranty (A3.6) đã có trong Use Case nhưng chưa thấy bảng `warranties` rõ ràng (hiện đang dùng `customer_treatments` để lồng ghép, cần làm rõ).
- **Use Case vs Sequence Diagrams**:
    - Thiếu sơ đồ tuần tự cho B1.8 (Tái lập lịch - Rescheduling).
    - Thiếu sơ đồ tuần tự cho C12 (Tính hoa hồng).

## 4. Đánh giá chất lượng học thuật
- Thuật ngữ đồng nhất giữa các tài liệu.
- Định dạng Mermaid chuyên nghiệp.
- Cấu trúc tài liệu rõ ràng, dễ theo dõi.

## 5. Kết luận sơ bộ
Tài liệu đạt khoảng **80-85%** yêu cầu cho một Khóa luận tốt nghiệp xuất sắc. Cần bổ sung các sơ đồ kỹ thuật (Class, Activity, Deployment) và thiết kế giao diện để hoàn thiện 100%.

## 6. Phân tích Task: Thiết kế Đặc tả Thuật toán (Algorithm Spec)
- **Ngày**: 2025-12-19
- **Yêu cầu**: Formalize logic từ văn bản đề xuất vào `docs/design/algorithm_spec.md` và chi tiết hóa toàn bộ các trường hợp ràng buộc.
- **Quyết định Thiết kế**:
    - **Resource Granularity**: Sử dụng đơn vị "Giường/Ghế" (Bed/Chair) làm Resource cơ sở.
    - **Room Logic**: "Phòng" chỉ là một thuộc tính nhóm (Group), không phải là Resource chịu ràng buộc Capacity (trừ trường hợp phòng đơn VIP).
    - **Constraint Model**: Sử dụng mô hình `AddNoOverlap` trên từng Resource ID cụ thể thay vì `AddCumulative` trên Room ID.
- **Tác động**:
    - Giúp thuật toán đơn giản và chính xác hơn (định vị chính xác khách ngồi ghế nào).
    - Tạo tiền đề cho UI "Floor Map" (Sơ đồ mặt bằng) trực quan.
