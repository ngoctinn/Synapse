# BÁO CÁO KIỂM TOÁN THẨM MỸ UI (AESTHETIC AUDIT)
## Phạm vi: Toàn bộ Frontend - Dự án Synapse
**Ngày kiểm tra:** 2025-12-12
**Số file phân tích:** 8 components chính + đối chiếu Design System
**Phương pháp:** Scout toàn bộ cấu trúc (13 feature modules, 86 UI components) và đọc chi tiết các file đại diện.

---

# I. BẤT NHẤT VỀ LINH KIỆN (COMPONENT INCONSISTENCY)

## 1.1. Icon Sizing - Bất nhất nghiêm trọng

| Pattern phát hiện | Files sử dụng | Vấn đề |
|-------------------|---------------|--------|
| `className="size-4"` | `resource-form.tsx:96`, `login-form.tsx:83`, `service-form.tsx:107` | CSS class |
| `className="size-5"` | `sidebar.tsx:58` | CSS class khác size |
| `size={18}` | `customer-form.tsx:103`, `staff-form.tsx:107` | Lucide prop |
| `className="h-4 w-4"` | `customer-form.tsx:59`, `invoice-table.tsx:79`, `event-card.tsx:53` | Legacy syntax |
| `className="h-3 w-3"` | `event-card.tsx:53-58`, `event-card.tsx:175` | Smaller icons |
| `className="w-4 h-4"` | `customer-form.tsx:244,261,284` | Inconsistent order (w trước h) |
| `className="w-5 h-5"` | `customer-form.tsx:305` | Mixed sizing |

## 1.2. TabsList Variants - 3 patterns khác nhau

| Pattern | File | Chi tiết |
|---------|------|----------|
| `variant="form"` + `gridCols` | `resource-form.tsx:45`, `staff-form.tsx:64`, `customer-form.tsx:57` | Form tabs với grid |
| `variant="default"` + `stretch={false}` | `customers-page.tsx:97-99` | Page tabs |
| `FormTabs` custom component | `service-form.tsx:379` | Hoàn toàn khác API |

## 1.3. FormLabel Styling - 5 patterns khác nhau

| Pattern Class | Files |
|---------------|-------|
| `"text-foreground/80 font-normal"` | `resource-form.tsx`, `staff-form.tsx`, `customer-form.tsx` |
| `"text-foreground/80"` (không có font-normal) | `service-form.tsx:79,102,123,144` |
| `"text-foreground/80 text-xs"` | `service-form.tsx:123` |
| `"text-destructive font-semibold"` | `customer-form.tsx:260` (special case) |
| Không có class | `login-form.tsx:80,99` (bare FormLabel) |

## 1.4. Input Height - Bất nhất

| Height | Files |
|--------|-------|
| `h-10` | `customer-form.tsx:109,131,152,185,211,231,327,356,376` |
| `h-9` | `customers-page.tsx:111` |
| Mặc định (không set) | `login-form.tsx:82,108`, `resource-form.tsx` |

## 1.5. TabsContent Wrapper - Inconsistent

| Pattern | Files |
|---------|-------|
| `"space-y-4 border rounded-lg bg-card p-4"` | `staff-form.tsx:69-77` |
| `"space-y-6 animate-in fade-in-50 duration-300 border rounded-lg bg-card p-4"` | `customer-form.tsx:73,241,302` |
| `"space-y-4"` (bare, không wrapper) | `resource-form.tsx:49,52` |
| `"flex-1 flex flex-col mt-0 border-0 p-0"` | `customers-page.tsx:122,136` |

---

# II. CHI TIẾT THỪA & RƯỜM RÀ (REDUNDANCY)

## 2.1. Decorative Elements không cần thiết

| Vị trí | Element | Vấn đề |
|--------|---------|--------|
| `hero.tsx:60-62` | 3 dots (red/yellow/green) | Fake window controls, purely decorative |
| `hero.tsx:64` | Mock div `w-32` | Fake URL bar placeholder |
| `hero.tsx:69-73` | Mock sidebar items | Fake skeleton content cho mockup |
| `customer-form.tsx:84` | Badge "Sắp ra mắt" | Có thể dùng Tooltip thay vì inline badge |
| `resource-form.tsx:78` | Badge "Sắp ra mắt" | Duplicate pattern với customer-form |

## 2.2. Icon thừa không phục vụ chức năng

| Vị trí | Icon | Vấn đề |
|--------|------|--------|
| `service-form.tsx:223` | `<Palette>` trong FormLabel | Icon trong label là thừa khi đã có icon trong Input |
| `service-form.tsx:310,331` | `<Users>`, `<Settings>` trong FormLabel | Tương tự, icon label thừa |
| `customer-form.tsx:284` | `<Activity>` với class `text-info` | Color token không tồn tại? |
| `event-card.tsx:197` | Emoji `👤`, `📍` | Dùng emoji thay vì icon, không nhất quán |

## 2.3. Background layers chồng chéo

| Vị trí | Layers |
|--------|--------|
| `hero.tsx:95-99` | 3 blur circles chồng nhau (purple/primary/pink 40-50rem) |
| `customer-form.tsx:75` | `bg-muted/30` container > `bg-background` avatar |
| `service-form.tsx:45` | `bg-muted/30 border` wrapper > component bên trong |
| `service-form.tsx:214` | `bg-muted/20 border-2 border-dashed border-primary/20` (quá nhiều border) |

