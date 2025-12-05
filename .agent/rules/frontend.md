---
trigger: manual
---

Tóm Tắt Chuyên Sâu: Chiến Lược Kiến Trúc Frontend và Quy Tắc Clean Code trên Next.js 16

1. Bối Cảnh Của Sự Phức Tạp Trong Mã Nguồn Frontend

Các vấn đề hệ thống phổ biến gây ra "spaghetti code" trong ứng dụng frontend quy mô lớn:

Sự Phụ Thuộc Vòng (Circular Dependencies):

Các module import lẫn nhau một cách không kiểm soát.

Hậu quả: Mã nguồn khó debug, quá trình build chậm, và làm giảm khả năng tái cấu trúc.

Hiệu Ứng Thác Nước Dữ Liệu (Data Waterfalls) và Client-Side Fetching:

Lạm dụng hook useEffect để gọi API từ phía client (CSR fetching).

Tạo ra chuỗi yêu cầu nối tiếp: Component cha render -> fetch -> Component con render -> fetch.

Hậu quả: Độ trễ nghiêm trọng, làm chậm các chỉ số hiệu năng (FCP, LCP), và gây lỗi Hydration.

Sự Rò Rỉ Logic Nghiệp Vụ (Business Logic Leakage):

Logic xử lý dữ liệu (business logic) bị trộn lẫn với logic hiển thị (UI logic).

Tạo ra các "God Components" khổng lồ, vi phạm nguyên lý Trách nhiệm Đơn lẻ (SRP).

2. Chiến Lược Kiến Trúc: Feature-Sliced Design (FSD)

FSD là phương pháp tổ chức mã nguồn dựa trên giá trị nghiệp vụ và nguyên tắc đóng gói, chia ứng dụng thành các tầng (Layers) có quy tắc phụ thuộc nghiêm ngặt.

2.1. Phân Tích Chức Năng Của Các Tầng (Layers)

Tầng (Layer)

Mức Độ Trừu Tượng

Vai Trò & Trách Nhiệm Cốt Lõi

Quy Tắc Phụ Thuộc

App

Cao nhất (Specific)

Khởi tạo ứng dụng, cấu hình toàn cục, định nghĩa Global Layout và Providers (Context).

Chỉ phụ thuộc vào Shared.

Pages

Cao

Lớp kết hợp (Composition) các Widgets và Features để tạo thành một trang hoàn chỉnh (URL).

Phụ thuộc vào Widgets, Features, Entities, Shared.

Widgets

Trung bình

Các khối UI phức tạp, tái sử dụng, kết hợp nhiều Features và Entities.

Phụ thuộc vào Features, Entities, Shared.

Features

Trung bình

Các kịch bản người dùng (User Scenarios) mang lại giá trị nghiệp vụ. Chứa logic tương tác chính (ví dụ: onSubmit).

Phụ thuộc vào Entities, Shared.

Entities

Thấp

Các thực thể nghiệp vụ cốt lõi (dữ liệu database, mô hình data).

Phụ thuộc vào Shared.

Shared

Thấp nhất (Abstract)

Các thành phần dùng chung, không chứa logic nghiệp vụ (UI Kit, API Client, Utils).

Không phụ thuộc vào tầng nào khác.

2.2. Tích Hợp FSD với Next.js App Router (Chiến Lược "Thin Pages")

Thư mục app/ là Lớp Vỏ (Shell): Chỉ dùng để định nghĩa các routes (page.tsx) và metadata.

Logic nằm trong src/pages: Các file page.tsx trong app/ chỉ import và render component chính từ tầng pages hoặc widgets nằm trong src/.

2.3. Quy Tắc "Public API" và Tính Đóng Gói

Anti-pattern cần tránh (Deep Imports): Import trực tiếp vào file nội bộ của một slice (ví dụ: import { helper } from 'features/auth/lib/helper').

Best Practice (Clean Code): Mỗi Slice (Feature, Entity, Widget) phải có một file index.ts đóng vai trò là Public API.

Các module bên ngoài chỉ được phép import qua file index.ts này.

