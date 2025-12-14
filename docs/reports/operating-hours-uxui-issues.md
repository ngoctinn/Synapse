# BÁO CÁO ĐÁNH GIÁ UX/UI: TÍNH NĂNG GIỜ HOẠT ĐỘNG (Operating Hours)

**Ngày đánh giá:** 2025-12-14
**Người đánh giá:** Chuyên gia UX/UI
**Phạm vi:** `frontend/src/features/settings/operating-hours`
**Mức độ nghiêm trọng:** 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Low

---

## 🎉 TRẠNG THÁI REFACTOR (Cập nhật 2025-12-14 14:30)

### Đã Fix (Phase 1 + 2)

| ID | Vấn đề | File được sửa | Trạng thái |
|----|--------|---------------|------------|
| **E1** | Không kiểm tra Overlap time slots | `constants.ts`, `day-row.tsx` | ✅ DONE |
| **E2** | Không kiểm tra trùng lặp Exception | `exception-sheet.tsx`, `exceptions-panel.tsx` | ✅ DONE |
| **C1** | Exception Sheet tự định nghĩa FormField | `exception-sheet.tsx` | ✅ DONE |
| **C2** | EXCEPTION_TYPE_LABELS trùng lặp | `constants.ts`, `exceptions-panel.tsx` | ✅ DONE |
| **C4** | Icon Send không semantic | `exception-sheet.tsx` | ✅ DONE |

### Chi tiết thay đổi

1. **`constants.ts`** (Mới mở rộng)
   - Thêm `EXCEPTION_TYPE_LABELS` và `EXCEPTION_TYPE_VARIANTS` (centralized)
   - Thêm utility functions: `timeToMinutes()`, `checkTimeSlotOverlap()`, `isValidTimeSlot()`, `findOverlappingSlots()`, `validateTimeSlots()`

2. **`day-row.tsx`**
   - Thêm validation overlap bằng `useMemo` và `validateTimeSlots()`
   - Hiển thị warning message khi có overlap (với AlertTriangle icon)
   - Truyền `hasOverlap` prop vào `TimeRangeInput`

3. **`time-range-input.tsx`** (Shared UI)
   - Thêm prop `hasOverlap` để hiển thị visual indicator khi slot overlap

4. **`exception-sheet.tsx`** (Viết lại hoàn toàn)
   - Sử dụng `Field`, `FieldLabel`, `FieldDescription`, `FieldError` từ shared
   - Thêm prop `existingExceptions` để check duplicate
   - Thêm `duplicateCheck` useMemo để validate duplicate date
   - Hiển thị error message rõ ràng khi chọn ngày đã có ngoại lệ
   - Thay icon `Send` bằng `Plus` cho semantic đúng

5. **`exceptions-panel.tsx`**
   - Import `EXCEPTION_TYPE_LABELS`, `EXCEPTION_TYPE_VARIANTS` từ constants
   - Truyền `existingExceptions={exceptions}` vào `ExceptionSheet`

6. **`types.ts`**
   - Thêm interface `ExceptionValidationResult`

7. **`index.ts`**
   - Export thêm constants và utilities

---

## 1. TỔNG QUAN TÍNH NĂNG

### 1.1. Cấu trúc Component
```
operating-hours/
├── weekly-schedule.tsx      # Quản lý lịch 7 ngày
├── day-row.tsx              # Hiển thị 1 ngày với toggle và time slots
├── exceptions-panel.tsx     # Quản lý ngày ngoại lệ
├── exception-sheet.tsx      # Form thêm/sửa ngoại lệ (Sheet)
├── time-range-input.tsx     # Component chọn khoảng thời gian (shared)
├── time-picker.tsx          # Component chọn giờ (shared)
├── types.ts                 # Type definitions
└── constants.ts             # Giá trị mặc định
```

### 1.2. Luồng người dùng chính
1. **Quản trị viên** truy cập tab "Lịch làm việc" → Chỉnh sửa giờ hoạt động từng ngày
2. **Quản trị viên** truy cập tab "Ngày ngoại lệ" → Thêm/Sửa/Xóa ngày nghỉ lễ hoặc giờ đặc biệt

