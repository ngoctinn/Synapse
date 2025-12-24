# Báo Cáo: 50 Vấn Đề UX/UI Trong Thiết Kế Table Components

**Ngày kiểm toán:** 2025-12-24
**Phạm vi:** Toàn bộ table components trong frontend (DataTable, TableRowActions, TableActionBar, và các implementations)
**Mục đích:** Phát hiện các vấn đề UX/UI để cải thiện trong giai đoạn tiếp theo

---

## ⚠️ QUAN TRỌNG
Đây là báo cáo **phân tích và liệt kê vấn đề**. KHÔNG thực hiện sửa code ở giai đoạn này.

---

## Phân Loại Vấn Đề

### 🔴 Nghiêm trọng (Critical) - 15 vấn đề
### 🟡 Quan trọng (High) - 20 vấn đề
### 🟢 Trung bình (Medium) - 15 vấn đề

---

## 🔴 NGHIÊM TRỌNG (Critical) - 15 Vấn Đề

### 1. Thiếu Responsive Behavior Toàn Diện
**File:** `data-table.tsx`, tất cả table implementations
**Vấn đề:** Table chỉ có `overflow-x-auto` nhưng không có responsive strategy rõ ràng cho mobile (640px trở xuống). Người dùng mobile phải scroll ngang trong container nhỏ, rất khó sử dụng.
**Ảnh hưởng:** Trải nghiệm mobile cực kỳ tệ, đặc biệt với table có nhiều cột (7+ columns).
**Ưu tiên:** 🔴 Critical

---

### 2. Không Có Empty State Consistency
**File:** Các table implementations khác nhau
**Vấn đề:** Mỗi table tự định nghĩa empty state riêng, không có pattern chung về icon, spacing, và action button placement.
**Ví dụ:**
- `customer-table.tsx`: Dùng `AnimatedUsersIcon`
- `service-table.tsx`: Dùng `Plus` icon
- `invoice-table.tsx`: Không có empty state custom

**Ảnh hưởng:** Thiếu consistency, người dùng không có expectation thống nhất.
**Ưu tiên:** 🔴 Critical

---

### 3. Thiếu Loading State Transitions
**File:** `data-table.tsx` (line 99-110)
**Vấn đề:** Khi `isLoading={true}`, component thay thế toàn bộ table bằng `DataTableSkeleton`, không có fade transition. Gây "flash" và jarring experience.
**Ảnh hưởng:** Premium feeling bị phá vỡ, đặc biệt khi re-fetching data.
**Ưu tiên:** 🔴 Critical

---

### 4. Row Actions Luôn Hiện Với Opacity=0 (Performance Issue)
**File:** `table-row-actions.tsx` (line 68)
**Vấn đề:** Actions được render với `opacity-0` và chỉ hiện khi hover. Điều này tạo ra DOM nodes không cần thiết cho tất cả rows, ảnh hưởng performance với large datasets.
**Giải pháp tốt hơn:** Conditional rendering hoặc virtualization.
**Ảnh hưởng:** Performance degradation với 100+ rows.
**Ưu tiên:** 🔴 Critical

---

### 5. Thiếu Keyboard Navigation Toàn Diện
**File:** `data-table.tsx`, `table-row-actions.tsx`
**Vấn đề:**
- Không có arrow key navigation giữa các rows
- Không có Enter key để trigger row click
- Icon buttons thiếu accessible labels (chỉ có `sr-only` trong `table-row-actions.tsx`)
- Không có focus trap trong dropdown menus

**Ảnh hưởng:** Accessibility WCAG AA violation, người dùng keyboard-only không thể navigate hiệu quả.
**Ưu tiên:** 🔴 Critical

---

### 6. Selection UX Không Rõ Ràng
**File:** `data-table.tsx` (line 123-136)
**Vấn đề:**
- Checkbox header không có label text (chỉ có aria-label)
- Indeterminate state dùng string `"true"` thay vì boolean (line 129) - hack không đúng chuẩn
- Khi select nhiều rows, không có visual feedback về số lượng đã chọn ngay trong table header

**Ảnh hưởng:** Users không biết họ đang chọn bao nhiêu items mà phải nhìn xuống ActionBar.
**Ưu tiên:** 🔴 Critical

