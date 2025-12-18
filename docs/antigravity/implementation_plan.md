# Kế hoạch Refactor Hệ Thống (Antigravity Mode - Revised)

## 1. TƯ DUY (THINK)
- **Mục tiêu**: Làm sạch Tailwind CSS, chuẩn hóa UI abstraction, giảm độ phức tạp của JSX mà không làm hỏng tính toàn vẹn của shadcn/ui.
- **Chiến lược**:
    - **Hạn chế can thiệp trực tiếp vào `shared/ui/*.tsx`**: Tuân thủ chuẩn mặc định của shadcn. Nếu cần refactor, phải đối chiếu với `@mcp:shadcn`.
    - **Tập trung vào Feature Components**: Trích xuất các class wrapper, layout, và animation phức tạp tại tầng `features/` vào các CSS utilities hoặc shared components.
    - **Sử dụng MCP shadcn**: Để quyết định cách refactor tốt nhất cho các component UI core.
    - **Audit & Cleanup Dependency**: Loại bỏ các thư viện trùng lặp hoặc không sử dụng (e.g., `tw-animate-css` nếu đã có `tailwindcss-animate`).
    - **Fix Linting & Shadow Code**: Dọn dẹp các biến chưa sử dụng và warnings từ `pnpm lint`.

- [x] **Task 1: Dependency & Configuration Audit**
    - Kiểm tra `package.json` & `globals.css` cho các bộ animation trùng lặp.
    - Đối chiếu cấu hình Tailwind.
- [x] **Task 2: Feature Refactoring (Long ClassNames focus)**
    - Refactor `features/staff`, `features/customers`, `features/appointments`.
    - Trích xuất layout patterns và animation clusters vào `globals.css`.
- [x] **Task 3: Shadcn/UI Alignment**
    - Sử dụng `mcp_shadcn` để kiểm tra các components `shared/ui` đã refactor (Sheet, Dialog, Sidebar).
    - Khôi phục về chuẩn nếu việc refactor trước đó quá xa rời logic shadcn gốc.
- [x] **Task 4: Clean Code & Linting**
    - Fix toàn bộ warnings từ `pnpm lint` báo cáo.
- [x] **Task 5: Verification & Reporting**
    - `pnpm build` & `pnpm lint`.
    - Sinh `CLEANUP_REPORT.md`.

## 3. PHÂN TÍCH (ANALYZE) - Đang thực hiện
- Sẽ sử dụng `grep` để tìm các class lặp lại trong `features/`.
- Sử dụng `mcp_shadcn` để lấy reference code.

## 4. ĐỀ XUẤT (DIFF)
- Liệt kê các class sẽ trích xuất vào `globals.css`.

## 5. THỰC THI (APPLY)
- Ưu tiên Feature layer -> Shared layer.

## 6. KIỂM TRA (VERIFY)
- `cd frontend && pnpm lint && pnpm build`.

## 7. KIỂM TOÁN (AUDIT)
- Nhật ký thay đổi tại `change-log.md`.

## 8. BÁO CÁO (REPORT)
- `dashboard.md` & `CLEANUP_REPORT.md`.
