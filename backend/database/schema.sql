-- ============================================================
-- SYNAPSE DATABASE SCHEMA v2.0
-- Hệ thống Quản lý Spa - CRM
-- ============================================================
-- Tác giả: Synapse Development Team
-- Ngày tạo: 2025-12-07
-- Mô tả: Script khởi tạo đầy đủ database cho PostgreSQL (Supabase)
-- Bao gồm: Tables, Indexes, Constraints, RLS Policies, Triggers
-- ============================================================

-- ============================================================
-- PHẦN 1: EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Tạo UUID
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Tìm kiếm văn bản (Trigram)

-- ============================================================
-- PHẦN 2: ENUM TYPES
-- ============================================================

-- Vai trò người dùng trong hệ thống
-- admin: Quản trị viên - toàn quyền
-- receptionist: Lễ tân - quản lý booking, thanh toán
-- technician: Kỹ thuật viên (KTV) - thực hiện dịch vụ
-- customer: Khách hàng - đặt lịch, đánh giá
CREATE TYPE user_role AS ENUM ('admin', 'receptionist', 'technician', 'customer');

-- Hạng thành viên khách hàng
CREATE TYPE membership_tier AS ENUM ('SILVER', 'GOLD', 'PLATINUM');

-- Loại tài nguyên
CREATE TYPE resource_type AS ENUM ('ROOM', 'EQUIPMENT');

-- Trạng thái tài nguyên
CREATE TYPE resource_status AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');

-- Trạng thái lịch hẹn
-- PENDING: Chờ xác nhận
-- CONFIRMED: Đã xác nhận
-- IN_PROGRESS: Đang thực hiện
-- COMPLETED: Hoàn thành
-- CANCELLED: Đã hủy
-- NO_SHOW: Khách không đến
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- Trạng thái hóa đơn
CREATE TYPE invoice_status AS ENUM ('PAID', 'UNPAID', 'REFUNDED');

-- Phương thức thanh toán
CREATE TYPE payment_method AS ENUM ('CASH', 'CARD', 'TRANSFER');

-- Trạng thái gói liệu trình
CREATE TYPE treatment_status AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED');

-- Trạng thái lịch làm việc
CREATE TYPE schedule_status AS ENUM ('PUBLISHED', 'DRAFT');

-- ============================================================
-- PHẦN 3: HELPER FUNCTIONS
-- ============================================================

-- Hàm tự động cập nhật cột updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hàm lấy User ID từ JWT claims (cho RLS)
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::UUID;
EXCEPTION
    WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Hàm lấy vai trò của user hiện tại
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

-- Hàm kiểm tra user có phải nhân viên không (receptionist/technician/admin)
CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() IN ('admin', 'receptionist', 'technician');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- PHẦN 4: TABLES
-- ============================================================

-- ------------------------------------------------------------
-- 4.1. USERS MODULE
-- ------------------------------------------------------------

-- Bảng người dùng chính (đồng bộ với Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(50),
    avatar_url TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    deleted_at TIMESTAMPTZ,  -- Soft delete
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE users IS 'Lưu trữ thông tin người dùng hệ thống, liên kết với Supabase Auth';
COMMENT ON COLUMN users.deleted_at IS 'Thời điểm xóa mềm, NULL nếu chưa xóa';
COMMENT ON COLUMN users.role IS 'Vai trò: admin (Quản trị viên), receptionist (Lễ tân), technician (KTV), customer (Khách hàng)';

-- Unique phone number (chỉ áp dụng khi phone không null và user chưa bị xóa)
CREATE UNIQUE INDEX idx_users_phone_unique
    ON users(phone_number)
    WHERE phone_number IS NOT NULL AND deleted_at IS NULL;

-- Bảng thông tin mở rộng cho nhân viên (quan hệ 1-1 với users)
CREATE TABLE staff_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    bio TEXT,
    color_code VARCHAR(7) DEFAULT '#6366F1',
    commission_rate DECIMAL(5, 2) DEFAULT 0.0,
    hired_at DATE DEFAULT CURRENT_DATE,

    CONSTRAINT chk_commission_rate CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

COMMENT ON TABLE staff_profiles IS 'Thông tin chi tiết cho nhân viên (Lễ tân, KTV)';
COMMENT ON COLUMN staff_profiles.commission_rate IS 'Tỷ lệ hoa hồng (0-100%)';
COMMENT ON COLUMN staff_profiles.color_code IS 'Mã màu hiển thị trên lịch (HEX)';

-- Bảng thông tin mở rộng cho khách hàng (quan hệ 1-1 với users)
CREATE TABLE customer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    loyalty_points INTEGER DEFAULT 0,
    membership_tier membership_tier DEFAULT 'SILVER',
    date_of_birth DATE,
    address TEXT,

    CONSTRAINT chk_loyalty_points CHECK (loyalty_points >= 0)
);