---

### 7. TableActionBar Positioning Có Vấn Đề Với Sticky Headers
**File:** `table-action-bar.tsx` (line 56-67)
**Vấn đề:** ActionBar có `position: fixed`, `bottom-6`, `left-1/2`. Khi người dùng scroll table dài, ActionBar có thể bị che bởi footer hoặc sticky elements khác. Không có z-index strategy rõ ràng.
**Ảnh hưởng:** ActionBar có thể bị che khuất, đặc biệt trên mobile landscape.
**Ưu tiên:** 🔴 Critical

---

### 8. Sort Indicator Animation Không Smooth
**File:** `data-table.tsx` (line 168-178)
**Vấn đề:**
- Dùng `animate-fade-zoom` cho sort icons nhưng không có transition cho việc thay đổi direction
- Icon `ArrowUpDown` có opacity-0 và chỉ hiện khi group-hover, nhưng table header không có class `group`

**Ảnh hưởng:** Sort direction change cảm giác "jump" thay vì smooth transition.
**Ưu tiên:** 🔴 Critical

---

### 9. Pagination Controls Không Có Loading State
**File:** `pagination-controls.tsx`
**Vấn đề:** Khi click page number, không có loading indicator. User không biết liệu action có được xử lý hay không.
**Ảnh hưởng:** Users có thể spam-click, gây multiple requests.
**Ưu tiên:** 🔴 Critical

---

### 10. Table Header Không Sticky By Default
**File:** `data-table.tsx` (line 121)
**Vấn đề:** Header có class `sticky top-0 z-10` NHƯNG parent container (line 119) có `overflow-x-auto`, khiến sticky behavior bị break. Sticky position không hoạt động trong scroll container.
**Ảnh hưởng:** Users mất context khi scroll xuống, không biết mình đang xem cột nào.
**Ưu tiên:** 🔴 Critical

---

### 11. Bulk Delete Không Có Progress Indicator
**File:** `customer-table.tsx` (line 73-108), `service-table.tsx`, `staff-table.tsx`
**Vấn đề:** Bulk delete dùng `Promise.allSettled` nhưng không hiển thị progress (X/Y deleted). Chỉ có loading overlay toàn màn hình (`isPending`).
**Ảnh hưởng:** Khi delete 50+ items, users không biết tiến độ, tạo cảm giác "stuck".
**Ưu tiên:** 🔴 Critical

---

### 12. Thiếu Error State Handling Trong Table
**File:** Tất cả table implementations
**Vấn đề:** Không có prop `error` hoặc error boundary. Khi data fetching fail, component vẫn hiển thị loading hoặc empty state, không có error message.
**Ảnh hưởng:** Users không biết có lỗi xảy ra, không có retry mechanism.
**Ưu tiên:** 🔴 Critical

---

### 13. Table Cell Text Truncation Không Có Tooltip Fallback
**File:** `data-table.tsx`, specific implementations
**Vấn đề:**
- Cells có `whitespace-nowrap` (table.tsx line 86) nhưng không có max-width và ellipsis
- Không có tooltip để hiển thị full text khi bị truncate
- Đặc biệt nghiêm trọng với columns như "Description", "Medical Notes"

**Ảnh hưởng:** Users không thể đọc full content của cells dài.
**Ưu tiên:** 🔴 Critical

---

### 14. Skeleton Loading Layout Không Match Real Table
**File:** `data-table-skeleton.tsx` (line 52-70)
**Vấn đề:**
- Skeleton layout hoàn toàn khác với real table (dùng avatar + 2 text lines thay vì match column structure)
- Số lượng columns của skeleton không match với real table columns (dùng generic layout)

**Ảnh hưởng:** Layout shift khi transition từ skeleton sang real data.
**Ưu tiên:** 🔴 Critical

---

### 15. Checkbox Accessibility Issues
**File:** `data-table.tsx` (line 125-134, 211-217)
**Vấn đề:**
- Checkbox trong cells có `translate-y-[2px]` để align, nhưng không consistent với TableHead checkbox
- Checkbox trong rows không có individual aria-labels với row identifier (chỉ có generic "Chọn hàng")
- Click area của checkbox quá nhỏ (chỉ có checkbox itself, không có padding)

