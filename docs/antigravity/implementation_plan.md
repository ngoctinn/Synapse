# Kế Hoạch Triển Khai: Core Scheduling Data (Database & Backend)

## 1. Mục Tiêu Giai Đoạn
Thiết lập và đồng bộ hóa cấu trúc dữ liệu nền tảng từ **Tài liệu Đặc tả** (`data_specification.md`) lên Database thực tế.
Mục tiêu cuối: Hệ thống Backend có thể trả lời câu hỏi:

> **"Dịch vụ X cần AI (kỹ năng gì, mức độ bao nhiêu) và cần TÀI NGUYÊN nào (loại phòng, loại máy)? Ai + Phòng nào có thể làm?"**

---

## 2. Phân Tích GAP: Đặc Tả vs. Hiện Trạng

### 2.1. Bảng `services`
| Cột (Theo Đặc tả) | Hiện Trạng DB | Trạng Thái | Hành động |
|:---|:---|:---:|:---|
| `id` (UUID) | ✅ Có | OK | - |
| `category_id` (FK) | ❌ Thiếu | **GAP** | Thêm cột |
| `name` | ✅ Có | OK | - |
| `duration_minutes` | ✅ Có (`duration`) | Mismatch | Rename |
| `buffer_time_minutes` | ✅ Có (`buffer_time`) | Mismatch | Rename |
| `price` (DECIMAL) | ✅ Có (`float`) | Mismatch | Đổi kiểu |
| `description` | ❌ Thiếu | **GAP** | Thêm cột |
| `deleted_at` (Soft Delete) | ❌ Thiếu | **GAP** | Thêm cột |

### 2.2. Bảng Mới Cần Tạo
| Bảng | Mô tả | Ưu tiên |
|:---|:---|:---:|
| `service_categories` | Danh mục dịch vụ (Massage, Skincare...) | **P0** |
| `resource_groups` | Nhóm tài nguyên logic (Phòng đơn, Phòng đôi...) | **P0** |
| `resources` | Thực thể vật lý (Phòng VIP 1, Ghế 03...) | **P0** |
| `service_resource_requirements` | Dịch vụ A cần 1 tài nguyên thuộc nhóm B | **P0** |
| `customer_profiles` | Hồ sơ khách hàng (điểm, hạng, ghi chú y tế) | P1 |
| `staff_profiles` | Hồ sơ nhân viên (thay thế bảng `staff` hiện tại) | P1 |

### 2.3. Bảng Cần Điều Chỉnh
| Bảng | Vấn đề | Hành động |
|:---|:---|:---|
| `service_skills` | Thiếu `min_proficiency_level` | Thêm cột (Default: 1) |
| `staff_skills` | Thiếu `proficiency_level` | Thêm cột (Default: 1) |

### 2.4. ENUM Cần Tạo
| ENUM Name | Giá trị | Bảng Liên quan |
|:---|:---|:---|
| `resource_type` | ROOM, EQUIPMENT | `resource_groups` |
| `resource_status` | ACTIVE, MAINTENANCE, INACTIVE | `resources` |

---

## 3. Kế Hoạch Thực Thi (Execution Plan)

### Giai Đoạn 1: Database Schema Migration (Alembic)

#### Migration 1.1: `add_service_categories`
```sql
-- Tạo bảng service_categories
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thêm FK vào services
ALTER TABLE services ADD COLUMN category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL;
ALTER TABLE services ADD COLUMN description TEXT;
ALTER TABLE services ADD COLUMN deleted_at TIMESTAMPTZ;

-- Rename cột duration -> duration_minutes (tuân thủ đặc tả)
-- (Cân nhắc: Nếu Frontend đang dùng "duration" thì cần đồng bộ)
```