COMMENT ON TABLE customer_profiles IS 'Thông tin chi tiết cho khách hàng';
COMMENT ON COLUMN customer_profiles.loyalty_points IS 'Điểm tích lũy thành viên';

-- ------------------------------------------------------------
-- 4.2. SKILLS MODULE
-- ------------------------------------------------------------

-- Bảng kỹ năng chuyên môn
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

COMMENT ON TABLE skills IS 'Danh mục kỹ năng chuyên môn mà KTV có thể sở hữu';

-- Bảng liên kết nhân viên - kỹ năng (N-N)
CREATE TABLE staff_skills (
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 1,  -- 1: Basic, 2: Intermediate, 3: Expert
    PRIMARY KEY (staff_id, skill_id),

    CONSTRAINT chk_proficiency CHECK (proficiency_level BETWEEN 1 AND 3)
);

COMMENT ON TABLE staff_skills IS 'Kỹ năng mà mỗi nhân viên sở hữu và mức độ thành thạo';

-- ------------------------------------------------------------
-- 4.3. SERVICES MODULE
-- ------------------------------------------------------------

-- Bảng danh mục dịch vụ
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

COMMENT ON TABLE service_categories IS 'Phân loại các nhóm dịch vụ (Massage, Facial, Body,...)';

-- Bảng dịch vụ
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer_time_minutes INTEGER DEFAULT 0,
    price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    color_code VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_duration CHECK (duration_minutes > 0),
    CONSTRAINT chk_buffer CHECK (buffer_time_minutes >= 0),
    CONSTRAINT chk_price CHECK (price >= 0)
);

COMMENT ON TABLE services IS 'Danh sách các dịch vụ Spa cung cấp';
COMMENT ON COLUMN services.duration_minutes IS 'Thời lượng thực hiện dịch vụ (phút)';
COMMENT ON COLUMN services.buffer_time_minutes IS 'Thời gian nghỉ/dọn dẹp sau dịch vụ (phút)';

-- Bảng liên kết dịch vụ - kỹ năng yêu cầu (N-N)
CREATE TABLE service_required_skills (
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    min_proficiency_level INTEGER DEFAULT 1,
    PRIMARY KEY (service_id, skill_id),

    CONSTRAINT chk_min_proficiency CHECK (min_proficiency_level BETWEEN 1 AND 3)
);

COMMENT ON TABLE service_required_skills IS 'Kỹ năng cần thiết để thực hiện dịch vụ';

-- ------------------------------------------------------------
-- 4.4. RESOURCES MODULE
-- ------------------------------------------------------------

-- Bảng tài nguyên (phòng, thiết bị)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    type resource_type NOT NULL,
    status resource_status DEFAULT 'ACTIVE' NOT NULL,
    capacity INTEGER DEFAULT 1,
    setup_time_minutes INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,

    CONSTRAINT chk_capacity CHECK (capacity > 0),
    CONSTRAINT chk_setup_time CHECK (setup_time_minutes >= 0)
);

COMMENT ON TABLE resources IS 'Quản lý phòng và thiết bị máy móc';
COMMENT ON COLUMN resources.type IS 'ROOM: Phòng điều trị, EQUIPMENT: Thiết bị';

-- Bảng yêu cầu tài nguyên cho dịch vụ
CREATE TABLE service_resource_requirements (
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    resource_type resource_type NOT NULL,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (service_id, resource_type),

    CONSTRAINT chk_quantity CHECK (quantity > 0)
);

COMMENT ON TABLE service_resource_requirements IS 'Định nghĩa loại tài nguyên cần cho mỗi dịch vụ';

-- ------------------------------------------------------------
-- 4.5. SCHEDULING MODULE
-- ------------------------------------------------------------

-- Bảng ca làm việc
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    color_code VARCHAR(7),

    CONSTRAINT chk_shift_time CHECK (end_time > start_time)
);

COMMENT ON TABLE shifts IS 'Định nghĩa các ca làm việc (Sáng, Chiều, Full-time)';