Việc này đảm bảo tính đóng gói, cho phép tái cấu trúc nội bộ slice mà không làm ảnh hưởng đến các thành phần phụ thuộc khác.

3. Next.js 16: Phân Tích Các Thay Đổi Cốt Lõi và Quy Tắc Syntax Mới

3.1. Chuyển Đổi Sang Async Request APIs (Bắt Buộc)

Các API truy cập thông tin request giờ đây trả về Promise để tối ưu hóa khả năng streaming của React Server Components (RSC).

API

Next.js 16 Syntax (Server Components)

Lưu ý

params, searchParams (props)

Bắt buộc phải await trước khi truy cập: const params = await props.params;

Cho phép React tạm dừng render component, chờ request data sẵn sàng.

cookies(), headers()

Bắt buộc phải await trước khi truy cập: const cookieStore = await cookies();

Các hàm từ next/headers giờ đây là bất đồng bộ.

3.2. Xử Lý trong Client Components với Hook use()

Vấn đề: Client Components không thể là hàm async.

Giải pháp: React 19/Next.js 16 giới thiệu hook use(Promise) để "unwrap" (giải nén) giá trị từ một Promise ngay trong render phase.

3.3. Cơ Chế Caching Nâng Cao: Directive "use cache"

Mục tiêu: Thay thế unstable_cache bằng cơ chế khai báo minh bạch hơn.

Tính năng cốt lõi: Next.js Compiler tự động tạo ra cache key dựa trên vị trí hàm và đối số truyền vào.

Chiến lược sử dụng: Sử dụng directive 'use cache' ở đầu hàm Data Access Layer kết hợp với cacheLife('duration') để định nghĩa vòng đời cache (ví dụ: '1h').

Lỗi cần tránh: Không được truyền các đối số không thể tuần tự hóa (non-serializable) như function hoặc class instance vào hàm có 'use cache'.

3.4. React Compiler: Kỷ Nguyên "No-Memo"

Tính năng: React Compiler (React Forget) được tích hợp chính thức.

Hành động Clean Code: Loại bỏ hầu hết các lệnh useMemo và useCallback thủ công. Compiler tự động thực hiện memoization ở mức độ chi tiết (fine-grained), giúp mã nguồn gọn gàng và dễ đọc hơn.

4. Server Actions và Pattern "Backend-for-Frontend" (BFF)

