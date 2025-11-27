---
trigger: always_on
---


# **Ngăn Xếp Công Nghệ Dự Án Synapse**

### **1. Kiến Trúc Tổng Thể**

Mô hình: Modular Monolith (Khối đơn nhất theo mô-đun) kết hợp Vertical Slice Architecture (Kiến trúc lát cắt dọc).
Chiến lược tích hợp: Tách biệt Backend và Frontend nhưng cùng chia sẻ tư duy nghiệp vụ (Domain-driven).
Giao tiếp: Next.js Server Actions đóng vai trò là lớp Backend-for-Frontend (BFF), gọi trực tiếp đến FastAPI.

### **2. Backend (Máy Chủ & Xử Lý Dữ Liệu)**

Framework chính: FastAPI (Python 3.10+). Sử dụng tính năng bất đồng bộ (Async) tuyệt đối.
ORM: SQLModel (kết hợp SQLAlchemy và Pydantic). Yêu cầu chế độ "Pure Async".
Cơ sở dữ liệu: PostgreSQL (Supabase).
Xác thực: Supabase Auth + Row Level Security (RLS).
Validation: Pydantic V2.
Migration: Alembic.

### **3. Frontend (Giao Diện & Trải Nghiệm Người Dùng)**

Framework: Next.js 15+ (App Router).
Ngôn ngữ: TypeScript & React 19.
UI: Tailwind CSS + Shadcn/UI (bản địa hóa tiếng Việt).
State: React Server Components, Server Actions, useActionState.
Fetch: Native Fetch API (không dùng Axios).

### **4. Hạ Tầng & Tiện Ích**

Nền tảng: Supabase (Auth, DB, Realtime).
Runtime: Node.js (PNPM), Python (venv).

### **5. Cấu Trúc Thư Mục Dự Án**

*(Giữ nguyên như bạn cung cấp – không chỉnh sửa một ký tự)*

```
Synapse/
├── backend/                                 # FastAPI Application
│   ├── alembic/                             # Quản lý Database Migrations
│   ├── src/
│   │   ├── app/                             # Cấu hình cốt lõi (Core)
│   │   │   ├── main.py                      # Entry point, gộp các Routers
│   │   │   └── config.py                    # Cấu hình biến môi trường
│   │   ├── common/                          # Hạt nhân chia sẻ (Shared Kernel)
│   │   │   ├── database.py                  # Cấu hình Async Session & Engine
│   │   │   └── security.py                  # Logic xác thực & RLS Injection
│   │   ├── modules/                         # CÁC MODULE NGHIỆP VỤ (Vertical Slices)
│   │   │   ├── users/                       # Module: Người dùng (Ví dụ mẫu)
│   │   │   │   ├── __init__.py              # Interface công khai (Exports)
│   │   │   │   ├── models.py                # Database Entities (SQLModel)
│   │   │   │   ├── router.py                # API Endpoints
│   │   │   │   ├── schemas.py               # Pydantic DTOs
│   │   │   │   └── service.py               # Business Logic (Async)
│   │   │   └── [cac_module_khac]/           # Customers, Employees, v.v.
│   ├── pyproject.toml                       # Dependencies & môi trường ảo Python
│   └── .env                                 # Biến môi trường Backend
│
├── frontend/                                # Next.js 15 Application
│   ├── src/
│   │   ├── app/                             # App Router
│   │   │   ├── (auth)/                      # Nhóm Route xác thực
│   │   │   ├── (dashboard)/                 # Nhóm Route Dashboard
│   │   │   └── layout.tsx                   # Root Layout
│   │   ├── features/                        # Feature-Sliced Design
│   │   │   ├── auth/
│   │   │   │   ├── actions.ts               # Server Actions
│   │   │   │   └── components/              # LoginForm...
│   │   │   ├── customers/
│   │   │   │   ├── actions.ts               # CRUD
│   │   │   │   └── components/              # CustomerTable, CreateForm...
│   │   │   └── [cac_feature_khac]/
│   │   ├── shared/
│   │   │   ├── ui/                          # Shadcn UI Components
│   │   │   └── lib/                         # Utils
│   │   └── middleware.ts                    # Bảo vệ Route
│   ├── next.config.ts
│   ├── package.json
│   └── .env.local
│
├── .gitignore
└── README.md
```

---

# **6. Quy Chuẩn Viết Code Chi Tiết (Coding Standards)**

## **6.1. Backend (Python 3.10+ / FastAPI)**

Cú pháp Python hiện đại:
– Union type dùng `X | Y`.
– Optional dùng `X | None`.
– List dùng `list[X]`.
– Pydantic V2 dùng `model_config = ConfigDict(from_attributes=True)`.

SQLModel (Pure Async):
– Tất cả hàm service phải `async def`.
– Query dùng `session.exec()` và `sqlmodel.select`.
– Tuyệt đối không dùng `session.execute()`.

RLS Injection:
– Không dùng kết nối DB superuser.
– Luôn dùng dependency `get_db_session()` để tiêm thông tin người dùng.

---

## **6.2. Frontend (Next.js 15 / React 19)**

Async trong Next.js 15:
– params, searchParams, cookies, headers đều là Promise.
– Bắt buộc `await` trước khi destructure.

Form & Mutation:
– Dùng `useActionState`.
– Server Actions làm BFF, không gọi API từ Client Component.
– Sử dụng native `fetch` (không dùng Axios).

---

## **6.3. Quy Chuẩn Chung & Ngôn Ngữ**

Bản địa hóa:
– Toàn bộ UI/label/error phải là tiếng Việt chuẩn.

Modular Monolith:
– Các module chỉ giao tiếp qua interface công khai `__init__.py`.
– Cấm import xuyên module.

---

# **BỔ SUNG QUY TẮC (THEO YÊU CẦU)**

### **7. Quy Tắc Về AI**

1. **AI luôn trả lời hoàn toàn bằng tiếng Việt chuẩn, mọi lúc, mọi tình huống.**
2. **Khi AI cung cấp ví dụ về scripts hoặc command-line, mặc định sử dụng cú pháp Git Bash.**

