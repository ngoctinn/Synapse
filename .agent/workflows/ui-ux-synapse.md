---
description: Workflow Next.js Tối Ưu (Shadcn Ready) - Quy trình thiết kế và triển khai giao diện tập trung vào UX và Code Quality.
---

# Workflow Next.js Tối Ưu (Shadcn Ready)

Ngăn xếp công nghệ: **Next.js** (tích hợp Shadcn/ui)

Mục tiêu: Tối ưu hóa quy trình làm việc để tập trung vào UX, Cấu trúc và các thực hành tốt nhất của Next.js, tránh các lỗi ghi đè style và đảm bảo tính nhất quán.

## Các Bước Thực Hiện

### Step 1: Phân Tích Yêu Cầu

Trích xuất thông tin cốt lõi từ yêu cầu người dùng:

*   **Product Type (Loại SP):** Dashboard, E-commerce, Landing Page, v.v.
*   **Industry (Ngành):** Fintech, Healthcare, Spa (Synapse Context), v.v.
*   **Key User Flows (Luồng người dùng chính):** Đăng ký, thanh toán, quản lý dữ liệu, đặt lịch, v.v.

### Step 2: Tìm Kiếm Cốt Lõi (Core Search)

Sử dụng `search.py` có sẵn để tìm kiếm thông tin về cấu trúc, tính năng, UX, và tối ưu hóa Next.js.

#### A. Cấu trúc & Tính năng (Product & Layout)
Mục tiêu: Đảm bảo thiết kế phù hợp với yêu cầu kinh doanh và luồng người dùng.

```bash
# 1. Product (Tìm kiếm tính năng, thành phần cốt lõi, và đối tượng người dùng)
# Keywords: Dùng loại sản phẩm và ngành nghề
python3 .shared/ui-ux-pro-max/scripts/search.py "<Product Type> <Industry> user flows" --domain product

# 2. Landing (Chỉ tìm kiếm nếu là Landing Page/Marketing site)
python3 .shared/ui-ux-pro-max/scripts/search.py "hero-centric pricing social-proof" --domain landing

# 3. Chart (Chỉ tìm kiếm nếu là Dashboard/Analytics)
python3 .shared/ui-ux-pro-max/scripts/search.py "trend comparison funnels" --domain chart
```

#### B. UX & Triển khai Next.js (Optimization & Best Practices)
Mục tiêu: Đảm bảo tính chuyên nghiệp (UX) và hiệu suất (Next.js).

```bash
# 4. UX (Quy tắc tương tác, Animation, Z-index, Accessibility)
# Đảm bảo các component shadcn được triển khai đúng cách về mặt UX
python3 .shared/ui-ux-pro-max/scripts/search.py "accessibility form anti-patterns" --domain ux
python3 .shared/ui-ux-pro-max/scripts/search.py "smooth animation loading states" --domain ux

# 5. Stack (CỐ ĐỊNH Next.js Best Practices)
# Tập trung vào SSR, routing, tối ưu hóa hình ảnh, và API routes
python3 .shared/ui-ux-pro-max/scripts/search.py "SSR routing images API routes performance" --stack nextjs
```

### Step 3: Tổng Hợp & Next.js Pre-Delivery Checklist

Tổng hợp tất cả kết quả tìm kiếm và áp dụng chúng vào dự án Synapse.

**Quy tắc Cốt lõi:**
*   **Không copy-paste style thô:** Sử dụng biến CSS của dự án (`--primary`, `--background`) và các utility classes của Tailwind.
*   **Tuân thủ Rules:** Tham khảo `e:\Synapse\.agent\rules\frontend.md` cho các quy tắc cụ thể về màu sắc và layout.

**Checklist trước khi giao hàng:**

1.  **UX Consistency:**
    *   Kiểm tra các quy tắc về Icons (Lucide), Cursor (pointer cho interactive), Hover States (rõ ràng).
    *   Đảm bảo ngôn ngữ là **Tiếng Việt**.

2.  **Next.js Optimization:**
    *   Sử dụng component `Image` của Next.js để tối ưu hóa hình ảnh.
    *   Sử dụng **Server Components** mặc định, chỉ dùng `'use client'` khi cần tương tác (hook).
    *   Quản lý data fetching bằng `await` trong Server Component hoặc `use()` hook.

3.  **Layout Responsiveness:**
    *   Kiểm tra giao diện ở các kích thước mobile, tablet, desktop.
    *   Đảm bảo không có lỗi layout shift hoặc horizontal scroll không mong muốn.