---

## 2. DANH MỤC VẤN ĐỀ UX/UI

### 2.1. NHÓM A: VẤN ĐỀ TƯƠNG TÁC (Interaction Issues)

#### 🟠 A1. Copy Mode thiếu Affordance rõ ràng (Floating Action Bar)
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `weekly-schedule.tsx` (dòng 104-136) |
| **Bản chất** | Floating Action Bar xuất hiện ở đáy màn hình khi người dùng vào "copy mode", nhưng thiếu liên kết trực quan với hành động gốc |
| **Nguyên nhân** | Action Bar được render ở vị trí cố định (`fixed bottom-6`) và không có visual indicator nào chỉ về nguồn copy (DayRow đang được copy) |
| **Tác động** | Người dùng mới có thể không nhận ra mối quan hệ giữa ngày được chọn và thanh hành động, gây nhầm lẫn |
| **Mức độ** | 🟠 High |

#### 🟡 A2. Thiếu Visual Feedback khi Paste thành công/thất bại
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `day-row.tsx` (dòng 87-103) |
| **Bản chất** | Khi nhấn "Dán", chỉ có Toast thông báo, không có micro-animation trên DayRow đích |
| **Nguyên nhân** | Thiếu animation state transition sau khi paste thành công (ví dụ: flash highlight, shake animation) |
| **Tác động** | Người dùng khó nhận biết thay đổi đã xảy ra, đặc biệt khi paste lên ngày có cấu hình tương tự |
| **Mức độ** | 🟡 Medium |

#### 🟡 A3. Nút "Sao chép" và "Dán" thiếu Keyboard Shortcut
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `day-row.tsx`, `weekly-schedule.tsx` |
| **Bản chất** | Copy/Paste chỉ hoạt động qua click chuột, không hỗ trợ phím tắt quen thuộc |
| **Nguyên nhân** | Không có handler cho Ctrl+C / Ctrl+V |
| **Tác động** | Giảm hiệu suất thao tác cho Power User, thiếu Accessibility |
| **Mức độ** | 🟡 Medium |

#### 🔵 A4. TimePicker không cho phép nhập trực tiếp
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `time-picker.tsx` (dòng 62-80) |
| **Bản chất** | Input field được set `readOnly`, bắt buộc người dùng phải chọn từ Popover |
| **Nguyên nhân** | Design pattern hiện tại ưu tiên chọn từ danh sách cuộn |
| **Tác động** | Chậm hơn so với nhập trực tiếp "14:00" nếu người dùng đã biết giá trị cần nhập |
| **Mức độ** | 🔵 Low |

#### 🟠 A5. Không có Undo/Redo cho thay đổi cấu hình
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `settings-page.tsx` |
| **Bản chất** | Khi chỉnh sửa lịch tuần, không có cách hoàn tác từng bước (chỉ có "Khôi phục" về cấu hình ban đầu) |
| **Nguyên nhân** | State management không lưu history |
| **Tác động** | Người dùng mất kiểm soát nếu thao tác sai, phải nhớ cấu hình cũ hoặc reset toàn bộ |
| **Mức độ** | 🟠 High |

