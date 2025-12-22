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
- $R$: Tập hợp các Tài nguyên (Resources), được phân loại thành Bed hoặc Equipment. Mỗi tài nguyên là một thực thể nguyên tử (Atomic).
- $B$: Tập hợp các yêu cầu đặt lịch (Bookings). Mỗi booking $b$ bao gồm một hoặc nhiều dịch vụ con (items) $i$.

### 2.2. Biến Quyết định (Decision Variables)
Hệ thống sử dụng biến nhị phân $x_{i, s, r_k, t}$ để biểu diễn trạng thái:
$$x_{i, s, \{r\}, t} = 1$$
Nếu dịch vụ item $i$ được gán cho nhân viên $s$, và bộ tài nguyên $\{r\}$ (bao gồm 1 hoặc nhiều tài nguyên), bắt đầu tại thời điểm $t$.

## 3. Đặc tả Chi tiết Các Ràng buộc (Constraints Specification)

Hệ thống tuân thủ nghiêm ngặt các ràng buộc sau. Vi phạm **Ràng buộc Cứng** sẽ khiến lịch không khả thi. Vi phạm **Ràng buộc Mềm** sẽ bị phạt điểm trong hàm mục tiêu.

### 3.1. Ràng buộc Cứng (Hard Constraints) - BẮT BUỘC

| Mã | Tên Ràng buộc | Mô tả Chi tiết | Logic Hệ thống (OR-Tools) |
|:---|:---|:---|:---|
| **H01** | **Gán Đủ và Duy nhất (Assignment Completeness)** | Một dịch vụ (item) phải được gán cho **chính xác 1 Nhân viên** và **đủ số lượng Tài nguyên** theo yêu cầu (Resource Requirements). | `AddExactlyOne` cho Staff; `AddExactlyOne` cho mỗi Resource Group yêu cầu. |
| **H02** | **Nhân viên Không chồng chéo (Staff No-Overlap)** | Một nhân viên không thể thực hiện 2 dịch vụ cùng lúc. | `AddNoOverlap(staff_intervals)` |
| **H03** | **Tài nguyên Không chồng chéo (Resource No-Overlap)** | Một Tài nguyên (Giường hoặc Thiết bị) không thể được sử dụng bởi 2 dịch vụ cùng lúc. | `AddNoOverlap(resource_intervals)` cho mỗi atomic resource. |
| **H04** | **Khớp Kỹ năng (Skill Matching)** | Nhân viên được gán phải sở hữu **tất cả** các kỹ năng (Skills) mà dịch vụ yêu cầu. | Filter `available_staff` theo `required_skill_ids` trước khi tạo biến. |
| **H05** | **Khớp Nhóm Tài nguyên (Resource Group Matching)** | Tài nguyên được gán phải thuộc đúng Nhóm (Group) mà dịch vụ yêu cầu (VD: Dịch vụ cần 1 Giường và 1 Máy Laser -> Phải gán đúng 1 Resource thuộc Group 'Giường' và 1 Resource thuộc Group 'Máy Laser'). | Filter `available_resources` theo `group_id`. |
| **H06** | **Ca làm việc (Shift Boundaries)** | Thời gian bắt đầu và kết thúc dịch vụ phải nằm trọn trong ca làm việc của nhân viên. | `AddIteration` kiểm tra `shift_start <= item_start` và `item_end <= shift_end`. |
| **H07** | **Giờ Mở cửa (Operating Hours)** | Dịch vụ không được diễn ra ngoài giờ mở cửa của Spa hoặc trong các ngày nghỉ lễ/đóng cửa. | Pre-processing data đầu vào. |
| **H08** | **Tính Liên tục (Continuity)** | Dịch vụ không được bị ngắt quãng (preemption). Một khi bắt đầu phải diễn ra liên tục đến khi kết thúc. | `NewOptionalFixedSizeIntervalVar` (thời lượng cố định). |
| **H09** | **Xung đột Lịch cũ (Existing Conflict)** | Lịch mới không được đè lên các lịch đã Chốt (Confirmed/Booked) trong Database. | Loại bỏ các khoảng thời gian `ExistingAssignment` khỏi domain của biến. |

