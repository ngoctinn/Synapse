# Deep Design Review: Exceptions Table vs ExceptionsViewManager

**Date**: 2025-12-06
**Subject**: `exceptions-table.tsx` vs `exceptions-view-manager.tsx`
**Reviewer**: Antigravity (Agent)

## 1. Tổng Quan & Ngữ Cảnh
Báo cáo này tập trung phân tích sự tương tác và tính nhất quán giữa `ExceptionsTable` (thành phần hiển thị danh sách) và `ExceptionsViewManager` (container quản lý bố cục Split View/Toggle).
Mục tiêu là đảm bảo trải nghiệm "Premium", mạch lạc giữa chế độ xem Lịch (Calendar) và Danh sách (List/Table).

## 2. Phân Tích Bố Cục & Cấu Trúc (Layout & Structure)

### 2.1. Vấn Đề "Compact Mode" (Quan Trọng)
Trong `ExceptionsViewManager`, chúng ta sử dụng `ExceptionsTable` ở hai ngữ cảnh:
1.  **Full List View**: Chế độ danh sách toàn màn hình (Mobile hoặc khi toggle List).
2.  **Compact Side Panel**: Panel bên phải (35% width) trong Split View trên Desktop.

**Hiện trạng:**
File `exceptions-table.tsx`:
```typescript
const visibleColumns = useMemo(() => {
    if (!compact) return columns;
    // In compact mode, we might want to hide some columns, 
    // but for now let's keep it simple or hide ID if it was a separate column
    return columns; // <--- VẤN ĐỀ: Không thay đổi gì cả
}, [columns, compact]);
```
- **Hệ quả**: Panel bên phải (Grid 35%) bị chật chội vì phải hiển thị đầy đủ 5 cột (Thời gian, Tên, Loại, Trạng thái, Hành động).
- **Trải nghiệm**: Người dùng phải scroll ngang hoặc nội dung bị xuống dòng xấu xí.

### 2.2. Sự Dư Thừa Tiêu Đề (Header Redundancy)
- **ExceptionsViewManager**: Đã có header "DANH SÁCH CHI TIẾT" ở panel phải.
- **DataTable**: Mặc định render `TableHeader` (thead).
- **Conflict**: Hai header xếp chồng lên nhau tạo cảm giác lặp lại và rối mắt trong không gian hẹp.

### 2.3. Scrollbar & Resizable Panel
- Container của Table trong Split View đã có `overflow-y-auto` và `custom-scrollbar`.
- Tuy nhiên, `DataTable` cũng thường có cơ chế scroll riêng nếu max-height được set. Cần đảm bảo `ExceptionsTable` tràn đầy chiều cao cha (`h-full`) thay vì bị giới hạn.

## 3. Đánh Giá Chi Tiết Thành Phần (Component Details)

### 3.1. Columns Design (`exceptions-columns.tsx`)
- **Cột Thời Gian**: Design hiện tại khá ổn với icon `CalendarDays`, nhưng trong Compact Mode nên rút gọn (VD: bỏ icon, chỉ hiện ngày, nếu Multi-day thì hiện "2 ngày" dạng badge thay vì text dài).
- **Cột Loại & Trạng Thái**: Badges đẹp nhưng chiếm diện tích.
- **Hành động**: Nút Edit/Delete chiếm không gian chiều ngang quý giá bên phải.

### 3.2. Empty State
- Trong Compact Mode, `ExceptionsTable` đang render một box dashed border.
- **Góp ý**: Trong Split View, nếu chưa chọn ngày nào (hoặc bộ lọc rỗng), Side Panel nên hiển thị một hình minh họa (Illustration) hoặc hướng dẫn "Chọn ngày trên lịch để xem chi tiết" thay vì "Không có dữ liệu".

## 4. Đề Xuất Cải Tiến "Premium" (Solutions)

### 4.1. Chiến Lược "Responsive Columns" cho Compact Mode
Cần định nghĩa lại `visibleColumns` thật sự khi `compact = true`.

**Gợi ý biến đổi:**
- **Full View**: Giữ nguyên 5 cột.
- **Compact View (Side Panel)**:
  - **Gộp cột**: Gộp "Tên sự kiện" và "Thời gian" thành một cột chính.
  - **Ẩn bớt**: Ẩn cột "Trạng thái" (status text) nếu Badge "Loại" đã đủ màu sắc để phân biệt (Open/Closed).
  - **Hành động**: Chuyển thành Dropdown Menu (...) hoặc chỉ hiện khi Hover row.

**Ví dụ Code Refactor (`exceptions-table.tsx`):**
```typescript
const visibleColumns = useMemo(() => {
  if (!compact) return columns;
  
  // Compact columns definition
  return [
    {
        header: "Sự kiện",
        cell: (row) => (
            <div className="flex flex-col">
                <span className="font-medium truncate">{row.main.reason}</span>
                <span className="text-xs text-muted-foreground">{formatDate(row.main.date)}</span>
            </div>
        )
    },
    {
        header: "Loại",
        cell: (row) => <CompactBadge type={row.main.type} /> // Icon only or tiny badge
    },
    // Action column kept minimal
    columns.find(c => c.id === 'actions')
  ];
}, [columns, compact]);
```

### 4.2. Interaction Sync (Đồng Bộ Tương Tác)
- **Hover Effect**: Khi trỏ chuột vào một ngày trên `ExceptionsCalendar`, dòng tương ứng bên `ExceptionsTable` nên sáng lên (highlight) và ngược lại.
- **Auto Scroll**: Khi click ngày trên Lịch, Table bên phải nên tự động scroll tới dòng chứa ngày đó.

### 4.3. Loại Bỏ Header Thừa
- Thêm prop `hideHeader?: boolean` cho `ExceptionsTable` và `DataTable`.
- Khi ở trong Compact Side Panel, set `hideHeader={true}` để liếc qua danh sách tự nhiên hơn (giống danh sách file trong Finder/Explorer).

## 5. Kế Hoạch Hành Động (Refactoring Plan)

1.  **Cập nhật `ExceptionsColumns`**:
    - Tạo biến thể cột "Compact" (Mobile-friendly).
    - Tinh chỉnh padding cho cell để tiết kiệm diện tích.

2.  **Refactor `ExceptionsTable`**:
    - Thực thi logic `visibleColumns` thực sự.
    - Truyền prop `hideHeader` xuống `DataTable` (cần update `DataTable` nếu chưa hỗ trợ).
    - Tối ưu `TableActionBar` trong `compact` mode (hiện tại đã ẩn là tốt, nhưng có thể cần nút Delete nhỏ gọn).

3.  **Update `ExceptionsViewManager`**:
    - Truyền `compact` và `hideHeader` vào Table ở Side Panel.
    - Thêm empty state xịn xò hơn cho Side Panel.

## 6. Kết Luận
`ExceptionsViewManager` có cấu trúc Split View rất hiện đại ("Wow factor"). Tuy nhiên, `ExceptionsTable` đang là "điểm nghẽn" về mặt thị giác do chưa thích nghi tốt với không gian hẹp. Việc tối ưu hóa Compact Mode sẽ hoàn thiện trải nghiệm người dùng cao cấp (Premium UX).
