---
title: Tái Cấu Trúc Clean Code Frontend
status: Draft
priority: Medium
assignee: AI Agent
---

# Tính năng: Tái Cấu Trúc Clean Code Frontend

## 1. Tuyên Bố Vấn Đề
Mã nguồn frontend hiện tại thiếu cấu trúc Public API nhất quán cho một số module tính năng (`staff`, `landing-page`, `admin`). Điều này dẫn đến các "deep imports" tiềm ẩn, nơi các component tiêu thụ import trực tiếp từ các file nội bộ của một tính năng, vi phạm nguyên tắc đóng gói của Feature-Sliced Design (FSD). Việc này làm cho việc tái cấu trúc trở nên khó khăn và tăng sự phụ thuộc lẫn nhau.

## 2. Mục Tiêu
- **Đóng Gói**: Đảm bảo tất cả các tính năng (`admin`, `auth`, `customer-dashboard`, `landing-page`, `layout`, `staff`) có một Public API nghiêm ngặt thông qua `index.ts`.
- **Import Sạch**: Tái cấu trúc tất cả các import để sử dụng Public API (ví dụ: `import { StaffList } from "@/features/staff"` thay vì `@/features/staff/components/staff-list`).
- **Chuẩn Hóa**: Căn chỉnh tất cả các thư mục tính năng theo cấu trúc FSD-lite của dự án.

## 3. Phi Mục Tiêu
- Viết lại logic nghiệp vụ (trừ khi nó vi phạm các nguyên tắc clean code như client-side waterfalls).
- Thiết kế lại giao diện người dùng lớn.
- Thay đổi tech stack cơ bản.

## 4. Câu Chuyện Người Dùng
- **Là một Lập trình viên**, tôi muốn import các component tính năng từ một điểm nhập duy nhất để tôi không cần biết cấu trúc nội bộ của tính năng đó.
- **Là một Lập trình viên**, tôi muốn đảm bảo rằng việc thay đổi cấu trúc nội bộ của một tính năng không làm hỏng các phần khác của ứng dụng, miễn là Public API vẫn giữ nguyên.

## 5. Tiêu Chí Thành Công
- Tất cả các thư mục trong `src/features` đều có file `index.ts`.
- Không có file nào bên ngoài một tính năng import từ các file nội bộ của tính năng đó (chỉ qua `index.ts`).
- Ứng dụng build và chạy không có lỗi.
- `pnpm dev` không hiển thị hồi quy (regressions).

## 6. Ràng Buộc & Giả Định
- Dự án sử dụng Next.js App Router.
- Chúng ta đang tuân theo cách tiếp cận "FSD-lite" (Features là các lát cắt chính).

## 7. Câu Hỏi Mở
- Có sự phụ thuộc vòng nào hiện đang bị ẩn bởi deep imports không? (Sẽ được phát hiện trong quá trình tái cấu trúc).
