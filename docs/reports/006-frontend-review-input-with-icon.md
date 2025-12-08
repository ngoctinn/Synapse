# Báo Cáo Review Frontend: InputWithIcon & Tính Đồng Bộ

**Ngày**: 2025-12-08
**Đối tượng**: `frontend/src/shared/ui/custom/input-with-icon.tsx`
**Trạng thái**: ⚠️ Cần Cải Thiện (Warning)

---

## 1. Tóm Tắt Vấn Đề (Context)
Người dùng yêu cầu kiểm tra "tính đồng bộ" (consistency) của component `InputWithIcon`.
Sau khi so sánh với `frontend/src/shared/ui/input.tsx` và `frontend/src/app/globals.css`, phát hiện các vi phạm nghiêm trọng về:
1. **Kích thước (Size/Height)**: Không đồng nhất giữa Input thường và Input có icon.
2. **Hiệu ứng (Effects)**: Input có icon có shadow và transition khác biệt so với Input thường.
3. **Mã nguồn dư thừa (Redundancy)**: Lặp lại logic styling đã có trong base component.
4. **Màu sắc (Color)**: Sử dụng màu nền hardcode thay vì kế thừa từ system token.
5. **Bản địa hóa (Localization)**: TimePicker (liên quan trong ảnh) đang hiển thị AM/PM thay vì SA/CH.

---

## 2. Chi Tiết Vi Phạm

### 🔴 2.1. Lệch Kích Thước (Height Customization)
- **Base Input (`input.tsx`)**: Mặc định là `h-9` (tương đương 36px) và `py-1`.
- **InputWithIcon (`input-with-icon.tsx`)**:
  ```typescript
  const sizeVariants = {
    sm: "h-9",
    default: "h-10", // ❌ Lệch: Đặt mặc định là h-10 (40px)
    lg: "h-12",
  }
  ```
- **Hậu quả**: Khi đặt một `Input` thường cạnh một `InputWithIcon` trên cùng một form, chúng sẽ bị lệch chiều cao (36px vs 40px), gây mất thẩm mỹ nghiêm trọng.

### 🔴 2.2. Lệch Style & Hiệu Ứng (Inconsistent Styling)
- **Base Input**:
  - `shadow-xs`
  - `bg-transparent`
  - Không có hiệu ứng `hover:shadow-md`.
- **InputWithIcon**:
  - `shadow-sm`
  - `hover:shadow-md` (Tạo cảm giác "nổi" hơn so với input thường)
  - `bg-background` (Màu nền trắng/đục, trong khi base là transparent)
- **Hậu quả**: Trải nghiệm người dùng không nhất quán. Input có icon cảm giác "premium" hơn Input thường.

### 🟡 2.3. Dư Thừa Code (Redundancy)
- `InputWithIcon` đang apply lại class `focus-premium` và `rounded-lg` trong khi `Input` (base) đã có sẵn các class này.

### 🔴 2.4. Lệch Màu Nền (Color Inconsistency) (Theo Yêu Cầu)
- **Base Input (`input.tsx`)**: Sử dụng `bg-transparent`. Điều này cho phép input hòa nhập vào màu nền của card hoặc modal mẹ.
- **InputWithIcon (`input-with-icon.tsx`)**: Hardcode `bg-background` (thường là màu trắng hoặc màu nền trang).
- **Hậu quả**:
  - Khi đặt trên một Card có màu nền hơi xám hoặc custom (ví dụ `bg-muted/50`), `InputWithIcon` sẽ bị "lộ" ra là một khối `bg-background` đục lỗ, trong khi `Input` thường sẽ trong suốt và hòa hợp.
  - Vi phạm nguyên tắc **Layered Design** của Shadcn UI.

- **Code hiện tại**:

  ```tsx
  // input-with-icon.tsx
  <Input
    className={cn(
      "focus-premium", // ⚠️ Dư thừa: Base Input đã có
      "rounded-lg",    // ⚠️ Dư thừa: Base Input đã có
      ...
    )}
  />
  ```  ```

### 🔴 2.5. Bản Địa Hóa (Localization - TimePicker) (Theo Ảnh)
- **Vấn đề**: Ảnh minh họa cho thấy TimePicker đang sử dụng ký hiệu tiếng Anh **AM/PM**.
- **Yêu cầu dự án**: "Toàn bộ thông báo lỗi và tài liệu... phải là Tiếng Việt".
- **Hậu quả**: Không thân thiện với người dùng Việt Nam (lễ tân/khách hàng). Cần đổi thành **SA/CH**.

---

## 3. Đề Xuất Cải Tiến (Action Plan)

### Bước 1: Đồng bộ hóa Kích thước
Sửa `sizeVariants` trong `input-with-icon.tsx` để khớp với hệ thống design 3 size chuẩn của dự án (khớp với `Button` và `Input`):

```diff
const sizeVariants = {
  sm: "h-8 text-xs", // Cho compact views
-  default: "h-10",
+  default: "h-9",    // Chuẩn Shadcn UI / Base Input
  lg: "h-11",        // Cho form nhấn mạnh (Login/Home)
}
```

### Bước 2: Đồng bộ hóa Visual Style
Quyết định Style "Premium" có nên áp dụng cho TOÀN BỘ Input không?
- **Phương án A (Khuyên dùng)**: Chuyển các style "xịn" (`hover:shadow-md`, `transition-all`) vào thẳng `frontend/src/shared/ui/input.tsx`. Khi đó `InputWithIcon` chỉ cần thừa kế.
- **Phương án B**: Xóa các style override trong `InputWithIcon` để nó giống hệt Input thường.
- **Phương án C (Fix Màu)**: Xóa class `bg-background` khỏi `InputWithIcon` và để nó fallback về `bg-transparent` của `Input` gốc.

### Bước 3: Refactor Code (Clean Up)
Loại bỏ các class dư thừa và sửa lại logic render icon để linh hoạt hơn.

**Mã đề xuất (`input-with-icon.tsx`):**
```tsx
const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, containerClassName, icon: Icon, rightIcon: RightIcon, variant = "default", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        {Icon && (
           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
             <Icon size={16} /> {/* Size 16 chuẩn hơn 18 cho input h-9 */}
           </div>
        )}
        <Input
          className={cn(
            sizeVariants[variant],
            Icon && "pl-9",       // Padding chuẩn cho icon left
            RightIcon && "pr-9",  // Padding chuẩn cho icon right
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Right Icon Logic */}
      </div>
    )
  }
)
```

### Bước 4: Áp dụng cho TimePicker (Theo ảnh)
Cập nhật `time-picker.tsx` để sử dụng `InputWithIcon` (hoặc style tương đương) làm trigger thay vì `Button variant="outline"`. Điều này sẽ đảm bảo TimePicker nhìn y hệt các Input khác.

### Bước 5: Bản địa hóa TimePicker (Localization)
- Thay đổi hiển thị **AM** -> **SA** (Sáng).
- Thay đổi hiển thị **PM** -> **CH** (Chiều).
- Đảm bảo logic parse giờ vẫn hoạt động đúng với format 24h hoặc 12h của hệ thống.

---

## 4. Kết luận
Component `InputWithIcon` đang tự định nghĩa lại style system gây ra sự bất đồng bộ. Cần đưa về chuẩn chung với `Input` gốc.