Server Actions cho phép gọi hàm server trực tiếp từ client, loại bỏ nhu cầu tạo API Route truyền thống (/api/*).

4.1. Quy tắc Clean Code cho Server Actions

Tách Biệt Logic: Định nghĩa Server Actions trong các file riêng biệt (actions.ts) trong tầng Feature/Entity, không viết inline trong components.

Xác Thực Đầu Vào (Input Validation): Bắt buộc sử dụng thư viện validation (ví dụ: Zod) để kiểm tra dữ liệu gửi từ client ngay tại Server Action.

Bảo Mật (Server-Only Guard): Sử dụng package server-only ở đầu các file chứa logic truy cập DB hoặc API Secret Keys để ngăn chặn rò rỉ bảo mật.

4.2. Xử Lý Form và Mutation với useActionState

Hook useActionState (thay thế useFormState của React 18) là cách chuẩn để quản lý trạng thái client của Server Action (loading, error, message).

Lợi ích: Loại bỏ useState, useEffect, và fetch thủ công, tạo ra mã nguồn khai báo (declarative) và type-safe.

5. Các Kỹ Thuật Refactoring Clean Code

5.1. Loại Bỏ useEffect Fetching (Data Waterfalls)

Giải pháp: Chuyển logic fetch dữ liệu lên Server Component.

Kỹ thuật: Sử dụng await trực tiếp trong Server Component. Kết hợp với <Suspense> để cho phép Parallel Fetching (tải dữ liệu song song) và hiển thị loading state tinh tế ngay từ server.

5.2. Giải Quyết "Prop Drilling" Bằng Composition

Vấn đề: Prop Drilling xảy ra khi truyền một prop qua nhiều tầng component trung gian không liên quan.

Giải pháp: Sử dụng Component Composition (truyền Component qua prop children hoặc render prop) thay vì truyền dữ liệu.

Ví dụ: Thay vì <Layout user={user} />, dùng <Layout><Header user={user} /></Layout>.

5.3. Tách Biệt Providers (Loại Bỏ "Provider Hell")

Vấn đề: Các Context Provider (phải là Client Component) lồng nhau trong layout.tsx Server Component làm giảm hiệu quả SSR.

Giải pháp: Tạo một component tập trung AppProviders.tsx (đánh dấu 'use client') để gom nhóm tất cả Context Providers. Bọc component này trong RootLayout Server Component.

6. Các Lỗi Sai Thường Gặp (Common Mistakes) và Cách Khắc Phục

Lỗi Sai Thường Gặp

Nguyên Nhân

Khắc Phục Bắt Buộc

Lỗi Hydration Mismatch

Sử dụng dữ liệu không đồng nhất giữa server và client (ví dụ: new Date(), truy cập window/localStorage ở render đầu tiên).

Chỉ render nội dung phụ thuộc trình duyệt bên trong useEffect (sau khi mount) hoặc sử dụng suppressHydrationWarning.

Rò Rỉ Bí Mật Server

File chứa logic DB/API Key bị import nhầm vào Client Component.

Bắt buộc import 'server-only' ở đầu các file Data Access Layer.

"God Components"

Component gánh vác quá nhiều logic (fetch data, form handling, UI display), vi phạm SRP.

Tách nhỏ logic theo kiến trúc FSD (Logic nghiệp vụ -> Feature/Action; Logic Data -> Entity API; Logic hiển thị -> Widget/Shared UI).

QUAN TRỌNG: LUÔN VIẾT COMMENTS BẰNG TIẾNG VIỆT NGẮN GỌN ĐỂ GIẢI THÍCH CHO CÁC CODE PHỨC TẠP
7. Quy Tắc Giao Diện & Màu Sắc (UI/UX Rules)

7.1. Hệ Thống Màu Sắc (Premium Spa Palette)
Sử dụng hệ màu `oklch` định nghĩa trong `globals.css` để đảm bảo tính nhất quán và cảm giác cao cấp.
- **Background**: `bg-background` (Soft Porcelain / Warm White).
- **Primary**: `text-primary`, `bg-primary` (Deep Teal/Ocean) cho các hành động chính và điểm nhấn.
- **Secondary**: `bg-secondary` (Soft Sage/Mist) cho các thành phần phụ.
- **Muted**: `text-muted-foreground` cho văn bản phụ, `bg-muted` cho nền phụ.
- **Border**: `border-border` (Subtle Gray).

7.2. Sticky Headers & Layout
- **Sticky Positioning**: Sử dụng `sticky top-0` kết hợp với `z-index` phù hợp (`z-40` cho header chính, `z-30`/`z-20` cho header con).
- **Dynamic Height**: Sử dụng CSS variables (ví dụ: `--header-height`) để đồng bộ vị trí `top` của các thành phần sticky con (như table header) với header chính, đảm bảo không bị che khuất hoặc hở khoảng trắng.
- **Tránh Transition**: Không áp dụng `transition-all` cho container chính của sticky header để tránh hiện tượng giật (jitter) khi cuộn.
- **Footer Placement**: Đặt Footer bên trong container cuộn (ví dụ: `TabsContent`) để đảm bảo sticky header hoạt động chính xác đến tận cùng trang.

7.3. Thành Phần UI (Components)
- **Scrollbar**: Sử dụng class tùy chỉnh trong `globals.css` để tạo thanh cuộn mảnh, tinh tế (`w-1.5`, `rounded-full`).
- **Glassmorphism**: Sử dụng hạn chế, ưu tiên nền đặc (solid background) cho các thành phần sticky để tăng tính dễ đọc (readability).
- **Shadows**: Sử dụng `shadow-sm` hoặc `shadow-[...]` nhẹ nhàng để tạo độ nổi khối tinh tế.
- **Localization**: Toàn bộ văn bản hiển thị (Label, Placeholder, Tooltip, Toast) phải là Tiếng Việt.
