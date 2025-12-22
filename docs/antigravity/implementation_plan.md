# Kế hoạch Kiểm thử Toàn diện Backend (Synapse)

## 1. Vấn đề (Problem)
Hiện tại hệ thống backend có hơn 17 modules và 67+ endpoints nhưng thiếu hụt trầm trọng các bộ test tự động. Điều này dẫn đến:
- Khó khăn trong việc phát hiện lỗi khi refactor code.
- Rủi ro về bảo mật (RLS) không được kiểm chứng thường xuyên.
- Mất nhiều thời gian kiểm thử thủ công.

## 2. Mục đích (Purpose)
- Thiết lập hạ tầng và quy chuẩn kiểm thử chuyên nghiệp.
- Đảm bảo độ phủ (coverage) cho toàn bộ 100% endpoints.
- Tự động hóa việc kiểm tra logic nghiệp vụ và phân quyền (RLS).

## 3. Ràng buộc (Constraints)
- **Kiến trúc**: Tuân thủ Modular Monolith và Vertical Slice.
- **Vị trí**: Áp dụng quy tắc **Colocation** (Test nằm cùng module).
- **Công nghệ**: FastAPI 0.115+, SQLModel, Python 3.12+, PostgreSQL RLS.
- **Ngôn ngữ**: Toàn bộ tài liệu và log phải bằng Tiếng Việt.

## 4. Chiến lược thực hiện (Strategy)
### 4.1. Quy tắc Colocation
```bash
src/modules/[module_name]/
├── tests/
│   ├── unit/         # Test logic Service (Mock DB)
│   └── integration/  # Test API Router (Test DB + RLS)
```

### 4.2. Lộ trình 3 Giai đoạn
1.  **Giai đoạn 1 (Core)**: Users, Services, Staff.
2.  **Giai đoạn 2 (Logic)**: Bookings, Scheduling Engine, Customers.
3.  **Giai đoạn 3 (Supporting)**: Settings, Billing, Warranty, v.v.

## 5. Giải pháp kỹ thuật (Solution)
- **Hạ tầng**: `pytest` + `pytest-asyncio`.
- **Mocking**: `app.dependency_overrides` để inject mock session hoặc mock user.
- **Database**: Sử dụng PostgreSQL chuyên biệt cho integration test để kiểm tra RLS thực tế.
- **Automation**: Thiết lập `conftest.py` toàn cục tại `backend/tests/`.

## 6. Kế hoạch xác thực (Verification)
### Tự động
- Chạy `pytest src/modules/` sau mỗi module được hoàn thành.
- Đảm bảo log xanh 100%.
### Thủ công
- Review code test để đảm bảo bao phủ đủ các trường hợp Exception (Guard Clauses).
