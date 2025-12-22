# Tài liệu Hướng dẫn Kỹ thuật: Bộ giải Lập lịch RCPSP (Synapse Scheduling Engine)

Tài liệu này cung cấp cái nhìn chuyên sâu về bộ giải lập lịch thông minh được triển khai trong hệ thống Synapse CRM, dựa trên mô hình toán học RCPSP và thư viện Google OR-Tools CP-SAT.

---

## 1. Tổng quan Bộ giải

### 1.1 Vấn đề nghiệp vụ
Trong vận hành Spa, việc xếp lịch thủ công đối mặt với bài toán tổ hợp cực kỳ phức tạp:
- **Đa tài nguyên**: Một dịch vụ yêu cầu cùng lúc cả Kỹ thuật viên (KTV) có tay nghề phù hợp và tài nguyên vật lý (Phòng/Giường/Máy móc).
- **Ràng buộc thời gian**: Các lịch hẹn phải khớp với khung giờ hoạt động và ca làm việc của nhân viên.
- **Tối ưu hóa**: Không chỉ dừng lại ở việc xếp "vừa", hệ thống cần xếp "đẹp" (cân bằng tải cho nhân viên, giảm khoảng trống lịch).

### 1.2 Tại sao các phương pháp truyền thống thất bại?
- **First-Come-First-Serve (FCFS)**: Dễ dẫn đến việc gán tài nguyên hiếm cho các dịch vụ phổ thông, gây tắc nghẽn (bottleneck) cho các yêu cầu sau.
- **Heuristic đơn giản**: Không thể đảm bảo tính tối ưu toàn cục và thường xuyên gây ra xung đột khi số lượng booking tăng cao.

### 1.3 Lựa chọn Mô hình RCPSP
Chúng tôi lựa chọn mô hình **Resource-Constrained Project Scheduling Problem (RCPSP)**. Trong đó:
- Mỗi dịch vụ (Service) là một **Task**.
- Nhân sự và thiết bị là các **Resources** với năng suất (Capacity) giới hạn.
- Mục tiêu là tìm một phương án gán tài nguyên sao cho thỏa mãn mọi ràng buộc và tối ưu hóa các chỉ số vận hành.

---

## 2. Mô hình hóa bài toán

Bộ giải ánh xạ các thực thể kinh doanh của Spa sang các đối tượng toán học:

| Thực thể Spa | Đối tượng Toán học | Đặc điểm |
| :--- | :--- | :--- |
| **Dịch vụ (Booking Item)** | **Task / Activity** | Có thời gian bắt đầu (Start), kết thúc (End) và thời lượng (Duration) cố định. |
| **Kỹ thuật viên** | **Renewable Resource** | Capacity = 1 (mỗi thời điểm chỉ làm 1 việc). Có tập hợp kỹ năng (Skills). |
| **Phòng / Thiết bị** | **Renewable Resource** | Capacity = 1. Thuộc về một nhóm tài nguyên (Resource Group). |
| **Ca làm việc** | **Availability Window** | Giới hạn miền giá trị của biến thời gian. |

---

## 3. Các ràng buộc (Constraints)

Bộ giải thực thi hai loại ràng buộc để đảm bảo tính khả thi của lịch trình.

### 3.1 Ràng buộc cứng (Hard Constraints)
Đây là các quy tắc bắt buộc, nếu vi phạm, lịch trình sẽ bị coi là không hợp lệ:
1.  **Gán duy nhất (Exactly One)**: Mỗi dịch vụ phải được gán cho đúng một cặp (KTV, Tài nguyên) hợp lệ.
2.  **Không trùng lịch (No-Overlap)**:
    - Một KTV không thể thực hiện hai dịch vụ cùng lúc.
    - Một tài nguyên vật lý không thể được sử dụng bởi hai dịch vụ đồng thời.
3.  **Khớp kỹ năng (Skill Matching)**: KTV được gán phải sở hữu toàn bộ các kỹ năng yêu cầu bởi dịch vụ.
4.  **Ca làm việc (Working Hours)**: Thời gian thực hiện dịch vụ phải nằm hoàn toàn trong khung giờ làm việc của KTV.
5.  **Xung đột lịch hiện hữu (Conflict Avoidance)**: Bộ giải tự động loại trừ các khoảng thời gian đã được gán thủ công hoặc gán bởi các tiến trình khác.

### 3.2 Ràng buộc mềm (Soft Constraints)
Được triển khai thông qua các hình phạt (Penalty) trong hàm mục tiêu:
- **Sở thích khách hàng**: Ưu tiên gán đúng KTV mà khách hàng yêu cầu.
- **Tính liên tục**: Giảm thiểu các khoảng trống nhỏ giữa các lịch hẹn để tối ưu hiệu suất sử dụng.

---

## 4. Hàm mục tiêu (Objective Function)

Hệ thống không chỉ tìm nghiệm khả thi mà còn hướng tới nghiệm tối ưu nhất thông qua việc cực tiểu hóa hàm tổng chi phí (Penalty Score):

$$Minimize \quad Z = W_{pref} \cdot P_{pref} + W_{fair} \cdot P_{fair} + W_{util} \cdot P_{util}$$

