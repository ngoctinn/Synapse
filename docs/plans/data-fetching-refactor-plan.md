# Kế hoạch Refactor: Data Access Layer (DAL) Pattern

> **Mục tiêu:** Áp dụng pattern DAL theo khuyến nghị Next.js 16
> **Cập nhật:** 29/12/2024

---

## 1. Vấn đề Hiện tại

### 1.1. Data Fetching sai pattern
- **Hiện trạng:** Sử dụng Server Actions (`"use server"`) cho cả GET requests
- **Vấn đề:** Server Actions dùng POST method → không được cache tự động
- **Hướng giải quyết:** Tách data fetching ra file riêng, không dùng `"use server"`

### 1.2. Thiếu Request Deduplication
- **Hiện trạng:** Không có `React.cache()` wrap các hàm fetch
- **Vấn đề:** Cùng request có thể bị gọi nhiều lần trong 1 render
- **Hướng giải quyết:** Wrap tất cả GET functions với `React.cache()`
- **Tìm kiếm:** `@mcp:next-devtools: nextjs_docs` về `React.cache` usage

### 1.3. Thiếu Cache Control
- **Hiện trạng:** Không có `next: { revalidate, tags }` trong fetch options
- **Vấn đề:** Không tận dụng được Next.js Data Cache
- **Hướng giải quyết:** Thêm cache options cho tất cả fetch requests
- **Tìm kiếm:** `@mcp:next-devtools: nextjs_docs` về `fetch revalidate tags`

### 1.4. Thiếu Server-only Guard
- **Hiện trạng:** Không có `import 'server-only'` trong các file DAL
- **Vấn đề:** Có thể bị import nhầm vào Client Component → lộ secrets
- **Hướng giải quyết:** Thêm `server-only` import ở đầu tất cả file `.api.ts`
- **Cài đặt:** `pnpm add server-only`

### 1.5. Không có Revalidation sau Mutations
- **Hiện trạng:** Dùng `revalidatePath()`
- **Vấn đề:** Invalidate toàn bộ path thay vì chỉ data cần thiết
- **Hướng giải quyết:** Chuyển sang `revalidateTag()` cho fine-grained invalidation
- **Tìm kiếm:** `@mcp:next-devtools: nextjs_docs` về `revalidateTag vs revalidatePath`

### 1.6. Env Variable lộ Client
- **Hiện trạng:** Dùng `NEXT_PUBLIC_API_URL`
- **Vấn đề:** Env var có prefix `NEXT_PUBLIC_` bị expose ra client bundle
- **Hướng giải quyết:** Đổi thành `API_URL` (không có prefix)

---

## 2. Pattern Mới: `[feature].api.ts`

### 2.1. Cấu trúc
```
features/[feature]/
├── [feature].api.ts   # DAL: Tất cả API calls (GET + Mutations)
├── components/
├── model/
└── index.ts
```

### 2.2. Đặc điểm
- 1 file per feature chứa toàn bộ API calls
- Bắt buộc `import 'server-only'`
- GET functions wrapped với `React.cache()`
- Mutations kết thúc với `revalidateTag()`
- Gọi trực tiếp từ Server Components

---

## 3. Phases Thực hiện

### Phase 0: Cập nhật Rules
**Vấn đề:** Rules hiện tại cho phép Server Actions cho data fetching
**Hướng giải quyết:**
- Cập nhật `.agent/rules/frontend.md` Section 4
- Cập nhật `.agent/rules/tech-stack.md` Section 6.2
- Nêu rõ DAL pattern là standard

---

### Phase 1: Infrastructure
**Vấn đề:** Thiếu dependencies và config
**Hướng giải quyết:**
- Cài `server-only` package
- Cập nhật `shared/lib/api.ts` để support `next` options
- Đổi env var `NEXT_PUBLIC_API_URL` → `API_URL`

---

### Phase 2: Refactor `services` (Làm mẫu)
**Vấn đề:** `actions.ts` chứa cả GET và mutations
**Hướng giải quyết:**
- Tạo `services.api.ts` mới theo template
- Di chuyển logic từ `actions.ts`
- Cập nhật imports trong `page.tsx` và components
- Xóa hoặc simplify `actions.ts`
- **Tìm kiếm cú pháp:** Agent cần search docs khi implement

---

### Phase 3: Áp dụng cho các Features khác

| Priority | Features | Lý do |
|----------|----------|-------|
| P1 | `packages`, `resources` | Cùng module Services |
| P2 | `customers`, `staff`, `appointments` | Core business |
| P3 | `billing`, `reviews`, `treatments`, `waitlist`, `warranty` | Secondary |
| P4 | `booking-wizard`, `customer-dashboard`, `audit-logs`, `settings/*` | Low traffic |

---

## 4. Nội dung Cập nhật Rules

### `.agent/rules/frontend.md` - Section 4
**Thay thế:** "Server Actions và Pattern BFF"
**Bằng:** "Data Access Layer (DAL) Pattern"
**Nội dung chính:**
- 1 file `[feature].api.ts` per feature
- Bắt buộc `server-only`
- `React.cache()` cho GET
- `revalidateTag()` cho mutations
- KHÔNG dùng Server Actions cho data fetching

### `.agent/rules/tech-stack.md` - Section 6.2
**Cập nhật:** Phần Data Fetching
**Nội dung chính:**
- DAL pattern
- Không dùng Server Actions cho GET
- Env var không có prefix NEXT_PUBLIC_

---

## 5. Checklist

### Phase 0
- [ ] Cập nhật `frontend.md`
- [ ] Cập nhật `tech-stack.md`

### Phase 1
- [ ] `pnpm add server-only`
- [ ] Cập nhật `api.ts`
- [ ] Cập nhật `.env.local`

### Phase 2
- [ ] Tạo `services.api.ts`
- [ ] Cập nhật exports
- [ ] Cập nhật page imports
- [ ] Test

### Phase 3
- [ ] Repeat cho các features khác (theo priority)

---

## 6. Tài liệu Tham khảo

Khi implement, agent cần search:
- `@mcp:next-devtools: nextjs_docs` - "React cache function"
- `@mcp:next-devtools: nextjs_docs` - "fetch revalidate tags"
- `@mcp:next-devtools: nextjs_docs` - "revalidateTag"
- `@mcp:next-devtools: nextjs_docs` - "server-only package"
- `@mcp:next-devtools: nextjs_docs` - "data access layer"
