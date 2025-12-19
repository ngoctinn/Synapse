# Kế Hoạch Triển Khai: Chỉnh Sửa Và Đồng Bộ Hóa Thiết Kế UML (Synapse Design Patch)

**Mã phiên:** `DESIGN-PATCH-20251219`
**Ngày tạo:** 2025-12-19
**Trạng thái:** THINK (Chờ phê duyệt)

---

## 1. Vấn đề (Problem Statement)

Hiện tại, hệ thống tài liệu thiết kế tại `docs/design` đang tồn tại 10 lỗi không nhất quán nghiêm trọng giữa các sơ đồ UML (Use Case, Sequence, Activity) và thực tế triển khai/logic nghiệp vụ:
1.  **Sai lệch Auth Supabase**: Mô tả sai luồng kiểm tra email tồn tại (vi phạm Security by Design).
2.  **Sai bản chất Trigger DB**: Vẽ Trigger như một actor/service bên ngoài.
3.  **Thổi phồng thuật toán**: Mô tả RCPSP và Jain's Index quá mức so với những gì UML thực tế thể hiện (chỉ kiểm tra ràng buộc).
4.  **Mâu thuẫn Use Case - DB**: Use Case bắt buộc đăng nhập trong khi DB cho phép khách vãng lai (`customer.user_id` nullable).
5.  **Vi phạm Single Responsibility**: Activity Diagram quá tải thông tin (ôm đồm cả UI, Auth, DB).
6.  **Lạm dụng alt/else**: Vẽ các nhánh rẽ mà hệ thống không kiểm soát được (ví dụ lỗi từ bên thứ 3).
7.  **Nhầm lẫn Actor**: Dùng "Hệ thống", "Database" làm Actor.
8.  **Trùng lặp Use Case**: Chia nhỏ Use Case không cần thiết (Chat, Đặt lịch).
9.  **Thiếu bảo mật RLS/RBAC**: Tài liệu nhấn mạnh nhưng sơ đồ không thể hiện điểm kiểm soát.
10. **Thiếu tính nguyên tử**: Thao tác quan trọng (Đặt lịch) không thể hiện tính Transaction/Rollback.

---

## 2. Mục đích (Goals)

1.  **Đồng bộ hóa Toàn diện**: Đảm bảo tất cả sơ đồ UML (Use Case, Sequence, Activity) nhất quán với nhau và khớp với thực tế mã nguồn/DB.
2.  **Bao quát Tính năng**: Đảm bảo UML thể hiện đầy đủ các đặc tính quan trọng (RCPSP, RLS, Transaction) nhưng ở mức độ bao quát (high-level).
3.  **Chuẩn hóa & Tinh gọn**: Loại bỏ các lỗi sai actor, lạm dụng ký hiệu kỹ thuật, tập trung vào luồng nghiệp vụ chính để dễ đọc, dễ hiểu.

---

## 3. Ràng buộc (Constraints)

- **Ngôn ngữ**: Phải sử dụng tiếng Việt chuẩn.
- **Tính thực tế**: Không vẽ những gì hệ thống không làm.
- **Supabase Contract**: Phải tuân thủ đúng cách Supabase Auth và DB Trigger vận hành.
- **Kiến trúc**: Phải phù hợp với Vertical Slice Architecture và Feature-Sliced Design đang áp dụng.

---

## 4. Chiến lược (Strategy)

Tôi sẽ thực hiện chỉnh sửa theo từng nhóm tài liệu:

### Nhóm 1: Use Case & Actors (`usecase.md`, `usecase_diagrams.md`)
- Hợp nhất các Use Case trùng lặp.
- Định nghĩa lại 4 Actor chính: Khách hàng, Lễ tân, KTV, Quản trị viên.
- Cập nhật tiền điều kiện cho Use Case "Đặt lịch" (hỗ trợ cả khách có tài khoản và vãng lai).

### Nhóm 2: Sequence Diagrams (`sequence_diagrams.md`, `docs/design/sequences/`)
- Chỉnh sửa luồng Auth: Bỏ nhánh kiểm tra email, dùng thông báo chung.
- Chỉnh sửa Trigger: Chuyển từ Actor/Service thành `Note over DB` hoặc mũi tên nội bộ DB.
- Loại bỏ các khối `alt` thừa thải, thay bằng `Note` mô tả trường hợp ngoại lệ.
- Thêm `Note` về Transaction/ACID và Kiểm soát RLS/RBAC.

### Nhóm 3: Activity Diagrams (`activity_diagrams.md`)
- **Tinh gọn trách nhiệm**: Loại bỏ các bước hạ tầng kỹ thuật (API, DB) để giải quyết lỗi "quá tải trách nhiệm", chỉ giữ lại luồng hành động của Actor và quyết định của hệ thống.
- **Bao quát thuật toán**: Thể hiện quy trình lập lịch thông minh SISF thông qua các khối chức năng bao quát (RCPSP Constraint Check, Optimization Process) thay vì vẽ chi tiết vòng lặp code. Điều này đảm bảo tính nhất quán với văn bản mà không làm rối sơ đồ.
- Đảm bảo tính bao quát: Sơ đồ phải phản ánh được toàn bộ quy trình từ yêu cầu của khách đến kết quả cuối cùng.

---

## 5. Danh sách Task Chi Tiết (SPLIT)

### 5.1 Xử lý Use Case & Actors
- [ ] **5.1.1** Rà soát và cập nhật danh sách Actor chuẩn trong `usecase.md`.
- [ ] **5.1.2** Hợp nhất Use Case "Hỗ trợ chat" (Customer + Staff).
- [ ] **5.1.3** Cập nhật Use Case "Đặt lịch" để phản ánh thực tế DB (Nullable user_id).

### 5.2 Xử lý Sequence Diagrams (Auth & DB Focus)
- [ ] **5.2.1** Sửa lỗi Auth Supabase (Bỏ nhánh check email tồn tại).
- [ ] **5.2.2** Chuyển đổi Trigger DB từ Participant sang Internal Mechanism (Note).
- [ ] **5.2.3** Dọn dẹp `alt/else` và thêm Note về RLS/RBAC.
- [ ] **5.2.4** Bổ sung Note "Transaction/Atomic" cho các luồng tạo dữ liệu quan trọng.

### 5.3 Chuẩn hóa Activity Diagrams & Thuật toán
- [ ] **5.3.1** Refactor Activity Diagrams: Chỉ giữ lại luồng nghiệp vụ, loại bỏ các bước API/DB call chi tiết.
- [ ] **5.3.2** Đồng bộ hóa mô tả thuật toán: Sử dụng các khối chức năng (Action boxes) định danh rõ "RCPSP" và "Jain's Fairness" để đảm bảo tính bao quát của hệ thống trong UML.

---

## 6. Kiểm tra Thành công (VERIFY)

- [ ] Tất cả sơ đồ không còn "Hệ thống" hay "Database" là Actor.
- [ ] Luồng đăng ký tài khoản không còn nhánh "Email đã tồn tại".
- [ ] Use Case "Đặt lịch" hỗ trợ cả khách vãng lai.
- [ ] Các sơ đồ Sequence có ghi chú về ACID và RLS.
- [ ] Activity Diagram chỉ tập trung vào hành động nghiệp vụ.

---

**⏸️ TRẠNG THÁI: Chờ phê duyệt (THINK stage complete).**