Trong đó:
- **$P_{pref}$ (Preference Penalty)**: Cộng điểm phạt nếu KTV được gán không phải là người khách yêu cầu.
- **$P_{fair}$ (Load Balancing Penalty)**: Tính bằng $Max\_Load - Min\_Load$ của tất cả KTV. Mục tiêu là phân chia công việc công bằng, tránh tình trạng người quá bận, người quá rảnh.
- **$P_{util}$ (Gap Minimization)**: Tính bằng tổng thời gian rảnh xen kẽ giữa các dịch vụ của từng KTV. Việc cực tiểu hóa giá trị này tạo ra các khối lịch tập trung, giải phóng các khoảng thời gian lớn cho các booking mới.

---

## 5. Kiến trúc xử lý của bộ giải

Hệ thống hoạt động theo mô hình Pipeline 3 giai đoạn:

1.  **Tiền xử lý (Pre-processing)**:
    - Trích xuất dữ liệu từ Database thông qua `DataExtractor`.
    - Lọc danh sách KTV và Tài nguyên khả dụng dựa trên Skills và Schedule.
2.  **Bộ giải (Solver Core - CP-SAT)**:
    - Khởi tạo `CpModel`.
    - Khai báo các biến `OptionalIntervalVar` để đại diện cho các phương án gán.
    - Thêm các ràng buộc toán học.
    - Gọi động cơ `Solve()` để tìm nghiệm.
3.  **Hậu xử lý (Post-processing)**:
    - Chuyển đổi các biến nhị phân từ bộ giải về đối tượng `Assignment` có ý nghĩa nghiệp vụ.
    - Tính toán các chỉ số chất lượng (`SolutionMetrics`) như Jain's Fairness Index.

---

## 6. Quy trình chạy bộ giải (Step-by-step)

1.  **Nhận Request**: Hệ thống nhận danh sách các ID của dịch vụ cần xếp lịch.
2.  **Chuẩn hóa**: Chuyển đổi thời gian sang số phút tính từ đầu ngày ($0 \to 1439$).
3.  **Lọc ứng viên**: Với mỗi dịch vụ, xác định tập hợp các KTV đủ kỹ năng và có lịch làm việc phù hợp.
4.  **Thiết lập Model**:
    - Tạo biến logic $X_{i,s,r} = 1$ nếu dịch vụ $i$ gán cho nhân viên $s$ và phòng $r$.
    - Thêm ràng buộc `AddExactlyOne` cho mỗi dịch vụ trên tập hợp các biến $X$ tương ứng.
    - Sử dụng `AddNoOverlap` trên các `IntervalVar` tương ứng với mỗi nhân viên/phòng.
5.  **Giải toán**: Thực hiện tìm kiếm song song với giới hạn thời gian (mặc định 30 giây).
6.  **Trả kết quả**: Nếu tìm thấy nghiệm, hệ thống trả về danh sách phân công chi tiết kèm các chỉ số đánh giá.

---

## 7. Đầu vào – Đầu ra của bộ giải

### 7.1 Đầu vào (SchedulingProblem)
Cung cấp toàn bộ ngữ cảnh cần thiết:
- `unassigned_items`: Các dịch vụ chưa có người làm.
- `available_staff`: Danh sách KTV kèm mã kỹ năng.
- `available_resources`: Danh sách phòng/máy.
- `staff_schedules`: Ca làm việc cụ thể trong ngày.

### 7.2 Đầu ra (SchedulingSolution)
- `assignments`: Danh sách cặp gán (Item $\to$ Staff, Resource).
- `metrics`:
    - **Staff Utilization**: Hiệu suất sử dụng nhân sự.
    - **Jain Fairness Index**: Chỉ số độ công bằng (0 đến 1).
    - **Preference Satisfaction**: Tỷ lệ đáp ứng yêu cầu đích danh KTV.

---

## 8. Giới hạn hiện tại

- **Giả định thời lượng**: Bộ giải coi thời lượng dịch vụ là cố định (Deterministic). Chưa xử lý các trường hợp dịch vụ kéo dài hơn dự kiến một cách động.
- **Tính toán đơn ngày**: Hiện tại tối ưu hóa tốt nhất trên phạm vi từng ngày đơn lẻ.
- **Tài nguyên tĩnh**: Chưa tích hợp quản lý tồn kho tiêu hao (tinh dầu, dược liệu) vào bộ giải.

---

## 9. Khả năng mở rộng

- **Cấp độ kỹ năng (Skill Level)**: Thêm trọng số để gán các dịch vụ khó cho chuyên gia hoặc dịch vụ dễ cho học viên (mới bắt đầu).
- **Tối ưu hóa đa mục tiêu (Multi-objective optimization)**: Áp dụng phương pháp Pareto để cân bằng giữa lợi nhuận và sự hài lòng của nhân viên.
- **Dự báo nhu cầu (Demand Forecasting)**: Kết hợp AI để gợi ý thay đổi ca làm việc của nhân viên trước khi xung đột xảy ra.

---

## 10. Kết luận kỹ thuật

Bộ giải RCPSP được triển khai trong Synapse không chỉ là một công cụ tiện ích mà là "trái tim" của hệ thống quản lý vận hành. Bằng việc chuyển đổi các ràng buộc nghiệp vụ phức tạp thành mô hình Constraint Programming, hệ thống đảm bảo tính minh bạch, công bằng và hiệu quả cao nhất trong việc phân bổ tài nguyên Spa. Đây là sự khác biệt cốt lõi giữa Synapse và các phần mềm quản lý lịch hẹn thông thường.
