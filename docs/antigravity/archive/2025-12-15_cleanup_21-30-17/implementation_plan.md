# Kế Hoạch Clean Code: Module Resources

> **Ngày tạo:** 2025-12-15
> **Trạng thái:** ✅ ĐÃ DUYỆT
> **Vai trò:** Frontend Maintainer
> **Phạm vi:** `frontend/src/features/resources/**`

---

## 1. VẤN ĐỀ (Problem Statement)

### 1.1. Bối Cảnh

Module **Resources** hiện bao gồm nhiều component/phần logic (actions, schemas, form, table) với dấu hiệu code lặp, bất nhất đặt tên và tiềm ẩn prop drilling. Điều này làm giảm khả năng bảo trì và khó mở rộng.

### 1.2. Phạm Vi

| Thành phần      | Vị trí                                                               | Ghi chú                                              |
| --------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| Actions & types | `resources/actions.ts`, `resources/types.ts`, `resources/schemas.ts` | Kiểm tra kiểu dữ liệu, lỗi lặp validation            |
| UI Components   | `resources/components/**/*.tsx`                                      | Kiểm tra tách biệt client/server, props, memoization |
| Data mocks      | `resources/data/mocks.ts`                                            | Xem xét đơn giản hóa/loại bỏ nếu dư                  |

---

## 2. MỤC ĐÍCH (Objectives)

| Mục tiêu           | Mô tả                                                | Ưu tiên       |
| ------------------ | ---------------------------------------------------- | ------------- |
| Đọc dễ & nhất quán | Chuẩn hóa đặt tên props/handlers, tách logic khỏi UI | 🔴 Cao        |
| Giảm trùng lặp     | Gom logic chung (validation, helper) vào util/shared | 🟠 Trung bình |
| Không đổi hành vi  | Giữ nguyên API surface/UX; chỉ tinh gọn code         | 🔴 Cao        |

---

## 3. RÀNG BUỘC (Constraints)

- Không thay đổi contract dữ liệu công khai (types, schemas, action payload/response)
- Không mở rộng tính năng mới; chỉ refactor/clean code
- Tuân thủ cấu trúc barrel exports hiện tại trong `resources/index.ts`
- Giữ tương thích với Next.js 15 + React 19, không thêm dependency mới trừ khi thực sự cần

---

## 4. CHIẾN LƯỢC (Strategy)

- Rà soát nhanh actions/types/schemas để tìm duplication và validator trùng lặp; đề xuất helper dùng chung
- Kiểm tra component tree (`resource-page`, `resource-form`, `resource-table`, `maintenance-timeline`) để tách side-effects khỏi render, giảm prop drilling (memo, context nhẹ nếu cần)
- Chuẩn hóa naming: `onX`, `handleX`, `isLoading`/`disabled`; thống nhất định dạng date/time utilities
- Ưu tiên thay đổi nhỏ, an toàn, có thể kiểm chứng bằng lint/build; bổ sung unit test nếu scope nhỏ

---

## 5. GIẢI PHÁP ĐỀ XUẤT (Draft Solutions)

1. Trích xuất helpers dùng chung cho validation/date/time vào `resources/common` hoặc `shared/utils`
2. Gom các schema zod vào một nơi, tránh định nghĩa lặp (create/update) bằng `.partial()`/`merge`
3. Chuẩn hóa props component (trạng thái loading/disabled, callback đặt tên nhất quán)
4. Loại bỏ mock/logic không dùng, thêm type guard cho dữ liệu từ server actions
5. Bổ sung inline comment ngắn cho logic phức tạp (nếu có) và đảm bảo barrel `index.ts` sạch

---

**⏸️ DỪNG TẠI ĐÂY - ĐANG CHỜ PHÊ DUYỆT TỪ NGƯỜI DÙNG**

---

# Kế Hoạch Đánh Giá & Đồng Bộ Hóa: Module Appointments

> **Ngày tạo:** 2025-12-15
> **Trạng thái:** 🟡 CHỜ PHÊ DUYỆT
> **Vai trò:** Product Analyst & UX System Architect
> **Phạm vi:** Module Appointments + Booking Wizard

---

## 1. VẤN ĐỀ (Problem Statement)

### 1.1. Bối Cảnh

