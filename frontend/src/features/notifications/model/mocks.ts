import { Notification } from './types';

const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Lịch hẹn mới từ khách hàng',
    description: 'Nguyễn Văn A vừa đặt lịch "Cắt tóc nam" vào 15:30 hôm nay.',
    type: 'booking',
    createdAt: minutesAgo(5),
    read: false,
    meta: {
      customerName: 'Nguyễn Văn A',
    }
  },
  {
    id: '2',
    title: 'Cảnh báo tồn kho thấp',
    description: 'Sản phẩm "Dầu gội X-Men" chỉ còn 2 đơn vị trong kho.',
    type: 'alert',
    createdAt: hoursAgo(1),
    read: false,
  },
  {
    id: '3',
    title: 'Hoàn thành bảo trì hệ thống',
    description: 'Hệ thống đã cập nhật phiên bản 2.0 thành công.',
    type: 'system',
    createdAt: hoursAgo(3),
    read: true,
  },
  {
    id: '4',
    title: 'Khách hàng hủy lịch',
    description: 'Trần Thị B đã hủy lịch "Gội đầu" ngày mai.',
    type: 'booking',
    createdAt: daysAgo(1),
    read: true,
  },
  {
    id: '5',
    title: 'Tin nhắn từ Quản lý',
    description: 'Nhớ trích xuất báo cáo doanh thu tháng này nhé.',
    type: 'staff',
    createdAt: daysAgo(1),
    read: true,
    meta: {
      avatarUrl: 'https://github.com/shadcn.png',
    }
  },
   {
    id: '6',
    title: 'Lịch hẹn sắp tới',
    description: 'Có 3 khách hàng sẽ đến trong vòng 30 phút nữa.',
    type: 'booking',
    createdAt: minutesAgo(30),
    read: false,
  },
];
