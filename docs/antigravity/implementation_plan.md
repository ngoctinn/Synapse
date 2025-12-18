# Kế Hoạch Triển Khai: Rà Soát & Chuẩn Hóa Mã Nguồn Backend (Synapse Project)

## 1. Mục Tiêu (Objective)
Đảm bảo toàn bộ backend tuân thủ các quy tắc Clean Code, chuẩn hóa Documentation (Module Headers/Summaries) và tối ưu hóa logic nghiệp vụ theo kiến trúc Modular Monolith.

## 2. Phạm Vi Rà Soát (Scope)
Tất cả các module nghiệp vụ tại `backend/src/modules/`:
- `users`, `staff`, `services`, `resources`, `schedules`, `bookings`, `scheduling`.

## 3. Tiêu Chí Đánh Giá (Review Criteria)
- **Documentation**: Mọi file `.py` phải có Docstring mô tả mục đích (Tiếng Việt). Router phải có Markdown Docstring cho Swagger.
- **Clean Code**: Sử dụng Guard Clauses, Early Return, tên biến mang tính mô tả.
- **Kiến Trúc**: Triển khai đầy đủ Gatekeeper Pattern (`__init__.py`). Không có Deep Imports xuyên module.
- **Bất đồng bộ**: `async/await` nhất quán từ Router đến Service.
- **SQLAlchemy**: Eager loading (`selectinload`) cho các quan hệ hay dùng.
- **Type Hinting**: Sử dụng cú pháp Python 3.12+ (`X | None`, `list[X]`).

## 4. Các Bước Thực Hiện (Sub-tasks)

### Bước 1: ANALYZE - Rà Soát Tổng Thể [ ]
- [ ] Kiểm tra Docstrings/Headers của từng file trong các module.
- [ ] Đánh giá độ phức tạp của các hàm Service (tìm code lặp hoặc logic quá rối).
- [ ] Kiểm tra việc xử lý Exception (đảm bảo không catch chung chung).
- [ ] Ghi nhận các điểm cần sửa vào `analysis_log.md`.

### Bước 2: APPLY - Chuẩn Hóa Headers & Documentation [ ]
- [x] Bổ sung/Cập nhật Docstrings cho các tệp thiếu thông tin.
- [ ] **Chuẩn hóa Docstring Router (Senior Standard)**:
    - Áp dụng cấu trúc: Summary -> Description -> Logic Flow -> Parameters -> Error Cases.
    - Sử dụng Markdown chuyên sâu cho Swagger UI.
    - Nghiên cứu logic Service để viết mô tả chính xác.

### Bước 3: APPLY - Refactor Logic & Clean Code [ ]
- [ ] Áp dụng Guard Clauses cho các hàm Service phức tạp.
- [ ] Tách nhỏ các hàm quá lớn thành các utility functions trong nội bộ module.
- [ ] Chuẩn hóa Type Hinting trên toàn bộ backend.

### Bước 4: VERIFY - Kiểm Tra & Build [ ]
- [ ] Chạy `ruff check .` để đảm bảo không phát sinh lỗi mới.
- [ ] Chạy các script diagnostic để xác nhận logic nghiệp vụ vẫn đúng.

## 5. Metadata
- **Trạng thái**: Đang thực hiện (Phase: THINK)
- **Ngày khởi tạo**: 2025-12-18