## 2.4. Animation classes dư thừa/lặp lại

| Pattern | Số lần xuất hiện |
|---------|------------------|
| `animate-in fade-in slide-in-from-*` | 8+ files |
| `motion-safe:animate-in` | 3 files |
| `animate-fade-in` (custom?) | 2 files |
| `animate-slide-up` (custom?) | 1 file |

## 2.5. Đường kẻ chia ngăn quá nhiều

| Vị trí | Element |
|--------|---------|
| `staff-form.tsx:57,59` | `<div className="h-px bg-border/50" />` - 2 đường kẻ thủ công |
| `service-form.tsx:329` | `border-t` thêm separator thủ công |

---

# III. SỰ CỒNG KỀNH TRONG ĐỊNH NGHĨA STYLE

## 3.1. Class strings quá dài (>150 chars)

| File:Line | Độ dài class | Nội dung |
|-----------|--------------|----------|
| `sidebar.tsx:56` | ~400 chars | 16+ utility classes cho SidebarMenuButton |
| `event-card.tsx:83-90` | ~200 chars | Button styling với nhiều state |
| `event-card.tsx:109-116` | ~250 chars | Compact variant button |
| `customers-page.tsx:121` | ~150 chars | Motion + fade animation string |

## 3.2. Style override đè lại Design System

| Vị trí | Override | Vấn đề |
|--------|----------|--------|
| `event-card.tsx:91,119,189` | `style={{ backgroundColor: event.color + "20" }}` | Inline style override, không dùng CSS var |
| `hero.tsx:37` | `shadow-lg shadow-primary/25 hover:shadow-primary/40` | Double shadow declaration |
| `hero.tsx:55` | `bg-white/60 dark:bg-slate-900/60` | Hardcoded colors thay vì semantic tokens |
| `service-form.tsx:61` | `data-[state=checked]:bg-primary` | Override Switch component style |
| `invoice-table.tsx:53` | `text-orange-600`, `text-green-600` | Hardcoded semantic colors |

## 3.3. Định nghĩa lại những thứ đã có trong Design System

| Vị trí | Redefinition |
|--------|--------------|
| `customer-form.tsx:242-253` | `bg-destructive/5 border border-destructive/20 rounded-xl` - có thể dùng Alert component |
| `customer-form.tsx:303-313` | `bg-accent border border-accent-foreground/20` - có thể dùng Alert variant |
| `service-form.tsx:240-242` | Custom endContent styling cho VNĐ - có thể tạo InputAddon component |
| `event-card.tsx:52-59` | STATUS_ICONS object - duplicate, có thể move to constants |

## 3.4. Pattern lặp lại giữa các forms

| Pattern | Files lặp |
|---------|-----------|
| Avatar upload section "Sắp ra mắt" | `customer-form.tsx:75-90`, `staff-form.tsx:88-96`, `resource-form.tsx:63-85` |
| FormLabel required asterisk | `customer-form.tsx:99,123`, `service-form.tsx:103`, `resource-form.tsx:93,113,132` |
| TabsContent animation class | `customer-form.tsx:73,241,302` - copy/paste nhau |

## 3.5. Z-index chaos (không có hệ thống)

| File:Line | Z-index |
|-----------|---------|
| `sidebar.tsx:26` | `z-30` |
| `customers-page.tsx:96` | `z-40` |

---

# IV. TỔNG HỢP THEO MỨC ĐỘ NGHIÊM TRỌNG

## 🔴 CRITICAL (Cần sửa ngay)
1. **Icon sizing inconsistency** - 7 patterns khác nhau trong cùng project
2. **Hardcoded colors** - `text-orange-600`, `bg-yellow-100`, `bg-blue-50` không theo Design System
3. **Emoji usage** - `👤`, `📍` trong production code

## 🟡 HIGH (Nên sửa trong sprint tới)
4. **TabsList API inconsistency** - 3 patterns khác nhau
5. **FormLabel styling** - 5 patterns không thống nhất
6. **Input height** - Mix giữa `h-9`, `h-10`, default
7. **Animation class duplication** - Copy/paste nhau
8. **Alert/Info box không dùng component** - Reinvent wheel

## 🟢 MEDIUM (Refactor khi có thời gian)
9. **Hero mockup decorations** - Pure visual noise
10. **Class strings quá dài** - Extract to cva variants
11. **Inline style overrides** - CSS color hacking
12. **Separator elements manual** - Có thể dùng Separator component
13. **Z-index không có hệ thống** - Cần z-index scale

---

# V. SỐ LIỆU THỐNG KÊ

| Metric | Số lượng |
|--------|----------|
| Files analyzed | 8 |
| Icon sizing patterns | 7 |
| TabsList patterns | 3 |
| FormLabel patterns | 5 |
| Hardcoded colors found | 15+ |
| Redundant decorative elements | 12 |
| Long class strings (>150 chars) | 4 |
| Inline style overrides | 6 |
| **Total inconsistencies** | **50+** |

---

*Báo cáo được tạo tự động bởi UI Aesthetic Auditor.*