Dự án **Synapse** đang trong giai đoạn **phát triển**, có thiết kế chi tiết (UI/UX specification, database design) và một phần đã được triển khai. Yêu cầu đánh giá mức độ **phù hợp giữa thiết kế và triển khai hiện tại** cho module lịch hẹn (**Appointments**).

### 1.2. Phạm Vi Đánh Giá

| Thành phần                | Vị trí                                                    | Mô tả                                          |
| ------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| **Appointments Module**   | `frontend/src/features/appointments/`                     | Quản lý lịch hẹn (Calendar, Actions, Sheet)    |
| **Booking Wizard Module** | `frontend/src/features/booking-wizard/`                   | Luồng đặt lịch 4 bước cho khách hàng           |
| **Database Design**       | `docs/design/database_design.md`                          | Schema: bookings, booking_items, booking_holds |
| **Requirements**          | `docs/ai/requirements/feature-appointments-completion.md` | User Stories & Acceptance Criteria             |
| **UX Analysis**           | `docs/reports/ux-appointments-analysis.md`                | Báo cáo UX chuyên sâu                          |

---

## 2. MỤC ĐÍCH (Objectives)

### 2.1. Mục Tiêu Chính

| Mục tiêu                   | Mô tả                                         | Độ ưu tiên    |
| -------------------------- | --------------------------------------------- | ------------- |
| **Gap Identification**     | Xác định sai lệch giữa thiết kế và triển khai | 🔴 Cao        |
| **Data Model Consistency** | Đánh giá TypeScript types vs Database schema  | 🔴 Cao        |
| **Feature Completeness**   | So sánh User Stories vs Implementation        | 🔴 Cao        |
| **UX Alignment**           | Đánh giá UI patterns vs Design System         | 🟠 Trung bình |
| **API Contract Alignment** | Server Actions vs Backend API design          | 🟠 Trung bình |

### 2.2. Deliverables

1. **Báo cáo Gap Analysis** với chi tiết từng điểm sai lệch
2. **Ma trận quyết định** (Fix Design vs Fix Implementation)
3. **Danh sách tasks** để đồng bộ hóa (nếu được duyệt)

---

## 3. PHÂN TÍCH SƠ BỘ (Initial Analysis)

### 3.1. 🔴 PHÁT HIỆN NGHIÊM TRỌNG (Critical Gaps)

#### GAP-001: Frontend TypeScript vs Database Schema

| Field (Frontend)             | Field (Database)            | Vấn đề                                                                             |
| ---------------------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `Appointment.customerId`     | `bookings.customer_id`      | ✅ Khớp                                                                            |
| `Appointment.staffId`        | `booking_items.staff_id`    | ⚠️ **Sai mô hình**: Frontend có staffId cấp booking, DB thiết kế staffId per item  |
| `Appointment.serviceId`      | `booking_items.service_id`  | ⚠️ **Sai mô hình**: Frontend có serviceId cấp booking (legacy), DB chỉ có per item |
| `Appointment.resourceId`     | `booking_items.resource_id` | ⚠️ **Sai mô hình**: Tương tự trên                                                  |
| `Appointment.items[]`        | `booking_items`             | ✅ Khớp logic (1 booking → N items)                                                |
| `Appointment.internalNotes`  | ❌ **Không có**             | DB thiếu field `internal_notes`                                                    |
| `Appointment.check_in_time`  | `bookings.check_in_time`    | ✅ Khớp                                                                            |
| `Appointment.cancel_reason`  | `bookings.cancel_reason`    | ✅ Khớp                                                                            |
| `Appointment.isRecurring`    | ❌ **Không có**             | DB thiếu support cho recurring bookings                                            |
| `Appointment.recurrenceRule` | ❌ **Không có**             | DB thiếu support cho recurring bookings                                            |

**Phân tích:**

- Frontend types (`types.ts`) kế thừa **Legacy Fields** (`staffId`, `serviceId` ở cấp Appointment) trong khi DB thiết kế theo mô hình **Multi-Service** (`booking_items` với staffId/serviceId riêng từng item).
- Điều này gây **inconsistency** khi triển khai API thực tế.

---

#### GAP-002: Mock Data vs Real API Implementation

