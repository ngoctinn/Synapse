# Nghiên Cứu & Thiết Kế: Giao Diện Cấu Hình Thông Báo

## 1. Tổng Quan
Người dùng yêu cầu xây dựng giao diện cấu hình thông báo (Notification Settings) cho hệ thống CRM Spa "Synapse".
Yêu cầu cốt lõi: **Frontend Only** (không tích hợp Backend hiện tại), sử dụng stack có sẵn (Next.js, Shadcn/UI).

## 2. Phân Tích & Nghiên Cứu Hiện Trạng
### 2.1. Codebase Hiện Tại
- Hệ thống Admin Settings hiện tại nằm tại: `src/app/(admin)/admin/settings`.
- Feature module tương ứng: `src/features/settings`.
- Các UI Components sẵn có: `Switch`, `Card`, `Table`, `Badge`, `Dialog`, `Textarea` (Shadcn/UI).
- Chưa có module `notifications` riêng biệt.

### 2.2. Best Practices (SaaS CRM)
Dựa trên nghiên cứu các mẫu UI CRM hiện đại (như Zoho, HubSpot):
1.  **Phân Tầng Cấu Hình**:
    - **Cấp 1: Channels (Kênh)**: Cấu hình kết nối hạ tầng (Zalo OA, SMS Brandname, SMTP Email). Hiển thị trạng thái "Connected/Disconnected".
    - **Cấp 2: Triggers (Sự kiện)**: Ma trận bật/tắt thông báo cho từng sự kiện (VD: Đặt lịch thành công, Nhắc lịch, Hủy lịch).
    - **Cấp 3: Templates (Mẫu tin)**: Chỉnh sửa nội dung tin nhắn cho từng kênh/sự kiện.

2.  **Trải Nghiệm Người Dùng (UX)**:
    - Sử dụng **Toggle Switch** cho việc bật/tắt nhanh.
    - Nhóm các thông báo theo đối tượng nhận: **Khách hàng** vs **Nhân viên**.
    - **Template Editor** nên hỗ trợ biến động (dynamic variables) như `{{customer_name}}`, `{{appointment_time}}`.

## 3. Đề Xuất Giải Pháp (Thiết Kế Chi Tiết)

### 3.1. Cấu Trúc Thư Mục
```
src/features/settings/notifications/
├── components/
│   ├── notification-channels.tsx   # Quản lý kết nối Zalo, SMS, Email
│   ├── notification-list.tsx       # Danh sách cài đặt sự kiện (Triggers)
│   ├── channel-config-dialog.tsx   # Dialog cấu hình chi tiết kênh
│   └── template-editor.tsx         # Dialog chỉnh sửa mẫu tin
├── data/
│   └── mock-data.ts                # Dữ liệu giả lập cho Frontend
└── index.ts
```

### 3.2. Route
- Path: `/admin/settings/notifications`

### 3.3. Mô Hình Dữ Liệu (Mock)
```typescript
interface NotificationChannel {
  id: 'zalo' | 'sms' | 'email';
  name: string;
  isConnected: boolean;
  config: Record<string, any>;
}

interface NotificationEvent {
  id: string;
  name: string; // VD: "Đặt lịch thành công"
  recipient: 'customer' | 'staff';
  channels: {
    zalo: boolean;
    sms: boolean;
    email: boolean;
  };
  templates: {
    zalo?: string;
    sms?: string;
    email?: string;
  };
}
```

### 3.4. Kế Hoạch Triển Khai
1.  **Bước 1**: Tạo cấu trúc thư mục và Mock Data.
2.  **Bước 2**: Implement `NotificationChannels` (Card hiển thị trạng thái kết nối).
3.  **Bước 3**: Implement `NotificationList` (Bảng cấu hình bật tắt sự kiện).
4.  **Bước 4**: Implement `TemplateEditor` (Dialog chỉnh sửa nội dung).
5.  **Bước 5**: Tích hợp vào Page `/admin/settings/notifications`.
