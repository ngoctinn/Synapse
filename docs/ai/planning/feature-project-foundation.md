---
id: feature-project-foundation
status: proposed
title: Project Foundation Setup
---

# Kế hoạch Triển khai: Project Foundation

## Mục tiêu
Thiết lập nền tảng kỹ thuật cho dự án Synapse, bao gồm cấu trúc Monorepo, Backend FastAPI và Frontend Next.js, đảm bảo tuân thủ kiến trúc Modular Monolith và Vertical Slice.

## Phạm vi
- Cấu trúc thư mục dự án.
- Cấu hình Backend (FastAPI, SQLModel, Alembic).
- Cấu hình Frontend (Next.js 15, Tailwind, Shadcn).
- Kết nối cơ bản giữa Frontend và Backend.

## Danh sách Nhiệm vụ

### 1. Khởi tạo Dự án & Cấu trúc Thư mục
- [x] Tạo thư mục gốc `backend` và `frontend`.
- [x] Tạo `.gitignore` chung cho dự án.

### 2. Backend Setup (FastAPI)
- [x] Thiết lập môi trường Python (`venv` hoặc `poetry`/`pdm` - sử dụng `pip` + `venv` theo tech stack chuẩn).
- [x] Tạo `backend/pyproject.toml` và cài đặt dependencies:
    - `fastapi`, `uvicorn[standard]`, `sqlmodel`, `alembic`, `asyncpg`, `pydantic-settings`, `python-multipart`.
- [x] Tạo cấu trúc thư mục Backend:
    - `src/app` (main.py, config.py)
    - `src/common` (database.py, security.py)
    - `src/modules`
- [x] Cấu hình Biến môi trường (`.env`) & Pydantic Settings.
- [x] Thiết lập Database (SQLModel + Async Engine) & Alembic.
- [x] Cấu hình `alembic init`.
- [x] Viết `src/app/main.py` với Health Check endpoint.

### 3. Frontend Setup (Next.js 15)
- [x] Khởi tạo Next.js app: `npx create-next-app@latest frontend --typescript --tailwind --eslint`.
- [x] Cấu hình `tsconfig.json` (paths alias `@/*`).
- [x] Cài đặt Shadcn UI: `npx shadcn@latest init`.
- [x] Cấu hình biến môi trường `.env.local`.

### 4. Kiểm thử & Xác nhận
- [ ] Chạy Backend: `uvicorn src.app.main:app --reload`.
- [ ] Chạy Frontend: `npm run dev`.
- [ ] Kiểm tra kết nối API từ Frontend tới Backend.
