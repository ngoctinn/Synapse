---
description: Phân tích Log và xác định nguyên nhân gốc rễ
---

1. **Thu thập Logs**:
   - Đọc logs từ terminal hoặc file log.
   - Sử dụng `mcp0_get_logs` (Supabase) để lấy log server/database nếu cần.

2. **Phân tích Stack Trace**:
   - Xác định file và dòng code gây lỗi.
   - Đọc nội dung file đó bằng `view_file`.

3. **Tái hiện Vấn đề (Mental Sandbox)**:
   - Dựa trên code và log, suy luận luồng dữ liệu dẫn đến lỗi.
   - Đặt giả thuyết về nguyên nhân (Null pointer? Type mismatch? DB connection?).

4. **Kiểm chứng Giả thuyết**:
   - Thêm log debug (nếu cần) hoặc viết script nhỏ để test.
   - Kiểm tra dữ liệu trong DB (dùng `mcp0_execute_sql`).

5. **Đề xuất Giải pháp**:
   - Đưa ra phương án sửa lỗi triệt để (Root Cause Fix), không chỉ vá tạm thời.