| Aspect                | Trạng thái           | Chi tiết                                         |
| --------------------- | -------------------- | ------------------------------------------------ |
| `actions.ts`          | ⚠️ **MOCK ONLY**     | Sử dụng `MOCK_APPOINTMENTS` array, không persist |
| `createAppointment`   | ⚠️ **Không gọi API** | Push vào array local, restart = mất dữ liệu      |
| `checkConflictsLogic` | ⚠️ **Mock logic**    | Không tính `buffer_time` như requirement         |
| Backend Module        | ❌ **Chưa tồn tại**  | Không có `/api/v1/bookings` endpoints            |

**Impact:** Module Appointments **không production-ready**.

---

#### GAP-003: Requirements vs Implementation (User Stories)

| User Story               | AC        | Status                 | Gap                                                                      |
| ------------------------ | --------- | ---------------------- | ------------------------------------------------------------------------ |
| **US-A1: Xem Lịch**      | AC-A1.1~5 | ✅ Done                | —                                                                        |
| **US-A2: Tạo Lịch**      | AC-A2.5   | ⚠️ **Partial**         | Conflict check không tính buffer_time                                    |
|                          | AC-A2.6   | ⚠️ **Partial**         | Resource allocation là manual, không auto-allocate                       |
|                          | AC-A2.9   | ⚠️ **Missing**         | Duration không cộng buffer_time                                          |
| **US-A3: Walk-in**       | AC-A3.1~5 | ✅ Done                | `walk-in-booking-dialog.tsx` tồn tại                                     |
| **US-A4: Check-in**      | AC-A4.1~5 | ✅ Done                | —                                                                        |
| **US-A5: No-show**       | AC-A5.1   | ⚠️ **Missing**         | Không check "15 phút sau start_time"                                     |
| **US-A6: Hủy lịch**      | AC-A6.1~5 | ✅ Done                | CancelDialog implemented                                                 |
| **US-A7: Filter**        | AC-A7.1~6 | ✅ Done                | Filter component implemented                                             |
| **US-A8: Multi-Service** | AC-A8.1~5 | ⚠️ **Partial**         | Cho phép chọn nhiều services, nhưng duration calculation không đúng spec |
| **US-A9: Resource**      | AC-A9.1~6 | ❌ **Not Implemented** | Thiếu hoàn toàn logic resource allocation                                |

---

#### GAP-004: Booking Wizard vs Appointments Module

| Aspect               | Booking Wizard                    | Appointments                         | Gap                            |
| -------------------- | --------------------------------- | ------------------------------------ | ------------------------------ |
| **Entity Target**    | `bookings` + `booking_holds`      | `Appointment` (mapped to `bookings`) | ✅ Aligned                     |
| **Hold Mechanism**   | Thiết kế có `booking_holds` table | Không có hold concept                | ⚠️ Wizard chưa triển khai hold |
| **State Management** | Zustand Store                     | Component state                      | Khác pattern nhưng OK          |
| **Realtime**         | Supabase Realtime (planned)       | Không có                             | Wizard-only feature            |
| **Slot Calculation** | OR-Tools (Phase 2)                | Mock conflict check                  | Chưa có backend                |

---

### 3.2. 🟠 PHÁT HIỆN TRUNG BÌNH (Medium Gaps)

#### GAP-005: UX Patterns không nhất quán

| Issue ID | Vấn đề                                   | File                             | Impact   |
| -------- | ---------------------------------------- | -------------------------------- | -------- |
| UX-001   | Native `confirm()` thay vì custom Dialog | `appointments-page.tsx` (đã fix) | ✅ Fixed |
| UX-002   | Settings button không có chức năng       | `appointments-page.tsx:208`      | Low      |
| UX-003   | Conflict checking không real-time        | `appointment-form.tsx`           | High     |
| UX-004   | Không hiển thị available slots visual    | `time-step.tsx`                  | Medium   |
| UX-005   | Customer search yêu cầu 2 ký tự          | `actions.ts:186`                 | Low      |

#### GAP-006: Constants/Config Hardcoding

| Constant                          | Định nghĩa tại     | Vấn đề                                               |
| --------------------------------- | ------------------ | ---------------------------------------------------- |
| `DEFAULT_WORKING_HOURS`           | `constants.ts:133` | Hardcoded 8-21, nên lấy từ `regular_operating_hours` |
| `APPOINTMENT_STATUS_CONFIG.color` | `constants.ts`     | Hardcoded Tailwind classes, không dùng CSS variables |
| `DEFAULT_SERVICE_COLORS`          | `constants.ts:199` | Hardcoded hex, nên service có color trong DB         |

