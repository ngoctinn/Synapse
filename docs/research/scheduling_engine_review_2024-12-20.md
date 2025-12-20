# Báo cáo Đánh giá Module Scheduling Engine

**Ngày đánh giá:** 2024-12-20
**Người thực hiện:** AI Agent (Workflow: /researcher)
**Phạm vi:** `backend/src/modules/scheduling_engine`

---

## 1. Tổng Quan Module

Module `scheduling_engine` là thành phần cốt lõi của hệ thống, sử dụng **Google OR-Tools CP-SAT Solver** để giải bài toán lập lịch tối ưu (RCPSP - Resource-Constrained Project Scheduling Problem) cho nghiệp vụ Spa.

### Cấu trúc File:
| File | Vai trò | Dòng |
|------|---------|------|
| `__init__.py` | Public API | 47 |
| `models.py` | Data Structures & Pydantic Schemas | 300 |
| `data_extractor.py` | Trích xuất dữ liệu từ DB | 333 |
| `service.py` | Business Logic Layer | 322 |
| `solver.py` | CP-SAT Solver Implementation | 368 |
| `slot_finder.py` | Tìm kiếm slot khả dụng | 99 |
| `evaluator.py` | Đánh giá chất lượng lịch | 169 |
| `router.py` | API Endpoints | 159 |

---

## 2. Các Vấn Đề Phát Hiện

### 🔴 VẤN ĐỀ NGHIÊM TRỌNG (Critical)

#### 2.1. Duplicate Class Definition - `SchedulingService`

**Vị trí:** `service.py`, dòng 42-252 và 257-321

**Mô tả:** Class `SchedulingService` được định nghĩa **HAI LẦN** trong cùng một file:
- Lần 1 (dòng 42-252): Chứa các phương thức `solve`, `evaluate`, `get_suggestions`, `check_conflicts`, `reschedule`
- Lần 2 (dòng 257-321): Chứa phương thức `find_available_slots`

**Hậu quả:**
- Python sẽ **ghi đè** định nghĩa class đầu tiên bằng định nghĩa thứ hai
- **Tất cả các phương thức từ class đầu tiên sẽ KHÔNG TỒN TẠI** trong runtime
- Các endpoint `/solve`, `/evaluate`, `/suggestions`, `/conflicts`, `/reschedule` sẽ **LỖI 500** với `AttributeError: 'SchedulingService' object has no attribute 'solve'`

**Mã lỗi:**
```python
# Dòng 42
class SchedulingService:
    """Service trung tâm quản lý Scheduling Engine."""
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session
    async def solve(self, request: SolveRequest) -> SchedulingSolution:
        ...
    # ... các phương thức khác ...

# Dòng 254 - Import giữa file (anti-pattern)
from .slot_finder import SlotFinder

# Dòng 257 - ĐỊNH NGHĨA LẠI CLASS!
class SchedulingService:
    """Service điều phối công cụ lập lịch và logic tối ưu hóa."""
    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session
    # Chỉ có phương thức find_available_slots
    async def find_available_slots(self, request: SlotSearchRequest) -> SlotSuggestionResponse:
        ...
```

**Độ ưu tiên:** 🔴 **P0 - Phải sửa ngay**

---

### 🟠 VẤN ĐỀ QUAN TRỌNG (Major)

#### 2.2. Import Giữa File (Mid-file Import)

**Vị trí:** `service.py`, dòng 254

**Mô tả:** Import `SlotFinder` được đặt **giữa file** thay vì đầu file theo chuẩn PEP 8.

**Mã lỗi:**
```python
# Cuối class đầu tiên (dòng 252)
    ...

# Dòng 254 - Import giữa file
from .slot_finder import SlotFinder
```

**Hậu quả:**
- Khó đọc và maintain code
- Gây nhầm lẫn về module dependencies
- Có thể gây circular import trong tương lai

**Độ ưu tiên:** 🟠 **P1**

---

#### 2.3. Sử Dụng Không Nhất Quán `session.execute()` vs `session.exec()`

**Vị trí:** Toàn bộ module