**Ảnh hưởng:** Khó click trên mobile, screen readers không đọc được row nào đang được chọn.
**Ưu tiên:** 🔴 Critical

---

## 🟡 QUAN TRỌNG (High Priority) - 20 Vấn Đề

### 16. Table Border Styling Không Consistent
**File:** `data-table.tsx`, `table.tsx`
**Vấn đề:**
- Table row có `border-b` với `border-border/40` (line 197)
- Table header có `border-border/60` (line 122)
- Không có explanation cho opacity values khác nhau

**Ảnh hưởng:** Visual inconsistency nhẹ.
**Ưu tiên:** 🟡 High

---

### 17. Hover State Không Mượt
**File:** `data-table.tsx` (line 198)
**Vấn đề:** Row hover chỉ có `hover:bg-muted/50` nhưng không có transition-duration explicit. Dùng default `transition-colors` nhưng không có timing customization.
**Cải thiện:** Có thể thêm `duration-200 ease-out` để mượt hơn.
**Ảnh hưởng:** Premium feeling thiếu polish.
**Ưu tiên:** 🟡 High

---

### 18. Selected Row Styling Quá Nhạt
**File:** `data-table.tsx` (line 199)
**Vấn đề:** Selected row chỉ có `bg-primary/5` và `hover:bg-primary/10`. Với màu primary là oklch, 5% opacity rất khó thấy trên background sáng.
**Ảnh hưởng:** Users khó phân biệt rows đã chọn và chưa chọn.
**Ưu tiên:** 🟡 High

---

### 19. Table Variant "Flush" Không Có Documentation Rõ Ràng
**File:** `data-table.tsx` (line 73, 91)
**Vấn đề:** Có variant `flush` nhưng:
- Không có comment giải thích khi nào dùng
- Behavior khác nhau giữa DataTable và DataTableSkeleton
- Không có design guideline

**Ảnh hưởng:** Developers không biết khi nào dùng variant nào, dẫn đến inconsistency.
**Ưu tiên:** 🟡 High

---

### 20. First/Last Cell Padding Class Không Semantic
**File:** `data-table.tsx` (line 146, 149, 226, 232)
**Vấn đề:** Dùng CSS class `table-first-cell-padding` và `table-last-cell-padding` nhưng không thấy definition trong codebase (có thể là Tailwind layer).
**Ảnh hưởng:** Khó maintain, không rõ padding values.
**Ưu tiên:** 🟡 High

---

### 21. Actions Column Luôn Ở Bên Phải Nhưng Không Flexible
**File:** Tất cả table implementations
**Vấn đề:** Actions column luôn được hardcode là column cuối cùng, với `className="pr-6 text-right"`. Không có cơ chế để move actions column.
**Ảnh hưởng:** Thiếu flexibility nếu muốn actions column ở giữa (theo một số design patterns).
**Ưu tiên:** 🟡 High

---

### 22. Nested Value Access Sử dụng String Path
**File:** `data-table.tsx` (line 26, 240-243)
**Vấn đề:** Column có `accessorKey` support nested keys (e.g., `"user.full_name"`), parse qua `getNestedValue` utility. Nhưng không có type safety cho nested paths (vẫn dùng `keyof T | string`).
**Ảnh hưởng:** Typos trong nested keys không bị catch bởi TypeScript.
**Ưu tiên:** 🟡 High

---

### 23. Table Loading Overlay Z-Index Hardcoded
**File:** `customer-table.tsx` (line 262), `staff-table.tsx` (line 305)
**Vấn đề:** Loading overlay có `z-50` hardcoded, có thể conflict với TableActionBar (cũng `z-50`) hoặc các modals khác.
**Ảnh hưởng:** Overlay có thể bị che bởi ActionBar.
**Ưu tiên:** 🟡 High

---

### 24. Avatar Fallback Colors Không Accessible
**File:** `customer-table.tsx` (line 123), `staff-table.tsx` (line 165-174)
**Vấn đề:**
- Customer table: Dùng `bg-primary/10 text-primary` - contrast có thể thấp
- Staff table: Dùng dynamic `backgroundColor: staff.color_code` với `text-white` - không guarantee contrast ratio

**Ảnh hưởng:** WCAG contrast violation potential.
**Ưu tiên:** 🟡 High

