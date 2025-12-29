# Kế hoạch Refactor: Module Services - Luồng Nghiệp vụ Hoàn chỉnh

> **Mục tiêu:** Refactor module Services để phù hợp với nguyên tắc thiết kế UI và luồng nghiệp vụ đã đề xuất
> **Phạm vi:** Frontend only (lỗi runtime đã được fix)
> **Ngày tạo:** 29/12/2024

---

## 1. Tổng quan Vấn đề

### 1.1. Nguyên tắc Thiết kế Đề xuất (Spec)
| Nguyên tắc | Yêu cầu |
|------------|---------|
| **Admin-centric** | Chỉ Admin thao tác |
| **Phân tách Core vs Bổ trợ** | Thông tin cơ bản vs Nâng cao |
| **Tạo nhanh** | Không bắt buộc đi qua tất cả bước |
| **Tránh UI lồng sâu** | List → Detail, không wizard |
| **Post-create State** | Gợi ý bước tiếp theo sau tạo xong |

### 1.2. Luồng Thực tế Hiện tại
```
/admin/services (ServicesPage)
  ├─ Tab "Dịch vụ đơn" (ServiceTable)
  │   └─ ServiceSheet → ServiceForm (3 tabs: Thông tin, Tài nguyên, Kỹ năng)
  ├─ Tab "Gói combo" (PackageTable)
  ├─ Tab "Danh mục" (CategoryTable)
  └─ Tab "Kỹ năng" (SkillTable)
```

---

## 2. Danh sách Vấn đề Phát hiện

### 2.1. UX/UI Issues

#### **Vấn đề #1: Form quá nặng (Cognitive Overload)**
- **Hiện trạng:** ServiceForm hiện 3 tabs ngay từ đầu (Thông tin, Tài nguyên, Kỹ năng)
- **Vi phạm nguyên tắc:** "Tạo nhanh" - Admin bị buộc nhìn thấy tất cả trường
- **Search keywords:**
  - `progressive disclosure UI patterns`
  - `multi-step form best practices 2024`
  - `collapsible sections vs tabs UX`
  - `shadcn form organization patterns`

#### **Vấn đề #2: Thiếu Progressive Disclosure**
- **Hiện trạng:** Kỹ năng và Tài nguyên được hiển thị ngang hàng với Thông tin cơ bản
- **Nguyên tắc bị vi phạm:** "Phân tách Core vs Bổ trợ"
- **Hướng giải quyết:** Ẩn sections nâng cao sau accordion/disclosure
- **Search keywords:**
  - `accordion vs tabs when to use`
  - `form section organization best practices`
  - `shadcn accordion component patterns`

#### **Vấn đề #3: Thiếu Post-Create Guidance**
- **Hiện trạng:** Sau `createService` thành công → đóng Sheet → về danh sách
- **Vấn đề:** Admin không biết bước tiếp theo (vd: gán kỹ năng)
- **Vi phạm nguyên tắc:** "Post-create State"
- **Search keywords:**
  - `onboarding flow after create UX`
  - `post-submission guidance patterns`
  - `next steps UI recommendations`
  - `toast with action buttons patterns`

#### **Vấn đề #4: Category Table thiếu Drag-to-Reorder**
- **Hiện trạng:** Có cột `sort_order` nhưng chỉ hiển thị số, không kéo thả
- **Database:** `service_categories.sort_order` có sẵn
- **Hướng giải quyết:** Implement drag-drop để sắp xếp
- **Search keywords:**
  - `@dnd-kit table row reorder`
  - `shadcn table drag drop`
  - `sortable table rows React`
  - `tanstack table row DnD integration`

#### **Vấn đề #5: Skill Assignment thiếu Context**
- **Hiện trạng:** Multi-select kỹ năng không hiện số KTV đáp ứng
- **Nguyên tắc:** Gán kỹ năng để lọc KTV khi đặt lịch
- **Hướng giải quyết:** Hiển thị badge số lượng staff có kỹ năng
- **Search keywords:**
  - `multi-select with metadata display`
  - `checkbox list with counters`
  - `skill assignment UI patterns`

---

### 2.2. Architecture & Code Quality Issues

#### **Vấn đề #6: Form State Management phức tạp**
- **Hiện trạng:** `ServiceForm` có 3 tabs, mỗi tab một state riêng
- **Vấn đề:** Validation errors khó hiển thị tập trung
- **Search keywords:**
  - `react-hook-form multi-step validation`
  - `tab-based form error indicators`
  - `form state coordination patterns`

#### **Vấn đề #7: Category Form thiếu Live Preview**
- **Hiện trạng:** Không có preview khi tạo/sửa danh mục
- **Hướng giải quyết:** Split-pane view (form bên trái, preview bên phải)
- **Search keywords:**
  - `live preview form patterns`
  - `split pane form editor`
  - `real-time form preview React`

---

### 2.3. Business Logic Issues