#### Migration 1.2: `add_resource_system`
```sql
-- Tạo ENUM
CREATE TYPE resource_type AS ENUM ('ROOM', 'EQUIPMENT');
CREATE TYPE resource_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- Tạo resource_groups
CREATE TABLE resource_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type resource_type NOT NULL,
    description TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo resources
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES resource_groups(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    status resource_status NOT NULL DEFAULT 'ACTIVE',
    capacity INTEGER DEFAULT 1,
    setup_time_minutes INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Migration 1.3: `add_service_resource_requirements`
```sql
CREATE TABLE service_resource_requirements (
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES resource_groups(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (service_id, group_id)
);
```

#### Migration 1.4: `add_proficiency_levels`
```sql
-- Thêm cột vào service_skills (Yêu cầu kỹ năng của dịch vụ)
ALTER TABLE service_skills
ADD COLUMN min_proficiency_level INTEGER DEFAULT 1
CHECK (min_proficiency_level BETWEEN 1 AND 3);

-- Thêm cột vào staff_skills (Trình độ kỹ năng của nhân viên)
ALTER TABLE staff_skills
ADD COLUMN proficiency_level INTEGER DEFAULT 1
CHECK (proficiency_level BETWEEN 1 AND 3);
```

---

### Giai Đoạn 2: Backend Models & Schemas (FastAPI/SQLModel)

#### Task 2.1: Tạo Module `src/modules/resources/`
Cấu trúc:
```
src/modules/resources/
├── __init__.py       # Public API
├── models.py         # ResourceGroup, Resource
├── schemas.py        # DTOs
├── router.py         # CRUD Endpoints
└── service.py        # Business Logic
```

**Models:**
- `ResourceGroup`: Nhóm tài nguyên (type ENUM).
- `Resource`: Tài nguyên cụ thể (status ENUM).

**API Endpoints:**
- `GET /api/resource-groups` - Lấy danh sách nhóm.
- `POST /api/resource-groups` - Tạo nhóm mới.
- `GET /api/resources` - Lấy DS tài nguyên (filter by group).
- `POST /api/resources` - Tạo tài nguyên.

#### Task 2.2: Tạo Module `src/modules/categories/`
Hoặc tích hợp vào Module `services`.

**Models:**
- `ServiceCategory`

**API Endpoints:**
- `GET /api/service-categories` - Lấy danh sách danh mục.
- `POST /api/service-categories` - Tạo danh mục.

#### Task 2.3: Update Module `services`
- Thêm relationship `category: ServiceCategory`.
- Thêm relationship `resource_requirements: list[ServiceResourceRequirement]`.
- Update Schemas (`ServiceRead`, `ServiceCreate`).

#### Task 2.4: Tạo Model `ServiceResourceRequirement`
- Link Model giữa `Service` và `ResourceGroup`.

#### Task 2.5: Update `ServiceSkill` và `StaffSkill`
- Thêm trường `min_proficiency_level` / `proficiency_level`.

---

### Giai Đoạn 3: Matching Logic (Core Business)

#### Task 3.1: `MatchingService.get_qualified_staff(service_id)`
Logic:
1. Lấy `service_required_skills` của dịch vụ (kèm `min_proficiency_level`).
2. Lấy tất cả Staff có `staff_skills` thỏa mãn:
   - Có tất cả skill yêu cầu.
   - Với `proficiency_level >= min_proficiency_level`.
3. Return danh sách Staff ID hợp lệ.

```python
# Pseudo-code
async def get_qualified_staff(service_id: UUID) -> list[Staff]:
    required_skills = await db.exec(
        select(ServiceSkill)
        .where(ServiceSkill.service_id == service_id)
    )

    # Tìm staff có TẤT CẢ các skills yêu cầu với level đủ
    qualified_staff = ...  # Complex query với HAVING COUNT
    return qualified_staff
```

#### Task 3.2: `MatchingService.get_available_resources(service_id)`
Logic:
1. Lấy `service_resource_requirements` (nhóm tài nguyên + số lượng).
2. Lấy tất cả `resources` thuộc các nhóm đó với `status = ACTIVE`.
3. Return grouped theo nhóm.

```python
async def get_available_resources(service_id: UUID) -> dict[UUID, list[Resource]]:
    requirements = await db.exec(
        select(ServiceResourceRequirement)
        .where(ServiceResourceRequirement.service_id == service_id)
    )

    result = {}
    for req in requirements:
        resources = await db.exec(
            select(Resource)
            .where(Resource.group_id == req.group_id)
            .where(Resource.status == 'ACTIVE')
        )
        result[req.group_id] = resources.all()
    return result
```

#### Task 3.3: API Endpoint `/services/{id}/candidates`
Response Schema:
```json
{
  "qualified_staff": [
    { "id": "...", "name": "Nguyễn Văn A", "skills": [...] }
  ],
  "available_resources": {
    "group_id_1": [
      { "id": "...", "name": "Phòng VIP 1", "status": "ACTIVE" }
    ]
  }
}
```

---

## 4. Thứ Tự Ưu Tiên (Execution Order)

1. **[DB]** Migration 1.1: `add_service_categories` ✅
2. **[DB]** Migration 1.2: `add_resource_system` ✅
3. **[DB]** Migration 1.3: `add_service_resource_requirements` ✅
4. **[DB]** Migration 1.4: `add_proficiency_levels` ✅
5. **[BE]** Task 2.2: Module `categories` (hoặc trong services)
6. **[BE]** Task 2.1: Module `resources`
7. **[BE]** Task 2.3-2.4: Update `services` + Link Models
8. **[BE]** Task 2.5: Update Skill tables
9. **[BE]** Task 3.1-3.3: Matching Service + API

---

## 5. Tiêu Chí Nghiệm Thu (Definition of Done)

### Database
- [ ] Tất cả bảng mới tồn tại trên Supabase.
- [ ] Constraints và FK hoạt động đúng.
- [ ] ENUM types được tạo.

### Backend
- [ ] Tất cả Modules mới có đủ CRUD API.
- [ ] API `/services/{id}/candidates` trả về đúng dữ liệu.
- [ ] Không có lỗi lint (`ruff check`).

### Integration Test
- [ ] Tạo Dịch vụ "Massage Body" yêu cầu Skill "Massage" (Level 2) + ResourceGroup "Phòng Đơn".
- [ ] Tạo KTV "Nguyễn A" có Skill "Massage" (Level 3).
- [ ] Tạo Resource "Phòng VIP 1" thuộc nhóm "Phòng Đơn".
- [ ] Call API `/services/{massage_id}/candidates` → Nhận được KTV "Nguyễn A" + "Phòng VIP 1".

---

## 6. Rủi Ro & Giảm Thiểu

| Rủi Ro | Xác suất | Giảm Thiểu |
|:---|:---:|:---|
| Rename cột `duration` → `duration_minutes` gây lỗi Frontend | Cao | Giữ nguyên tên cột hiện tại, chỉ thêm cột mới. Hoặc update đồng thời FE. |
| Migration conflict với data hiện có | Trung bình | Chạy migration trên branch dev trước. Backup data. |
| Bảng `staff` hiện tại khác với `staff_profiles` trong đặc tả | Cao | Quyết định: Migrate hay song song? → **Đề xuất giữ nguyên `staff`, align đặc tả sau.** |

---

## 7. Ghi Chú Kỹ Thuật

### Về tên bảng `service_skills` vs `service_required_skills`
- Hiện tại DB có `service_skills` (đúng với code).
- Đặc tả gọi là `service_required_skills`.
- **Quyết định:** Giữ `service_skills`, update đặc tả để khớp với thực tế.

### Về bảng `staff` vs `staff_profiles`
- Hiện tại DB có `staff`.
- Đặc tả gọi là `staff_profiles`.
- **Quyết định:** Giữ `staff`, có thể rename sau khi ổn định.
