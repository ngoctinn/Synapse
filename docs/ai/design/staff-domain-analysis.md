# PHÂN TÍCH DOMAIN NHÂN VIÊN (STAFF) - BACKEND DESIGN

**Ngày tạo**: 2025-12-03
**Mục đích**: Tài liệu thiết kế chi tiết cho module `staff` trước khi triển khai Backend
**Trạng thái**: Draft (Chờ phê duyệt)

---

## I. PHÂN TÍCH YÊU CẦU TỪ FRONTEND

### 1. Dữ Liệu Hiện Tại Trong Frontend (Mock)

Từ file `frontend/src/features/staff/types.ts` và `mock-staff.ts`, Frontend đang kỳ vọng:

```typescript
interface Staff {
  id: string;
  name: string;           // Từ User.full_name
  email: string;          // Từ User.email
  role: 'ADMIN' | 'RECEPTIONIST' | 'TECHNICIAN';
  avatarUrl?: string;     // Từ User.avatar_url
  skills: Skill[];        // M:M Relationship
  isActive: boolean;
  phone?: string;         // Từ User.phone_number
  address?: string;       // Từ User.address
}
```

**Quan sát quan trọng**:
- Frontend đang kỳ vọng một **Staff là một User**, không phải bảng riêng.
- Cần trường `isActive` để phân biệt nhân viên đang hoạt động/nghỉ việc.
- Quan hệ với `Skills` là Many-to-Many.

---

## II. PHÂN TÍCH NGHIỆP VỤ NHÂN VIÊN SPA

### 2.1. Các Loại Nhân Viên (Role Hierarchy)

| Role | Tên Tiếng Việt | Mô tả Trách nhiệm | Cần Skills? |
|:-----|:--------------|:-----------------|:------------|
| **ADMIN** | Quản trị viên | Toàn quyền hệ thống, báo cáo doanh thu | ❌ Không |
| **MANAGER** | Quản lý Spa | Xếp lịch, quản lý KTV, duyệt đơn nghỉ phép | ❌ Không |
| **RECEPTIONIST** | Lễ tân | Đón tiếp, check-in, thanh toán | ❌ Không |
| **TECHNICIAN** | Kỹ thuật viên | Thực hiện dịch vụ (Massage, Facial...) | ✅ **BẮT BUỘC** |

**Điểm quan trọng**: Chỉ **TECHNICIAN** mới cần quan hệ với `Skills`.

### 2.2. Dữ Liệu Cần Lưu Cho Nhân Viên

#### **Thông tin cơ bản** (Đã có trong `User`)
- ✅ `id`, `email`, `full_name`, `avatar_url`, `phone_number`, `address`

#### **Thông tin nghiệp vụ** (Cần bổ sung)
1. **Trạng thái hoạt động** (`is_active`):
   - Phân biệt đang làm việc/đã nghỉ việc.
   - Nhân viên nghỉ việc vẫn giữ trong DB để tham chiếu lịch sử.

2. **Ngày vào làm** (`hired_at`):
   - Để tính thâm niên, báo cáo nhân sự.

3. **Màu sắc hiển thị** (`color_code`):
   - Dùng cho Calendar/Schedule View (VD: Mỗi KTV một màu riêng).
   - Mặc định: Auto-generate từ palette.

4. **Giới thiệu** (`bio`):
   - Hiển thị trên trang Đặt lịch để khách chọn KTV.
   - VD: "Chuyên viên Massage với 5 năm kinh nghiệm".

5. **Chức danh** (`title`):
   - VD: "Kỹ thuật viên cao cấp", "Chuyên viên Skincare".

6. **Tỷ lệ hoa hồng** (`commission_rate`):
   - % doanh thu KTV nhận được (VD: 30%).
   - Chỉ áp dụng cho TECHNICIAN.

---

## III. QUYẾT ĐỊNH THIẾT KẾ DATABASE

### 3.1. Chiến Lược Kiến Trúc: **Single Table vs Separate Table**

