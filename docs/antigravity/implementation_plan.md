# Kế hoạch Kiểm toán Frontend Synapse

## 1. Vấn đề (Problem)

Frontend Synapse hiện tại cần được đánh giá toàn diện để phát hiện:
- **Code complexity**: Mã nguồn rối hoặc khó đọc
- **UI issues**: Vấn đề tiềm ẩn gây lỗi giao diện
- **Unused components**: Components dư thừa không được sử dụng
- **Tailwind overrides**: Ghi đè Tailwind quá mức khi Shadcn UI đã có sẵn
- **Best practices violations**: Vi phạm các quy tắc Next.js 16 và React 19

## 2. Mục đích (Purpose)

1. Xác định và liệt kê tất cả các vấn đề trong từng feature
2. Tổng hợp vào file báo cáo duy nhất để có cái nhìn tổng quan
3. Đề xuất giải pháp cải thiện dựa trên best practices mới nhất
4. Loại bỏ code dư thừa và tối ưu hóa

## 3. Phạm vi Đánh giá

### 3.1. Features (15 modules)

| # | Feature | Số file | Mức độ ưu tiên | Trọng tâm kiểm tra |
|---|---------|---------|----------------|-------------------|
| 1 | `auth` | 8 | 🔴 Cao | Server/Client boundary, Auth flow |
| 2 | `appointments` | 48 | 🔴 Cao | Complex UI, State management |
| 3 | `booking-wizard` | 30 | 🔴 Cao | Multi-step form, Validation |
| 4 | `staff` | 43 | 🟠 Trung bình | CRUD patterns, Table components |
| 5 | `services` | 25 | 🟠 Trung bình | Form handling, Image upload |
| 6 | `customers` | 13 | 🟠 Trung bình | Search, Filter, DataTable |
| 7 | `customer-dashboard` | 22 | 🟠 Trung bình | Layout, Navigation |
| 8 | `settings` | 22 | 🟠 Trung bình | Form patterns, Tabs |
| 9 | `resources` | 14 | 🟡 Thấp | CRUD patterns |
| 10 | `billing` | 11 | 🟡 Thấp | Invoice display |
| 11 | `reviews` | 11 | 🟡 Thấp | Rating components |
| 12 | `chat` | 9 | 🟡 Thấp | Real-time UI |
| 13 | `landing-page` | 8 | 🟡 Thấp | Static content, Animation |
| 14 | `notifications` | 6 | 🟡 Thấp | Toast, Bell UI |
| 15 | `admin` | 5 | 🟡 Thấp | Dashboard layout |

### 3.2. Shared (5 categories)

| Category | Số file | Trọng tâm |
|----------|---------|-----------|
| `shared/ui` | 84 | Shadcn components, Custom components |
| `shared/hooks` | 11 | Hook patterns, Reusability |
| `shared/lib` | 12 | Utilities, API layer |
| `shared/components` | 16 | Common layouts |
| `shared/model` | ? | Type definitions |

### 3.3. App Router (7 route groups)

| Route Group | Trọng tâm |
|-------------|-----------|
| `(auth)` | Login/Register pages |
| `(dashboard)` | Main dashboard layout |
| `(public)` | Public pages |
| `admin` | Admin routes |
| `api` | Route handlers |
| `auth` | Auth callbacks |
| `dev` | Development tools |

## 4. Tiêu chí Đánh giá (Audit Criteria)

### 4.1. Next.js 16 Best Practices

| Tiêu chí | Mô tả |
|----------|-------|
| **RSC by default** | Server Components làm mặc định, Client Components chỉ khi cần |
| **'use client' placement** | Directive đặt đúng vị trí, không lan tỏa không cần thiết |
| **Data fetching** | Sử dụng `fetch` native, không dùng `useEffect` cho data |
| **Async params** | `await` cho params, searchParams trong Next.js 15+ |
| **Server Actions** | Sử dụng đúng pattern với `useActionState` |
| **Suspense boundaries** | Loading states đúng cách |

### 4.2. Shadcn UI Best Practices

| Tiêu chí | Mô tả |
|----------|-------|
| **Use CSS Variables** | Sử dụng CSS variables thay vì hardcode màu |
| **No direct modification** | Không sửa trực tiếp component gốc, dùng wrapper/variants |
| **tailwind-merge** | Sử dụng cn() helper cho class conflicts |
| **Utility first** | Ưu tiên Tailwind utilities |
| **Default variants** | Sử dụng variants có sẵn thay vì custom styles |

### 4.3. Code Quality

| Tiêu chí | Mô tả |
|----------|-------|
| **Dead code** | Components/hooks không được sử dụng |
| **Duplicate code** | Logic lặp lại có thể extract |
| **Complex components** | Components quá lớn cần tách |
| **Prop drilling** | Truyền props qua nhiều tầng |
| **Magic values** | Giá trị hardcode không có ý nghĩa |

### 4.4. Tailwind Override Detection

