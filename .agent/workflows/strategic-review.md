---
description: Đánh giá sâu về logic, mã nguồn, nghiên cứu giải pháp tối ưu và nhận diện vấn đề
---

1. **Phân tích Logic & Luồng dữ liệu**:
   - Đọc kỹ các thay đổi trong mã nguồn (git diff).
   - Kiểm tra tính đúng đắn của logic nghiệp vụ.
   - Đặt câu hỏi: "Logic này có xử lý được các trường hợp biên (edge cases) không?", "Luồng dữ liệu có bị gãy ở đâu không?".

2. **Đánh giá Mã nguồn (Code Review)**:
   - Kiểm tra tuân thủ Coding Standards (Naming, Typing, Project Structure).
   - Kiểm tra Bảo mật (Auth, Injection) và Hiệu năng (N+1, Blocking I/O).

3. **Nghiên cứu & Tối ưu hóa (Research Priority)**:
   - **Ưu tiên cao**: Tìm kiếm các giải pháp/công nghệ/pattern mới hiệu quả hơn cho vấn đề đang giải quyết.
   - Sử dụng tool `search_web` hoặc `mcp0_search_docs` để tìm "Best Practices" mới nhất.
   - So sánh giải pháp hiện tại với giải pháp đề xuất (Pros/Cons).

4. **Nhận diện Vấn đề & Báo cáo**:
   - Chỉ ra rõ ràng các vấn đề của mã nguồn hiện tại (Technical Debt, Complexity, Performance risk).
   - Đưa ra báo cáo tổng hợp và kế hoạch hành động cụ thể.
