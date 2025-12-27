# Thiết Kế Cơ Sở Dữ Liệu Synapse (Database Design) v2.2

Tài liệu này mô tả chi tiết mô hình dữ liệu (Data Model) và cung cấp script SQL khởi tạo cho hệ thống Synapse. **Phiên bản 2.2** đã được tinh chỉnh để tách biệt định danh Khách hàng (Customer) và Tài khoản hệ thống (User), hỗ trợ trọn vẹn nghiệp vụ Khách vãng lai và Đa kênh thông báo.

## 1. Mô hình Quan hệ Thực thể (ER Diagram)

```mermaid
erDiagram
    %% === USERS & ROLES ===
    users {
        uuid id PK "Supabase Auth ID"
        string email UK
        string full_name
        string avatar_url
        enum role "admin, receptionist, technician, customer"
        boolean is_active
        timestamp deleted_at "Soft Delete"
        timestamp created_at
        timestamp updated_at
    }

    staff_profiles {
        uuid user_id PK,FK
        string title
        string bio
        string phone_number
        string color_code
        decimal commission_rate "0-100%"
        date hired_at
    }

    users ||--o| staff_profiles : "has"

    %% === CUSTOMERS (CORE ENTITY) ===
    customers {
        uuid id PK "Customer ID riêng biệt"
        string phone_number UK "Định danh chính"
        string full_name
        string email "Optional contact email"
        uuid user_id FK,UK,Nullable "Link to App Account"

        int loyalty_points
        enum membership_tier "SILVER, GOLD, PLATINUM"

        enum gender "MALE, FEMALE, OTHER"
        date date_of_birth
        text address
        text allergies
        text medical_notes

        uuid preferred_staff_id FK
        timestamp created_at
        timestamp updated_at
    }

    users ||--o| customers : "linked_to"
    staff_profiles ||--o{ customers : "preferred_by"

    %% === SKILLS ===
    skills {
        uuid id PK
        string name
        string code UK
        text description
    }

    staff_skills {
        uuid staff_id PK,FK
        uuid skill_id PK,FK
    }

    staff_profiles ||--|{ staff_skills : "possesses"
    skills ||--|{ staff_skills : "assigned_to"

    %% === SERVICES ===
    service_categories {
        uuid id PK
        string name
        text description
        int sort_order
    }

    services {
        uuid id PK
        uuid category_id FK
        string name
        int duration
        int buffer_time
        decimal price
        text description
        string image_url
        boolean is_active
        timestamp deleted_at "Soft Delete"
        timestamp created_at
        timestamp updated_at
    }

    service_categories ||--|{ services : "contains"

    service_required_skills {
        uuid service_id PK,FK
        uuid skill_id PK,FK
    }

    services ||--|{ service_required_skills : "requires"
    skills ||--|{ service_required_skills : "needed_by"

    %% === RESOURCES ===
    resource_groups {
        uuid id PK
        string name
        enum type "BED, EQUIPMENT"
        text description
        timestamp deleted_at
    }

    resources {
        uuid id PK
        uuid group_id FK
        string name
        string code UK
        enum status "ACTIVE, MAINTENANCE, INACTIVE"
        int setup_time_minutes
        text description
        string image_url
        timestamp deleted_at
    }

    service_resource_requirements {
        uuid service_id PK,FK
        uuid group_id PK,FK
        int quantity
        int start_delay "Phút bắt đầu (từ 0)"
        int usage_duration "Thời lượng (null = full)"
    }

    resource_groups ||--|{ resources : "categorizes"
    services ||--|{ service_resource_requirements : "needs"
    resource_groups ||--|{ service_resource_requirements : "needed_as"

    %% === SCHEDULING ===
    shifts {
        uuid id PK
        string name
        time start_time
        time end_time
        string color_code
    }

    staff_schedules {
        uuid id PK
        uuid staff_id FK
        uuid shift_id FK
        date work_date
        enum status "PUBLISHED, DRAFT"
        timestamp created_at
    }

    staff_profiles ||--|{ staff_schedules : "assigned"
    staff_profiles ||--|{ staff_schedules : "assigned"
    shifts ||--|{ staff_schedules : "defined_by"

    %% === OPERATING HOURS ===
    regular_operating_hours {
        uuid id PK
        int day_of_week "1=Mon, 7=Sun"
        int period_number
        time open_time
        time close_time
        boolean is_closed
    }

    exception_dates {
        uuid id PK
        date exception_date
        enum type "HOLIDAY, MAINTENANCE, CUSTOM"
        time open_time
        time close_time
        boolean is_closed
        string reason
    }

    %% === BOOKINGS ===
    bookings {
        uuid id PK
        uuid customer_id FK "Reference Table Customers"
        uuid created_by FK "Người tạo booking (User)"
        timestamp start_time
        timestamp end_time
        enum status
        text notes
        text cancel_reason
        timestamp check_in_time
        timestamp actual_start_time
        timestamp actual_end_time
        decimal total_price
        timestamp created_at
        timestamp updated_at
    }

    customers ||--|{ bookings : "has"
    users ||--|{ bookings : "creates"

    booking_items {
        uuid id PK
        uuid booking_id FK
        uuid service_id FK
        uuid staff_id FK
        uuid treatment_id FK
        string service_name_snapshot "Snapshot"
        timestamp start_time
        timestamp end_time
        decimal original_price
    }

    booking_item_resources {
        uuid booking_item_id PK,FK
        uuid resource_id PK,FK
    }

    bookings ||--|{ booking_items : "includes"
    services ||--|{ booking_items : "instance_of"
    staff_profiles ||--o{ booking_items : "performs"

    booking_items ||--|{ booking_item_resources : "uses"
    resources ||--|{ booking_item_resources : "allocated_to"

    %% === TREATMENTS ===
    customer_treatments {
        uuid id PK
        uuid customer_id FK "Reference Table Customers"
        uuid service_id FK
        string name
        int total_sessions
        int used_sessions
        date expiry_date
        enum status "ACTIVE, COMPLETED, EXPIRED"
        timestamp created_at
    }

    customers ||--|{ customer_treatments : "owns"
    booking_items ||--o| customer_treatments : "redeems"

    %% === SERVICE PACKAGES ===
    service_packages {
        uuid id PK
        string name
        text description
        decimal price
        int validity_days
        boolean is_active
        timestamp created_at
    }

    package_services {
        uuid package_id PK,FK
        uuid service_id PK,FK
        int quantity
    }

    service_packages ||--|{ package_services : "includes"
    services ||--|{ package_services : "part_of"

    %% === BILLING ===
    invoices {
        uuid id PK
        uuid booking_id FK,UK
        decimal amount
        enum status "PAID, UNPAID, REFUNDED"
        timestamp issued_at
    }

    bookings ||--|| invoices : "generates"

    payments {
        uuid id PK
        uuid invoice_id FK
        decimal amount
        enum method "CASH, CARD, TRANSFER"
        string transaction_ref
        jsonb gateway_info
        timestamp transaction_time
    }

    invoices ||--|{ payments : "paid_by"

    %% === REVIEWS ===
    reviews {
        uuid id PK
        uuid booking_id FK
        uuid customer_id FK
        int rating "1-5"
        text comment
        timestamp created_at
    }

    bookings ||--o| reviews : "rated_in"

    %% === SYSTEM ===
    notifications {
        uuid id PK
        uuid user_id FK
        string title
        text message
        boolean is_read
        string type
        timestamp created_at
    }

    users ||--|{ notifications : "receives"

    audit_logs {
        uuid id PK
        string table_name
        uuid record_id
        string action
        jsonb old_data
        jsonb new_data
        uuid changed_by FK
        timestamp changed_at
    }

    %% === WAITLIST ===
    waitlist {
        uuid id PK
        uuid customer_id FK
        uuid service_id FK
        date preferred_date
        time preferred_time_start
        time preferred_time_end
        enum status "PENDING, NOTIFIED, BOOKED, EXPIRED"
        timestamp created_at
        timestamp notified_at
    }

    customers ||--|{ waitlist : "joins"
    services ||--|{ waitlist : "for"

    %% === CHAT ===
    chat_sessions {
        uuid id PK
        uuid customer_id FK
        uuid staff_id FK
        enum status "OPEN, CLOSED"
        timestamp created_at
        timestamp closed_at
    }

    chat_messages {
        uuid id PK
        uuid session_id FK
        uuid sender_id FK
        text content
        boolean is_read
        timestamp created_at
    }

    customers ||--|{ chat_sessions : "initiates"
    staff_profiles ||--o{ chat_sessions : "handles"
    chat_sessions ||--|{ chat_messages : "contains"

    %% === WARRANTY ===
    warranty_tickets {
        uuid id PK
        uuid booking_id FK
        uuid customer_id FK
        text description
        text images
        enum status "PENDING, APPROVED, REJECTED, RESOLVED"
        text resolution_notes
        uuid resolved_by FK
        timestamp created_at
        timestamp resolved_at
    }

    bookings ||--o| warranty_tickets : "has"
    customers ||--|{ warranty_tickets : "submits"

    %% === TREATMENT NOTES ===
    treatment_notes {
        uuid id PK
        uuid booking_item_id FK
        uuid staff_id FK
        text skin_condition
        text reaction_notes
        text special_notes
        text recommendations
        timestamp created_at
    }

    booking_items ||--o| treatment_notes : "has"
    staff_profiles ||--|{ treatment_notes : "writes"

    %% === PROMOTIONS ===
    promotions {
        uuid id PK
        string code UK
        string name
        text description
        enum discount_type "PERCENTAGE, FIXED_AMOUNT"
        decimal discount_value
        decimal min_order_value
        int max_uses
        int current_uses
        date valid_from
        date valid_until
        boolean is_active
        timestamp created_at
    }
```