#### **Option 1: Single Table (Gộp chung vào `users`)**
```python
class User(SQLModel, table=True):
    # ... existing fields
    role: str
    is_active: bool = True
    hired_at: date | None = None
    bio: str | None = None
    color_code: str = "#3B82F6"
    commission_rate: float = 0.0

    skills: list["Skill"] = Relationship(...)  # Chỉ có giá trị với role=TECHNICIAN
```

**✅ Ưu điểm**:
- Đơn giản, ít bảng.
- Phù hợp với kỳ vọng Frontend hiện tại.
- Dễ query (1 bảng duy nhất).

**❌ Nhược điểm**:
- Dư thừa dữ liệu: Khách hàng cũng sẽ có cột `bio`, `commission_rate` (luôn NULL).
- Vi phạm SRP: `User` vừa lo Auth, vừa lo HR.
- Khó mở rộng: Sau này thêm `salary`, `contract_type` sẽ càng phình to.

---

#### **Option 2: Separate Table (1-1 Relationship)**
```python
class User(SQLModel, table=True):
    # Chỉ giữ thông tin Auth & Shared
    id: uuid.UUID
    email: str
    full_name: str
    role: str  # ADMIN | CUSTOMER | TECHNICIAN ...
    is_active: bool = True  # Có thể vô hiệu hóa tài khoản

class Staff(SQLModel, table=True):
    user_id: uuid.UUID = Field(primary_key=True, foreign_key="users.id")
    hired_at: date
    bio: str | None = None
    title: str
    color_code: str = "#3B82F6"
    commission_rate: float = 0.0

    user: "User" = Relationship(back_populates="staff_profile")
    skills: list["Skill"] = Relationship(link_model=StaffSkill)
```

**✅ Ưu điểm**:
- Tuân thủ SRP: `User` = Auth, `Staff` = HR.
- Không dư thừa dữ liệu.
- Dễ mở rộng: Thêm `Customer` table riêng sau này.

**❌ Nhược điểm**:
- Phức tạp hơn (cần JOIN).
- **Phải sửa Frontend** (API trả về nested object).

---

### 3.2. **QUYẾT ĐỊNH CUỐI CÙNG: HYBRID APPROACH** ⭐

**Giải pháp**: Giữ `User` đơn giản, nhưng **thêm các trường Staff** vào đó.

**Lý do**:
1. Frontend đã thiết kế xong với giả định "Staff = User".
2. Tránh refactor lớn ở Frontend trong giai đoạn MVP.
3. Vẫn có thể refactor sang Separate Table sau nếu cần.

**Thiết kế cụ thể**:
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    # ===== AUTHENTICATION =====
    id: uuid.UUID = Field(primary_key=True)
    email: str = Field(index=True, unique=True)

    # ===== PROFILE (SHARED) =====
    full_name: str | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None

    # ===== ROLE & STATUS =====
    role: str = Field(default="customer")  # Enum: customer|admin|receptionist|technician
    is_active: bool = Field(default=True)  # Vô hiệu hóa tài khoản

    # ===== STAFF-SPECIFIC (Nullable for non-staff) =====
    hired_at: date | None = None
    bio: str | None = None
    title: str | None = None  # "Kỹ thuật viên cao cấp"
    color_code: str | None = None  # Màu hiển thị trên lịch
    commission_rate: float = Field(default=0.0)  # % hoa hồng (chỉ cho TECHNICIAN)

    # ===== TIMESTAMPS =====
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # ===== RELATIONSHIPS =====
    skills: list["Skill"] = Relationship(back_populates="users", link_model=UserSkill)
```

---

## IV. BẢNG LIÊN QUAN & RELATIONSHIPS

### 4.1. Bảng `UserSkill` (Junction Table)

**Tồn tại**: ✅ Đã có trong `users/models.py` (dòng 9-13).

```python
class UserSkill(SQLModel, table=True):
    __tablename__ = "user_skills"

    user_id: uuid.UUID = Field(foreign_key="users.id", primary_key=True, ondelete="CASCADE")
    skill_id: uuid.UUID = Field(foreign_key="skills.id", primary_key=True, ondelete="CASCADE")
