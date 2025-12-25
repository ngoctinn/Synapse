# Kiến thức: Hệ thống Lập lịch & Phân bổ Tài nguyên (Scheduling Engine)

## 1. Tổng quan
Hệ thống Scheduling Engine của Synapse chịu trách nhiệm tìm kiếm các khung giờ khả dụng và gán tài nguyên (Nhân viên, Phòng/Máy) cho các dịch vụ spa. Hệ thống sử dụng Google OR-Tools (CP-SAT) để giải quyết bài toán tối ưu hóa đa mục tiêu (cân bằng tải, ưu tiên nhân viên, tối ưu hóa tài nguyên).

**Điểm nhập chính:**
- `solver.py`: Bộ giải Batch (dùng cho tái lập lịch hoặc xếp lịch tự động hàng loạt).
- `flexible_solver.py`: Bộ giải Real-time (dùng khi khách hàng tìm kiếm slot đặt lịch).
- `data_extractor.py`: Trích xuất và chuẩn hóa dữ liệu từ Database thành cấu trúc `SchedulingProblem`.

## 2. Luồng Dữ liệu & Logic Cốt lõi

### 2.1. Cấu trúc Dữ liệu (`scheduling_engine/models.py`)
- **`BookingItemData`**: Đại diện cho một dịch vụ cần được xếp lịch. Chứa thông tin:
  - `start_time`, `end_time`: Thời gian của Booking (hiện tại là cố định toàn bộ).
  - `required_resource_group_ids`: Danh sách các loại tài nguyên cần thiết (hiện tại chỉ là list ID đơn giản).
- **`SchedulingProblem`**: Chứa toàn bộ bối cảnh bài toán (items chưa gán, nhân viên, tài nguyên, lịch đã có).

### 2.2. Trích xuất Dữ liệu (`data_extractor.py`)
- **`_get_unassigned_items`**: Lấy danh sách BookingItems.
  - Hiện tại: Lấy `group_id` từ bảng `service_resource_requirements`.
  - Hạn chế: Không lấy thông tin `start_delay` hay `usage_duration` (do chưa có trong DB).
- **`_get_existing_assignments`**: Lấy danh sách các tài nguyên và nhân viên đang bận.
  - Hiện tại: Truy vấn `booking_items` joined với `booking_item_resources`.
  - Logic Conflict: Sử dụng `bi.start_time` và `bi.end_time` của toàn bộ dịch vụ làm thời gian bận của tài nguyên -> **Gây lãng phí tài nguyên**.

### 2.3. Logic Tìm Slot (`flexible_solver.py`)
- Mục tiêu: Tìm danh sách `SlotOption` (Start, End, Staff, Resources) tối ưu.
- **`find_optimal_slots`**:
  1. Tạo các khung giờ ứng viên (Candidate Slots).
  2. Lọc nhân viên khả dụng (theo ca làm việc, skill).
  3. **Kiểm tra Tài nguyên (`_find_available_resources_for_groups`)**:
     - Duyệt qua từng Resource Group yêu cầu.
     - Kiểm tra conflict của từng Resource trong Group (`_has_resource_conflict`).
     - **Vấn đề**: Hàm `_has_resource_conflict` hiện đang kiểm tra va chạm dựa trên toàn bộ thời lượng dịch vụ (`duration_minutes` của slot).

## 3. Database Schema Liên quan

### `services` Module
- **`service_resource_requirements`**: Bảng liên kết N-N giữa `Service` và `ResourceGroup`.
  - Cột hiện tại: `service_id`, `group_id`, `quantity`.
  - **Thiếu**: `start_delay`, `usage_duration` để định nghĩa cửa sổ sử dụng.

### `resources` Module
- **`booking_item_resources`**: Lưu kết quả gán tài nguyên thực tế.
  - Cột: `booking_item_id`, `resource_id`.
  - Dữ liệu thời gian được suy diễn từ bảng cha `booking_items`.

## 4. Chiến lược Refactor: Resource Occupancy Window

Để giải quyết vấn đề lãng phí tài nguyên (ví dụ: máy chỉ dùng 15p trong dịch vụ 60p), cần thực hiện các thay đổi sau:

### 4.1. Database Migration
- Thêm cột vào `service_resource_requirements`:
  - `start_delay` (int): Thời gian chờ từ lúc bắt đầu dịch vụ (phút).
  - `usage_duration` (int, nullable): Thời gian sử dụng. Nếu NULL -> dùng đến hết dịch vụ.

### 4.2. BookingItemData Structure
- Thay đổi `required_resource_group_ids: list[uuid.UUID]` thành:
  - `required_resources: list[ResourceRequirementData]`
  - `ResourceRequirementData`: chứa `group_id`, `start_delay`, `usage_duration`.

### 4.3. Solver Logic Update (`flexible_solver.py`)
- Cập nhật hàm `_has_resource_conflict`:
  - Input: `slot_start`, `requirement` (chứa delay/duration).
  - Logic tính toán cửa sổ bận:
    - `usage_start` = `slot_start` + `requirement.start_delay`
    - `usage_end` = `usage_start` + `requirement.usage_duration`
  - So sánh va chạm dựa trên cửa sổ mới này thay vì `slot_start` -> `slot_end`.

## 5. Phụ thuộc & Rủi ro
- **Rủi ro**: Việc thay đổi logic check conflict có thể làm tăng độ phức tạp tính toán nếu cửa sổ quá nhỏ hoặc vụn vặt.
- **Dependencies**: `DataExtractor` cần được cập nhật đồng bộ để populate đúng dữ liệu mới cho Solver.
