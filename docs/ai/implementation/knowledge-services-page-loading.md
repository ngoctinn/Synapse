# Kiến thức: Services Page Navigation Delay (Độ trễ điều hướng trang Dịch vụ)

## 1. Tổng quan
- **Vấn đề**: Người dùng gặp phải độ trễ (khoảng trắng hoặc đứng hình) khi chuyển hướng đến trang `/admin/services`.
- **Điểm nhập**: `frontend/src/app/(admin)/admin/services/page.tsx`
- **Nguyên nhân chính**: Trang sử dụng **Blocking Server-Side Rendering (SSR)**. Trình duyệt phải đợi server tải xong toàn bộ dữ liệu (Services & Skills) trước khi nhận được HTML để hiển thị.

## 2. Phân tích Chi tiết

### Logic hiện tại
```tsx
export default async function ServicesPage(...) {
  // Blocking await: Trình duyệt đợi dòng này hoàn tất mới render
  const [servicesData, skills] = await Promise.all([
    getServices(page, limit, search),
    getSkills()
  ]);

  return ( ... );
}
```

### Tại sao lại chậm?
1.  **Cơ chế Next.js App Router**: Mặc định, các `async` Server Component sẽ block việc render cho đến khi promise được giải quyết.
2.  **Network Waterfall**: Khi người dùng click vào link `/admin/services`, Next.js gửi request lên server. Server gọi API Backend (FastAPI). Nếu API mất 500ms, người dùng phải đợi ít nhất 500ms + network latency trước khi thấy bất kỳ nội dung nào.
3.  **Thiếu Loading State**: Thư mục `services` hiện tại **không có file `loading.tsx`**. Do đó, Next.js không thể hiển thị giao diện chờ (Skeleton) ngay lập tức.

## 3. Giải pháp Đề xuất

### Cách 1: Thêm `loading.tsx` (Streaming SSR)
Tạo file `loading.tsx` cùng cấp với `page.tsx`. Next.js sẽ hiển thị component này **ngay lập tức** khi điều hướng, trong khi server tiếp tục fetch dữ liệu ngầm (Streaming).

```tsx
// loading.tsx
export default function Loading() {
  return <ServiceTableSkeleton />;
}
```

### Cách 2: Sử dụng React Suspense (Granular Loading)
Nếu muốn hiển thị một phần trang (ví dụ: Header) ngay lập tức và chỉ loading phần bảng dữ liệu:
1.  Tách logic fetch data vào một component con (ví dụ: `ServiceList`).
2.  Wrap component đó bằng `<Suspense fallback={<Skeleton />}>` trong `page.tsx`.

## 4. Kết luận
Việc thiếu `loading.tsx` là nguyên nhân chính gây ra trải nghiệm "đứng hình". Giải pháp chuẩn của Next.js là thêm `loading.tsx` để kích hoạt Streaming SSR.