#### **Vấn đề #8: Thiếu Validation cho `service_skills`**
- **Hiện trạng:** Có thể tạo dịch vụ mà không gán kỹ năng
- **Vấn đề logic:** Nếu không gán → "mọi KTV đều làm được" (assumption không rõ ràng)
- **Hướng giải quyết:** Thêm checkbox "Yêu cầu kỹ năng chuyên biệt?"
- **Search keywords:**
  - `conditional required fields UX`
  - `optional advanced settings patterns`

#### **Vấn đề #9: Resource Requirements không validate thời gian**
- **Hiện trạng:** `usage_duration` có thể > `service.duration`
- **Vấn đề:** Logic không hợp lệ
- **Search keywords:**
  - `cross-field validation react-hook-form`
  - `dependent field validation patterns`

---

## 3. Phases Refactor

### Phase 1: Research & Best Practices
**Agent Tasks:**
1. Search web cho từng vấn đề (keywords đã liệt kê)
2. Tổng hợp best practices vào docs
3. Chọn pattern phù hợp nhất

**Output:** `docs/research/services-ui-patterns.md`

---

### Phase 2: UX Improvements

#### 2.1. Refactor ServiceForm (Vấn đề #1, #2)
**Hướng dẫn:**
- Nghiên cứu progressive disclosure patterns
- Quyết định: Tabs vs Accordion vs Single-page scroll
- Implement theo pattern đã chọn
- Test với real data

**Files ảnh hưởng:**
- `service-form.tsx`
- `service-form/basic-tab.tsx`
- `service-form/resources-tab.tsx`
- `service-form/skills-tab.tsx`

#### 2.2. Post-Create Flow (Vấn đề #3)
**Hướng dẫn:**
- Nghiên cứu post-submission UX
- Thêm logic sau `createService` success:
  - Option 1: Toast với action "Cấu hình kỹ năng"
  - Option 2: Không đóng Sheet, chuyển tab "Kỹ năng"
  - Option 3: Modal "Bước tiếp theo?"
- Implement pattern đã chọn

**Files ảnh hưởng:**
- `service-sheet.tsx`
- `actions.ts` (return metadata)

#### 2.3. Category Drag-Drop (Vấn đề #4)
**Hướng dẫn:**
- Research `@dnd-kit` hoặc `react-beautiful-dnd`
- Implement drag-to-reorder
- Update `sort_order` backend

**Files ảnh hưởng:**
- `category-table.tsx`
- `actions.ts` (add `reorderCategories`)

---

### Phase 3: Validation & Logic

#### 3.1. Skill Assignment Context (Vấn đề #5)
**Hướng dẫn:**
- Fetch staff counts per skill
- Hiển thị badge trong UI
- Cảnh báo nếu skill không có staff

**Files ảnh hưởng:**
- `service-form/skills-tab.tsx`
- `services.api.ts` (add `getSkillStats`)

#### 3.2. Cross-Field Validation (Vấn đề #9)
**Hướng dẫn:**
- Research dependent validation patterns
- Implement validation:
  - `sum(resource_requirements.usage_duration) <= service.duration`
- Hiển thị error rõ ràng

**Files ảnh hưởng:**
- `model/schemas.ts` (validator)

---

## 4. Agent Workflow

### Step 1: Research Phase
```
For each issue (#1 → #9):
  1. Use search_web with provided keywords
  2. Document findings in research doc
  3. Choose best approach
```

### Step 2: Implementation Phase
```
For each phase:
  1. Create detailed plan for sub-task
  2. Implement changes
  3. Test manually
  4. Update documentation
```

### Step 3: Validation
```
1. Run build
2. Check accessibility
3. Test all flows
4. Update walkthrough.md
```

---

## 5. Success Criteria

| Vấn đề | Metric |
|--------|--------|
| #1 Form Overload | Time to create service < 30s |
| #2 Progressive Disclosure | Advanced fields collapsed by default |
| #3 Post-Create | User sees next step suggestion |
| #4 Drag-Drop | Categories sortable via drag |
| #5 Skill Context | Staff count visible per skill |
| #9 Validation | Invalid durations blocked |

---

## 6. Research Topics cho Agent

### Topic 1: Form Organization
**Questions:**
- Khi nào dùng Tabs vs Accordion?
- Progressive disclosure best practices?
- Error indicators trong multi-section forms?

**Sources:**
- Nielsen Norman Group
- Baymard Institute
- shadcn/ui examples

### Topic 2: Post-Submission UX
**Questions:**
- Toast vs Modal vs Inline guidance?
- Khi nào giữ form open?
- Multi-step onboarding patterns?

### Topic 3: Drag & Drop
**Questions:**
- @dnd-kit vs react-beautiful-dnd?
- Accessibility considerations?
- Table row DnD patterns?

### Topic 4: Validation Patterns
**Questions:**
- Cross-field validation best practices?
- Real-time vs submit validation?
- Error message positioning?

---

> **Note cho Agent:** Đây là kế hoạch tổng thể. Mỗi phase cần được chia nhỏ thành implementation plan riêng với code cụ thể sau khi research xong.