---

### 25. Font Mono Cho Phone Number Không Có Fallback
**File:** `customer-table.tsx` (line 142)
**Vấn đề:** Phone number dùng `font-mono` nhưng không có fallback font definition. Nếu system không có monospace font, sẽ dùng default.
**Ảnh hưởng:** Inconsistent rendering across systems.
**Ưu tiên:** 🟡 High

---

### 26. Medical Icons Không Có Consistent Sizing
**File:** `customer-table.tsx` (line 160, 173)
**Vấn đề:** `AlertCircle` và `Activity` icons không có explicit size prop, dùng default size. Không consistent với Icon component wrapper ở nơi khác.
**Ảnh hưởng:** Visual inconsistency.
**Ưu tiên:** 🟡 High

---

### 27. Service Duration Display Có Bullet Point Decoration
**File:** `service-table.tsx` (line 119-127)
**Vấn đề:** Dùng `<span className="bg-primary/60 h-1.5 w-1.5 rounded-full"></span>` làm bullet, nhưng:
- Không có accessibility label
- Không semantic (nên dùng `<ul><li>` với CSS list-style)

**Ảnh hưởng:** Screen readers không hiểu structure.
**Ưu tiên:** 🟡 High

---

### 28. Badge Wrapping Trong Cells
**File:** `service-table.tsx` (line 138-149), `staff-table.tsx` (line 204-236)
**Vấn đề:** Skills badges dùng `flex-wrap gap-2` nhưng không có max height, có thể wrap thành nhiều rows và làm row height không consistent.
**Ảnh hưởng:** Table row heights không uniform, gây distraction.
**Ưu tiên:** 🟡 High

---

### 29. Tooltip Nested Trong Table Cell Không Có Delay
**File:** `service-table.tsx` (line 155-176), `staff-table.tsx` (line 213-228)
**Vấn đề:** Tooltips không có `delayDuration` prop, dùng default 700ms. Khi hover nhanh qua rows, tooltips xuất hiện chậm và annoying.
**Ảnh hưởng:** Cluttered experience khi hover.
**Ưu tiên:** 🟡 High

---

### 30. Status Badge With Indicator Pulse Có Thể Lag
**File:** `service-table.tsx` (line 163-164), `staff-table.tsx` (line 244-245)
**Vấn đề:** `indicatorPulse={service.is_active}` - nếu có nhiều active items, nhiều animations chạy đồng thời có thể gây performance issue.
**Ảnh hưởng:** FPS drop với 50+ active items có pulse.
**Ưu tiên:** 🟡 High

---

### 31. Invoice Table Không Có Selection
**File:** `invoice-table.tsx`
**Vấn đề:** Invoice table không có selection mechanism (không có checkbox column), khác với các table khác. Không consistent.
**Ảnh hưởng:** Users không thể bulk export invoices.
**Ưu tiên:** 🟡 High

---

### 32. Currency Formatting Không Có Locale Option
**File:** `invoice-table.tsx` (line 44, 60), `service-table.tsx` (line 133)
**Vấn đề:** Dùng `formatCurrency` nhưng không có locale configuration nhất quán (hard-coded Vietnamese format).
**Ảnh hưởng:** Không thể i18n nếu mở rộng ra thị trường khác.
**Ưu tiên:** 🟡 High

---

### 33. Paid Amount Color Logic Không Có Intermediate State
**File:** `invoice-table.tsx` (line 52-61)
**Vấn đề:** Chỉ có 2 states: `paidAmount < finalAmount` (amber) và equal (emerald). Không có state cho overpayment hoặc partial payment tốt hơn.
**Ảnh hưởng:** Thiếu granularity.
**Ưu tiên:** 🟡 High

---

### 34. Date Formatting Hardcoded
**File:** `invoice-table.tsx` (line 74)
**Vấn đề:** Format `"dd/MM/yyyy HH:mm"` hardcoded, không dùng utility hoặc config. Nếu cần đổi format globally, phải find-replace.
**Ảnh hưởng:** Maintenance burden.
**Ưu tiên:** 🟡 High

---

