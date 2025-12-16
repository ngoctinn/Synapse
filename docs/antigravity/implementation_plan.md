# Kế Hoạch Triển Khai: SOLVER/RCPSP (Lập Lịch Thông Minh)

## 🎓 GIAI ĐOẠN ĂN ĐIỂM HỌC THUẬT

> **Chuyển từ:** "Lập lịch đúng" → "Lập lịch tốt"

---

## 1. Nghiên Cứu Công Nghệ

### 1.1 Google OR-Tools CP-SAT

**Tổng quan:**
- **CP-SAT** = Constraint Programming + Satisfiability
- Phiên bản mới nhất: OR-Tools 9.11 (2024)
- Hỗ trợ Python, C++, Java, C#
- **Miễn phí** và Open Source (Apache License 2.0)

**Tại sao chọn CP-SAT thay vì Genetic Algorithm:**
| Tiêu chí | CP-SAT | Genetic Algorithm |
|:---|:---|:---|
| Đảm bảo tối ưu | ✅ Toàn cục | ❌ Cục bộ |
| Xử lý ràng buộc | ✅ Native | ❌ Phải encode penalty |
| Khả năng giải thích | ✅ Cao | ❌ "Black box" |
| Tốc độ | ✅ Nhanh với bài toán nhỏ-vừa | ✅ Ổn định |
| Độ phức tạp triển khai | ✅ Đơn giản | ❌ Phức tạp |

### 1.2 Các Khái Niệm Quan Trọng

#### Interval Variables (Biến Khoảng)
```python
# Đại diện cho một task có start, duration, end
start = model.NewIntVar(0, horizon, 'start')
duration = 60  # 60 phút
end = model.NewIntVar(0, horizon, 'end')
interval = model.NewIntervalVar(start, duration, end, 'task')
```

#### NoOverlap Constraint (Ràng buộc Không Chồng Lấp)
```python
# Các task sử dụng cùng resource không được overlap
model.AddNoOverlap([interval1, interval2, interval3])
```

#### Optional Intervals (Biến Tuỳ Chọn)
```python
# Task có thể được gán cho resource này HOẶC không
is_present = model.NewBoolVar('is_present')
optional_interval = model.NewOptionalIntervalVar(
    start, duration, end, is_present, 'optional_task'
)
```

### 1.3 Mô Hình Toán Học (Theo althorism.md)

**Biến quyết định:**
$$x_{c,s,r,t} \in \{0, 1\}$$

Trong đó:
- $c$: Customer/Booking item
- $s$: Staff (KTV)
- $r$: Resource (Phòng)
- $t$: Time slot

**Ràng buộc cứng:**
1. **Unicité (Duy nhất):** Mỗi KTV chỉ phục vụ 1 khách tại 1 thời điểm
2. **Skill Matching:** KTV phải có skill phù hợp với dịch vụ
3. **Resource Capacity:** Phòng chỉ chứa 1 khách tại 1 thời điểm
4. **Schedule Bound:** KTV chỉ làm việc trong ca đã đăng ký

**Hàm mục tiêu:**
$$\text{Minimize } Z = \alpha \cdot C_{wait} + \beta \cdot C_{pref} + \gamma \cdot C_{idle}$$

---

## 2. Kiến Trúc Module

### 2.1 Cấu Trúc Thư Mục
```
src/modules/scheduling/
├── __init__.py
├── models.py           # SchedulingRequest, SchedulingSolution
├── data_extractor.py   # Trích xuất dữ liệu từ DB → Problem Instance
├── solver.py           # ⚡ CORE: OR-Tools CP-SAT Solver
├── evaluator.py        # Đánh giá chất lượng lịch
├── router.py           # API Endpoints
└── schemas.py          # DTOs
```

### 2.2 Các Class Chính

```python
class SchedulingProblem:
    """Bài toán lập lịch đã được trích xuất."""
    booking_items: list[BookingItemData]
    available_staff: list[StaffData]
    available_resources: list[ResourceData]
    staff_schedules: list[StaffScheduleData]
    staff_skills: list[StaffSkillData]
    time_horizon: tuple[datetime, datetime]

class SchedulingSolution:
    """Kết quả giải bài toán."""
    assignments: list[Assignment]  # (item_id, staff_id, resource_id, start_time)
    objective_value: float
    solve_time_ms: int
    status: str  # OPTIMAL, FEASIBLE, INFEASIBLE
    metrics: SolutionMetrics

class SolutionMetrics:
    """Các chỉ số đánh giá."""
    total_wait_time: int
    preference_satisfaction: float
    staff_utilization: float
    resource_utilization: float
    jain_fairness_index: float
```

---

## 3. API Endpoints