## 2. PostgreSQL Creation Script

```sql
-- ============================================================
-- SYNAPSE DATABASE v2.2
-- Updated: Decoupled Customer Identity from User Auth
-- ============================================================

-- Kích hoạt Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- For Exclusion Constraints (chống đặt trùng lịch)

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('admin', 'receptionist', 'technician', 'customer');
CREATE TYPE membership_tier AS ENUM ('SILVER', 'GOLD', 'PLATINUM');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE resource_type AS ENUM ('BED', 'EQUIPMENT');
CREATE TYPE resource_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE invoice_status AS ENUM ('PAID', 'UNPAID', 'REFUNDED');
CREATE TYPE payment_method AS ENUM ('CASH', 'CARD', 'TRANSFER');
CREATE TYPE treatment_status AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED');
CREATE TYPE schedule_status AS ENUM ('PUBLISHED', 'DRAFT');
CREATE TYPE exception_type AS ENUM ('HOLIDAY', 'MAINTENANCE', 'SPECIAL_HOURS', 'CUSTOM');

-- ============================================================
-- HELPER FUNCTIONS (RLS Helpers)
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Get current user ID from JWT claims (for RLS)
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::UUID;
EXCEPTION
    WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get current user role
CREATE OR REPLACE FUNCTION auth.role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM users WHERE id = auth.uid()
    );
EXCEPTION
    WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if current user is staff
CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() IN ('admin', 'receptionist', 'technician');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- TABLES: USERS MODULE (AUTH)
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    deleted_at TIMESTAMPTZ, -- Soft delete
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE staff_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    bio TEXT,
    phone_number VARCHAR(50) NOT NULL,
    color_code VARCHAR(7) DEFAULT '#6366F1',
    commission_rate DECIMAL(5, 2) DEFAULT 0.0,
    hired_at DATE DEFAULT CURRENT_DATE,

    CONSTRAINT chk_commission_rate CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

-- ============================================================
-- TABLES: WARRANTY MODULE
-- ============================================================

CREATE TYPE warranty_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED');

CREATE TABLE warranty_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treatment_id UUID REFERENCES customer_treatments(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

    description TEXT NOT NULL,
    images TEXT[], -- Array of image URLs

    status warranty_status NOT NULL DEFAULT 'PENDING',
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT description_length CHECK (char_length(description) >= 10)
);

CREATE INDEX idx_warranty_customer ON warranty_tickets(customer_id);
CREATE INDEX idx_warranty_treatment ON warranty_tickets(treatment_id);

-- ============================================================
-- TABLES: CUSTOMERS MODULE (CORE CRM)
-- ============================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(50) UNIQUE NOT NULL, -- Định danh chính
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),

    -- Link to User Account (Optional - for App Users)
    user_id UUID REFERENCES users(id) ON DELETE SET NULL UNIQUE,

    loyalty_points INTEGER DEFAULT 0,
    membership_tier membership_tier DEFAULT 'SILVER',
    gender gender,
    date_of_birth DATE,
    address TEXT,
    allergies TEXT,
    medical_notes TEXT,

    preferred_staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_loyalty_points CHECK (loyalty_points >= 0)
);

-- Index cho tìm kiếm nhanh
CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_name ON customers USING gin (full_name gin_trgm_ops);

-- ============================================================
-- TABLES: SKILLS MODULE
-- ============================================================

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE staff_skills (
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (staff_id, skill_id)
);

-- ============================================================
-- TABLES: SERVICES MODULE
-- ============================================================

CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    buffer_time INTEGER DEFAULT 0,
    price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    deleted_at TIMESTAMPTZ, -- Soft delete
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_duration CHECK (duration > 0),
    CONSTRAINT chk_buffer CHECK (buffer_time >= 0),
    CONSTRAINT chk_price CHECK (price >= 0)
);

CREATE TABLE service_required_skills (
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (service_id, skill_id)
);

-- ============================================================
-- TABLES: RESOURCES MODULE
-- ============================================================

CREATE TABLE resource_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type resource_type NOT NULL, -- Logical classification
    description TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES resource_groups(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    status resource_status DEFAULT 'ACTIVE' NOT NULL,
    setup_time_minutes INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    deleted_at TIMESTAMPTZ, -- Soft delete

    CONSTRAINT chk_setup_time CHECK (setup_time_minutes >= 0)
);

CREATE TABLE service_resource_requirements (
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    group_id UUID REFERENCES resource_groups(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    start_delay INTEGER DEFAULT 0 NOT NULL,
    usage_duration INTEGER, -- NULL means full duration
    PRIMARY KEY (service_id, group_id),

    CONSTRAINT chk_quantity CHECK (quantity > 0)
);

-- ============================================================
-- TABLES: SCHEDULING MODULE
-- ============================================================

CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    color_code VARCHAR(7),

    CONSTRAINT chk_shift_time CHECK (end_time > start_time)
);

CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE CASCADE NOT NULL,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE NOT NULL,
    work_date DATE NOT NULL,
    status schedule_status DEFAULT 'DRAFT' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    UNIQUE(staff_id, work_date, shift_id)
);

-- Bảng giờ hoạt động tiêu chuẩn
CREATE TABLE regular_operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    period_number SMALLINT NOT NULL DEFAULT 1, -- Hỗ trợ nhiều ca/ngày
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_hours CHECK (close_time > open_time OR is_closed = TRUE),
    UNIQUE (day_of_week, period_number)
);

-- Bảng ngày ngoại lệ
CREATE TABLE exception_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exception_date DATE NOT NULL UNIQUE,
    type exception_type DEFAULT 'CUSTOM' NOT NULL,
    reason VARCHAR(255) NOT NULL,
    is_closed BOOLEAN DEFAULT TRUE,
    open_time TIME,
    close_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_exception_hours CHECK (
        (is_closed = TRUE AND open_time IS NULL AND close_time IS NULL) OR
        (is_closed = FALSE AND open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time)
    )
);

-- ============================================================
-- TABLES: BOOKING MODULE (Updated References)
-- ============================================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Changed from users to customers
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,      -- User tạo booking (có thể là Staff or Customer)

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status DEFAULT 'CONFIRMED' NOT NULL,
    notes TEXT,
    cancel_reason TEXT,
    check_in_time TIMESTAMPTZ,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    total_price DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_booking_time CHECK (end_time > start_time),
    CONSTRAINT chk_total_price CHECK (total_price >= 0)
);

CREATE TABLE customer_treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL, -- Changed
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    total_sessions INTEGER NOT NULL,
    used_sessions INTEGER DEFAULT 0,
    expiry_date DATE,
    status treatment_status DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_sessions CHECK (used_sessions >= 0 AND used_sessions <= total_sessions),
    CONSTRAINT chk_total_sessions CHECK (total_sessions > 0)
);

CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL,
    treatment_id UUID REFERENCES customer_treatments(id) ON DELETE SET NULL,
    service_name_snapshot VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,

    CONSTRAINT chk_item_time CHECK (end_time > start_time),
    CONSTRAINT chk_item_price CHECK (original_price >= 0),

    -- Exclusion Constraint: Staff Overlap
    CONSTRAINT no_overlap_staff_booking EXCLUDE USING gist (
        staff_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (staff_id IS NOT NULL)
);

CREATE TABLE booking_item_resources (
    booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    PRIMARY KEY (booking_item_id, resource_id)
);
-- Note: Resource Overlap Constraint needs complex handling (Trigger or Exclusion on denormalized data).
-- This design assumes application-level check by Solver/ConflictChecker.

-- Index cho Operating Hours
CREATE UNIQUE INDEX idx_regular_hours_day_period ON regular_operating_hours(day_of_week, period_number);
CREATE INDEX idx_exception_dates_date ON exception_dates(exception_date);

-- ============================================================
-- TABLES: SERVICE PACKAGES & BILLING
-- ============================================================

CREATE TABLE service_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    validity_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_package_price CHECK (price >= 0),
    CONSTRAINT chk_validity CHECK (validity_days IS NULL OR validity_days > 0)
);

CREATE TABLE package_services (
    package_id UUID REFERENCES service_packages(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (package_id, service_id),

    CONSTRAINT chk_pkg_quantity CHECK (quantity > 0)
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL UNIQUE,
    amount DECIMAL(12, 2) NOT NULL,
    status invoice_status DEFAULT 'UNPAID' NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_amount CHECK (amount >= 0)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    method payment_method NOT NULL,
    transaction_ref VARCHAR(100),
    gateway_info JSONB,
    transaction_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_payment_amount CHECK (amount > 0)
);

-- ============================================================
-- TABLES: REVIEWS & AUDIT
-- ============================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL, -- Changed
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    UNIQUE(booking_id, customer_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE system_configurations (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABLES: WAITLIST
-- ============================================================

CREATE TYPE waitlist_status AS ENUM ('PENDING', 'NOTIFIED', 'BOOKED', 'EXPIRED');

CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_start TIME,
    preferred_time_end TIME,
    status waitlist_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    notified_at TIMESTAMPTZ,

    UNIQUE(customer_id, service_id, preferred_date)
);

-- ============================================================
-- TABLES: CHAT
-- ============================================================

CREATE TYPE chat_session_status AS ENUM ('OPEN', 'CLOSED');

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL,
    status chat_session_status DEFAULT 'OPEN' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    closed_at TIMESTAMPTZ
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at);

-- ============================================================
-- TABLES: WARRANTY
-- ============================================================

CREATE TYPE warranty_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED');

CREATE TABLE warranty_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    images TEXT[], -- Array of image URLs
    status warranty_status DEFAULT 'PENDING' NOT NULL,
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ
);

-- ============================================================
-- TABLES: TREATMENT NOTES
-- ============================================================

CREATE TABLE treatment_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE NOT NULL UNIQUE,
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL NOT NULL,
    skin_condition TEXT,
    reaction_notes TEXT,
    special_notes TEXT,
    recommendations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABLES: PROMOTIONS
-- ============================================================

CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    min_order_value DECIMAL(12, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_discount_value CHECK (discount_value > 0),
    CONSTRAINT chk_valid_dates CHECK (valid_until >= valid_from),
    CONSTRAINT chk_uses CHECK (max_uses IS NULL OR current_uses <= max_uses)
);

CREATE INDEX idx_promotions_code ON promotions(code) WHERE is_active = TRUE;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_modified_column(); -- New
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_system_config_modtime BEFORE UPDATE ON system_configurations FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE regular_operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE exception_dates ENABLE ROW LEVEL SECURITY;
-- ... (Enable for others)

-- === OPERATING HOURS POLICIES ===
-- Public đọc (để hiển thị trên booking wizard)
CREATE POLICY regular_hours_read_public ON regular_operating_hours FOR SELECT USING (true);
CREATE POLICY exception_dates_read_public ON exception_dates FOR SELECT USING (true);

-- Chỉ Admin được sửa
CREATE POLICY regular_hours_admin_all ON regular_operating_hours FOR ALL USING (auth.role() = 'admin');
CREATE POLICY exception_dates_admin_all ON exception_dates FOR ALL USING (auth.role() = 'admin');

-- === CUSTOMERS POLICIES (Updated) ===

-- Staff can View/Edit All Customers
CREATE POLICY customers_staff_all ON customers
    FOR ALL USING (auth.is_staff());

-- Customers can View/Edit ONLY their own profile (linked via user_id)
CREATE POLICY customers_self_select ON customers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY customers_self_update ON customers
    FOR UPDATE USING (user_id = auth.uid());

-- Customers can Create profile (link phone on registration)
CREATE POLICY customers_insert_public ON customers
    FOR INSERT WITH CHECK (true); -- Logic handled by API to prevent spam

-- === BOOKINGS POLICIES (Updated) ===

-- Customers see bookings linked to their customer_id
CREATE POLICY bookings_customer_select ON bookings
    FOR SELECT USING (
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
    );
```

