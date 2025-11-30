---
description: Đánh giá mã nguồn Backend theo tiêu chuẩn Modular Monolith, FastAPI và Clean Code.
---

1. **Chuẩn bị & Nạp Ngữ Cảnh**:
   - **QUY TẮC BẤT DI BẤT DỊCH**: Workflow này là **READ-ONLY**. Tuyệt đối KHÔNG thực thi mã (run_command) hay chỉnh sửa code (write_to_file, replace_file_content) ngoại trừ việc tạo file báo cáo.
   - Đọc kỹ quy tắc tại `.agent/rules/backend.md` để nắm vững tiêu chuẩn Modular Monolith và FastAPI.
   - Xác định phạm vi đánh giá: `backend/src/modules`, `backend/src/common`, `backend/src/app`.

2. **Kiểm Tra Tuân Thủ Kiến Trúc (Modular Monolith)**:
   - **Vertical Slices**: Kiểm tra xem mỗi module có đầy đủ `models.py`, `schemas.py`, `service.py`, `router.py` không.
   - **Public API**: Kiểm tra file `__init__.py` của mỗi module. Chỉ được export những gì cần thiết.
   - **Encapsulation**: Quét mã nguồn để phát hiện các import vi phạm (import file nội bộ của module khác thay vì qua `__init__.py`).
   - **Common Layer**: Đảm bảo `src/common` chỉ chứa mã hạ tầng, không chứa logic nghiệp vụ.

3. **Kiểm Tra Chất Lượng Code (Python & FastAPI)**:
   - **Async/Await**: Kiểm tra toàn bộ Service, Router, Database calls phải là `async/await`.
   - **Type Hinting**: Đảm bảo sử dụng Python 3.12+ syntax (`|` thay vì `Union`, `list[]` thay vì `List[]`).
   - **Pydantic V2**: Kiểm tra `model_config = ConfigDict(from_attributes=True)`.
   - **Dependency Injection**: Kiểm tra việc inject `Session` và `Service`.
   - **Error Handling**: Kiểm tra việc sử dụng Custom Exceptions thay vì `HTTPException` trực tiếp trong Service.

4. **Kiểm Tra Tài Liệu & Định Danh (Tiếng Việt)**:
   - **Naming**: Đảm bảo `snake_case` cho biến/hàm.
   - **Comments/Docstrings**: Toàn bộ giải thích và Docstring phải bằng **Tiếng Việt**.
   - **Swagger Docs**: Docstring của Router phải dùng Markdown để hiển thị đẹp trên Swagger.

5. **Tổng Hợp & Lưu Báo Cáo**:
   - **Xác định tên file**:
     - Kiểm tra thư mục `docs/reports/` để tìm số thứ tự tiếp theo.
     - Đặt tên file: `docs/reports/[SỐ_THỨ_TỰ]-backend-review-[TÊN_MODULE].md`.
   - **Nội dung báo cáo**:
     - **Vi phạm kiến trúc**: Liệt kê chi tiết.
     - **Code Smells**: Các vấn đề về Clean Code.
     - **Đề xuất cải tiến**: Kế hoạch cụ thể để refactor.

6. **Kết Thúc**:
   - Thông báo cho người dùng: "Báo cáo đã hoàn tất. Để thực hiện sửa đổi, hãy chạy workflow `/backend-refactor` và cung cấp đường dẫn file báo cáo này."
