# Báo Cáo Đánh Giá Backend & Đề Xuất Cải Tiến

**Ngày thực hiện:** 30/11/2025
**Người thực hiện:** Antigravity (AI Agent)
**Phạm vi:** `backend/src`

---

## 1. Kết Quả Kiểm Tra Tuân Thủ (Compliance Check)

Dựa trên quy tắc tại `.agent/rules/backend.md`:

### ✅ Tuân thủ tốt:
*   **Modular Monolith:** Cấu trúc `modules/users`, `modules/services` được tổ chức tốt theo Vertical Slice (đầy đủ Router, Service, Models, Schemas).
*   **Dependency Injection:**
    *   `UserService` được inject vào Router.
    *   `AsyncSession` được inject vào Service.
*   **Pydantic V2 & SQLModel:**
    *   Sử dụng `model_dump`.
    *   Sử dụng `session.exec()` và `await`.
    *   Sử dụng `Annotated` cho Type Hinting.

### 🔴 Vi Phạm Nghiêm Trọng (Critical):
*   **Blocking I/O trong Async Function:**
    *   **Vị trí:** `src/modules/users/service.py` (hàm `invite_staff`).
    *   **Vấn đề:** Gọi `supabase.auth.admin.invite_user_by_email(...)` là một thao tác đồng bộ (synchronous). Khi chạy trong hàm `async def`, nó sẽ **chặn (block)** toàn bộ Event Loop của FastAPI, làm treo server cho đến khi request hoàn tất.
    *   **Quy tắc vi phạm:** "Async All The Way" - Cấm Blocking Code.

### ⚠️ Cần lưu ý (Minor):
*   **Naming Ambiguity:** Module `services` (Spa Services) dễ gây nhầm lẫn với khái niệm "Application Services" (Business Logic).
*   **Hardcoded Role Check:** Trong `router.py`, việc kiểm tra `if current_user.role != "manager"` nên được tách thành Dependency (ví dụ: `Depends(get_current_manager)`) để tái sử dụng và clean hơn.

---

## 2. Đề Xuất Cải Tiến (Brainstorming & Research)

### A. Xử Lý Blocking Call (Supabase)
*   **Giải pháp 1 (Nhanh):** Sử dụng `run_in_threadpool` của Starlette.
    ```python
    from starlette.concurrency import run_in_threadpool
    response = await run_in_threadpool(supabase.auth.admin.invite_user_by_email, email=..., options=...)
    ```
*   **Giải pháp 2 (Lâu dài):** Sử dụng Async Client nếu thư viện hỗ trợ hoặc gọi trực tiếp API qua `httpx` (Async).

### B. Refactor Role Based Access Control (RBAC)
*   Tạo file `src/common/permissions.py`:
    ```python
    class RoleChecker:
        def __init__(self, allowed_roles: list[str]):
            self.allowed_roles = allowed_roles
        
        def __call__(self, user: User = Depends(get_current_user)):
            if user.role not in self.allowed_roles:
                raise HTTPException(...)
    ```
*   Sử dụng trong Router: `dependencies=[Depends(RoleChecker(["manager"]))]`.

### C. Error Handling
*   Nên catch cụ thể lỗi từ Supabase (ví dụ `GotrueError`) thay vì `Exception` chung chung để trả về mã lỗi HTTP chính xác hơn (400 vs 500).

---

## 3. Kế Hoạch Hành Động (Action Plan)

1.  **Hotfix `invite_staff`**:
    *   Bọc lệnh gọi Supabase trong `run_in_threadpool`.
2.  **Refactor Permissions**:
    *   Tạo Dependency kiểm tra quyền Manager.
3.  **Review Module `services`**:
    *   Cân nhắc đổi tên thành `catalog` hoặc `spa_services` nếu dự án mở rộng, hiện tại có thể giữ nguyên nhưng cần lưu ý.