---

## 3. Chiến lược Kiểm soát Đồng thời (Concurrency Control Strategy)

### 3.1 Vấn đề: Race Condition trong Đặt lịch

Khi nhiều người dùng cùng đặt một khung giờ cho cùng một nhân viên hoặc tài nguyên (phòng/giường), có thể xảy ra tình huống **Race Condition** nếu không có cơ chế kiểm soát phù hợp.

**Ví dụ:**
- Khách A và Khách B cùng xem thấy slot 10:00-11:00 của KTV Lan còn trống.
- Cả hai đồng thời nhấn "Đặt lịch".
- Nếu không có cơ chế khóa, cả hai đều được tạo booking → **Trùng lịch**.

### 3.2 Giải pháp: PostgreSQL Exclusion Constraints

Thay vì xử lý logic phức tạp ở tầng Application hoặc dùng Distributed Lock (Redis Redlock), hệ thống sử dụng **PostgreSQL Exclusion Constraints** - một tính năng native của PostgreSQL.

**Ưu điểm:**
1. **Đơn giản**: Chỉ cần khai báo constraint, không cần viết code logic kiểm tra.
2. **Tin cậy**: Database đảm bảo tính toàn vẹn dữ liệu ở mức thấp nhất.
3. **Hiệu năng**: Sử dụng GiST index, tối ưu cho các phép so sánh khoảng (range).

