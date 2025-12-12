---
phase: requirements
title: Chuẩn hóa Frontend Foundation
description: Yêu cầu chi tiết cho việc chuẩn hóa Response Types và Component APIs
version: 1.0
created_at: 2025-12-12
status: APPROVED
priority: P0-CRITICAL
estimated_effort: 2 days
---

# 📋 Yêu Cầu: Chuẩn Hóa Frontend Foundation

## 1. Tuyên Bố Vấn Đề

### 1.1. Bối cảnh
Hệ thống Frontend Synapse hiện tại có nhiều **inconsistencies** trong cách các Server Actions trả về response và cách Components được cấu hình. Điều này gây ra:
- Code duplication khi xử lý responses
- Khó maintain và debug
- Developer confusion khi làm việc với các modules khác nhau

### 1.2. Vấn Đề Cụ Thể

**Vấn đề 1: Response Type Không Nhất Quán**
```typescript
// auth/actions.ts - Pattern A
return { success: true, message: "Đăng nhập thành công" }

// appointments/actions.ts - Pattern B
return { status: "success", data: appointment, error: null }

// services/actions.ts - Pattern C
return { success: true, data: service, message?: string }
```

**Vấn đề 2: DataTable API Bị Bloated**
```typescript
// Hỗ trợ cả 2 cách cấu hình:
// Cách 1 (Deprecated): Flat props
<DataTable selectable isSelected={...} onToggleOne={...} />

// Cách 2 (Recommended): Grouped config
<DataTable selection={{ mode: 'multi', ... }} />
```

---

## 2. Mục Tiêu

### 2.1. Mục Tiêu Chính
- ✅ Tất cả Server Actions trả về `ActionResponse<T>` thống nhất
- ✅ DataTable chỉ sử dụng Grouped Config API
- ✅ Không có breaking changes cho end-users

### 2.2. Phi Mục Tiêu
- ❌ Thay đổi business logic của actions
- ❌ Redesign UI components
- ❌ Kết nối với Backend API thực

---

## 3. User Stories

### US-1: Developer Consistency
**Như một** Frontend Developer
**Tôi muốn** tất cả Server Actions có cùng response structure
**Để** tôi có thể viết một utility function xử lý responses cho toàn bộ app

**Acceptance Criteria:**
- [ ] AC1.1: Mọi action trả về `ActionResponse<T>`
- [ ] AC1.2: Có helper `createSuccessResponse()` và `createErrorResponse()`
- [ ] AC1.3: TypeScript strict mode pass

### US-2: DataTable Simplicity
**Như một** Developer sử dụng DataTable
**Tôi muốn** chỉ có một cách cấu hình selection/sorting
**Để** tôi không bị confuse về API nào nên dùng

**Acceptance Criteria:**
- [ ] AC2.1: Xóa toàn bộ deprecated flat props
- [ ] AC2.2: TypeScript errors cho code cũ dùng flat props
- [ ] AC2.3: Documentation update

---

## 4. Tiêu Chí Thành Công

| Metric | Target | Cách đo |
|:---|:---|:---|
| TypeScript Errors | 0 | `pnpm tsc --noEmit` |
| ESLint Warnings | 0 | `pnpm lint` |
| Response Type Coverage | 100% | Manual review |
| Test Coverage | Existing tests pass | `pnpm test` |

---

## 5. Ràng Buộc Kỹ Thuật

1. **Backward Compatibility**: Không break UI hiện tại
2. **TypeScript Strict**: Phải pass strict mode
3. **No Runtime Regression**: Performance không giảm
4. **Incremental Migration**: Có thể migrate từng module

---

## 6. Câu Hỏi Mở

| # | Câu hỏi | Trả lời | Người quyết định |
|:---|:---|:---|:---|
| Q1 | ActionResponse có cần `timestamp` field không? | Có, cho debugging | Tech Lead |
| Q2 | Có cần `requestId` cho tracing? | Chưa cần, Phase 2 | Tech Lead |
| Q3 | Error codes có standardize không? | Có, dùng string codes | Tech Lead |

---

## 7. Dependencies

- `@/shared/lib/action-response.ts` - Phải có sẵn
- Zod schemas cho validation
- React Server Actions support (Next.js 14+)

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|:---|:---:|:---:|:---|
| Breaking existing forms | Medium | High | Test từng form sau refactor |
| Type mismatches | Low | Medium | Strict TypeScript |
| Performance regression | Low | Medium | Benchmark before/after |