#### 🟡 A6. Exception Sheet thiếu Validation Real-time
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exception-sheet.tsx` (dòng 134-135) |
| **Bản chất** | Chỉ kiểm tra `date && reason.trim().length > 0`, không hiển thị lỗi inline (required field) |
| **Nguyên nhân** | Sử dụng state thủ công, không dùng React Hook Form hoặc validation schema |
| **Tác động** | Người dùng không biết field nào bắt buộc cho đến khi nhấn Submit |
| **Mức độ** | 🟡 Medium |

---

### 2.2. NHÓM B: VẤN ĐỀ THỊ GIÁC (Visual Issues)

#### 🟡 B1. TimeRangeInput thiếu Label cho Accessibility
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `time-range-input.tsx` |
| **Bản chất** | 2 TimePicker (start, end) không có `aria-label` hoặc `<Label>` liên kết |
| **Nguyên nhân** | Component được thiết kế compact, bỏ qua a11y |
| **Tác động** | Screen reader không thể phân biệt "Giờ bắt đầu" và "Giờ kết thúc" |
| **Mức độ** | 🟡 Medium |

#### 🔵 B2. DayRow "Đóng cửa" sử dụng màu quá nhạt
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `day-row.tsx` (dòng 194-199) |
| **Bản chất** | Badge "Đóng cửa" dùng `text-muted-foreground/70` và `bg-muted/30`, khó đọc trên màn hình sáng |
| **Nguyên nhân** | Thiếu kiểm tra contrast ratio |
| **Tác động** | Không đạt WCAG AA (4.5:1 contrast ratio) |
| **Mức độ** | 🔵 Low |

#### 🟡 B3. Mini Calendar trong ExceptionsPanel bị ẩn trên Tablet (md breakpoint)
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exceptions-panel.tsx` (dòng 211) |
| **Bản chất** | Sử dụng `hidden xl:block`, nghĩa là Calendar chỉ hiển thị từ 1280px trở lên |
| **Nguyên nhân** | Breakpoint được chọn quá cao, bỏ sót màn hình 1024-1279px |
| **Tác động** | Người dùng iPad Pro hoặc laptop nhỏ không thấy Calendar overview |
| **Mức độ** | 🟡 Medium |

#### 🔵 B4. Exception type Badge quá nhỏ
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exceptions-panel.tsx` (dòng 167) |
| **Bản chất** | Badge dùng `text-[10px]`, quá nhỏ để đọc nhanh |
| **Nguyên nhân** | Thiết kế ưu tiên compact hơn legibility |
| **Tác động** | Khó phân biệt loại ngoại lệ (Lễ, Bảo trì, Đặc biệt) trong danh sách dài |
| **Mức độ** | 🔵 Low |

#### 🟡 B5. Floating Action Bar che khuất nội dung dưới cùng
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `weekly-schedule.tsx` (dòng 106) |
| **Bản chất** | Bar dùng `fixed bottom-6`, che mất DayRow cuối (Chủ Nhật) khi scroll xuống |
| **Nguyên nhân** | Không có logic điều chỉnh scroll padding khi bar xuất hiện |
| **Tác động** | Người dùng phải scroll thêm để thấy ngày cuối trong copy mode |
| **Mức độ** | 🟡 Medium |

---

### 2.3. NHÓM C: VẤN ĐỀ NHẤT QUÁN THIẾT KẾ (Consistency Issues)

#### 🟠 C1. Exception Sheet tự định nghĩa FormField riêng
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exception-sheet.tsx` (dòng 49-68) |
| **Bản chất** | Tạo component `FormField` inline thay vì dùng `@/shared/ui/field` hoặc React Hook Form |
| **Nguyên nhân** | Tránh dependency, nhưng gây inconsistency |
| **Tác động** | Khác biệt về spacing, styling, và behavior so với các Sheet khác (ServiceSheet, StaffSheet) |
| **Mức độ** | 🟠 High |

