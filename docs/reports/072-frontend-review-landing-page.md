# Báo Cáo Đánh Giá Landing Page & Home Page

## 1. Tổng Quan
- **Phạm vi**: `frontend/src/features/landing-page` và `frontend/src/app/page.tsx`.
- **Mục tiêu**: Đánh giá theo chuẩn FSD, Clean Code, và UX/UI Premium.
- **Ngày thực hiện**: 06/12/2025.

## 2. Kết Quả Đánh Giá Frontend (Frontend Review)

### 2.1. Cấu Trúc & FSD (Feature-Sliced Design)
- **Tình trạng**: ✅ Tốt. Module `landing-page` có `index.ts` export đầy đủ các component chính (`Hero`, `ServicesSection`, `Features`, `Testimonials`, `CTASection`).
- **Vi phạm**:
    - **App Layer**: File `src/app/page.tsx` rất gọn ("Thin Page"), nhưng phát hiện lỗi duplicate component `<Hero />` (dòng 10, 11).

### 2.2. Clean Code & Syntax
- **Issues**:
    - `src/features/landing-page/components/services-section.tsx`:
        - ❌ **Hard Refresh**: Sử dụng `window.location.href = '/login'` (Dòng 31). Điều này gây tải lại trang, mất state application. Nên dùng `useRouter` từ `next/navigation`.
        - ❌ **Console Log**: Còn `console.log("Booking service:", id)` (Dòng 29).
        - ⚠️ **TODO**: Còn comment `// TODO: Trigger Booking Flow`.

### 2.3. UX/UI & Layout Review

#### Services Section
- **Vị trí**: `src/features/landing-page/components/services-section.tsx` & children.
- **Vấn đề Layout**:
    - `ServiceFilter` (Dòng 35): Sử dụng negative margin hack (`-mx-4 px-4`) cho thanh cuộn ngang trên mobile. Mặc dù phổ biến để full-bleed trên mobile trong khi container có padding, nhưng cần lưu ý side-effect scrollbar ngang của body nếu không có `overflow-x-hidden` ở root.
- **Vấn đề Màu sắc & Theme**:
    - `Testimonials` (Dòng 34): Đang dùng cứng `bg-slate-50/50`. Đây là mã màu cụ thể, không theo Design Tokens của dự án (`globals.css`). Nên thay bằng `bg-muted/30` hoặc `bg-secondary/10` để hỗ trợ Dark Mode tốt hơn và đồng nhất style.

#### Services Card
- **Layout**: Ổn. Aspect ratio 4/3 (`aspect-[4/3]`) giữ hình ảnh cân đối.
- **Hiệu ứng**: Animation hover (`hover:scale-110`) tốt, tạo cảm giác động.
- **Typography**: Giá tiền format chuẩn `vi-VN`.

#### Hero Section
- **Layout**: Sử dụng `z-10` trên content. Background elements dùng `-z-10`. Cấu trúc này an toàn.
- **Animation**: `framer-motion` sử dụng tốt, không lạm dụng quá đà.

#### CTA Section
- **Contrast**: Sử dụng `bg-primary` và `text-primary-foreground` đảm bảo độ tương phản chuẩn Accessibility (AA/AAA).

## 3. Kế Hoạch Hành Động (Action Plan)

### High Priority (Cần sửa ngay)
1.  **Xóa Duplicate**: Xóa dòng `<Hero />` thừa trong `app/page.tsx`.
2.  **Refactor Navigation**: Trong `services-section.tsx`, thay thế:
    ```typescript
    window.location.href = '/login'
    ```
    thành:
    ```typescript
    import { useRouter } from "next/navigation"
    // ...
    const router = useRouter()
    // ...
    router.push('/login')
    ```
3.  **Clean Code**: Xóa `console.log` và code thừa.

### Medium Priority (Cải thiện UI/UX)
1.  **Standardize Colors**:
    - Trong `testimonials.tsx`: Đổi `className="... bg-slate-50/50 ..."` thành `className="... bg-muted/30 ..."` (hoặc token tương đương).
2.  **Review Mobile Scroll**: Kiểm tra `ServiceFilter` trên mobile, đảm bảo negative margin không gây thanh cuộn ngang toàn trang.

### Low Priority (Tối ưu)
1.  **Lazy Loading**: Các component như `Testimonials` và `Features` nằm dưới fold, `Next.js` page router mặc định SSR tốt, nhưng có thể cân nhắc `dynamic import` nếu bundle quá lớn (hiện tại chưa cần thiết vì code còn nhỏ).

---
*Báo cáo được lưu tại: `docs/reports/072-frontend-review-landing-page.md`*