### 3.3 Constraint đã triển khai

```sql
-- Ngăn chặn đặt trùng lịch cho cùng một NHÂN VIÊN
CONSTRAINT no_overlap_staff_booking EXCLUDE USING gist (
    staff_id WITH =,                          -- Cùng nhân viên
    tstzrange(start_time, end_time) WITH &&   -- Thời gian chồng lấn
) WHERE (staff_id IS NOT NULL);

-- Ngăn chặn đặt trùng lịch cho cùng một TÀI NGUYÊN
CONSTRAINT no_overlap_resource_booking EXCLUDE USING gist (
    resource_id WITH =,                       -- Cùng tài nguyên
    tstzrange(start_time, end_time) WITH &&
) WHERE (resource_id IS NOT NULL);
```

### 3.4 Xử lý lỗi ở Backend

Khi xảy ra vi phạm constraint, PostgreSQL sẽ throw lỗi với mã `23P01` (Exclusion Violation). Backend cần catch lỗi này và trả về thông báo thân thiện:

```python
try:
    await session.commit()
except IntegrityError as e:
    if "no_overlap_staff_booking" in str(e) or "no_overlap_resource_booking" in str(e):
        raise HTTPException(
            status_code=409,
            detail="Khung giờ này vừa có người đặt. Vui lòng chọn khung giờ khác."
        )
    raise
```