-- Bảng lịch làm việc nhân viên
CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE CASCADE NOT NULL,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE NOT NULL,
    work_date DATE NOT NULL,
    status schedule_status DEFAULT 'DRAFT' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    UNIQUE(staff_id, work_date, shift_id)
);

COMMENT ON TABLE staff_schedules IS 'Phân công ca làm việc cho nhân viên theo ngày';
COMMENT ON COLUMN staff_schedules.status IS 'DRAFT: Nháp (chưa công bố), PUBLISHED: Đã công bố';

-- ------------------------------------------------------------
-- 4.6. BOOKING MODULE
-- ------------------------------------------------------------

-- Bảng lịch hẹn (booking header)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,

    status booking_status DEFAULT 'PENDING' NOT NULL,
    notes TEXT,
    cancel_reason TEXT,

    -- Timestamps cho tracking thực tế
    check_in_time TIMESTAMPTZ,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,

    total_price DECIMAL(12, 2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_booking_time CHECK (end_time > start_time),
    CONSTRAINT chk_total_price CHECK (total_price >= 0)
);

COMMENT ON TABLE bookings IS 'Lưu trữ thông tin tổng quát của một lần đặt hẹn';
COMMENT ON COLUMN bookings.customer_id IS 'NULL nếu là khách vãng lai (walk-in)';
COMMENT ON COLUMN bookings.check_in_time IS 'Thời điểm khách check-in tại quầy';

-- Bảng gói liệu trình của khách hàng
CREATE TABLE customer_treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,

    name VARCHAR(255) NOT NULL,  -- Snapshot tên gói tại thời điểm mua
    total_sessions INTEGER NOT NULL,
    used_sessions INTEGER DEFAULT 0,

    expiry_date DATE,
    status treatment_status DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_sessions CHECK (used_sessions >= 0 AND used_sessions <= total_sessions),
    CONSTRAINT chk_total_sessions CHECK (total_sessions > 0)
);

COMMENT ON TABLE customer_treatments IS 'Các gói liệu trình/combo mà khách hàng đã mua';

-- Bảng chi tiết dịch vụ trong booking (booking items)
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,

    -- Tài nguyên được gán
    staff_id UUID REFERENCES staff_profiles(user_id) ON DELETE SET NULL,
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,

    -- Liên kết gói liệu trình (nếu dùng)
    treatment_id UUID REFERENCES customer_treatments(id) ON DELETE SET NULL,

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,

    CONSTRAINT chk_item_time CHECK (end_time > start_time),
    CONSTRAINT chk_item_price CHECK (original_price >= 0)
);

COMMENT ON TABLE booking_items IS 'Chi tiết từng dịch vụ trong một booking';
COMMENT ON COLUMN booking_items.treatment_id IS 'ID gói liệu trình nếu sử dụng để đổi buổi';

-- ------------------------------------------------------------
-- 4.7. BILLING MODULE
-- ------------------------------------------------------------

-- Bảng hóa đơn
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL UNIQUE,  -- 1-1 với booking

    amount DECIMAL(12, 2) NOT NULL,
    status invoice_status DEFAULT 'UNPAID' NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_amount CHECK (amount >= 0)
);

COMMENT ON TABLE invoices IS 'Hóa đơn thanh toán cho mỗi booking';

-- Bảng giao dịch thanh toán
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,

    amount DECIMAL(12, 2) NOT NULL,
    method payment_method NOT NULL,
    transaction_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_payment_amount CHECK (amount > 0)
);

COMMENT ON TABLE payments IS 'Giao dịch thanh toán thực tế (có thể thanh toán nhiều lần)';

-- ------------------------------------------------------------
-- 4.8. REVIEWS MODULE
-- ------------------------------------------------------------

-- Bảng đánh giá
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    UNIQUE(booking_id, customer_id)  -- 1 khách chỉ đánh giá 1 lần/booking
);

COMMENT ON TABLE reviews IS 'Đánh giá của khách hàng sau khi hoàn thành dịch vụ';

-- ------------------------------------------------------------
-- 4.9. NOTIFICATIONS MODULE
-- ------------------------------------------------------------

-- Bảng thông báo
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    type VARCHAR(50),  -- booking_update, promo, system, reminder

    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE notifications IS 'Thông báo in-app gửi đến người dùng';

