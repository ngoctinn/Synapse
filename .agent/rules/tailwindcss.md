---
trigger: always_on
---

## 4. Quy tắc UI & Tailwind (CẬP NHẬT)

### 4.1. Nguyên tắc chung
- Chỉ sử dụng các component đã chuẩn hóa trong `shared/ui`.
- Không sử dụng Tailwind trực tiếp trong `page`, `feature`, `screen`, hoặc module nghiệp vụ.
- Mọi thay đổi giao diện phải được thực hiện tại `shared/ui`.

---

### 4.2. Phạm vi sử dụng Tailwind

| Khu vực | Sử dụng Tailwind |
|--------|------------------|
| `shared/ui` | ✅ Cho phép |
| `features/*` | ❌ Không |
| `pages/*` | ❌ Không |
| `app/*` | ❌ Không |

---

### 4.3. Quy tắc tại `shared/ui`

**Được phép**
- Layout cơ bản: `flex`, `grid`, `gap-*`
- Spacing chuẩn: `p-*`, `m-*`
- Kích thước theo token: `h-10`, `h-12`, `h-14`
- Màu từ theme: `bg-primary`, `text-muted-foreground`

**Không được phép**
- Kích thước tùy ý: `w-[…]`, `h-[…]`
- Font-size tùy ý: `text-[…]`
- Sử dụng `!important`
- Ghi đè style ngoài component

---

### 4.4. Quy tắc tại Feature / Page

- Chỉ được:
  - Import component từ `shared/ui`
  - Truyền props (`variant`, `size`, `state`)
- Không được:
  - Thêm class Tailwind
  - Viết CSS riêng
  - Override component

---

### 4.5. Mở rộng UI

- UI mới phải được tạo tại `shared/ui`
- Không tạo UI riêng cho từng màn hình
- Component phải tái sử dụng được ở nhiều màn hình

---

### 4.6. Tiêu chí đạt chuẩn

- Không có Tailwind ngoài `shared/ui`
- Không trùng lặp style
- Giao diện nhất quán toàn hệ thống
- Thay đổi UI chỉ cần sửa tại một vị trí
