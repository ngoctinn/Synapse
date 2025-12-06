# Kiến Trúc Hệ Thống Synapse (Updated V2)

Dựa trên yêu cầu mới về **Smart Scheduling (OR-Tools)** và quy tắc **Modular Monolith**, kiến trúc ban đầu của bạn cần được chi tiết hóa. Hình ảnh cũ đúng về mặt tổng quan nhưng thiếu các thành phần quan trọng để xử lý bài toán tối ưu hóa phức tạp.

Dưới đây là sơ đồ kiến trúc chi tiết cập nhật:

```mermaid
graph TD
    %% -- User Interaction Layer --
    User[Người dùng<br>(Mobile/Web)] -->|HTTPS| NextApp[**Frontend Next.js 15**<br>App Router]

    %% -- Frontend / BFF Layer --
    subgraph Frontend_Eco [Frontend Ecosystem]
        direction TB
        NextApp -->|Interactive| ServerActions[**Server Actions (BFF)**<br>Data Validation & Orchestration]

        ServerActions -->|Secure API Call| APIGateway[Auth Header Injection<br>Supabase JWT]
    end

    %% -- Backend Infrastructure --
    subgraph Backend_Infrastructure [Backend Services]
        direction TB

        %% -- Main Monolith --
        subgraph Modular_Monolith [**FastAPI Modular Monolith**]
            direction TB

            API_Core[**API Core**<br>Main.py]

            subgraph Vertical_Slices [Vertical Slices / Modules]
                AuthMod[Module<br>Xác thực]
                StaffMod[Module<br>Nhân sự]
                CustMod[Module<br>Khách hàng]

                %% -- Critical Component: Booking --
                BookingMod[**Module Lịch hẹn**<br>Booking Logic]
            end

            %% -- Infrastructure Layer --
            Infra[**Shared Kernel**<br>DB Config, RLS Injection, Logger]

            API_Core --> Vertical_Slices
            Vertical_Slices --> Infra
        end

        %% -- Smart Engine (New) --
        subgraph Optimization_Engine [**Smart Scheduling Engine**]
            SolverWorker[**Solver Worker**<br>Background Process]
            CSP_Model[**OR-Tools CP-SAT**<br>Constraint Solver]

            SolverWorker -->|Builds| CSP_Model
            SolverWorker -->|Optimizes| Objectives[Hàm Mục tiêu<br>(CSAT, Utilization)]
        end
    end

    %% -- Data Persistence & Messaging --
    subgraph Data_Layer [Data & State]
        PG[(**PostgreSQL**<br>Supabase DB + RLS Enabled)]
        Redis[(**Redis**<br>Job Queue & Caching)]
        SupabaseAuth[Supabase Auth<br>Identity Provider]
    end

    %% -- Relationships --

    %% BFF to Backend
    ServerActions -->|REST API| API_Core

    %% Auth Flow
    Frontend_Eco -.->|Login| SupabaseAuth
    SupabaseAuth -.->|Token| Frontend_Eco

    %% Database Interaction
    Infra -->|RLS Protected Session| PG

    %% Smart Scheduling Flow (Critical Update)
    BookingMod -->|Push Job| Redis
    Redis -->|Pull Job| SolverWorker
    SolverWorker -->|Update Schedule| PG

    %% Styling
    classDef primary fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef component fill:#fff,stroke:#333,stroke-width:1px;
    classDef storage fill:#fff3e0,stroke:#ff6f00,stroke-width:2px;
    classDef engine fill:#e8f5e9,stroke:#2e7d32,stroke-width:3px;

    class NextApp,ServerActions,API_Core primary
    class PG,Redis,SupabaseAuth storage
    class SolverWorker,CSP_Model engine
```

## Các Điểm Nâng Cấp Quan Trọng So Với Hình Cũ

1.  **Tách Biệt Lớp Smart Scheduling Engine (Quan Trọng Nhất)**
    *   **Vấn đề cũ:** Hình cũ chỉ có "Module Lịch hẹn". Với thuật toán CP-SAT của Google BW-Tools, việc tính toán có thể mất từ vài giây đến vài phút (nếu dữ liệu lớn). Nếu chạy trực tiếp trong API Request, server sẽ bị treo (timeout).
    *   **Giải pháp:** Thêm **Redis** làm hàng đợi (Job Queue) và **Solver Worker** (tiến trình nền). Khi có yêu cầu "Tối ưu hóa lịch" hoặc "Xử lý sự cố", API chỉ gửi lệnh vào Redis rồi trả về "Đang xử lý". Worker sẽ chạy thuật toán nặng và cập nhật lại DB sau.

2.  **Khẳng Định Vai Trò BFF của Next.js Server Actions**
    *   **Vấn đề cũ:** Hình cũ vẽ mũi tên chung chung từ Frontend.
    *   **Cập nhật:** Xác định rõ **Server Actions** là lớp trung gian (Backend-for-Frontend). Client không gọi trực tiếp FastAPI. Server Actions sẽ lọc dữ liệu, validate sơ bộ, rồi mới gọi FastAPI (giấu kín API Key nội bộ nếu có).

3.  **Cơ Chế Bảo Mật RLS (Row Level Security)**
    *   **Vấn đề cũ:** Kết nối DB chung chung.
    *   **Cập nhật:** Module `Shared Kernel` chịu trách nhiệm **RLS Injection**. Mỗi kết nối tới PostgreSQL đều phải đi qua bước "mạo danh" user (Impersonation) để đảm bảo Policy của Supabase hoạt động đúng (KTV chỉ thấy lịch của mình, Admin thấy hết).

4.  **Luồng Dữ Liệu "Reactive"**
    *   Hệ thống không chỉ ghi nhận lịch mà còn **phản ứng**. Khi một KTV báo nghỉ đột xuất (Input), Booking Module đẩy việc vào Queue -> Solver tính toán phương án thay thế tối ưu (Match-up Rescheduling) -> Cập nhật DB.