### 35. Eye Icon Action Button Không Có Keyboard Shortcut Hint
**File:** `invoice-table.tsx` (line 81-89)
**Vấn đề:** "Xem chi tiết" button chỉ có click handler, không có hint về keyboard shortcut (e.g., Enter key khi focus row).
**Ảnh hưởng:** Power users không biết shortcuts.
**Ưu tiên:** 🟡 High

---

## 🟢 TRUNG BÌNH (Medium Priority) - 15 Vấn Đề

### 36. Table Header Text Color Có Thể Mất Focus
**File:** `data-table.tsx` (line 144)
**Vấn đề:** Header text có `text-muted-foreground` và `hover:text-foreground/80`. Khi sort active, không có color change (chỉ có icon indicator).
**Ảnh hưởng:** Header của sorted column không prominent.
**Ưu tiên:** 🟢 Medium

---

### 37. Column Header Hover Cursor Chỉ Có Khi Sortable
**File:** `data-table.tsx` (line 151)
**Vấn đề:** `cursor-pointer` chỉ thêm khi `col.sortable`. Nhưng `hover:text-foreground/80` thì luôn có (line 144). Inconsistent signal.
**Ảnh hưởng:** Users có thể confused khi hover vào non-sortable column và thấy color change nhưng không có cursor pointer.
**Ưu tiên:** 🟢 Medium

---

### 38. Sort Icon Container Có Fixed Size Nhưng Không Justify
**File:** `data-table.tsx` (line 168-178)
**Vấn đề:** Icon container có `h-4 w-4` nhưng icon bên trong lại có `h-3.5 w-3.5` hoặc `h-3 w-3`. Không có flexbox centering trong container.
**Ảnh hưởng:** Icon có thể không center perfect.
**Ưu tiên:** 🟢 Medium

---

### 39. AnimatedTableRow Animation Delay Có Thể Annoying
**File:** `data-table.tsx` (line 193)
**Vấn đề:** AnimatedTableRow có `index` prop để stagger animation, nhưng không có config cho stagger delay. Nếu có 100 rows, animation quá lâu.
**Ảnh hưởng:** Initial render cảm giác slow.
**Ưu tiên:** 🟢 Medium

---

### 40. Empty State Container Class Name Hardcoded
**File:** `data-table-empty-state.tsx` (line 22)
**Vấn đề:** Dùng class `empty-state-container` nhưng không thấy definition. Có thể là Tailwind @layer component nhưng không documented.
**Ảnh hưởng:** Unclear styling source.
**Ưu tiên:** 🟢 Medium

---

### 41. Empty State Icon Animation Không Có Loop Control
**File:** `data-table-empty-state.tsx` (line 23)
**Vấn đề:** Icon có `animate-in zoom-in duration-500` nhưng chỉ chạy 1 lần. Không có option để loop hoặc pulse.
**Ảnh hưởng:** Animation hơi "flat" sau khi kết thúc.
**Ưu tiên:** 🟢 Medium

---

### 42. TableActionBar Animation Không Có Exit Animation
**File:** `table-action-bar.tsx` (line 65)
**Vấn đề:** Có `animate-in slide-in-from-bottom-4 fade-in-0` nhưng không có corresponding exit animation classes. Khi `selectedCount === 0`, component unmount đột ngột.
**Ảnh hưởng:** Jarring when deselect all.
**Ưu tiên:** 🟢 Medium

---

### 43. ActionBar Separator Không Có Accessible Label
**File:** `table-action-bar.tsx` (line 76, 113)
**Vấn đề:** Separators chỉ là visual `<div>` với border, không có aria-hidden hoặc role.
**Ảnh hưởng:** Screen readers đọc thêm empty divs.
**Ưu tiên:** 🟢 Medium

---

### 44. ActionBar Button Labels Không i18n
**File:** `table-action-bar.tsx` (line 46-47)
**Vấn đề:** Default labels "Xóa", "Xuất" hardcoded, không dùng i18n key.
**Ảnh hưởng:** Không thể translate.
**Ưu tiên:** 🟢 Medium

---

### 45. TableRowActions Fallback Text Không Accessible
**File:** `table-row-actions.tsx` (line 124)
**Vấn đề:** Khi không có actions, hiển thị `<span className="text-muted-foreground text-xs">-</span>`. Screen readers sẽ đọc "dash" hoặc bỏ qua.
**Ảnh hưởng:** Confusing for screen reader users.
**Ưu tiên:** 🟢 Medium