### 3.2. Ràng buộc Mềm (Soft Constraints) - TỐI ƯU HÓA

| Mã | Tên Ràng buộc | Mô tả & Cách tính Phạt (Penalty) | Mục tiêu |
|:---|:---|:---|:---|
| **S01** | **Sở thích KTV (Staff Preference)** | Nếu khách yêu cầu đích danh KTV A, nhưng hệ thống xếp cho KTV B. <br> **Phạt:** +1000 điểm. | Tối đa hóa **CSAT**. |
| **S02** | **Cân bằng Tải (Load Balancing)** | Tối thiểu hóa sự chênh lệch workload giữa các nhân viên. <br> **Phạm vi (Horizon):** Tính toán dựa trên tổng thời lượng (phút) được gán cho mỗi nhân viên trong một ngày cụ thể (`target_date`). <br> **Cơ chế:** Sử dụng kỹ thuật "Tuyến tính hóa" (Linearization) để làm Linear Proxy cho chỉ số Jain. Chỉ số công bằng Jain (Jain's Fairness Index) là thước đo tiêu chuẩn cho sự công bằng, nhưng công thức gốc của nó chứa các phép toán phi tuyến tính gây khó khăn cho bộ giải CP-SAT. <br> **Thực nghiệm:** Sử dụng kỹ thuật Tuyến tính hóa (Linearization) thông qua việc tối thiểu hóa độ lệch tải trọng: $C_{fair} = \text{Max}(L_s) - \text{Min}(L_s)$. | Tối đa hóa **Fairness**. |
| **S03** | **Lấp đầy Khe hở (Gap Minimization)** | Ưu tiên xếp lịch khít nhau, hạn chế các khoảng trống nhỏ (VD: 15p) khó bán được cho khách khác. <br> **Phạt:** + điểm tương ứng với độ lớn khoảng trống. | Tối đa hóa **Utilization/Revenue**. |
| **S04** | **Ổn định Lịch (Stability)** | (Trong trường hợp Rescheduling) Hạn chế đổi giờ hoặc đổi người của các khách đã đặt. <br> **Phạt:** + điểm cho mỗi sự thay đổi so với lịch gốc. | **Customer Retention**. |


## 4. Hàm Mục tiêu (Objective Function)

Hệ thống áp dụng mô hình tối ưu hóa dựa trên việc cực tiểu hóa tổng chi phí phạt (Cost/Penalty minimization). Hàm mục tiêu $Z$ được thiết kế dưới dạng tổng trọng số của các thành phần đa mục tiêu:

$$ \text{Minimize } Z = \alpha \cdot C_{fair} + \beta \cdot C_{pref} + \gamma \cdot C_{idle} + \delta \cdot C_{perturb} $$

### 4.1. Hệ số Phạt Cơ sở (Base Penalty Coefficients)
Để các thành phần có đơn vị khác nhau (phút, lần, trạng thái) có thể cộng dồn vào một hàm mục tiêu duy nhất, hệ thống quy định các **Hệ số Phạt Cơ sở (Base Penalties)** trong mã nguồn như sau:

| Thành phần | Công thức Chi phí Gốc ($C$) | Hệ số Cơ sở ($K$) | Ý nghĩa đơn vị |
| :--- | :--- | :---: | :--- |
| **$C_{fair}$** | $\text{Max}(Load) - \text{Min}(Load)$ | **1** | Phạt 1 điểm cho mỗi phút chênh lệch. |
| **$C_{idle}$** | $\sum (\text{Span}_s - \text{Load}_s)$ | **1** | Phạt 1 điểm cho mỗi phút nhàn rỗi. |
| **$C_{pref}$** | $\sum (\text{Vi phạm sở thích})$ | **10** | 1 lần sai KTV yêu thích $\approx$ 10 phút lệch tải. |
| **$C_{perturb}$** | $\sum (\text{Xáo trộn lịch cũ})$ | **20** | 1 lần đổi KTV lịch cũ $\approx$ 20 phút lệch tải. |

**Công thức triển khai thực tế:**
$$ Z = \alpha \cdot (K_{fair} \cdot C_{fair}) + \beta \cdot (K_{pref} \cdot C_{pref}) + \dots $$

Trong đó:
- **Hệ số Cơ sở ($K$):** Được lập trình viên thiết lập để định nghĩa "tỷ giá" giữa các mục tiêu khác loại (phút vs lần).
- **Trọng số điều chỉnh ($\alpha, \beta, \gamma, \delta$):** Do người dùng (Chủ Spa) cấu hình trong dải $[0, 10]$ để thực thi chiến lược ưu tiên.
- **$\alpha, \beta, \gamma, \delta$:** Các trọng số điều chỉnh (normalized weights) thường nằm trong khoảng $[0, 10]$, cho phép nhà quản trị tùy biến chiến lược ưu tiên của Spa theo từng thời điểm kinh doanh.

> [!TIP]
> **Tính Tuyến tính hóa (Linearization):** Trong quá trình giải bằng CP-SAT, thành phần $C_{fair}$ được mô hình hóa bằng đại lượng Max-Min Deviation. Đây là một **Linear Proxy** (đại diện tuyến tính) quan trọng giúp tăng tốc độ hội tụ của thuật toán trong khi vẫn đảm bảo sự tương quan cao với Chỉ số Công bằng Jain thực tế.

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
## 7. Đánh giá Hiệu quả Cân bằng tải (Fairness Verification)

Để kiểm chứng hiệu quả của hàm mục tiêu tuyến tính hóa (Minimize Max-Min Load) trong việc đảm bảo sự công bằng, hệ thống thực hiện đo lường lại kết quả lập lịch bằng Chỉ số công bằng Jain (Jain's Fairness Index).

**Công thức kiểm chứng (Evaluation Metric):**
$$ J = \frac{(\sum_{i=1}^{n} T_i)^2}{n \cdot \sum_{i=1}^{n} T_i^2} $$

### 7.3. Sự kết hợp giữa Sở thích (Preference) và Công bằng (Fairness)
Hệ thống giải quyết bài toán "Chọn KTV" và "Cân bằng tải" thông qua mô hình **Phạt theo cấp bậc (Tiered Penalties)**:

| Cấp độ | Thành phần mục tiêu | Điểm phạt (Mặc định) | Ý nghĩa nghiệp vụ |
| :--- | :--- | :---: | :--- |
| **Vô hạn** | Ràng buộc Cứng (Overlap, Skill) | `Infeasible` | Bắt buộc tuân thủ (Không thể trùng lịch). |
| **Cao** | **S01 - Sở thích** (Preference) | **~1000** | Ưu tiên kỳ vọng của khách hàng. |
| **Thấp** | **S02 - Cân bằng tải** (Min-Max) | **1đ / phút lệch** | Dàn đều công việc theo đơn vị phút. |
| **Thấp** | **S03 - Lấp đầy gap** (Idle time) | **1đ / phút rảnh** | Tối ưu doanh thu/Hiệu suất máy. |

**Cơ chế:** Khách vẫn được chọn KTV yêu thích, nhưng hệ thống sẽ âm thầm điều phối các lịch hẹn khác (không yêu cầu đích danh) sang các nhân viên rảnh hơn để giảm tổng điểm phạt của $C_{fair}$.

**Kết luận thực nghiệm (Quy mô 10 KTV, 50 đặt lịch):**
- Khi **không** tối ưu công bằng (Ưu tiên sở thích): Độ lệch Max-Min là 195 phút, chỉ số Jain 0.9757, thời gian giải **0.09s**.
- Khi **áp dụng** thuật toán (Min-Max + Trọng số 50.0): Độ lệch Max-Min giảm xuống chỉ còn **15 phút**, chỉ số Jain đạt **0.9999**, thời gian giải **0.75s**.
- **Hiệu năng:** Dù độ phức tạp tăng lên nhưng thời gian giải vẫn giữ ở mức **dưới 1 giây**, đảm bảo tính khả thi cho ứng dụng web (Real-time Scheduling).
