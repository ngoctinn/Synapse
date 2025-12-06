# Design Review: Year View Legend & Visual Status (085)

## 1. Tổng Quan & Phạm Vi
**Component**: `frontend/src/features/settings/operating-hours/components/year-view-grid.tsx`
**Trạng Thái**: ✅ **Đã Triển Khai** (Implemented)
**Mục tiêu**: Thêm chú thích (Legend) trực quan, tuân thủ yêu cầu màu sắc cụ thể và nâng cấp thẩm mỹ "Premium".

## 2. Phân Tích Hiện Trạng

### 2.1 Cấu Trúc
- **Header**: Hiện chỉ có điều hướng năm (`ChevronLeft`, `YearPicker`, `ChevronRight`).
- **Grid**: Hiển thị 12 tháng.
- **Vấn đề**: Người dùng không biết ý nghĩa của các màu sắc (Đỏ, Vàng, Xanh, Xám, Đậm/Nhạt) nếu không có hướng dẫn.

### 2.2 Màu Sắc & Trạng Thái (Hiện tại)
- Logic màu sắc hiện nằm trong `utils/style-helpers` và được áp dụng trực tiếp trong `MonthCard`.
- Thiếu sự đồng bộ rõ ràng giữa "Status" (Mở/Đóng) và "Type" (Lễ/Bảo trì/Tùy chỉnh) trong nhận thức người dùng.

## 3. Đề Xuất Thiết Kế "Premium"

### 3.1 Legend Row (Thanh Chú Thích)
Để đảm bảo "thân thiện, đồng bộ và thẩm mỹ", chúng ta sẽ thêm một thanh Legend ngay bên dưới (hoặc bên cạnh) bộ điều hướng năm, sử dụng Flexbox để căn chỉnh gọn gàng.

**Cấu trúc đề xuất**:
```tsx
<div className="flex flex-wrap items-center justify-between gap-4 py-4 px-1">
  {/* Nhóm 1: Trạng Thái (Status) - Border & Text */}
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái:</span>
    <LegendItem style="border-green-500 text-green-600 bg-green-50/10 border" label="Mở cửa" />
    <LegendItem style="border-red-500 text-red-600 bg-red-50/10 border" label="Đóng cửa" />
  </div>

  {/* Nhóm 2: Loại (Type) - Background Solid/Soft */}
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loại:</span>
    <LegendItem style="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" label="Ngày lễ" />
    <LegendItem style="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" label="Bảo trì" />
    <LegendItem style="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" label="Tùy chỉnh" />
  </div>

  {/* Nhóm 3: Hiển thị (Display) - Opacity */}
  <div className="flex items-center gap-3">
     <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hiển thị:</span>
     <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
           24
        </div>
        <span className="text-sm">Được lọc</span>
     </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-muted/30 text-muted-foreground opacity-40 text-[10px]">
           24
        </div>
        <span className="text-sm text-muted-foreground">Ẩn</span>
     </div>
  </div>
</div>
```

### 3.2 Mapping Màu Sắc (Theo Yêu Cầu)
Chúng ta sẽ chuẩn hóa các class Tailwind để khớp chính xác yêu cầu:

1.  **Trạng thái (Status)**
    *   **Mở cửa**: `border border-emerald-500 text-emerald-600` (Viền xanh, chữ xanh).
    *   **Đóng cửa**: `border border-rose-500 text-rose-600` (Viền đỏ, chữ đỏ). *Lưu ý: Giả định user muốn "Đóng cửa" cho màu đỏ.*

2.  **Loại (Type)**
    *   **Ngày lễ**: `bg-red-500 text-white` (Nền đỏ) hoặc `bg-red-100 text-red-900` (Soft). *Yêu cầu: "Nền màu đỏ"*. Để thẩm mỹ và dễ đọc số ngày, nên dùng **Soft Background** (`bg-red-100`) cho giao diện sáng, hoặc nếu dùng Solid (`bg-red-500`) thì chữ phải trắng.
    *   **Bảo trì**: `bg-amber-400 text-amber-900` (Nền vàng).
    *   **Tùy chỉnh**: `bg-blue-500 text-white` (Nền xanh lam).

3.  **Ngày (Date)**
    *   **Được lọc (Matched)**: `opacity-100`, `scale-100` (Màu đậm).
    *   **Không được lọc (Unmatched)**: `opacity-30`, `grayscale`, `scale-75` (Màu nhạt).

### 3.3 Đề Xuất Implementation Detail
Tạo component nhỏ `LegendItem` bên trong file hoặc tách ra để tái sử dụng.
```tsx
const LegendItem = ({ className, label }: { className: string, label: string }) => (
    <div className="flex items-center gap-1.5">
        <div className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px] font-medium shadow-sm", className)}>
            {/* Giả lập số ngày demo */}
            12
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
    </div>
)
```

## 4. Kế Hoạch Hành Động
1.  **Refactor `YearViewGrid`**:
    *   Thêm section `Legend` vào đầu component, ngay dưới row điều hướng năm.
    *   Sử dụng Grid hoặc Flex wrap để đảm bảo responsive trên màn hình nhỏ.
2.  **Cập nhật `MonthCard`**:
    *   Đảm bảo logic render class trong `month-card` khớp 100% với Legend.
    *   Đảm bảo logic render class trong `month-card` khớp 100% với Legend.
    *   Tinh chỉnh lại `getStatusStyles` nếu cần để support việc tách biệt Border/Text (Status) và Background (Type).
3. **Refinement (Cập nhật sau triển khai)**:
    *   Đổi từ "Ẩn" thành "**Ngoài lọc**" để chính xác hơn về ngữ nghĩa.
    *   Căn chỉnh Legend sang phải (`ml-auto`) trên desktop để cân bằng bố cục.

**Lưu ý**: Hiện tại `exception.type` quyết định màu sắc. Nếu user muốn phân biệt "Trạng thái" vs "Loại" song song, chúng ta cần xác định độ ưu tiên.
*   Thường thì: Một ngày Bảo trì (Type) sẽ Đóng cửa (Status).
*   Đề xuất:
    *   Nếu là **Ngày lễ/Bảo trì**: Ưu tiên hiển thị **Nền** (Background).
    *   Nếu là **Tùy chỉnh**:
        *   Nếu Mở: Dùng Nền xanh lam.
        *   Nếu Đóng (nhưng user yêu cầu Border?): Cái này cần logic ưu tiên.
*   **Giải pháp đơn giản hóa**:
    *   **Lễ/Bảo trì**: Luôn có Background đặc trưng.
    *   **Exception Tùy chỉnh (Mở/Đóng)**: Có thể dùng Border Style như yêu cầu.
    *   Hoặc áp dụng cả hai: Background cho Loại, Border cho Trạng thái. (Ví dụ: Nền Vàng [Bảo trì] + Border Đỏ [Đóng cửa]).

---
*Báo cáo được tạo bởi AI Assistant - Tuân thủ quy trình /deep-design-review.*