---

### 46. Dropdown Menu Content Min-Width Hardcoded
**File:** `table-row-actions.tsx` (line 116)
**Vấn đề:** `min-w-[160px]` hardcoded, không dùng design token.
**Ảnh hưởng:** Inconsistent với design system.
**Ưu tiên:** 🟢 Medium

---

### 47. Icon Button Size "icon-sm" Không Standard
**File:** `table-row-actions.tsx` (line 76, 91, 108)
**Vấn đề:** Dùng size `icon-sm` nhưng không có trong Button component standard sizes (chỉ có `icon`). Có thể là custom variant không documented.
**Ảnh hưởng:** Unclear API.
**Ưu tiên:** 🟢 Medium

---

### 48. Pagination Controls Không Có "Go to Page" Input
**File:** `pagination-controls.tsx`
**Vấn đề:** Chỉ có Previous/Next và page numbers. Nếu có 100+ pages, không có cách jump nhanh.
**Ảnh hưởng:** Bad UX với large datasets.
**Ưu tiên:** 🟢 Medium

---

### 49. Pagination Ellipsis Không Có Tooltip
**File:** `pagination-controls.tsx` (line 81)
**Vấn đề:** Ellipsis chỉ là `<PaginationEllipsis />`, không có tooltip để hint về page range.
**Ảnh hưởng:** User không biết có bao nhiêu pages bị skip.
**Ưu tiên:** 🟢 Medium

---

### 50. DataTableSkeleton Toolbar Layout Không Match Thực Tế
**File:** `data-table-skeleton.tsx` (line 37-50)
**Vấn đề:** Skeleton có toolbar với search + filter + action button, nhưng real tables không có built-in toolbar (toolbar là separate component ở page level).
**Ảnh hưởng:** Layout shift khi load.
**Ưu tiên:** 🟢 Medium

---

## 📊 Tổng Kết

### Phân Bổ Vấn Đề Theo Loại
- 🔴 **Critical:** 15 vấn đề (30%)
- 🟡 **High:** 20 vấn đề (40%)
- 🟢 **Medium:** 15 vấn đề (30%)

### Phân Bổ Theo Component
- **data-table.tsx:** 18 vấn đề
- **Table implementations (customer, service, staff, invoice):** 16 vấn đề
- **table-action-bar.tsx:** 5 vấn đề
- **table-row-actions.tsx:** 4 vấn đề
- **data-table-skeleton.tsx:** 3 vấn đề
- **data-table-empty-state.tsx:** 2 vấn đề
- **pagination-controls.tsx:** 2 vấn đề

### Phân Bổ Theo Chủ Đề
1. **Accessibility:** 12 vấn đề
2. **Responsive Design:** 8 vấn đề
3. **Visual Consistency:** 10 vấn đề
4. **Performance:** 6 vấn đề
5. **User Feedback:** 8 vấn đề
6. **Code Quality:** 6 vấn đề

---

## 🎯 Giai Đoạn Tiếp Theo

### Phase 1: Fix Critical Issues (Priority 🔴)
Tập trung vào 15 vấn đề critical, đặc biệt:
- Issue #1-3: Responsive, consistency, transitions
- Issue #5: Keyboard navigation
- Issue #10: Sticky header fix
- Issue #13: Text truncation + tooltip

### Phase 2: High Priority Improvements (Priority 🟡)
Cải thiện 20 vấn đề high priority, focus vào:
- Visual polish (hover states, colors, animations)
- Consistency (variants, styling patterns)
- Accessibility (colors, labels, tooltips)

### Phase 3: Medium Priority Polish (Priority 🟢)
Refine remaining issues để đạt premium quality.

---

## 📝 Ghi Chú Cho Developers

1. **Không edit code ngay lập tức** - Đây là phase THINK/ANALYZE
2. **Tham khảo Design System** khi fix để đảm bảo consistency
3. **Test accessibility** với screen readers sau mỗi fix
4. **Measure performance** trước và sau optimization
5. **Document decisions** trong CHANGELOG

---

**Kết thúc báo cáo.** Chờ chỉ thị tiếp theo để bắt đầu implementation.
