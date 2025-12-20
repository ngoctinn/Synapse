# ĐẶC TẢ CƠ CHẾ LẬP LỊCH THÔNG MINH TRONG HỆ THỐNG

## 1. Tổng quan Giải pháp
Hệ thống Synapse triển khai một cơ chế lập lịch dịch vụ dựa trên ràng buộc, nhằm giải quyết bài toán phân bổ các yêu cầu dịch vụ của khách hàng theo thời gian, đồng thời thỏa mãn các ràng buộc về nhân sự, tài nguyên vật lý và các tiêu chí chất lượng dịch vụ. Hệ thống áp dụng mô hình toán học **Tối ưu hóa Đa mục tiêu (Multi-Objective Optimization)** dựa trên lý thuyết Bài toán Xếp lịch Dự án Có Ràng buộc Tài nguyên (RCPSP).

Hệ thống được thiết kế để giải quyết bài toán cốt lõi: **"Làm thế nào để tối đa hóa doanh thu và hiệu suất sử dụng tài nguyên trong khi vẫn đảm bảo sự hài lòng cao nhất cho khách hàng và sự công bằng cho nhân viên?"**

### 1.1. Phạm vi Ứng dụng
- **Tự động xếp lịch (Auto-Scheduling):** Tìm kiếm các khung giờ khả dụng (slots) tối ưu cho khách hàng mới.
- **Tái lập lịch (Rescheduling):** Tự động sắp xếp lại lịch khi có sự cố (KTV nghỉ ốm, thiết bị hỏng) với mức độ xáo trộn thấp nhất.
- **Quản lý Tài nguyên chi tiết:** Quản lý đến từng Giường (Bed) và Ghế (Chair) cụ thể.

## 2. Mô hình Toán học

### 2.1. Định nghĩa Tập hợp (Sets)
- $T$: Tập hợp các khoảng thời gian (Time slots, độ phân giải 15 phút).
- $S$: Tập hợp nhân viên (Staff/Technicians).
- $R_{bed}$: Tập hợp các Tài nguyên Giường/Ghế (Beds/Chairs). **Lưu ý: Mỗi Giường/Ghế là một tài nguyên độc lập với Capacity = 1.**
- $B$: Tập hợp các yêu cầu đặt lịch (Bookings). Mỗi booking $b$ bao gồm một hoặc nhiều dịch vụ con (items) $i$.

### 2.2. Biến Quyết định (Decision Variables)
Hệ thống sử dụng biến nhị phân $x_{i, s, r, t}$ để biểu diễn trạng thái:
$$x_{i, s, r, t} = 1$$
Nếu dịch vụ item $i$ được gán cho nhân viên $s$, sử dụng giường/ghế $r$, bắt đầu tại thời điểm $t$.

## 3. Đặc tả Chi tiết Các Ràng buộc (Constraints Specification)

Hệ thống tuân thủ nghiêm ngặt các ràng buộc sau. Vi phạm **Ràng buộc Cứng** sẽ khiến lịch không khả thi. Vi phạm **Ràng buộc Mềm** sẽ bị phạt điểm trong hàm mục tiêu.

### 3.1. Ràng buộc Cứng (Hard Constraints) - BẮT BUỘC

| Mã | Tên Ràng buộc | Mô tả Chi tiết | Logic Hệ thống (OR-Tools) |
|:---|:---|:---|:---|
| **H01** | **Duy nhất Gán (One-to-One)** | Một dịch vụ (item) phải được gán cho chính xác **1 Nhân viên** và **1 Giường/Ghế** (nếu dịch vụ yêu cầu giường). | `AddExactlyOne(assignment_vars)` |
| **H02** | **Nhân viên Không chồng chéo (Staff No-Overlap)** | Một nhân viên không thể thực hiện 2 dịch vụ cùng lúc. | `AddNoOverlap(staff_intervals)` |
| **H03** | **Tài nguyên Không chồng chéo (Resource No-Overlap)** | Một Giường/Ghế không thể chứa 2 khách hàng cùng lúc. **Đây là lý do quản lý theo từng Bed/Chair ID giúp đảm bảo chính xác tuyệt đối.** | `AddNoOverlap(resource_intervals)` |
| **H04** | **Khớp Kỹ năng (Skill Matching)** | Nhân viên được gán phải sở hữu **tất cả** các kỹ năng (Skills) mà dịch vụ yêu cầu. | Filter `available_staff` theo `required_skill_ids` trước khi tạo biến. |
| **H05** | **Khớp Loại Tài nguyên (Resource Group)** | Giường/Ghế được gán phải thuộc đúng Nhóm (Group) phù hợp với dịch vụ (VD: Massage Body phải dùng giường có lỗ úp mặt, không dùng ghế Foot). | Filter `available_resources` theo `resource_group_id`. |
| **H06** | **Ca làm việc (Shift Boundaries)** | Thời gian bắt đầu và kết thúc dịch vụ phải nằm trọn trong ca làm việc của nhân viên. | `AddIteration` kiểm tra `shift_start <= item_start` và `item_end <= shift_end`. |
| **H07** | **Giờ Mở cửa (Operating Hours)** | Dịch vụ không được diễn ra ngoài giờ mở cửa của Spa hoặc trong các ngày nghỉ lễ/đóng cửa. | Pre-processing data đầu vào. |
| **H08** | **Tính Liên tục (Continuity)** | Dịch vụ không được bị ngắt quãng (preemption). Một khi bắt đầu phải diễn ra liên tục đến khi kết thúc. | `NewOptionalFixedSizeIntervalVar` (thời lượng cố định). |
| **H09** | **Xung đột Lịch cũ (Existing Conflict)** | Lịch mới không được đè lên các lịch đã Chốt (Confirmed/Booked) trong Database. | Loại bỏ các khoảng thời gian `ExistingAssignment` khỏi domain của biến. |