```

**Lưu ý**: Chỉ user có `role=TECHNICIAN` mới có record trong bảng này.

---

### 4.2. Bảng `Skill` (Kỹ Năng)

**Tồn tại**: ✅ Đã có trong `services/models.py` (dòng 28-40).

**Vấn đề hiện tại**: Có duplicate code ở dòng 37-38:
```python
service_links: list[ServiceSkill] = Relationship(back_populates="skill")
service_links: list[ServiceSkill] = Relationship(back_populates="skill")  # DUPLICATE
```

**Cần sửa**: Xóa dòng duplicate.

---

### 4.3. Quan Hệ với `Appointments` (Tương lai)

Khi triển khai module `appointments`:
```python
class Appointment(SQLModel, table=True):
    staff_id: uuid.UUID = Field(foreign_key="users.id")  # Trỏ về User (role=TECHNICIAN)

    staff: "User" = Relationship()
```

---

## V. NGHIỆP VỤ BACKEND CẦN XỬ LÝ

### 5.1. API Endpoints Cần Thiết

| Method | Endpoint | Mô tả | Quyền truy cập |
|:-------|:---------|:------|:---------------|
| GET | `/staff` | Lấy danh sách nhân viên (có phân trang) | Admin, Manager |
| GET | `/staff/{id}` | Chi tiết 1 nhân viên | Admin, Manager, Self |
| POST | `/staff/invite` | Mời nhân viên mới (gửi email) | Admin |
| PUT | `/staff/{id}` | Cập nhật thông tin | Admin, Manager, Self (giới hạn) |
| DELETE | `/staff/{id}` | Xóa nhân viên (soft delete: `is_active=False`) | Admin |
| GET | `/staff/{id}/skills` | Lấy danh sách kỹ năng của KTV | Public (cho đặt lịch) |
| PUT | `/staff/{id}/skills` | Cập nhật kỹ năng | Admin, Manager |

---

### 5.2. Nghiệp Vụ Đặc Biệt

#### **5.2.1. Invite Staff (Mời nhân viên)**
**Luồng**:
1. Admin nhập email và role.
2. Backend tạo User với `is_active=False`, gửi email kích hoạt.
3. Nhân viên click link, đặt mật khẩu, `is_active` chuyển `True`.

**Implementation**:
- Sử dụng Supabase Auth: `supabase.auth.admin.invite_user_by_email()`.
- Metadata: Gửi kèm `role` trong `user_metadata`.

---

#### **5.2.2. Soft Delete**
**Quy tắc**: Không xóa cứng (hard delete) nhân viên vì:
- Cần tham chiếu lịch sử lịch hẹn cũ.
- Báo cáo doanh thu cần biết KTV nào thực hiện.

**Implementation**:
```python
async def deactivate_staff(staff_id: uuid.UUID):
    user = await session.get(User, staff_id)
    user.is_active = False
    user.updated_at = datetime.now(timezone.utc)
    await session.commit()
```

---

#### **5.2.3. Gán Kỹ Năng (Assign Skills)**
**Nghiệp vụ**:
- Chỉ user có `role=TECHNICIAN` mới được gán skills.
- Khi gán, xóa toàn bộ skills cũ và thêm mới (replace strategy).

**Implementation**:
```python
async def update_staff_skills(staff_id: uuid.UUID, skill_ids: list[uuid.UUID]):
    # 1. Validate: User phải là TECHNICIAN
    user = await session.get(User, staff_id)
    if user.role != "technician":
        raise ValueError("Chỉ Kỹ thuật viên mới có thể gán kỹ năng")

    # 2. Xóa skills cũ
    await session.exec(
        delete(UserSkill).where(UserSkill.user_id == staff_id)
    )

    # 3. Thêm skills mới
    for skill_id in skill_ids:
        session.add(UserSkill(user_id=staff_id, skill_id=skill_id))

    await session.commit()