-- ------------------------------------------------------------
-- 4.10. SYSTEM MODULE
-- ------------------------------------------------------------

-- Bảng cấu hình hệ thống
CREATE TABLE system_configurations (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE system_configurations IS 'Lưu trữ cấu hình động (giờ làm việc, chính sách,...)';

-- Bảng nhật ký thay đổi (Audit Log)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE audit_logs IS 'Ghi lại mọi thay đổi quan trọng cho mục đích kiểm toán';

-- ============================================================
-- PHẦN 5: INDEXES
-- ============================================================

-- ------------------------------------------------------------
-- 5.1. Users & Profiles
-- ------------------------------------------------------------
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;

-- ------------------------------------------------------------
-- 5.2. Skills
-- ------------------------------------------------------------
CREATE INDEX idx_staff_skills_skill ON staff_skills(skill_id);
CREATE INDEX idx_service_skills_skill ON service_required_skills(skill_id);

-- ------------------------------------------------------------
-- 5.3. Services
-- ------------------------------------------------------------
CREATE INDEX idx_services_category ON services(category_id) WHERE is_active = TRUE;
CREATE INDEX idx_services_active ON services(is_active);

-- ------------------------------------------------------------
-- 5.4. Resources
-- ------------------------------------------------------------
CREATE INDEX idx_resources_type_status ON resources(type, status);

-- ------------------------------------------------------------
-- 5.5. Scheduling (CRITICAL cho xếp lịch)
-- ------------------------------------------------------------
CREATE INDEX idx_staff_schedules_staff_date ON staff_schedules(staff_id, work_date);
CREATE INDEX idx_staff_schedules_date_status ON staff_schedules(work_date, status);

-- ------------------------------------------------------------
-- 5.6. Bookings (CRITICAL cho kiểm tra availability)
-- ------------------------------------------------------------
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(start_time);
CREATE INDEX idx_bookings_status_date ON bookings(status, start_time);

-- Partial indexes cho truy vấn theo trạng thái phổ biến
CREATE INDEX idx_bookings_pending ON bookings(start_time) WHERE status = 'PENDING';
CREATE INDEX idx_bookings_confirmed ON bookings(start_time) WHERE status = 'CONFIRMED';

-- ------------------------------------------------------------
-- 5.7. Booking Items (CRITICAL cho conflict detection)
-- ------------------------------------------------------------
CREATE INDEX idx_booking_items_staff_time ON booking_items(staff_id, start_time, end_time);
CREATE INDEX idx_booking_items_resource_time ON booking_items(resource_id, start_time, end_time);
CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);
CREATE INDEX idx_booking_items_date ON booking_items((start_time::date));

-- ------------------------------------------------------------
-- 5.8. Customer Treatments
-- ------------------------------------------------------------
CREATE INDEX idx_treatments_customer_active ON customer_treatments(customer_id) WHERE status = 'ACTIVE';

-- ------------------------------------------------------------
-- 5.9. Notifications
-- ------------------------------------------------------------
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE is_read = FALSE;

-- ------------------------------------------------------------
-- 5.10. Audit Logs
-- ------------------------------------------------------------
CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_logs(changed_at DESC);

-- ============================================================
-- PHẦN 6: TRIGGERS
-- ============================================================

-- Auto-update updated_at cho các bảng cần thiết
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_services_modtime
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_bookings_modtime
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_system_config_modtime
    BEFORE UPDATE ON system_configurations
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ============================================================
-- PHẦN 7: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ------------------------------------------------------------
-- 7.1. Enable RLS cho tất cả các bảng
-- ------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public tables (cần RLS nhưng cho phép đọc công khai)
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 7.2. Users Policies
-- ------------------------------------------------------------

-- Người dùng xem được profile của mình, nhân viên xem được tất cả
CREATE POLICY users_select_own ON users
    FOR SELECT USING (id = auth.uid() OR auth.is_staff());

-- Nhân viên xem được thông tin khách hàng
CREATE POLICY users_select_customers ON users
    FOR SELECT USING (role = 'customer' AND auth.is_staff());

-- Chỉ Admin quản lý (thêm/sửa/xóa) users
CREATE POLICY users_admin_all ON users
    FOR ALL USING (auth.role() = 'admin');

-- ------------------------------------------------------------
-- 7.3. Bookings Policies
-- ------------------------------------------------------------

-- Khách hàng xem booking của mình
CREATE POLICY bookings_customer_select ON bookings
    FOR SELECT USING (customer_id = auth.uid());