---

## 4. Quy ước Thuật ngữ (Terminology Convention)

Để đảm bảo tính nhất quán trong tài liệu thiết kế và code, hệ thống sử dụng các thuật ngữ sau:

| Thuật ngữ Kỹ thuật | Thuật ngữ Hiển thị (UI) | Mô tả |
|-------------------|------------------------|-------|
| **Resource** | Tài nguyên | Bất kỳ đối tượng vật lý nào cần được quản lý tính khả dụng |
| **Resource Group** | Nhóm Tài nguyên | Phân loại logic cho Resource |
| **ROOM** (type) | Phòng | Không gian thực hiện dịch vụ (VD: Phòng VIP, Phòng Thường) |
| **EQUIPMENT** (type) | Thiết bị | Vật dụng lớn cần đặt lịch (VD: Máy laser, Ghế spa) |
| **Resource (instance)** | Giường/Ghế/Máy cụ thể | Một đơn vị cụ thể trong Resource Group |
| **Staff** | Nhân viên | Bao gồm Admin, Lễ tân, Kỹ thuật viên |
| **Customer** | Khách hàng | Hồ sơ CRM, có thể liên kết hoặc không liên kết với User |
| **User** | Tài khoản | Tài khoản đăng nhập hệ thống (Supabase Auth) |
| **Booking** | Lịch hẹn | Một phiên đặt lịch tổng (có thể chứa nhiều dịch vụ) |
| **Booking Item** | Mục lịch hẹn | Một dịch vụ cụ thể trong Booking |
| **Treatment** | Liệu trình | Gói nhiều buổi của cùng một dịch vụ |

**Lưu ý quan trọng:**
- Trong **tài liệu kỹ thuật** (code, DB, API): Sử dụng thuật ngữ tiếng Anh (`Resource`, `Staff`, `Customer`).
- Trong **giao diện người dùng**: Sử dụng thuật ngữ tiếng Việt phù hợp ngữ cảnh.
- Thuộc tính `is_closed` nghĩa đen là "đóng cửa" (ngày nghỉ), không phải "đã hoàn thành".
