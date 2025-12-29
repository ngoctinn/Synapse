# Nghiên cứu: Next.js 16 Data Fetching Best Practices

> **Ngày:** 29/12/2024
> **Phiên bản tham chiếu:** Next.js 16.1.1

---

## 1. Nguồn Tài liệu Tham khảo

| Nguồn | Nội dung |
|-------|----------|
| [Next.js Caching Guide](https://nextjs.org/docs/app/guides/caching) | 4 lớp caching trong Next.js |
| [Next.js fetch API](https://nextjs.org/docs/app/api-reference/functions/fetch) | Options cache, revalidate, tags |
| [Server Actions Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) | Server Actions dành cho mutations |
| Web Search 2024 | Best practices cộng đồng |

---

## 2. Phát hiện Quan trọng

### 2.1. Server Actions = Mutations, NOT Fetching

> **⚠️ QUAN TRỌNG:** Server Actions được thiết kế cho **MUTATIONS** (create, update, delete), không phải data fetching.

**Lý do:**
- Server Actions sử dụng `POST` method → Không được cache tự động
- Gọi Server Action để fetch data = redundant network requests
- Best practice: Fetch data trong **Server Components** trực tiếp

### 2.2. Next.js 16 Caching Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CACHING LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Request Memoization │ Per-request │ React.cache()        │
│ 2. Data Cache          │ Persistent  │ fetch + revalidate   │
│ 3. Full Route Cache    │ Persistent  │ Static generation    │
│ 4. Router Cache        │ Client      │ Prefetching          │
└─────────────────────────────────────────────────────────────┘
```

### 2.3. Fetch Options trong Next.js 16

| Option | Giá trị | Mô tả |
|--------|---------|-------|
| `cache` | `'force-cache'` | Luôn cache (default trong production) |
| `cache` | `'no-store'` | Dynamic rendering, không cache |
| `next.revalidate` | `number` | Time-based revalidation (giây) |
| `next.tags` | `string[]` | Tag-based revalidation |

---

## 3. So sánh: Hiện trạng Synapse vs Best Practices

| Khía cạnh | Synapse | Best Practice | Gap |
|-----------|---------|---------------|-----|
| Data fetching location | Server Actions | Server Components | ⚠️ |
| Request deduplication | ❌ Không có | React.cache() | ⚠️ |
| Cache control | ❌ Không có | revalidate/tags | ⚠️ |
| Auth token injection | ✅ fetchWithAuth | ✅ | ✓ |
| Error handling | ✅ ActionResponse | ✅ | ✓ |
| Conditional fetching | ✅ Theo tab | ✅ | ✓ |

---

## 4. Checklist Điều chỉnh (Ưu tiên)

### ✅ KEEP (Không cần thay đổi)
- [x] Pattern BFF với `fetchWithAuth`
- [x] Auth token injection từ Supabase
- [x] Error handling với `ActionResponse`
- [x] Conditional fetching theo activeTab
- [x] Suspense boundaries

### 🔄 ADJUST (Điều chỉnh)

#### P1: Thêm `React.cache()` cho Data Deduplication
```typescript
// shared/lib/cached-fetchers.ts
import { cache } from 'react';
import { fetchWithAuth } from './api';

export const getCachedServices = cache(async (page: number, limit: number, search?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append('search', search);
  return fetchWithAuth(`/services?${params}`);
});
```

#### P2: Thêm Cache Control cho fetch
```typescript
// shared/lib/api.ts
const response = await fetch(`${baseUrl}${path}`, {
  ...options,
  headers,
  next: {
    revalidate: 60,     // Time-based: 60 giây
    tags: ['services']  // Tag-based invalidation
  }
});
```

#### P3: Đổi `NEXT_PUBLIC_API_URL` → `API_URL`
```env
# .env.local
API_URL=http://localhost:8000/api  # Server-only
```

#### P4: Sử dụng `revalidateTag` sau mutations
```typescript
// features/services/actions.ts
import { revalidateTag } from 'next/cache';

export async function createService(data: ServiceCreateInput) {
  // ... create service
  revalidateTag('services'); // Invalidate cache
  return success(result);
}
```

### ❌ KHÔNG NÊN THAY ĐỔI
- **Không nên** chuyển data fetching sang Server Components trực tiếp vì:
  - Synapse có FastAPI backend riêng
  - Server Actions đang hoạt động như BFF layer
  - Refactor lớn không cần thiết cho MVP

---

## 5. Kết luận

### Pattern Hiện tại: Server Actions as BFF ✅ Hợp lệ

Mặc dù docs khuyến nghị fetch trực tiếp trong Server Components, pattern BFF của Synapse vẫn **hợp lệ** vì:
1. Có backend riêng (FastAPI) → Cần abstraction layer
2. Auth token injection tập trung
3. Error handling thống nhất
4. Type safety end-to-end

### Điều chỉnh Ưu tiên

| # | Điều chỉnh | Effort | Impact |
|---|------------|--------|--------|
| 1 | React.cache() | Low | High |
| 2 | fetch revalidate | Low | Medium |
| 3 | Env var rename | Low | Low |
| 4 | revalidateTag | Low | High |
| 5 | Remove NEXT_PUBLIC | Medium | Security |
| 6 | Parallel fetching | Low | Medium |

---

> **Khuyến nghị:** Thực hiện điều chỉnh P1 → P4 trước, không cần restructure toàn bộ.
