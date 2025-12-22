# BÁO CÁO KỸ THUẬT: HỆ THỐNG LẬP LỊCH THÔNG MINH SYNAPSE

## Phần 1: Tổng Quan Hệ Thống

### 1.1. Mục Tiêu Nghiệp Vụ

Bài toán lập lịch cho Spa cần giải quyết:
- **Tìm slot tối ưu**: Khách hàng đặt lịch → Tìm khung giờ tốt nhất
- **Cân bằng tải**: Phân bổ công việc đều giữa các KTV
- **Đáp ứng sở thích**: Ưu tiên KTV yêu thích của khách
- **Quản lý tài nguyên**: Giường, máy laser, thiết bị không bị trùng

### 1.2. Mô Hình Toán Học

Áp dụng **RCPSP** (Resource-Constrained Project Scheduling Problem) với:

**Hàm mục tiêu đa biến:**
```
Minimize Z = α·C_fair + β·C_pref + γ·C_idle
```

Trong đó:
- `C_fair`: Chi phí chênh lệch tải (Max - Min workload)
- `C_pref`: Chi phí sai sở thích (penalty khi không đúng KTV yêu thích)
- `C_idle`: Chi phí khoảng trống (gap giữa các booking)

**Trọng số mặc định:**
- α = 3.0 (Load Balance)
- β = 5.0 (Preference)
- γ = 1.0 (Utilization)

---

## Phần 2: Kiến Trúc Module

### 2.1. Cấu Trúc Files

```
scheduling_engine/
├── models.py                  # Data structures (Pydantic)
├── flexible_solver.py         # ✅ CORE: OR-Tools CP-SAT Solver
├── solver.py                  # SpaSolver cho Batch Assignment
├── slot_finder.py             # [Legacy] Thuật toán Incremental
├── data_extractor.py          # Trích xuất dữ liệu từ DB
├── evaluator.py               # Đánh giá kết quả (Jain Index)
├── service.py                 # Business Logic Layer
├── router.py                  # API Endpoints
├── benchmarks.py              # Performance Tests
├── test_*.py                  # Unit Tests
└── __init__.py                # Public API
```

### 2.2. Luồng Xử Lý

```
[API Request] → [Router] → [Service] → [FlexibleTimeSolver]
                                              ↓
                                        [OR-Tools CP-SAT]
                                              ↓
                                        [SlotOption[]]
```

---

## Phần 3: Đặc Tả Ràng Buộc

### 3.1. Ràng Buộc Cứng (Hard Constraints)

| Mã | Tên | Mô Tả | Implementation |
|----|-----|-------|----------------|
| H01 | Assignment | 1 slot = 1 staff + đủ resources | `AddExactlyOne` |
| H02 | Staff No-Overlap | KTV không làm 2 việc cùng lúc | `_has_conflict()` |
| H03 | Resource No-Overlap | Resource không dùng song song | `_has_resource_conflict()` |
| H04 | Skill Matching | KTV phải có skill yêu cầu | Filter `qualified_staff` |
| H05 | Resource Group | Resource đúng nhóm | `group_id` match |
| H06 | Shift Boundaries | Slot trong ca làm việc | `_is_staff_in_shift()` |
| H07 | Operating Hours | Slot trong giờ mở cửa | `search_start/end` |
| H08 | Continuity | Không bị ngắt quãng | Fixed duration |
| H09 | Existing Conflict | Không trùng lịch đã xác nhận | `existing_assignments` |

### 3.2. Ràng Buộc Mềm (Soft Constraints)

| Mã | Tên | Phạt | Mục Tiêu |
|----|-----|------|----------|
| S01 | Preference | 100 điểm/violation | Tối đa hóa CSAT |
| S02 | Load Balance | 1 điểm/phút lệch | Công bằng nhân viên |
| S03 | Gap Minimization | 1 điểm/phút gap | Tối đa doanh thu |

---

## Phần 4: Kết Quả Thực Nghiệm

### 4.1. Unit Tests - 23 Test Cases

#### 4.1.1. Hard Constraints (9 tests)

**Test H02 - Staff No-Overlap:**
```
Scenario: KTV đã có booking 10:00-12:00
Input:    Tìm slot 60 phút
Expected: Không có slot nào bắt đầu trong 10:00-12:00
Result:   ✓ PASS
```

**Test H04 - Skill Matching:**
```
Scenario: 2 KTV, 1 có skill Massage, 1 có skill Facial
Input:    Yêu cầu skill Massage
Expected: Chỉ trả về KTV có skill Massage
Result:   ✓ PASS
```

**Test H06 - Shift Boundaries:**
```
Scenario: KTV làm việc 9:00-17:00
Input:    Tìm slot 60 phút
Expected: Tất cả slot trong 9:00-17:00
Result:   ✓ PASS
```

#### 4.1.2. Soft Constraints (3 tests)