| Pattern vi phạm | Ví dụ |
|-----------------|-------|
| Hardcode colors | `text-[#ff0000]`, `bg-[#123456]` |
| Hardcode sizes | `w-[350px]`, `h-[200px]` |
| Override shadows | Custom shadow thay vì `shadow-sm/md/lg` |
| Override typography | `text-[14px]` thay vì `text-sm` |

## 5. Kế hoạch Thực hiện (Execution Plan)

### Phase 1: SPLIT - Chia nhỏ Task (Hiện tại)

```
[ ] Tạo task.md với danh sách feature cần audit
[ ] Cập nhật dashboard.md với workflow tracker
```

### Phase 2: ANALYZE - Phân tích từng Feature

**Batch 1 - High Priority (3 features)**
```
[ ] auth - Authentication flow
[ ] appointments - Appointment management
[ ] booking-wizard - Booking flow
```

**Batch 2 - Medium Priority (5 features)**
```
[ ] staff - Staff management
[ ] services - Service management
[ ] customers - Customer management
[ ] customer-dashboard - Customer portal
[ ] settings - System settings
```

**Batch 3 - Low Priority (7 features)**
```
[ ] resources - Resource management
[ ] billing - Billing/Invoice
[ ] reviews - Reviews/Ratings
[ ] chat - Live chat
[ ] landing-page - Landing page
[ ] notifications - Notifications
[ ] admin - Admin dashboard
```

**Batch 4 - Shared Code**
```
[ ] shared/ui - UI components
[ ] shared/hooks - Custom hooks
[ ] shared/lib - Utilities
[ ] shared/components - Common components
```

### Phase 3: DIFF - Tổng hợp Báo cáo

```
[ ] Tạo file tổng hợp: docs/antigravity/frontend_audit_report.md
[ ] Phân loại issues theo severity
[ ] Đề xuất fixes
```

### Phase 4: VERIFY - Kiểm tra

```
[ ] Chạy pnpm lint
[ ] Chạy pnpm build
[ ] Kiểm tra TypeScript errors
```

## 6. Research Findings

### 6.1. Next.js 16 Key Points (Từ tài liệu chính thống)

1. **Server Components by Default**: Mọi component là Server Component trừ khi có `'use client'`
2. **Keep Client Components Small**: Client Components nên nhỏ và tập trung vào interactivity
3. **No useEffect for Data**: Sử dụng Server Components với `await fetch()` thay vì `useEffect`
4. **Context Providers Deep**: Đặt providers sâu nhất có thể trong component tree
5. **Lazy Loading**: Sử dụng `next/dynamic` cho Client Components không critical
6. **Streaming with Suspense**: Dùng `<Suspense>` để progressive rendering
7. **Client Cannot Import Server**: Client Component không thể import Server Component trực tiếp

### 6.2. Shadcn UI Key Points (Từ tài liệu chính thống)

1. **CSS Variables**: Dùng `tailwind.cssVariables: true` trong components.json
2. **tailwind-merge**: Đã tích hợp qua helper `cn()` - tự động resolve conflicts
3. **Avoid Direct Modification**: Tạo wrapper components hoặc variants thay vì sửa trực tiếp
4. **Strict Typography Scale**: Định nghĩa scale rõ ràng từ đầu dự án
5. **Theme Testing**: Test cả light và dark mode thường xuyên
6. **Use Default Variants**: Ưu tiên dùng variants có sẵn (default, destructive, outline, secondary, ghost, link)
7. **@theme Directive**: Tailwind v4 dùng `@theme` để register CSS variables

### 6.3. Globals.css Analysis (Synapse hiện tại)

**✅ Điểm tốt:**
- Sử dụng CSS Variables với `oklch()` color space (modern)
- Có full dark mode variables
- Sử dụng `@theme inline` cho Tailwind v4
- Định nghĩa utility classes hợp lý như `glass`, `focus-premium`
- Custom keyframes animations rõ ràng

**⚠️ Điểm cần xem xét:**
- Có **503 dòng CSS** - khá lớn, cần review
- `surface-card` dùng `dark:bg-slate-900` thay vì CSS variable
- Một số utility như `stats-card-premium` phức tạp quá mức
- Có thể refactor `command-dialog-styling` thành variant

## 7. Output Format

Mỗi feature sẽ được đánh giá và ghi vào file tổng hợp với format:

```markdown
## [Feature Name]

### Summary
| Metric | Value |
|--------|-------|
| Total Files | X |
| Issues Found | X |
| Severity | High/Medium/Low |

### Issues
1. **[CATEGORY]** Description
   - File: `path/to/file.tsx`
   - Line: XX
   - Suggestion: How to fix

### Recommendations
- ...
```

---

> [!IMPORTANT]
> Kế hoạch này cần được duyệt trước khi bắt đầu giai đoạn SPLIT và ANALYZE.

---

*Tạo bởi: Antigravity Workflow*
*Ngày: 2025-12-22*