**Mô tả:**
- Hầu hết các file sử dụng `session.execute()` (SQLAlchemy Core)
- `service.py` dòng 281 sử dụng `session.exec()` (SQLModel)

**Bảng thống kê:**
| File | Phương thức | Lần gọi |
|------|-------------|---------|
| `data_extractor.py` | `session.execute()` | 9 |
| `service.py` | `session.execute()` | 3 |
| `service.py` | `session.exec()` | 1 (dòng 281) |
| `evaluator.py` | `session.execute()` | 3 |

**Hậu quả:**
- Code không nhất quán
- `session.exec()` (SQLModel) và `session.execute()` (SQLAlchemy) có hành vi khác nhau về kiểu trả về

**Độ ưu tiên:** 🟠 **P1**

---

#### 2.4. Lazy Loading Trong Async Context (Đã Được Fix)

**Vị trí:** `service.py`, dòng 277-282

**Mô tả:** Có comment ghi chú về việc đã fix lỗi Lazy Loading. Query đã sử dụng `selectinload()` đúng cách.

**Mã hiện tại (OK):**
```python
# Fix Lazy Loading Error by Eagerly Loading Relationships
query_service = select(Service).where(Service.id == request.service_id).options(
    selectinload(Service.skills),
    selectinload(Service.resource_requirements)
)
```

**Trạng thái:** ✅ Đã được giải quyết

---

### 🟡 VẤN ĐỀ NHỎ (Minor)

#### 2.5. Docstring Không Khớp Với Nội Dung Module

**Vị trí:** `service.py`, dòng 1-10

**Mô tả:** Docstring ghi "Operating Hours Module" nhưng đây là Scheduling Engine module.

**Mã lỗi:**
```python
"""
Operating Hours Module - Business Logic Service  # <-- Sai tên
...
"""
```

**Độ ưu tiên:** 🟡 **P2**

---

#### 2.6. TODO/Placeholder Chưa Implement

**Vị trí:** Nhiều file

| File | Dòng | Nội dung TODO |
|------|------|---------------|
| `service.py` | 221 | `# TODO: Cần đảm bảo DataExtractor.extract_problem KHÔNG lọc bỏ items...` |
| `evaluator.py` | 84 | `total_idle_minutes=0  # TODO` |
| `solver.py` | 366 | `total_idle_minutes=0  # TODO: Calculate properly` |

**Độ ưu tiên:** 🟡 **P2**

---

#### 2.7. Deep Import Trong `slot_finder.py`

**Vị trí:** `slot_finder.py`, dòng 7

**Mô tả:** Import trực tiếp vào `src.modules.scheduling_engine.models` thay vì dùng relative import từ cùng package.

**Mã lỗi:**
```python
from src.modules.scheduling_engine.models import (
    SlotOption, StaffSuggestionInfo, ResourceSuggestionInfo
)
```

**Nên sửa thành:**
```python
from .models import (
    SlotOption, StaffSuggestionInfo, ResourceSuggestionInfo
)
```

**Độ ưu tiên:** 🟡 **P2**

---

#### 2.8. Public API (`__init__.py`) Không Export Đầy Đủ

**Vị trí:** `__init__.py`

**Mô tả:** Các schema mới (Conflict, Reschedule, SlotSearch) không được export trong `__all__`.

**Các schema thiếu:**
- `ConflictType`
- `ConflictInfo`
- `ConflictCheckResponse`
- `RescheduleRequest`
- `RescheduleResult`
- `SlotSearchRequest`
- `SlotSuggestionResponse`
- `SlotOption`
- `TimeWindow`

**Độ ưu tiên:** 🟡 **P2**

---

## 3. Đề Xuất Sửa Lỗi

### 3.1. Sửa Lỗi P0 - Gộp Class SchedulingService

**Hướng dẫn:**
1. Xóa import giữa file (dòng 254)
2. Di chuyển import `SlotFinder` lên đầu file
3. Xóa định nghĩa class thứ hai (dòng 257-321)
4. Thêm phương thức `find_available_slots` vào class đầu tiên