#### 🟡 C2. EXCEPTION_TYPE_LABELS định nghĩa trùng lặp
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exception-sheet.tsx` (dòng 42-47), `exceptions-panel.tsx` (dòng 28-33) |
| **Bản chất** | Cùng một object `EXCEPTION_TYPE_LABELS` nhưng viết 2 lần |
| **Nguyên nhân** | Thiếu centralization trong `types.ts` hoặc `constants.ts` |
| **Tác động** | Khó maintain, dễ sai lệch khi thêm loại mới |
| **Mức độ** | 🟡 Medium |

#### 🟡 C3. Thiếu Empty State đẹp cho Weekly Schedule
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `weekly-schedule.tsx` |
| **Bản chất** | Không có trường hợp danh sách 7 ngày đều "đóng cửa" được xử lý đặc biệt |
| **Nguyên nhân** | UI không cảnh báo nếu tất cả ngày đều off |
| **Tác động** | Người dùng có thể vô tình tắt hết ngày mà không nhận ra |
| **Mức độ** | 🟡 Medium |

#### 🔵 C4. Icon Save vs Send không nhất quán
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exception-sheet.tsx` (dòng 237) |
| **Bản chất** | Dùng `<Send>` icon cho "Thêm ngày" và `<Save>` cho "Cập nhật" |
| **Nguyên nhân** | Semantic không rõ ràng - "Send" thường dùng cho email/message |
| **Tác động** | Gây nhầm lẫn về ngữ nghĩa hành động |
| **Mức độ** | 🔵 Low |

#### 🟡 C5. Tab "Ngày ngoại lệ" không có Header Actions giống tab "Lịch làm việc"
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `settings-page.tsx` (dòng 157-195) |
| **Bản chất** | Tab "Lịch làm việc" có nút "Lưu thay đổi" + "Khôi phục" ở header, tab "Ngày ngoại lệ" không có |
| **Nguyên nhân** | Exceptions được auto-save, nhưng UX không consistent |
| **Tác động** | Người dùng không biết exceptions đã được tự động lưu hay chưa |
| **Mức độ** | 🟡 Medium |

---

### 2.4. NHÓM D: VẤN ĐỀ RESPONSIVE (Responsive Issues)

#### 🟠 D1. DayRow Grid bị vỡ trên màn hình nhỏ
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `day-row.tsx` (dòng 127-128) |
| **Bản chất** | Sử dụng `grid-cols-1 md:grid-cols-[200px_1fr_auto]`, trên mobile (<768px) tất cả xếp chồng |
| **Nguyên nhân** | Thiếu xử lý cho khoảng giữa (sm: 640-767px) |
| **Tác động** | Trên tablet portrait, TimeRangeInputs và Actions button chen lấn không gọn gàng |
| **Mức độ** | 🟠 High |

#### 🟡 D2. TimeRangeInput quá rộng trên mobile
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `time-range-input.tsx` |
| **Bản chất** | Mỗi TimePicker có `w-[100px]` cố định, TimeRangeInput chiếm khoảng 220px |
| **Nguyên nhân** | Không có breakpoint responsive cho width |
| **Tác động** | Trên màn hình 320px, multiple time slots bị overflow |
| **Mức độ** | 🟡 Medium |