-- Nhân viên (receptionist, technician, admin) xem tất cả booking
CREATE POLICY bookings_staff_select ON bookings
    FOR SELECT USING (auth.is_staff());

-- Khách hàng tạo booking cho mình, nhân viên tạo cho khách vãng lai
CREATE POLICY bookings_customer_insert ON bookings
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR auth.is_staff());

-- Lễ tân và Admin cập nhật booking (check-in, cancel,...)
CREATE POLICY bookings_receptionist_update ON bookings
    FOR UPDATE USING (auth.role() IN ('admin', 'receptionist'));

-- KTV chỉ cập nhật booking mà mình thực hiện
CREATE POLICY bookings_technician_update ON bookings
    FOR UPDATE USING (
        auth.role() = 'technician'
        AND EXISTS (
            SELECT 1 FROM booking_items bi
            WHERE bi.booking_id = bookings.id
            AND bi.staff_id = auth.uid()
        )
    );

-- ------------------------------------------------------------
-- 7.4. Booking Items Policies
-- ------------------------------------------------------------

-- Nhân viên xem tất cả booking items
CREATE POLICY booking_items_staff_select ON booking_items
    FOR SELECT USING (auth.is_staff());

-- Khách hàng xem booking items của booking của mình
CREATE POLICY booking_items_customer_select ON booking_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND b.customer_id = auth.uid())
    );

-- ------------------------------------------------------------
-- 7.5. Staff Schedules Policies
-- ------------------------------------------------------------

-- KTV xem lịch làm việc của mình
CREATE POLICY staff_schedules_own ON staff_schedules
    FOR SELECT USING (staff_id = auth.uid());

-- Lễ tân và Admin xem tất cả lịch
CREATE POLICY staff_schedules_receptionist ON staff_schedules
    FOR SELECT USING (auth.role() IN ('admin', 'receptionist'));

-- Chỉ Admin quản lý lịch làm việc
CREATE POLICY staff_schedules_admin_write ON staff_schedules
    FOR ALL USING (auth.role() = 'admin');

-- ------------------------------------------------------------
-- 7.6. Customer Profiles Policies
-- ------------------------------------------------------------

-- Khách xem profile của mình, nhân viên xem được tất cả
CREATE POLICY customer_profiles_own ON customer_profiles
    FOR ALL USING (user_id = auth.uid() OR auth.is_staff());

-- ------------------------------------------------------------
-- 7.7. Staff Profiles Policies
-- ------------------------------------------------------------

-- Public đọc được thông tin KTV (để đặt lịch)
CREATE POLICY staff_profiles_public_read ON staff_profiles
    FOR SELECT USING (true);

-- Chỉ Admin quản lý staff profiles
CREATE POLICY staff_profiles_admin_write ON staff_profiles
    FOR ALL USING (auth.role() = 'admin');

-- ------------------------------------------------------------
-- 7.8. Notifications Policies
-- ------------------------------------------------------------

-- Người dùng chỉ xem thông báo của mình
CREATE POLICY notifications_own ON notifications
    FOR ALL USING (user_id = auth.uid());

-- ------------------------------------------------------------
-- 7.9. Public Read Policies
-- ------------------------------------------------------------

-- Bất kỳ ai cũng đọc được danh sách kỹ năng
CREATE POLICY skills_public_read ON skills
    FOR SELECT USING (true);

-- Bất kỳ ai cũng đọc được danh mục dịch vụ
CREATE POLICY categories_public_read ON service_categories
    FOR SELECT USING (true);

-- Bất kỳ ai cũng đọc được dịch vụ đang hoạt động
CREATE POLICY services_public_read ON services
    FOR SELECT USING (is_active = true);

-- Chỉ nhân viên xem được tài nguyên
CREATE POLICY resources_staff_read ON resources
    FOR SELECT USING (auth.is_staff());

-- Chỉ nhân viên xem được ca làm việc
CREATE POLICY shifts_staff_read ON shifts
    FOR SELECT USING (auth.is_staff());

-- ------------------------------------------------------------
-- 7.10. Reviews Policies
-- ------------------------------------------------------------

-- Khách hàng tạo đánh giá
CREATE POLICY reviews_customer_create ON reviews
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Public đọc được đánh giá
CREATE POLICY reviews_public_read ON reviews
    FOR SELECT USING (true);

