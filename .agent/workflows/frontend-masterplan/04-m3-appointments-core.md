---
description: Milestone M3 - Appointments Module Core (8 ngày)
---

# 🔴 M3: Appointments Core (8 ngày)

## Issues: C1, C2, C3
## Tham khảo: `docs/ai/requirements/feature-appointments-completion.md`

---

### Task 3.1: Server Component Refactor (C3)

**Mục tiêu:** Loại bỏ useEffect fetch, chuyển sang Server Component pattern.

**Làm gì:**
1. Tạo Server Component wrapper trong `app/(dashboard)/appointments/page.tsx`
2. Fetch data với Promise.all, pass xuống Client Component
3. Tạo loading.tsx cho Suspense

---

### Task 3.2: Persist Data (C2)

**Mục tiêu:** createAppointment lưu data thực.

**Làm gì:**
1. Tạo in-memory store trong actions.ts
2. Implement CRUD operations với revalidatePath
3. Tham khảo US-A2, US-A8 (multi-service), US-A9 (resource allocation) trong requirements

---

### Task 3.3: Calendar Views (C1)

**Mục tiêu:** Tất cả calendar views hoạt động đầy đủ.

**Làm gì:**
1. Verify DayView, WeekView, MonthView, AgendaView
2. Event interactions: click, hover, color coding
3. Navigation: prev/next/today
4. Mobile responsive
5. Empty state

---

### Verify
- Tất cả views render đúng
- CRUD appointments hoạt động
- Responsive trên mobile
- Update Issue Tracker: C1, C2, C3 = DONE

## Tiếp theo
→ `/05-m4-appointments-workflows`