#### 🟡 D3. ExceptionsPanel không tối ưu cho Stack View (mobile)
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exceptions-panel.tsx` (dòng 125) |
| **Bản chất** | Sử dụng `flex-col xl:flex-row`, nghĩa là dưới 1280px đều là stack |
| **Nguyên nhân** | Thiếu breakpoint lg (1024px) để hiển thị 2 cột |
| **Tác động** | Lãng phí không gian ngang trên màn hình 1024-1279px |
| **Mức độ** | 🟡 Medium |

#### 🔵 D4. Header Actions ẩn text trên mobile
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `settings-page.tsx` (dòng 177) |
| **Bản chất** | Nút "Khôi phục" dùng `hidden sm:inline` cho text, chỉ hiện icon trên <640px |
| **Nguyên nhân** | Thiết kế tiết kiệm không gian |
| **Tác động** | Người dùng mobile có thể không hiểu ý nghĩa icon RotateCcw nếu không di chuột |
| **Mức độ** | 🔵 Low |

---

### 2.5. NHÓM E: VẤN ĐỀ LOGIC NGHIỆP VỤ (Business Logic Issues)

#### 🔴 E1. Không kiểm tra Overlap giữa các Time Slots
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `day-row.tsx` (hàm `addSlot`, dòng 56-62) |
| **Bản chất** | Khi thêm ca mới, không kiểm tra xem ca mới có chồng lấn với ca cũ không |
| **Nguyên nhân** | Thiếu validation logic |
| **Tác động** | Người dùng có thể tạo lịch không hợp lệ (VD: 08:00-12:00 và 10:00-15:00) mà không bị cảnh báo |
| **Mức độ** | 🔴 Critical |

#### 🔴 E2. Không kiểm tra trùng lặp Exception Date
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `exception-sheet.tsx` (hàm `handleSubmit`, dòng 111-132) |
| **Bản chất** | Cho phép thêm nhiều exception cho cùng một ngày |
| **Nguyên nhân** | Thiếu check duplicate trong logic save |
| **Tác động** | Dữ liệu bị conflict, hệ thống không biết áp dụng exception nào |
| **Mức độ** | 🔴 Critical |

#### 🟠 E3. TimeRangeInput chỉ validate start >= end, không validate tổng hợp
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `time-range-input.tsx` (dòng 27-28) |
| **Bản chất** | Chỉ kiểm tra `startTime >= endTime` là invalid, không có message cụ thể |
| **Nguyên nhân** | Simple validation |
| **Tác động** | Người dùng không biết cần sửa gì (start quá lớn hay end quá nhỏ?) |
| **Mức độ** | 🟠 High |

#### 🟡 E4. Không có Confirmation khi xóa Time Slot cuối cùng
| Thuộc tính | Giá trị |
|------------|---------|
| **File** | `day-row.tsx` (dòng 65-69) |
| **Bản chất** | Logic `if (day.timeSlots.length <= 1) return;` âm thầm block xóa, không thông báo |
| **Nguyên nhân** | Silent fail |
| **Tác động** | Người dùng nhấn xóa nhưng không thấy gì xảy ra, gây bối rối |
| **Mức độ** | 🟡 Medium |

---

## 3. TỔNG HỢP VÀ ƯU TIÊN

### 3.1. Thống kê theo mức độ
| Mức độ | Số lượng | Tỷ lệ |
|--------|----------|-------|
| 🔴 Critical | 2 | 9% |
| 🟠 High | 6 | 27% |
| 🟡 Medium | 12 | 55% |
| 🔵 Low | 6 | 27% |
| **Tổng** | **22** | **100%** |

### 3.2. Ma trận ưu tiên (Impact vs Effort)

```
         HIGH IMPACT
              │
    ┌─────────┼─────────┐
    │ E1, E2  │  A1, D1 │  ← FIX FIRST
    │ A5      │  C1     │
    ├─────────┼─────────┤
    │         │         │
    │ B5, C3  │  B3, D3 │  ← FIX LATER
    │ E3, A6  │  C5     │
    └─────────┴─────────┘
    LOW EFFORT   HIGH EFFORT
```

### 3.3. Roadmap đề xuất

| Phase | Thời gian | Issues |
|-------|-----------|--------|
| **Phase 1: Critical** | 1-2 ngày | E1, E2 (Time Overlap, Duplicate Exception) |
| **Phase 2: High Priority** | 2-3 ngày | A5, D1, C1, A1, E3 |
| **Phase 3: Medium Priority** | 3-4 ngày | A2, A3, A6, B1, B3, B5, C2, C3, C5, D2, D3, E4 |
| **Phase 4: Polish** | 1 ngày | A4, B2, B4, C4, D4 |

---

## 4. KẾT LUẬN

Tính năng **Operating Hours** có nền tảng UI tốt với thiết kế hiện đại (card-based, responsive grid, floating action bar). Tuy nhiên, tồn tại nhiều vấn đề về:

1. **Validation nghiệp vụ** (🔴 Critical): Thiếu kiểm tra overlap time slots và trùng lặp exception dates
2. **Nhất quán thiết kế** (🟠 High): FormField tự định nghĩa, thiếu undo/redo
3. **Responsive** (🟠 High): DayRow không tối ưu cho tablet
4. **Accessibility** (🟡 Medium): Thiếu ARIA labels, keyboard shortcuts

Ưu tiên fix **Phase 1** ngay lập tức để đảm bảo data integrity trước khi deploy production.