-- ------------------------------------------------------------
-- 7.11. Treatments Policies
-- ------------------------------------------------------------

-- Khách xem gói của mình, nhân viên xem tất cả
CREATE POLICY treatments_customer_read ON customer_treatments
    FOR SELECT USING (customer_id = auth.uid() OR auth.is_staff());

-- Lễ tân và Admin quản lý gói liệu trình
CREATE POLICY treatments_receptionist_write ON customer_treatments
    FOR ALL USING (auth.role() IN ('admin', 'receptionist'));

-- ------------------------------------------------------------
-- 7.12. Invoices & Payments Policies
-- ------------------------------------------------------------

-- Khách xem hóa đơn của mình
CREATE POLICY invoices_customer_read ON invoices
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND b.customer_id = auth.uid())
    );

-- Lễ tân và Admin quản lý hóa đơn
CREATE POLICY invoices_staff_all ON invoices
    FOR ALL USING (auth.role() IN ('admin', 'receptionist'));

-- Khách xem thanh toán của mình
CREATE POLICY payments_customer_read ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices i
            JOIN bookings b ON b.id = i.booking_id
            WHERE i.id = invoice_id AND b.customer_id = auth.uid()
        )
    );

-- Lễ tân và Admin quản lý thanh toán
CREATE POLICY payments_receptionist_all ON payments
    FOR ALL USING (auth.role() IN ('admin', 'receptionist'));

-- ============================================================
-- PHẦN 8: SEED DATA (Dữ liệu mẫu)
-- ============================================================

-- Tạo các ca làm việc mặc định
INSERT INTO shifts (name, start_time, end_time, color_code) VALUES
    ('Ca Sáng', '08:00:00', '12:00:00', '#10B981'),
    ('Ca Chiều', '13:00:00', '17:00:00', '#F59E0B'),
    ('Ca Tối', '17:00:00', '21:00:00', '#8B5CF6'),
    ('Full-time', '08:00:00', '17:00:00', '#3B82F6');

-- Tạo các kỹ năng cơ bản
INSERT INTO skills (name, code, description) VALUES
    ('Massage Thư giãn', 'MASSAGE_RELAX', 'Kỹ thuật massage thư giãn cơ bản'),
    ('Massage Thái', 'MASSAGE_THAI', 'Massage theo phương pháp Thái Lan'),
    ('Chăm sóc da mặt', 'FACIAL_BASIC', 'Các bước chăm sóc da mặt cơ bản'),
    ('Trị liệu mụn', 'FACIAL_ACNE', 'Điều trị và ngăn ngừa mụn'),
    ('Nail Art', 'NAIL_ART', 'Vẽ móng nghệ thuật'),
    ('Tắm trắng', 'BODY_WHITENING', 'Liệu trình tắm trắng toàn thân'),
    ('Xông hơi', 'SAUNA', 'Vận hành phòng xông hơi');

-- Tạo danh mục dịch vụ
INSERT INTO service_categories (name, description, sort_order) VALUES
    ('Massage', 'Các dịch vụ massage thư giãn và trị liệu', 1),
    ('Chăm sóc da', 'Dịch vụ chăm sóc da mặt và body', 2),
    ('Nail', 'Dịch vụ làm móng tay, móng chân', 3),
    ('Spa & Xông hơi', 'Dịch vụ xông hơi và liệu trình spa', 4);

-- Tạo cấu hình hệ thống mặc định
INSERT INTO system_configurations (key, value, description) VALUES
    ('operating_hours', '{"monday": {"open": "08:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "21:00"}, "wednesday": {"open": "08:00", "close": "21:00"}, "thursday": {"open": "08:00", "close": "21:00"}, "friday": {"open": "08:00", "close": "21:00"}, "saturday": {"open": "08:00", "close": "21:00"}, "sunday": {"open": "09:00", "close": "18:00"}}', 'Giờ hoạt động của Spa'),
    ('cancellation_policy', '{"min_hours_before": 2, "penalty_percent": 0}', 'Chính sách hủy lịch'),
    ('loyalty_config', '{"points_per_10k_vnd": 1, "silver_threshold": 0, "gold_threshold": 500, "platinum_threshold": 2000}', 'Cấu hình điểm thành viên'),
    ('notification_settings', '{"reminder_hours_before": 24, "sms_enabled": false, "email_enabled": true}', 'Cấu hình thông báo');

-- ============================================================
-- END OF SCHEMA
-- ============================================================