---

### 3.3. ✅ ĐIỂM MẠNH (What's Working Well)

| Khía cạnh                   | Đánh giá   | Chi tiết                                                 |
| --------------------------- | ---------- | -------------------------------------------------------- |
| **Calendar Views**          | ⭐⭐⭐⭐   | 5 views (Day/Week/Month/Agenda/Timeline) hoạt động tốt   |
| **Sheet UX**                | ⭐⭐⭐⭐   | Appointment detail sheet có layout tốt                   |
| **Status Management**       | ⭐⭐⭐⭐⭐ | Color-coded status badges, transitions logic rõ ràng     |
| **TypeScript Types**        | ⭐⭐⭐⭐   | Well-typed interfaces với RecurrenceConfig, ConflictInfo |
| **Zod Schemas**             | ⭐⭐⭐⭐   | Form validation với Tiếng Việt messages                  |
| **Action Response Pattern** | ⭐⭐⭐⭐⭐ | Consistent ActionResponse<T> pattern                     |
| **Localization**            | ⭐⭐⭐⭐⭐ | 100% Tiếng Việt UI/messages                              |

---

## 4. MA TRẬN QUYẾT ĐỊNH (Decision Matrix)

### 4.1. Fix Design vs Fix Implementation

| Gap ID  | Mô tả                                              | Quyết định             | Lý do                                                                 |
| ------- | -------------------------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| GAP-001 | Legacy Fields (staffId/serviceId at booking level) | **Fix Implementation** | DB design đúng (per-item), Frontend cần migrate                       |
| GAP-001 | Missing `internal_notes` in DB                     | **Fix Design (DB)**    | Add column `internal_notes TEXT` to `bookings`                        |
| GAP-001 | Missing recurring support in DB                    | **Fix Design (DB)**    | Add `is_recurring`, `recurrence_rule`, `recurrence_parent_id` columns |
| GAP-002 | Mock data only                                     | **Fix Implementation** | Create Backend module `/modules/appointments/`                        |
| GAP-003 | buffer_time not calculated                         | **Fix Implementation** | Update conflict checking logic                                        |
| GAP-003 | No-show 15min rule                                 | **Fix Implementation** | Add time validation in UI                                             |
| GAP-003 | Resource auto-allocation                           | **Defer to Phase 2**   | Complex feature, not MVP                                              |
| GAP-004 | Booking holds                                      | **Defer**              | Wizard feature, implement when Wizard is priority                     |
| GAP-005 | Real-time conflict check                           | **Fix Implementation** | Use `checkConflicts` action on time/staff change                      |
| GAP-006 | Hardcoded working hours                            | **Fix Implementation** | Fetch from `operating-hours` feature                                  |

---

## 5. RÀNG BUỘC (Constraints)

### 5.1. Phải Tuân Thủ

- ❌ **KHÔNG** thay đổi phạm vi chức năng cốt lõi (MVP scope)
- ❌ **KHÔNG** implement features Phase 2 (OR-Tools, Realtime, Recurring)
- ✅ Đảm bảo backward compatibility với mock data
- ✅ Tuân thủ FSD Architecture (barrel exports)
- ✅ Tuân thủ Design System (colors, typography)

### 5.2. Technical Constraints

- React 19 + Server Components
- Next.js 15+ App Router
- Supabase (không có Backend FastAPI sẵn cho module này)

---

## 6. CHIẾN LƯỢC (Strategy)

### 6.1. Phương Pháp Tiếp Cận

```
Phase 1: FIX-CRITICAL   → Sửa GAP-001, GAP-003 (UX issues)
Phase 2: ALIGN-DATA     → Chuẩn bị migration cho DB/TypeScript alignment
Phase 3: BACKEND-PREP   → Document API contract cho future backend
Phase 4: VERIFY         → Lint, build, manual testing
```

### 6.2. Ưu Tiên Sửa Chữa

| Thứ tự | Gap ID  | Task                                                   | Effort | Impact   |
| ------ | ------- | ------------------------------------------------------ | ------ | -------- |
| 1      | GAP-003 | Thêm check "15 phút sau start_time" cho No-show button | Low    | High     |
| 2      | GAP-003 | Thêm buffer_time vào duration calculation              | Medium | High     |
| 3      | GAP-005 | Real-time conflict checking khi chọn time              | Medium | High     |
| 4      | GAP-006 | Fetch working hours từ settings thay vì hardcode       | Low    | Medium   |
| 5      | GAP-001 | Document Legacy Field migration plan                   | Low    | Planning |
| 6      | GAP-001 | Add missing DB columns proposal                        | Low    | Planning |

