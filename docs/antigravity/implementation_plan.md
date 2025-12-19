# Backend Module Refactoring - Scheduling Module Renaming

## Vấn đề
Hiện tại trong `backend/src/modules/` tồn tại hai module có tên gần giống nhau dễ gây nhầm lẫn:
- `schedules`: Quản lý dữ liệu lịch làm việc (Shifts, Staff Assignments).
- `scheduling`: Chứa logic thuật toán tối ưu hóa (OR-Tools, Solver).

Sự tương đồng về tên gọi (`schedule` vs `scheduling`) dẫn đến khó khăn trong việc phân biệt trách nhiệm của từng module và dễ gây lỗi khi import.

## Mục đích
- Làm rõ trách nhiệm (Single Responsibility) của từng module.
- `schedules` -> Tập trung vào Dữ liệu (State/Data).
- `scheduling_engine` -> Tập trung vào Tính toán (Logic/Solver).

## Mục tiêu (Requirements)
- [ ] Đổi tên module `scheduling` thành `scheduling_engine`.
- [ ] Cập nhật toàn bộ các tham chiếu import trong codebase Backend.
- [ ] Cấu hình lại Router trong `main.py`.
- [ ] Đảm bảo tính nhất quán trong Frontend (nếu có gọi API cụ thể hoặc types liên quan).

## Phân tích tác động (Impact Analysis)
- **Files bị ảnh hưởng**:
  - Toàn bộ files trong `src/modules/scheduling/` (nội bộ).
  - `src/app/main.py` (Router registration).
  - Các module khác có import từ `scheduling` (ví dụ: `bookings` hoặc `staff` nếu có).
- **Broken links**: Đường dẫn API prefix có thể thay đổi nếu không được giữ nguyên. Cần giữ prefix `/scheduling` cho API để không làm hỏng Frontend, nhưng tên biến/module trong code đổi thành `scheduling_engine`.

## Giải pháp (Solution Design)
1. **Giai đoạn chuẩn bị**: Tìm tất cả các vị trí sử dụng `src.modules.scheduling`.
2. **Thực thi**:
   - Sử dụng lệnh `mv` hoặc `rename` để đổi tên folder.
   - Sử dụng regex replace để cập nhật các câu lệnh import.
   - Sửa biến module trong `main.py`.
3. **Kiểm tra**:
   - Chạy test (nếu có).
   - Kiểm tra API Health.

---

## Kế hoạch chi tiết (Task Breakdown)

### Phase 1: Preparation & Renaming
- [ ] 1.1. Rename folder `backend/src/modules/scheduling` -> `backend/src/modules/scheduling_engine`.

### Phase 2: Code Updates
- [ ] 2.1. Cập nhật `src/modules/scheduling_engine/__init__.py`.
- [ ] 2.2. Update imports trong `backend/src/app/main.py`.
- [ ] 2.3. Tìm và sửa các câu lệnh `from src.modules import scheduling` hoặc `from src.modules.scheduling import ...` trong toàn bộ backend.

### Phase 3: Verification
- [ ] 3.1. Kiểm tra API documentation (Swagger) xem router có hoạt động đúng không.
- [ ] 3.2. Cập nhật các tài liệu liên quan (nếu có).
