# Nghiên cứu Giao diện Cấu hình Lịch Bảo trì Thiết bị

## 1. Giới thiệu
Tài liệu này tổng hợp kết quả nghiên cứu về việc thiết kế giao diện cấu hình lịch bảo trì thiết bị cho hệ thống Synapse. Mục tiêu là tạo ra một trải nghiệm người dùng "Premium", trực quan, dễ sử dụng, hỗ trợ đắc lực cho việc quản lý bảo trì định kỳ và khắc phục sự cố.

## 2. Hiện trạng Codebase
Qua quá trình tìm kiếm trong codebase hiện tại (`backend/src` và `frontend/src`):
- **Không tìm thấy** các module hoặc concept liên quan đến "Equipment" (Thiết bị), "Maintenance" (Bảo trì) hay "Device".
- **Có sẵn** các thành phần UI liên quan đến Lịch và Thời gian trong `frontend/src/features/appointments`:
    - `AppointmentCalendar`: Component lịch chính.
    - `ResourceTimeline`: Hiển thị tài nguyên theo trục thời gian (có thể tái sử dụng để hiển thị lịch bảo trì của từng thiết bị).
    - Các component UI cơ bản (Button, Input, Modal) theo phong cách Premium Spa.

**Kết luận:** Đây là một tính năng hoàn toàn mới, cần thiết kế từ Database Schema đến UI/UX, nhưng có thể tận dụng lại các pattern về Lịch và Form hiện có.

## 3. Các Pattern UI/UX Phổ biến (Nghiên cứu bên ngoài)
Dựa trên các best practices cho hệ thống quản lý bảo trì (CMMS) và lập lịch:

### 3.1. Cấu hình Lặp lại (Recurrence)
Đây là chức năng cốt lõi cho bảo trì định kỳ (Preventive Maintenance).
- **Tần suất:** Hàng ngày, Hàng tuần, Hàng tháng, Hàng năm.
- **Tùy chỉnh:** "Mỗi 2 tuần vào thứ Hai", "Ngày 15 hàng tháng".
- **Điều kiện dừng:** Không bao giờ, Sau ngày X, Sau N lần lặp.
- **Xử lý ngoại lệ:** Cho phép sửa/hủy một lần bảo trì cụ thể trong chuỗi lặp mà không ảnh hưởng toàn bộ chuỗi.

### 3.2. Giao diện Lịch (Calendar View)
- **Trực quan hóa:** Hiển thị các đợt bảo trì trên lịch (Tháng/Tuần/Ngày).
- **Mã màu:** Phân biệt trạng thái (Sắp tới - Xanh, Quá hạn - Đỏ, Đang thực hiện - Vàng, Hoàn thành - Xám).
- **Tương tác:** Kéo thả để đổi lịch (Reschedule), click để xem chi tiết.

### 3.3. Quản lý Trạng thái & Lịch sử
- Cần phân biệt rõ giữa "Lịch dự kiến" (Schedule) và "Nhật ký thực hiện" (Log).
- Hiển thị lịch sử bảo trì của từng thiết bị để theo dõi độ bền và hiệu quả.

## 4. Đề xuất Thiết kế (Premium Spa Aesthetic)

### 4.1. Data Model (Dự kiến)
Cần thêm module `equipment` vào `backend/src/modules/`.

```python
# backend/src/modules/equipment/models.py

class Equipment(SQLModel, table=True):
    id: uuid.UUID
    name: str
    serial_number: str | None
    status: str # Active, Maintenance, Broken
    # ...

class MaintenanceSchedule(SQLModel, table=True):
    id: uuid.UUID
    equipment_id: uuid.UUID
    title: str
    description: str | None
    frequency: str # DAILY, WEEKLY, MONTHLY
    interval: int # e.g., 2 (weeks)
    start_date: date
    end_date: date | None
    # ...

class MaintenanceLog(SQLModel, table=True):
    id: uuid.UUID
    schedule_id: uuid.UUID | None
    equipment_id: uuid.UUID
    performed_at: datetime
    status: str # COMPLETED, SKIPPED
    notes: str | None
```

### 4.2. Giao diện Người dùng (Frontend)

#### A. Dashboard Quản lý Thiết bị & Bảo trì
Sử dụng layout 2 cột hoặc Tab view:
1.  **Danh sách Thiết bị (Sidebar/Table):**
    - Hiển thị danh sách thiết bị với trạng thái hiện tại (Đang hoạt động, Đang bảo trì).
    - Bộ lọc nhanh: "Cần bảo trì tuần này", "Quá hạn".
2.  **Lịch Bảo trì (Main View):**
    - Sử dụng `ResourceTimeline` (đã có) nhưng customize lại.
    - **Trục Y:** Danh sách Thiết bị.
    - **Trục X:** Thời gian.
    - **Event:** Các block bảo trì.

#### B. Form Cấu hình Lịch (Modal/Drawer)
Thiết kế Form với phong cách Premium:
- **Tiêu đề:** Font Serif sang trọng.
- **Input:** Sử dụng các Custom Input đã chuẩn hóa (`InputWithIcon`, `Select`, `DatePicker`).
- **Recurrence Editor:** Một section riêng biệt, sử dụng các chip hoặc toggle button để chọn tần suất lặp lại (thay vì dropdown nhàm chán).
    - Ví dụ: [Hàng ngày] [Hàng tuần] [Hàng tháng]
    - Khi chọn "Hàng tuần": Hiển thị các nút tròn [T2] [T3] ... [CN] để chọn ngày.
- **Visual Feedback:** Hiển thị dòng tóm tắt văn bản ngay bên dưới (VD: "Sẽ lặp lại vào Thứ 2 và Thứ 5 hàng tuần").

#### C. Quy trình Xử lý
1.  **Tạo lịch:** Admin chọn thiết bị -> Bấm "Lên lịch bảo trì" -> Mở Form -> Cấu hình lặp lại -> Lưu.
2.  **Nhắc nhở:** Hệ thống tự động tạo thông báo (Notification) khi đến hạn.
3.  **Thực hiện:** Kỹ thuật viên bấm vào lịch -> Chọn "Hoàn thành" -> Form cập nhật kết quả -> Lưu vào `MaintenanceLog`.

## 5. Kế hoạch Tiếp theo
1.  **Backend:** Tạo module `equipment` và các API CRUD cơ bản.
2.  **Frontend:**
    - Tạo trang `EquipmentPage`.
    - Xây dựng `MaintenanceScheduleForm` với UI lặp lại tùy chỉnh.
    - Tích hợp `ResourceTimeline` để hiển thị lịch bảo trì.