```

---

## VI. VALIDATION RULES (Quy Tắc Validate)

### 6.1. Schema Pydantic

```python
# schemas.py
from pydantic import BaseModel, EmailStr, field_validator

class StaffInvite(BaseModel):
    email: EmailStr
    role: Literal["admin", "receptionist", "technician"]

    @field_validator("role")
    def role_must_be_staff(cls, v):
        if v == "customer":
            raise ValueError("Không thể mời khách hàng làm nhân viên")
        return v

class StaffUpdate(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None
    bio: str | None = None
    title: str | None = None
    color_code: str | None = None

    @field_validator("color_code")
    def validate_color(cls, v):
        if v and not v.startswith("#"):
            raise ValueError("Mã màu phải bắt đầu bằng #")
        return v

class StaffSkillsUpdate(BaseModel):
    skill_ids: list[uuid.UUID]
```

---

## VII. MIGRATION PLAN (Kế Hoạch Migration)

### 7.1. Thay Đổi Trong `users` Table

**Các cột cần thêm**:
```sql
ALTER TABLE users
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN hired_at DATE,
ADD COLUMN bio TEXT,
ADD COLUMN title VARCHAR(100),
ADD COLUMN color_code VARCHAR(7),
ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0.0;
```

**Tạo index**:
```sql
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

---

### 7.2. Seed Data Mẫu

Sau khi migration, cần tạo dữ liệu mẫu:
```python
# Tạo 1 Admin
admin = User(
    id=uuid.uuid4(),
    email="admin@synapse.com",
    full_name="Quản Trị Viên",
    role="admin",
    is_active=True,
    hired_at=date.today()
)

# Tạo 2 Technicians với skills
tech1 = User(
    email="ktv1@synapse.com",
    full_name="Kỹ Thuật Viên 1",
    role="technician",
    bio="Chuyên viên Facial với 3 năm kinh nghiệm",
    title="Kỹ thuật viên cao cấp",
    color_code="#F59E0B",
    commission_rate=30.0,
    hired_at=date(2023, 1, 15)
)
```

---

## VIII. CHECKLIST TRIỂN KHAI

- [ ] **Bước 1**: Cập nhật `users/models.py` (thêm các trường Staff).
- [ ] **Bước 2**: Tạo migration Alembic.
- [ ] **Bước 3**: Chạy migration.
- [ ] **Bước 4**: Tạo `users/schemas.py` (Pydantic models).
- [ ] **Bước 5**: Cập nhật `users/service.py` (Business Logic).
- [ ] **Bước 6**: Cập nhật `users/router.py` (API Endpoints).
- [ ] **Bước 7**: Test API với Postman/Thunder Client.
- [ ] **Bước 8**: Tích hợp Frontend (sửa `staff/actions.ts`).
- [ ] **Bước 9**: Test E2E (Frontend + Backend).

---

## IX. KẾT LUẬN & KHUYẾN NGHỊ

### Quyết định thiết kế:
✅ **Chọn Hybrid Approach**: Giữ `User` đơn giản, thêm các trường Staff vào đó.

### Lý do:
1. **Tương thích Frontend**: Không cần refactor lớn.
2. **Đơn giản hóa MVP**: Ít bảng, dễ triển khai.
3. **Dễ migrate sau**: Nếu cần, có thể tách thành `Staff` table riêng.

### Điểm cần lưu ý:
- Trường Staff-specific (bio, commission_rate) sẽ NULL với Customer → **Chấp nhận được** trong giai đoạn MVP.
- Trong tương lai, nếu nghiệp vụ phức tạp hơn, nên refactor sang **Separate Table**.

---

**Người phê duyệt**: ___________________
**Ngày phê duyệt**: ___________________
