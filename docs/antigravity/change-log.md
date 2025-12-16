# Nhật Ký Thay Đổi (Change Log)

## Phiên Làm Việc: 2025-12-16

### Tóm Tắt
Triển khai thành công giai đoạn **Core Scheduling Data** - Ổn định dữ liệu nền cho lập lịch.

---

### 1. Database Migrations (Supabase Cloud)

| Migration | Trạng Thái | Mô Tả |
|:---|:---:|:---|
| `add_service_categories` | ✅ | Tạo bảng `service_categories`, thêm `category_id`, `description`, `deleted_at` vào `services` |
| `add_resource_system` | ✅ | Tạo ENUMs, bảng `resource_groups` và `resources` |
| `add_service_resource_requirements` | ✅ | Tạo bảng liên kết N-N |
| `add_proficiency_levels` | ✅ | Thêm `min_proficiency_level` và `proficiency_level` |

### 2. Backend Code Changes

#### Module Mới: `src/modules/resources/`
| File | Mô Tả |
|:---|:---|
| `models.py` | Định nghĩa `ResourceGroup`, `Resource`, `ServiceResourceRequirement` với ENUMs |
| `schemas.py` | Pydantic V2 DTOs cho CRUD operations |
| `service.py` | Business logic với Dependency Injection pattern |
| `router.py` | API endpoints với docstrings tiếng Việt |
| `__init__.py` | Public API (Gatekeeper pattern) |

#### Module Cập Nhật: `src/modules/services/`
| File | Thay Đổi |
|:---|:---|
| `models.py` | Thêm `ServiceCategory`, `min_proficiency_level`, `category_id`, `description`, `deleted_at` |
| `schemas.py` | Thêm `ServiceCategoryRead`, cập nhật `ServiceCreate/Update/Read` |
| `__init__.py` | Export các thực thể mới |

#### Entry Point: `src/app/main.py`
- Đăng ký `resources_router` vào app.

### 3. Kiểm Tra Bảo Mật

| Hạng Mục | Kết Quả |
|:---|:---|
| Không hardcode secrets | ✅ Pass |
| Sử dụng RLS Injection | ✅ Pass (get_db_session) |
| Soft Delete thay vì Hard Delete | ✅ Pass |
| Validation đầu vào (Pydantic) | ✅ Pass |

### 4. Tuân Thủ Backend Rules

| Quy Tắc | Tuân Thủ |
|:---|:---:|
| Vertical Slice Architecture | ✅ |
| Async All The Way | ✅ |
| Pydantic V2 (ConfigDict) | ✅ |
| Guard Clauses / Early Return | ✅ |
| Public API (__init__.py Gatekeeper) | ✅ |
| Docstrings Tiếng Việt | ✅ |
| Type Hints Python 3.12+ | ✅ |

---

### 5. Các File Đã Tạo/Sửa

**Tạo mới:**
- `backend/src/modules/resources/models.py`
- `backend/src/modules/resources/schemas.py`
- `backend/src/modules/resources/service.py`
- `backend/src/modules/resources/router.py`
- `backend/src/modules/resources/__init__.py`

**Sửa đổi:**
- `backend/src/modules/services/models.py`
- `backend/src/modules/services/schemas.py`
- `backend/src/modules/services/__init__.py`
- `backend/src/app/main.py`

---

### 6. Pending Items
- [ ] Tạo API endpoints cho ServiceCategory CRUD (trong services router).
- [ ] Implement Matching Logic (ML-01, ML-02, ML-03).
- [ ] Sync Alembic migrations với Supabase cloud migrations.
