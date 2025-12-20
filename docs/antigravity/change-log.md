# Change Log - Antigravity Workflow

## [2025-12-20] Phase 2: Scheduling Engine Expansion (Auto Reschedule)

### Cập Nhật
- `backend/src/modules/scheduling_engine/models.py`
  - Thêm `ConflictCheckResponse`, `ConflictInfo`, `ConflictType`.
  - Thêm `RescheduleRequest`, `RescheduleResult`.
  - Cập nhật Pydantic models với `ConfigDict`.

- `backend/src/modules/scheduling_engine/service.py` (Mới)
  - Refactor logic từ `router.py` sang `SchedulingService`.
  - Thêm method `check_conflicts`: Tìm booking bị ảnh hưởng bởi staff unavailable.
  - Thêm method `reschedule`: Tự động tìm slot thay thế cho items bị conflict.

- `backend/src/modules/scheduling_engine/data_extractor.py`
  - Update `_get_existing_assignments` hỗ trợ `exclude_item_ids`.
  - Fix logic `extract_problem` để cho phép Solver xử lý lại items đã gán (Reschedule mode).

- `backend/src/modules/scheduling_engine/router.py`
  - Refactor toàn bộ endpoints sử dụng `SchedulingService`.
  - Thêm API `GET /conflicts`.
  - Thêm API `POST /reschedule`.

### API Endpoints Mới
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/scheduling/conflicts` | Kiểm tra xung đột (VD: khi NV nghỉ) |
| POST | `/scheduling/reschedule` | Tự động tìm người thay thế cho bookings bị conflict |

### Logic Tái Lập Lịch
1.  Nhận danh sách `conflict_booking_item_ids`.
2.  Trích xuất bài toán với các items này được coi là "unassigned" và loại trừ khỏi "existing assignments".
3.  Chạy Solver để tìm `staff/resource` khác phù hợp (giữ nguyên giờ).
4.  Trả về kết quả Assignments mới hoặc danh sách Failed Items.

### Kiểm Tra
- ✅ Import test passed.
- ✅ DataExtractor logic patched.
- ✅ Solver logic unchanged (stable).

## [2025-12-20] Phase 1: Operating Hours Module
... (như cũ)
