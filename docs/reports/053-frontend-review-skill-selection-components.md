# Frontend Review: Skill Selection Components Inconsistency

**Ngày đánh giá:** 2025-12-05
**Phạm vi:** `features/staff`, `features/services`, `shared/ui/custom`
**Loại đánh giá:** Tính nhất quán UI/UX, Tuân thủ FSD

---

## Tóm Tắt Vấn Đề

> [!CAUTION]
> Hiện tại dự án sử dụng **2 component khác nhau** cho cùng một chức năng "chọn nhiều kỹ năng", gây ra:
> - Trải nghiệm người dùng không đồng nhất
> - Vi phạm nguyên tắc DRY (Don't Repeat Yourself)
> - Khó bảo trì và mở rộng

---

## 1. Phát Hiện Chi Tiết

### Component 1: `SkillSelector`

| Thuộc tính | Chi tiết |
|------------|----------|
| **Vị trí** | [skill-selector.tsx](file:///e:/Synapse/frontend/src/features/staff/components/skill-selector.tsx) |
| **Sử dụng tại** | 3 files trong `features/staff` |
| **Animations** | ❌ Không có |
| **Badge styling** | `variant="secondary"`, không rounded-full |
| **Thêm tag mới** | ❌ Không hỗ trợ |

**Files sử dụng:**
- [invite-staff-modal.tsx](file:///e:/Synapse/frontend/src/features/staff/components/invite-staff-modal.tsx#L215)
- [staff-modal.tsx](file:///e:/Synapse/frontend/src/features/staff/components/staff-list/staff-modal.tsx#L183)
- [edit-staff-modal.tsx](file:///e:/Synapse/frontend/src/features/staff/components/staff-list/edit-staff-modal.tsx#L172)

---

### Component 2: `TagInput`

| Thuộc tính | Chi tiết |
|------------|----------|
| **Vị trí** | [tag-input.tsx](file:///e:/Synapse/frontend/src/shared/ui/custom/tag-input.tsx) |
| **Sử dụng tại** | 2 files trong `features/services` |
| **Animations** | ✅ Framer-motion (scale, opacity) |
| **Badge styling** | `rounded-full`, hover effects, premium |
| **Thêm tag mới** | ✅ Hỗ trợ với visual feedback |

**Files sử dụng:**
- [service-form.tsx](file:///e:/Synapse/frontend/src/features/services/components/service-form.tsx#L399-L422)
- [service-filter.tsx](file:///e:/Synapse/frontend/src/features/services/components/service-filter.tsx#L154)

---

## 2. So Sánh Chi Tiết

### Interface Props

```typescript
// SkillSelector - Đặc thù cho Skill
interface SkillSelectorProps {
  skills: Skill[]
  selectedSkillIds: string[]
  onSkillsChange: (skillIds: string[]) => void
  disabled?: boolean
}

// TagInput - Generic, dùng được cho nhiều trường hợp
interface TagInputProps {
  options: TagOption[]           // Generic hơn
  selectedIds: string[]
  newTags: string[]              // Hỗ trợ thêm mới
  onSelectedChange: (ids: string[]) => void
  onNewTagsChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}
```

### Visual Comparison

| Tính năng | SkillSelector | TagInput |
|-----------|---------------|----------|
| Popover width | `w-full` | `w-[400px]` |
| Badge remove button | `<button>` basic | `<div>` với hover states |
| Animation on add/remove | ❌ | ✅ Spring animation |
| Empty state text | "Không tìm thấy..." | "Không tìm thấy..." + Tạo mới option |
| Border radius | Default | `rounded-xl`, `rounded-full` |
| Focus states | Basic ring | Premium ring + shadow |

---

## 3. Vi Phạm Kiến Trúc FSD

> [!WARNING]
> `SkillSelector` nằm trong `features/staff` nhưng lại là một component **có thể tái sử dụng** (reusable). Theo FSD, nó nên được di chuyển vào `shared/ui`.

### Vi phạm cụ thể:

1. **Duplicate Logic**: Cả 2 component đều implement cùng pattern Popover + Command + Badge
2. **Feature-Specific Placement**: `SkillSelector` bị lock trong `staff` feature
3. **Missing Export**: `SkillSelector` không được export qua `index.ts` của staff

---

## 4. Đánh Giá UX/UI Pro Max

### 4.1. Micro-Animations

| Component | Animation | Đánh giá |
|-----------|-----------|----------|
| SkillSelector | Không có | ⚠️ Thiếu feedback khi thêm/xóa item |
| TagInput | Spring animation | ✅ Premium feel |

### 4.2. Hover States

| Component | Hover Effect | Đánh giá |
|-----------|--------------|----------|
| SkillSelector | `hover:text-foreground` only | ⚠️ Minimal |
| TagInput | `hover:bg-black/10`, `hover:bg-secondary/70` | ✅ Rich feedback |

### 4.3. Visual Hierarchy

- **SkillSelector**: Badge đơn giản, không có visual distinction
- **TagInput**: Badge có màu khác biệt cho "mới" (blue) vs "đã chọn" (secondary)

### 4.4. Accessibility

| Tiêu chí | SkillSelector | TagInput |
|----------|---------------|----------|
| `role="combobox"` | ✅ | ✅ |
| `aria-expanded` | ✅ | ✅ |
| Focus ring | Basic | Enhanced |
| Keyboard nav | ✅ | ✅ |

---

## 5. Kế Hoạch Hành Động

### Phương án đề xuất: **Thống nhất sang `TagInput`**

> [!IMPORTANT]
> Di chuyển tất cả nơi sử dụng sang `TagInput` (đã nằm trong `shared/ui`) vì:
> 1. Đã có animations premium
> 2. Interface generic hơn
> 3. Đúng vị trí theo FSD

### Các bước cần thực hiện:

#### Bước 1: Tạo adapter interface (nếu cần)

```typescript
// Wrapper để giữ nguyên API cho Staff nếu không muốn refactor nhiều
function SkillSelectorAdapter({
  skills,
  selectedSkillIds,
  onSkillsChange
}: SkillSelectorProps) {
  const options = skills.map(s => ({ id: s.id, label: s.name }))

  return (
    <TagInput
      options={options}
      selectedIds={selectedSkillIds}
      newTags={[]}
      onSelectedChange={onSkillsChange}
      onNewTagsChange={() => {}}
      placeholder="Chọn kỹ năng..."
    />
  )
}
```

#### Bước 2: Cập nhật các file sử dụng

1. `invite-staff-modal.tsx` - Thay `SkillSelector` → `TagInput`
2. `staff-modal.tsx` - Thay `SkillSelector` → `TagInput`
3. `edit-staff-modal.tsx` - Thay `SkillSelector` → `TagInput`

#### Bước 3: Xóa component không dùng

- Xóa `frontend/src/features/staff/components/skill-selector.tsx`

#### Bước 4: Verify UI consistency

- Kiểm tra animations hoạt động
- Kiểm tra responsive design
- Kiểm tra dark mode

---

## 6. Verification Plan

### Manual Testing

1. **Mở modal "Mời nhân viên" (`/admin/staff`)**
   - Chọn role = "Kỹ thuật viên"
   - Kiểm tra skill selector hiển thị với animations
   - Thêm/xóa skills và xác nhận animations smooth

2. **Mở modal "Thêm nhân viên" (`/admin/staff`)**
   - Tương tự test case trên

3. **Mở modal "Chỉnh sửa nhân viên"**
   - Verify skills đã chọn hiển thị đúng
   - Thêm/xóa skills

4. **So sánh với Service Form (`/admin/services/new`)**
   - Xác nhận UI giống nhau giữa Staff và Services

---

## 7. Kết Luận

Cần chạy workflow `/frontend-refactor` với file báo cáo này để thống nhất 2 component về một, sử dụng `TagInput` làm component chuẩn.

**Ưu tiên:** 🔴 Cao - Ảnh hưởng trực tiếp đến UX consistency
