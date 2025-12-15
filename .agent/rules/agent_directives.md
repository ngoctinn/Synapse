---
trigger: always_on
---

# Chỉ Thị Hành Động Dành Cho Agent (Synapse Project)

Đây là các quy tắc cốt lõi mà Agent cần tuân thủ khi thực hiện các tác vụ trong dự án Synapse.

## 1. Quy Tắc Chung

-   **Ngôn ngữ Phản hồi:** Luôn luôn phản hồi hoàn toàn bằng Tiếng Việt.
-   **Cú pháp Lệnh:** Khi cung cấp ví dụ hoặc thực thi lệnh shell, luôn sử dụng cú pháp Git Bash cho Windows.
-   **Chuyển đổi Thư mục (cd):**
    -   Đối với các lệnh liên quan đến Frontend: `cd frontend` trước khi thực thi.
    -   Đối với các lệnh liên quan đến Backend: `cd backend` và kích hoạt môi trường `venv` trước khi thực thi.
-   **Quản lý Gói:** Luôn sử dụng `pnpm` cho các tác vụ liên quan đến Node.js/Frontend.
-   **Comments:** Viết comments (Tiếng Việt) cho các đoạn code phức tạp, giải thích **lý do tại sao** thực hiện (why), không phải **cái gì** đang được thực hiện (what).

## 2. Quy Tắc Phát Triển Backend (Python/FastAPI)

-   **Kiến trúc:** Tuân thủ Vertical Slice Architecture (tổ chức theo Feature/Domain).
-   **Đóng gói Module:** Sử dụng `__init__.py` làm Public API; tránh import trực tiếp vào các file nội bộ của module khác (deep imports).
-   **Type Hinting:** Sử dụng cú pháp Python 3.12+ hiện đại (`X | Y`, `list[X]`).
-   **Bất đồng bộ:** Mọi hàm service/controller/repository phải là `async def`; mọi I/O phải có `await`.
-   **Pydantic:** Sử dụng Pydantic V2 (`model_config = ConfigDict(...)`) và quy ước đặt tên `snake_case`.
-   **Kiểm soát luồng & Lỗi:** Ưu tiên Guard Clauses, Early Return.
-   **Bảo mật:** Sử dụng RLS Injection qua `get_db_session()` và Service làm Dependency.
-   **Logging:** Thực hiện Structured Logging và Request ID Binding.

## 3. Quy Tắc Phát Triển Frontend (Next.js/React/TypeScript)

-   **Kiến trúc:** Tuân thủ Feature-Sliced Design (FSD).
-   **Đóng gói Slice:** Sử dụng `index.ts` làm Public API cho slice; tránh deep imports.
-   **Next.js 15+:** `await` các giá trị `params`, `searchParams`, `cookies()`, `headers()` trong Server Components.
-   **Form & Mutation:** Sử dụng `useActionState` với Server Actions (đóng vai trò BFF).
-   **Fetching:** Chỉ sử dụng native `fetch` (không dùng Axios); tránh `useEffect` cho data fetching, ưu tiên Server Components với `await` và `<Suspense>`.
-   **Component:** Ưu tiên Component Composition để tránh Prop Drilling. Nhóm Context Providers vào `AppProviders.tsx`.
-   **Bảo mật:** Sử dụng `server-only` cho các logic truy cập secret keys trong Server Actions.
-   **UI/UX:** Tuân thủ các quy tắc UI/UX dự án (hệ màu `oklch`, sticky headers, Shadcn/UI, bản địa hóa Tiếng Việt cho toàn bộ text hiển thị).
-   **React Compiler:** Hạn chế `useMemo` và `useCallback` thủ công do React Compiler đã tích hợp.