---

## 7. DANH SÁCH TASKS ĐỀ XUẤT

### 7.1. Phase 1: Quick Fixes (UX Improvements)

| Task    | Mô tả                                                | File                          | Est. Effort |
| ------- | ---------------------------------------------------- | ----------------------------- | ----------- |
| TASK-01 | Add 15-minute elapsed check for No-show button       | `calendar/event-popover.tsx`  | 15 min      |
| TASK-02 | Include buffer_time in appointment duration display  | `sheet/appointment-sheet.tsx` | 20 min      |
| TASK-03 | Trigger conflict check on staff/time change          | `sheet/appointment-form.tsx`  | 30 min      |
| TASK-04 | Display conflict warning inline (not just on submit) | `sheet/conflict-warning.tsx`  | 20 min      |
| TASK-05 | Fetch DEFAULT_WORKING_HOURS from settings            | `constants.ts`, `actions.ts`  | 30 min      |

### 7.2. Phase 2: Data Model Alignment (Documentation)

| Task   | Mô tả                                                   | Deliverable                                    | Est. Effort |
| ------ | ------------------------------------------------------- | ---------------------------------------------- | ----------- |
| DOC-01 | Document Legacy Fields migration plan                   | `docs/ai/migrations/appointments-v2.md`        | 1 hour      |
| DOC-02 | Propose DB schema additions (internal_notes, recurring) | `docs/ai/migrations/db-appointments-patch.sql` | 30 min      |
| DOC-03 | Define Backend API contract for `/api/v1/bookings`      | `docs/ai/design/api-appointments.md`           | 1 hour      |

**Tổng thời gian Phase 1:** ~2 giờ
**Tổng thời gian Phase 2:** ~2.5 giờ

---

## 8. TÓM TẮT ĐIỀU HÀNH (Executive Summary)

### 8.1. Mức Độ Phù Hợp Tổng Thể

| Khía cạnh                          | Điểm (1-10) | Ghi chú                            |
| ---------------------------------- | ----------- | ---------------------------------- |
| **UX/UI vs Design**                | 7.5/10      | Tốt, một số patterns cần cải thiện |
| **TypeScript vs Database**         | 6/10        | Legacy fields gây inconsistency    |
| **Requirements vs Implementation** | 6/10        | ~60% User Stories hoàn thiện       |
| **API Contract**                   | 3/10        | Mock data only, Backend chưa có    |

**Tổng điểm:** **5.6/10** - Cần cải thiện đáng kể trước production

### 8.2. Rủi Ro Chính

| Rủi ro                                    | Likelihood | Impact | Mitigation                    |
| ----------------------------------------- | ---------- | ------ | ----------------------------- |
| Data loss khi switch từ mock sang real DB | High       | High   | Document migration path       |
| Conflict detection không chính xác        | High       | High   | Implement buffer_time logic   |
| Multi-service booking logic sai           | Medium     | High   | Align với DB model (per-item) |

---

## 9. QUYẾT ĐỊNH CẦN XÁC NHẬN

> ⚠️ **CẦN PHẢN HỒI TỪ NGƯỜI DÙNG:**

### 9.1. Xác nhận Gap Analysis

- [ ] Đồng ý với danh sách gaps đã phát hiện
- [ ] Cần bổ sung/điều chỉnh gaps

### 9.2. Lựa chọn Phạm vi Sửa chữa

- [ ] **Option A:** Chỉ Phase 1 (Quick Fixes - UX) - ~2 giờ
- [ ] **Option B:** Phase 1 + Phase 2 (Documentation) - ~4.5 giờ
- [ ] **Option C:** Chỉ cần báo cáo, không thực hiện sửa chữa

### 9.3. Ưu tiên Backend

- [ ] Tạo Backend module cho Appointments ngay (thay thế mock)
- [ ] Giữ mock, tập trung UX trước
- [ ] Defer backend đến khi có backend team

---

**⏸️ DỪNG TẠI ĐÂY - ĐANG CHỜ PHÊ DUYỆT TỪ NGƯỜI DÙNG**