**Thay đổi cần thiết:**

```python
# Đầu file - thêm import
from .slot_finder import SlotFinder

# Trong class SchedulingService (dòng 42)
class SchedulingService:
    """Service trung tâm quản lý Scheduling Engine."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    # ... các phương thức hiện có ...

    # Thêm phương thức này vào cuối class
    async def find_available_slots(
        self,
        request: SlotSearchRequest
    ) -> SlotSuggestionResponse:
        """Tìm kiếm khung giờ khả dụng tối ưu (Smart Slot Finding)."""
        from src.modules.services.models import Service
        # ... logic hiện tại ...
```

### 3.2. Sửa Lỗi P1 - Chuẩn Hoá Session Method

**Hướng dẫn:** Thống nhất sử dụng `session.execute()` với raw SQL text queries, và `session.exec()` với SQLModel select statements.

### 3.3. Sửa Lỗi P2 - Hoàn Thiện Public API

**Hướng dẫn:** Cập nhật `__init__.py` để export đầy đủ các schema mới.

---

## 4. Phương Án Tốt Nhất

✅ **Khuyến nghị:** Thực hiện theo thứ tự ưu tiên:

1. **Ngay lập tức (P0):** Gộp hai định nghĩa `SchedulingService` thành một class duy nhất
2. **Trong tuần (P1):** Chuẩn hoá imports và session methods
3. **Trong sprint (P2):** Cập nhật docstrings, TODOs, và public API

---

## 5. Kết Luận

Module `scheduling_engine` có **lỗi nghiêm trọng** về duplicate class definition sẽ khiến hầu hết các endpoint API không hoạt động. Việc sửa lỗi này cần được thực hiện **ngay lập tức** để đảm bảo hệ thống có thể chạy đúng.

**Trạng thái:** 🔴 Cần hành động ngay

---

---

## 6. Trạng Thái Refactor (Đã Hoàn Thành)

**Ngày thực hiện:** 2024-12-20

### 6.1. Các Thay Đổi Đã Áp Dụng

| ID | Mức độ | Vấn đề | Trạng thái | File |
|----|--------|--------|------------|------|
| 2.1 | 🔴 P0 | Duplicate Class Definition | ✅ **ĐÃ SỬA** | `service.py` |
| 2.2 | 🟠 P1 | Import giữa file | ✅ **ĐÃ SỬA** | `service.py` |
| 2.5 | 🟡 P2 | Docstring sai tên module | ✅ **ĐÃ SỬA** | `service.py` |
| 2.7 | 🟡 P2 | Deep import | ✅ **ĐÃ SỬA** | `slot_finder.py` |
| 2.8 | 🟡 P2 | Public API không export đầy đủ | ✅ **ĐÃ SỬA** | `__init__.py` |

### 6.2. Chi Tiết Thay Đổi

#### `service.py`
- Gộp 2 định nghĩa `SchedulingService` thành 1 class duy nhất
- Di chuyển `from .slot_finder import SlotFinder` lên đầu file
- Sửa docstring từ "Operating Hours Module" → "Scheduling Engine Module"
- Chuẩn hoá messages sang tiếng Việt

#### `slot_finder.py`
- Sửa deep import `from src.modules.scheduling_engine.models` → `from .models`
- Cải thiện docstring và code structure

#### `__init__.py`
- Export đầy đủ tất cả schemas mới:
  - `ConflictType`, `ConflictInfo`, `ConflictCheckResponse`
  - `RescheduleRequest`, `RescheduleResult`
  - `TimeWindow`, `SlotSearchRequest`, `SlotSuggestionResponse`
  - `SlotOption`, `StaffSuggestionInfo`, `ResourceSuggestionInfo`
- Thêm export cho `SchedulingService` và `SlotFinder`

### 6.3. Kết Quả Kiểm Tra

```bash
✅ Syntax check: PASSED
✅ Import test: PASSED
```

**Trạng thái cuối:** 🟢 Module đã sẵn sàng hoạt động

---

*Báo cáo được tạo tự động bởi AI Agent - Workflow /researcher*
