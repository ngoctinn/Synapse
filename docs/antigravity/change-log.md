# Nhật Ký Thay Đổi (Change Log)

## Phiên Làm Việc: 2025-12-16 (Giai đoạn 4)

### 🎓 GIAI ĐOẠN ĂN ĐIỂM HỌC THUẬT - SOLVER/RCPSP

---

### 1. Nghiên Cứu Công Nghệ

#### Google OR-Tools CP-SAT
- **Phiên bản:** 9.14.6206
- **Công nghệ:** Constraint Programming + Satisfiability
- **Nguồn tham khảo:**
  - [CP-SAT Primer](https://d-krupke.github.io/cpsat-primer/)
  - [Google Developer Docs - Employee Scheduling](https://developers.google.com/optimization/scheduling)
  - Khung lý thuyết từ `althorism.md`

#### Các khái niệm được áp dụng:
| Khái niệm | Ứng dụng trong Synapse |
|:---|:---|
| IntervalVar | Đại diện cho booking item (start, duration, end) |
| NoOverlap | Ràng buộc KTV và Phòng không overlap |
| OptionalInterval | Cho phép gán item cho nhiều KTV khác nhau |
| BoolVar | Biến quyết định x[item, staff, resource] |

---

### 2. Backend Code Changes

#### Module Mới: `src/modules/scheduling/`
| File | Mô Tả | Dòng Code |
|:---|:---|:---:|
| `models.py` | Data structures (Problem, Solution, Metrics) | ~180 |
| `data_extractor.py` | Trích xuất data từ DB | ~200 |
| `solver.py` | ⚡ **CORE**: OR-Tools CP-SAT Solver | ~300 |
| `evaluator.py` | Đánh giá và so sánh lịch | ~150 |
| `router.py` | API Endpoints | ~200 |
| `__init__.py` | Public API | ~50 |

**Tổng:** ~1,080 dòng code mới

---

### 3. Mô Hình Toán Học

```
Minimize Z = α·C_pref + β·C_idle + γ·C_fairness

Subject to:
1. ∀ item: exactly one (staff, resource) assignment
2. ∀ staff: NoOverlap(intervals)
3. ∀ resource: NoOverlap(intervals)
4. ∀ (item, staff): skill matching
5. ∀ (item, resource): resource group matching
6. ∀ (staff, time): within working schedule
```

---

### 4. API Endpoints Mới

| Method | Endpoint | Mô tả |
|:---|:---|:---|
| POST | `/scheduling/solve` | Giải bài toán lập lịch |
| POST | `/scheduling/evaluate` | Đánh giá lịch hiện tại |
| POST | `/scheduling/compare` | So sánh Manual vs Optimized |
| GET | `/scheduling/suggestions/{booking_id}` | Gợi ý cho booking cụ thể |
| GET | `/scheduling/health` | Kiểm tra OR-Tools |

---

### 5. Metrics Được Tính Toán

| Metric | Mô tả | Công thức |
|:---|:---|:---|
| `staff_utilization` | Tỷ lệ sử dụng KTV | assigned_time / available_time |
| `resource_utilization` | Tỷ lệ sử dụng Phòng | resource_time / total_time |
| `jain_fairness_index` | Công bằng workload | (Σx)² / (n·Σx²) |
| `preference_satisfaction` | Đáp ứng sở thích | matched / total_with_pref |
| `load_distribution` | Max/Min/Avg workload | Phút làm việc mỗi KTV |

---

### 6. Dependencies Mới

```txt
ortools>=9.10
```

**Cài đặt thành công:** ✅

---

### 7. Kiểm Tra

| Hạng Mục | Kết Quả |
|:---|:---:|
| OR-Tools Install | ✅ Pass |
| Backend Import | ✅ Pass |
| Module Structure | ✅ Complete |

---

### 8. Các File Đã Tạo

**Tạo mới:**
- `backend/src/modules/scheduling/models.py`
- `backend/src/modules/scheduling/data_extractor.py`
- `backend/src/modules/scheduling/solver.py`
- `backend/src/modules/scheduling/evaluator.py`
- `backend/src/modules/scheduling/router.py`
- `backend/src/modules/scheduling/__init__.py`

**Sửa đổi:**
- `backend/src/app/main.py`
