# Nhật ký phân tích (ANALYZE) - Antigravity v2

## 1. Audit Dependency & Style
- **Tailwind Version**: 4.0 (phát hiện trong `package.json` và `@import "tailwindcss"`).
- **Animation**: Đang sử dụng `tw-animate-css`. Cần kiểm tra xem có xung đột với các class `animate-*` mặc định của Tailwind 4 không.
- **Lặp lại Class**:
    - Pattern "Premium Card": `relative overflow-hidden border border-white/20 shadow-lg bg-card/80 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-card/30 dark:ring-white/10 hover:scale-[1.01] hover:shadow-xl transition-all duration-200 cursor-pointer group`. Xuất hiện 3 lần trong Feature layer.
    - Pattern "Hover Info Badge": `flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-muted/50 transition-colors cursor-help border border-transparent hover:border-border`. Xuất hiện 4 lần.
    - Pattern "Selection Card/Radio": `flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer`. Xuất hiện 2 lần.

## 2. Rà soát Shadcn/UI (MCP Verification)
- `SheetContent`, `DialogContent`, `Sidebar` đã được refactor trước đó sang các utility classes (`.close-button-base`, `.sidebar-inner-base`, ...).
- **Đánh giá**: Mặc dù làm gọn JSX, nhưng việc tách quá nhiều logic style ra khỏi component shadcn gốc có thể gây khó khăn khi cập nhật components từ registry.
- **Hành động**: Giữ nguyên các utilities đã tách nếu chúng mang tính "xuyên suốt" (cross-cutting), nhưng hạn chế tách thêm các logic "unique" của riêng component đó.

## 3. Kế hoạch trích xuất (Stage 4 - DIFF)
- Trích xuất `.card-premium-interact`.
- Trích xuất `.item-hover-shallow`.
- Trích xuất `.selection-card-ring`.
- Thống nhất các animation `motion-safe` vào `.page-entry-animation`.
