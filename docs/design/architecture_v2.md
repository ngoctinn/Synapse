# Kiến Trúc Hệ Thống Synapse

Tài liệu này mô tả kiến trúc tổng thể của hệ thống chăm sóc khách hàng trực tuyến cho Spa, tuân thủ mô hình Modular Monolith.

---

## 1. Sơ đồ Kiến trúc Tổng quan

```mermaid
graph TD
    %% -- Lớp Tương tác Người dùng --
    User["Người dùng<br>(Di động/Máy tính)"] -->|HTTPS| NextApp["Frontend Next.js 15<br>App Router"]

    %% -- Lớp Frontend / BFF --
    subgraph Frontend_Eco [Hệ sinh thái Frontend]
        direction TB
        NextApp -->|Tương tác| ServerActions["Server Actions (BFF)<br>Xác thực dữ liệu & Điều phối"]

        ServerActions -->|Gọi API nội bộ| APIGateway["Tiêm Header xác thực<br>Supabase JWT"]
    end

    %% -- Hạ tầng Backend --
    subgraph Backend_Infrastructure [Dịch vụ Backend]
        direction TB

        %% -- Khối Modular Monolith --
        subgraph Modular_Monolith ["FastAPI Modular Monolith"]
            direction TB

            API_Core["API Core<br>main.py"]

            subgraph Vertical_Slices ["Các Module Nghiệp vụ"]
                AuthMod["Module<br>Xác thực"]
                StaffMod["Module<br>Nhân sự"]
                CustMod["Module<br>Khách hàng"]
                ServiceMod["Module<br>Dịch vụ"]
                ResourceMod["Module<br>Tài nguyên"]
                BookingMod["Module<br>Lịch hẹn"]
                ChatMod["Module<br>Trò chuyện"]
            end

            %% -- Lớp Hạ tầng --
            Infra["Shared Kernel<br>Cấu hình CSDL, Tiêm RLS, Ghi nhật ký"]

            API_Core --> Vertical_Slices
            Vertical_Slices --> Infra
        end

        %% -- Bộ Lập lịch Thông minh --
        subgraph Optimization_Engine ["Bộ Lập lịch Thông minh"]
            SolverWorker["Tiến trình Solver<br>Chạy nền"]
            CSP_Model["OR-Tools CP-SAT<br>Bộ giải Ràng buộc"]

            SolverWorker -->|Xây dựng| CSP_Model
        end
    end

    %% -- Lớp Lưu trữ Dữ liệu --
    subgraph Data_Layer [Dữ liệu & Trạng thái]
        PG[("PostgreSQL<br>Supabase DB + RLS")]
        Redis[("Redis<br>Hàng đợi Tác vụ")]
        SupabaseAuth["Supabase Auth<br>Nhà cung cấp Danh tính"]
    end

    %% -- Kết nối --
    ServerActions -->|REST API| API_Core

    Frontend_Eco -.->|Đăng nhập| SupabaseAuth
    SupabaseAuth -.->|Token| Frontend_Eco

    Infra -->|Phiên được bảo vệ RLS| PG

    BookingMod -->|Đẩy tác vụ| Redis
    Redis -->|Lấy tác vụ| SolverWorker
    SolverWorker -->|Cập nhật lịch| PG

    %% -- Định kiểu --
    classDef primary fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef component fill:#fff,stroke:#333,stroke-width:1px;
    classDef storage fill:#fff3e0,stroke:#ff6f00,stroke-width:2px;
    classDef engine fill:#e8f5e9,stroke:#2e7d32,stroke-width:3px;

    class NextApp,ServerActions,API_Core primary
    class PG,Redis,SupabaseAuth storage
    class SolverWorker,CSP_Model engine
```

---

## 2. Các Thành phần Chính

### 2.1. Lớp Frontend (Next.js 15)
| Thành phần | Mô tả |
|------------|-------|
| **App Router** | Định tuyến dựa trên thư mục, hỗ trợ Server Components |
| **Server Actions** | Backend-for-Frontend, xử lý logic nghiệp vụ phía server |
| **Shadcn/UI** | Thư viện thành phần giao diện |

### 2.2. Lớp Backend (FastAPI)
| Thành phần | Mô tả |
|------------|-------|
| **API Core** | Điểm vào chính, gộp các Router từ các Module |
| **Vertical Slices** | Các Module nghiệp vụ độc lập (Xác thực, Khách hàng, Lịch hẹn...) |
| **Shared Kernel** | Mã hạ tầng dùng chung (Cấu hình CSDL, Tiêm RLS, Ghi nhật ký) |

### 2.3. Bộ Lập lịch Thông minh
| Thành phần | Mô tả |
|------------|-------|
| **Redis Queue** | Hàng đợi tác vụ cho các tính toán nặng |
| **Solver Worker** | Tiến trình nền xử lý thuật toán tối ưu |
| **OR-Tools CP-SAT** | Bộ giải ràng buộc của Google |

### 2.4. Lớp Dữ liệu
| Thành phần | Mô tả |
|------------|-------|
| **PostgreSQL** | Cơ sở dữ liệu chính với Supabase |
| **Row Level Security** | Bảo mật mức hàng theo vai trò người dùng |
| **Supabase Auth** | Xác thực và quản lý phiên đăng nhập |

---

## 3. Luồng Dữ liệu Chính

### 3.1. Luồng Đặt lịch Hẹn
```
Người dùng → Server Action → API Booking → Solver Worker → Cập nhật CSDL → Thông báo
```

### 3.2. Luồng Xác thực
```
Người dùng → Server Action → Supabase Auth → Nhận JWT → Tiêm vào Header
```

### 3.3. Luồng Truy vấn Dữ liệu
```
Server Action → API Router → Service → CSDL (qua phiên RLS) → Trả kết quả
```

---

## 4. Nguyên tắc Kiến trúc

### 4.1. Modular Monolith
- Mỗi Module là một "lát cắt dọc" chứa đầy đủ Router, Service, Schema, Model.
- Các Module giao tiếp qua Interface công khai (`__init__.py`).
- Cấm import trực tiếp vào file nội bộ của Module khác.

### 4.2. Bảo mật Mức Hàng (RLS)
- Mỗi phiên kết nối CSDL được tiêm thông tin người dùng hiện tại.
- PostgreSQL RLS Policy tự động lọc dữ liệu theo vai trò.

### 4.3. Bất đồng bộ cho Tác vụ Nặng
- Các tác vụ tính toán phức tạp (lập lịch tối ưu) được đẩy vào hàng đợi Redis.
- Tiến trình Solver chạy nền để tránh chặn API chính.

---

*Lưu ý: Sơ đồ này thể hiện kiến trúc logic. Việc triển khai thực tế có thể được đơn giản hóa trong phiên bản MVP.*