### 3.2. Ràng buộc Mềm (Soft Constraints) - TỐI ƯU HÓA

| Mã | Tên Ràng buộc | Mô tả & Cách tính Phạt (Penalty) | Mục tiêu |
|:---|:---|:---|:---|
| **S01** | **Sở thích KTV (Staff Preference)** | Nếu khách yêu cầu đích danh KTV A, nhưng hệ thống xếp cho KTV B. <br> **Phạt:** +1000 điểm. | Tối đa hóa **CSAT**. |
| **S02** | **Cân bằng Tải (Load Balancing)** | Tránh việc một KTV làm quá nhiều trong khi người khác ngồi chơi. <br> **Phạt:** Dựa trên độ lệch chuẩn (Variance) của tổng thời gian làm việc. | Tối đa hóa **Fairness**. |
| **S03** | **Lấp đầy Khe hở (Gap Minimization)** | Ưu tiên xếp lịch khít nhau, hạn chế các khoảng trống nhỏ (VD: 15p) khó bán được cho khách khác. <br> **Phạt:** + điểm tương ứng với độ lớn khoảng trống. | Tối đa hóa **Utilization/Revenue**. |
| **S04** | **Sở thích Giới tính (Gender Request)** | Khách nữ yêu cầu KTV nữ (quan trọng cho Body services). <br> **Phạt:** +5000 điểm (thường coi như xấp xỉ Hard Constraint). | Tối đa hóa **CSAT/Comfort**. |
| **S05** | **Ổn định Lịch (Stability)** | (Trong trường hợp Rescheduling) Hạn chế đổi giờ hoặc đổi người của các khách đã đặt. <br> **Phạt:** + điểm cho mỗi sự thay đổi so với lịch gốc. | **Customer Retention**. |

## 4. Hàm Mục tiêu (Objective Function)

Hàm mục tiêu tổng quát được định nghĩa làm cực tiểu hóa tổng chi phí phạt:

$$ \text{Minimize } Z = \alpha \cdot P_{pref} + \beta \cdot P_{fair} + \gamma \cdot P_{util} + \delta \cdot P_{perturb} $$

Trong đó:
- $P_{pref}$: Điểm phạt vi phạm sở thích khách hàng.
- $P_{fair}$: Điểm phạt mất cân bằng tải (dựa trên Jain's Fairness Index đảo ngược).
- $P_{util}$: Điểm phạt lãng phí tài nguyên (thời gian chết).
- $P_{perturb}$: Điểm phạt xáo trộn lịch (chỉ dùng khi Rescheduling).
- $\alpha, \beta, \gamma, \delta$: Các trọng số có thể cấu hình (Configurable Weights) tùy theo chiến lược kinh doanh của Spa (VD: Mùa cao điểm ưu tiên $P_{util}$, ngày thường ưu tiên $P_{pref}$).

## 5. Chiến lược Tái lập lịch (Rescheduling Strategy)
Khi xảy ra sự cố (KTV ốm, Giường hỏng), hệ thống sử dụng chiến lược **Minimal Perturbation (Xáo trộn Tối thiểu)**:

1.  **Nhận diện**: Xác định Resource/Staff bị hỏng và khoảng thời gian ảnh hưởng.
2.  **Khoanh vùng**: Tìm tất cả Booking bị ảnh hưởng trực tiếp.
3.  **Thay thế Cục bộ (Local Search)**:
    -   Thử tìm KTV/Giường thay thế có cùng Skill/Type trong cùng khung giờ.
    -   Nếu thành công -> Cập nhật, gửi thông báo thay đổi nhỏ.
4.  **Dịch chuyển (Shift)**:
    -   Nếu không thể thay thế, thử dịch chuyển giờ hẹn +/- 15-30 phút.
5.  **Leo thang (Escalation)**:
    -   Nếu không tìm được giải pháp máy, đánh dấu "Cần xử lý thủ công" (Manual Action Required) cho Lễ tân.

## 6. Công nghệ Triển khai
- **Core Solver**: Google OR-Tools (CP-SAT Solver).
- **Backend Lang**: Python 3.10+ (FastAPI).
- **Integration**:
    - Dữ liệu Input: Customer Requests, Staff Schedules, Resource Status (từ Database).
    - Biến đổi: Adapter pattern chuyển đổi DB Models -> Solver Models using Pydantic.
    - Output: List assignments -> DB Transactions.