| Method | Endpoint | Mô tả |
|:---|:---|:---|
| POST | `/scheduling/solve` | Giải bài toán cho các booking items chưa gán |
| POST | `/scheduling/evaluate` | Đánh giá chất lượng lịch hiện tại |
| POST | `/scheduling/compare` | So sánh lịch thủ công vs tối ưu |
| GET | `/scheduling/suggestions/{booking_id}` | Gợi ý KTV + Phòng cho booking |

---

## 4. Chi Tiết Thuật Toán

### 4.1 Data Extraction Flow

```
Database Tables → Data Extractor → SchedulingProblem
    ↓
booking_items (chưa gán staff/resource)
    ↓
staff (available) + staff_schedules (working today)
    ↓
resources (available) + service_resource_requirements
    ↓
staff_skills + service_skills (matching)
```

### 4.2 CP-SAT Model Building

```python
# 1. Tạo biến cho mỗi booking_item
for item in booking_items:
    # Với mỗi KTV phù hợp, tạo optional interval
    for staff in qualified_staff:
        is_assigned = model.NewBoolVar(f'assign_{item.id}_{staff.id}')
        interval = model.NewOptionalIntervalVar(
            item.start_slot, item.duration_slots, item.end_slot,
            is_assigned, f'interval_{item.id}_{staff.id}'
        )
        # Lưu lại để add constraints

# 2. Ràng buộc: Mỗi item chỉ gán cho 1 KTV
model.AddExactlyOne(assignment_vars[item.id])

# 3. Ràng buộc: KTV không overlap
for staff_id in all_staff:
    intervals = get_intervals_for_staff(staff_id)
    model.AddNoOverlap(intervals)

# 4. Ràng buộc: Resource không overlap
for resource_id in all_resources:
    intervals = get_intervals_for_resource(resource_id)
    model.AddNoOverlap(intervals)

# 5. Ràng buộc: KTV phải trong ca làm việc
for item in booking_items:
    for staff in qualified_staff:
        if not is_staff_working(staff, item.time):
            model.Add(assignment_vars[item.id][staff.id] == 0)

# 6. Hàm mục tiêu: Tối thiểu hóa cost
# - Preference cost (KTV ưu tiên)
# - Idle time cost
# - Load balancing cost
model.Minimize(total_cost)
```

### 4.3 Evaluation Metrics

```python
def calculate_metrics(solution):
    # 1. Staff Utilization
    utilization = sum(staff_busy_time) / sum(staff_available_time)

    # 2. Resource Utilization
    resource_util = sum(resource_busy_time) / sum(resource_available_time)

    # 3. Jain Fairness Index (KTV workload)
    workloads = [get_workload(staff) for staff in all_staff]
    jain_index = (sum(workloads)**2) / (n * sum(w**2 for w in workloads))

    # 4. Preference Satisfaction
    pref_score = matched_preferences / total_preferences

    return SolutionMetrics(...)
```

---

## 5. Kịch Bản So Sánh (Cho Khóa Luận)

### 5.1 Scenario 1: Ngày bận (Peak Day)
- 20 booking items
- 5 KTV
- 8 phòng
- So sánh: Manual vs Optimized

### 5.2 Scenario 2: Ràng buộc skill chặt
- 15 booking items (dịch vụ chuyên môn cao)
- 5 KTV (chỉ 2 có đủ skill)
- So sánh khả năng đáp ứng

### 5.3 Scenario 3: Reactive Scheduling
- Giả lập sự cố: 1 KTV nghỉ đột xuất
- So sánh thời gian reschedule

---

## 6. Thứ Tự Thực Thi

### Phase 1: Foundation
1. **[BE]** Cài đặt OR-Tools (`pip install ortools`)
2. **[BE]** Tạo module `scheduling` với data structures
3. **[BE]** Implement `data_extractor.py`

### Phase 2: Core Solver
4. **[BE]** Implement `solver.py` - CP-SAT model
5. **[BE]** Implement `evaluator.py` - Metrics

### Phase 3: API
6. **[BE]** Tạo `router.py` - Endpoints
7. **[BE]** Đăng ký router

### Phase 4: Testing & Demo
8. **[TEST]** Tạo test scenarios
9. **[DOC]** Ghi lại kết quả so sánh

---

## 7. Tiêu Chí Nghiệm Thu

### Chức năng
- [ ] Solver trả về solution khả thi
- [ ] Không vi phạm hard constraints
- [ ] Có thể đánh giá solution

### Học thuật
- [ ] Có số liệu so sánh Manual vs Optimized
- [ ] Có Jain Fairness Index
- [ ] Có đồ thị/bảng biểu cho báo cáo

### Performance
- [ ] Giải được 20 items trong < 5 giây
- [ ] Có time limit option

---

## 8. Dependencies Mới

```txt
ortools>=9.10  # Google OR-Tools
```
