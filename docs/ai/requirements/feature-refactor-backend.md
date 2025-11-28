---
phase: requirements
title: Refactor Backend Compliance
description: Refactor backend to strictly follow Vertical Slice Architecture and Security Rules defined in backend.md
---

# Yêu cầu & Hiểu biết Vấn đề

## Tuyên bố Vấn đề
**Chúng ta đang giải quyết vấn đề gì?**

- Backend hiện tại vi phạm nhiều quy tắc cốt lõi trong `backend.md`:
    1.  **Kiến trúc**: Module `users` thiếu `service.py`, logic nghiệp vụ nằm trong Router.
    2.  **Bảo mật**: Thiếu cơ chế RLS Injection (Row Level Security) trong kết nối Database.
    3.  **Cấu trúc**: Thiếu `src/app/dependencies.py`.
    4.  **Xử lý lỗi**: Thiếu Global Exception Handler trong `main.py`.
    5.  **Phụ thuộc**: `src/common/security.py` phụ thuộc ngược vào module `users`.
- Điều này dẫn đến mã khó bảo trì, kém bảo mật và không đồng nhất.

## Mục tiêu & Mục đích
**Chúng ta muốn đạt được điều gì?**

- **Mục tiêu chính**: Đưa toàn bộ codebase backend về trạng thái tuân thủ 100% `backend.md`.
- **Mục tiêu phụ**: Cải thiện cấu trúc thư mục và tách biệt mối quan tâm (Separation of Concerns).
- **Phi mục tiêu**: Không thay đổi logic nghiệp vụ (chỉ refactor cấu trúc, giữ nguyên hành vi).

## Câu chuyện Người dùng & Trường hợp Sử dụng
**Người dùng sẽ tương tác với giải pháp như thế nào?**

- **Developer**: Khi thêm tính năng mới, tôi có thể theo mẫu chuẩn (Service, Router, Model) mà không phải đoán.
- **System**: Khi truy cập DB, session luôn được inject thông tin user để đảm bảo RLS hoạt động.

## Tiêu chí Thành công
**Làm sao chúng ta biết khi nào chúng ta hoàn thành?**

- [ ] `src/modules/users/service.py` tồn tại và chứa logic nghiệp vụ.
- [ ] `src/modules/users/router.py` chỉ gọi Service, không truy cập DB trực tiếp (trừ khi qua Service).
- [ ] `get_db_session` thực hiện RLS Injection (`SET LOCAL role`, `set_config`).
- [ ] `src/app/main.py` có Exception Handler trả về JSON chuẩn.
- [ ] Không có lỗi import vòng hoặc phụ thuộc sai nguyên tắc trong `common`.

## Ràng buộc & Giả định
**Chúng ta cần làm việc trong những giới hạn nào?**

- **Kỹ thuật**: FastAPI, SQLModel, Async/Await.
- **Giả định**: Database Supabase đã được cấu hình RLS (chúng ta chỉ cần inject context từ backend).

## Câu hỏi & Các mục Mở
**Chúng ta vẫn cần làm rõ điều gì?**

- Không có. Quy tắc đã rõ ràng trong `backend.md`.
