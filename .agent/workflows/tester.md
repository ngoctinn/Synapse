---
description: Tạo và chạy bộ kiểm thử toàn diện (Unit, Integration, E2E)
---

1. **Xác định Phạm vi Test**:
   - Xác định module hoặc tính năng cần test.
   - Quyết định loại test: Unit Test (cho logic nhỏ), Integration Test (cho API/DB), hay E2E.

2. **Viết Test Case**:
   - Tạo file test trong thư mục `tests/` (Backend) hoặc `__tests__` (Frontend).
   - Backend: Sử dụng `pytest`. Đảm bảo mock DB session hoặc dùng test DB.
   - Frontend: Sử dụng `Jest` hoặc `React Testing Library`.

3. **Chạy Test**:
   - Chạy lệnh test (ví dụ: `pytest` hoặc `npm test`).
   - Theo dõi kết quả và log lỗi.

4. **Phân tích Lỗi (Nếu có)**:
   - Nếu test fail, phân tích stack trace.
   - Sửa code nguồn hoặc sửa test case cho phù hợp.

5. **Báo cáo**:
   - Tổng hợp kết quả test (Pass/Fail).
   - Đảm bảo độ bao phủ (Coverage) đạt yêu cầu.