**Test S01 - Preference:**
```
Scenario: 2 KTV, khách yêu thích KTV_1
Input:    preferred_staff_id = KTV_1, weight_preference = 10.0
Expected: KTV_1 có score cao nhất, đứng đầu danh sách
Result:   ✓ PASS
```

**Test S02 - Load Balance:**
```
Scenario: KTV_A đã có 4 booking, KTV_B chưa có
Input:    weight_load_balance = 10.0, weight_preference = 0.0
Expected: KTV_B được ưu tiên (slot đầu tiên)
Result:   ✓ PASS
```

**Test S03 - Gap Minimization:**
```
Scenario: Có booking 10:00-11:00
Input:    Tìm slot sau 11:00, weight_utilization = 10.0
Expected: Slot 11:15 (liền kề) có score cao hơn slot 14:00
Result:   ✓ PASS
```

#### 4.1.3. Multi-Resource (3 tests)

**Test Two Groups:**
```
Scenario: Dịch vụ cần 1 Giường + 1 Máy Laser
Input:    required_resource_group_ids = [bed_group, equip_group]
Expected: Mỗi slot trả về đúng 2 resources
Result:   ✓ PASS
```

#### 4.1.4. Edge Cases (5 tests)

| Test | Scenario | Expected | Result |
|------|----------|----------|--------|
| No Staff | Không có KTV nào | [] | ✓ PASS |
| No Qualified | Không ai có skill | [] | ✓ PASS |
| Fully Booked | KTV kín lịch | [] | ✓ PASS |
| Duration Too Long | 3h > ca 2h | [] | ✓ PASS |
| Empty Resources | Không cần resource | OK với staff | ✓ PASS |

#### 4.1.5. Score/Ranking (3 tests)

| Test | Scenario | Expected | Result |
|------|----------|----------|--------|
| Best First | TOP 5 slots | Score giảm dần | ✓ PASS |
| Consistent | Cùng input 2 lần | Cùng output | ✓ PASS |
| Weight Impact | Thay đổi weight | Thay đổi kết quả | ✓ PASS |

### 4.2. Performance Benchmark

#### 4.2.1. Realistic Scenario (10 KTV, 50 booking)

| Metric | FCFS | OR-Tools | Cải thiện |
|--------|------|----------|-----------|
| Thời gian | - | **70ms** | Real-time ✓ |
| Preference Rate | 3.7% | **42.9%** | **+39.2%** |
| Jain Index | 0.9693 | 0.9514 | Trade-off |

#### 4.2.2. Stress Test TOÀN DIỆN (Skills + Resources + Preferences)

**Cấu hình Test:**
- **Skills**: 3 loại (Massage, Facial, Body) - mỗi KTV có 1-3 skills random
- **Resources**: 2 groups (Giường, Thiết bị) - 50% cần 1 group, 50% cần cả 2
- **Preferences**: 50% booking có KTV yêu thích
- **Workload**: Không đều (mô phỏng thực tế)
- **Duration**: Random (30, 45, 60, 90 phút)

| Quy mô | Staff | Resources | Skills | Pref% | Time | Status |
|--------|-------|-----------|--------|-------|------|--------|
| 10x20 | 10 | 5 | 3 | 30% | **73ms** | ✓ |
| 15x50 | 15 | 8 | 3 | 40% | **76ms** | ✓ |
| 20x100 | 20 | 12 | 3 | 50% | ~80ms | ✓ |
| 30x150 | 30 | 20 | 3 | 50% | ~90ms | ✓ |

**Kết luận:** Thời gian phản hồi < 100ms với đầy đủ ràng buộc đa mục tiêu.

---

## Phần 5: So Sánh Với Thiết Kế

| Tiêu chí | algorithm_spec.md | Implementation | Độ phủ |
|----------|-------------------|----------------|--------|
| Hard Constraints | 9 | 9 | **100%** |
| Soft Constraints | 4 | 3 | **75%** (S04 bỏ) |
| Multi-Resource | Có | Có | **100%** |
| OR-Tools CP-SAT | Có | Có | **100%** |

**Lý do bỏ S04 (Gender):** Đa số Spa có nhân viên nữ 100%, constraint không có ý nghĩa.

---

## Phần 6: Kết Luận

### 6.1. Đạt Được

- ✅ Thuật toán tối ưu hóa đa mục tiêu hoạt động đúng
- ✅ 23/23 unit tests PASS (100%)
- ✅ Thời gian phản hồi < 100ms (Real-time)
- ✅ Preference tăng từ 3.7% lên 42.9%
- ✅ Multi-Resource support

### 6.2. Hướng Phát Triển

- Thêm `buffer_time_minutes` từ service
- Thêm `resource.status` filter (MAINTENANCE)
- Tích hợp Rescheduling (S04 - Stability)

---

## Phụ Lục: Chạy Tests

```bash
# Chạy comprehensive tests
cd backend && source venv/Scripts/activate
python -m src.modules.scheduling_engine.test_flexible_solver_comprehensive

# Chạy benchmark
python -m src.modules.scheduling_engine.benchmarks
```
