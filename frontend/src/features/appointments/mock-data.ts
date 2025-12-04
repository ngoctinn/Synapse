import { setHours, setMinutes, startOfToday } from 'date-fns';
import { Appointment, Resource } from './types';

const today = startOfToday();

export const MOCK_RESOURCES: Resource[] = [
  { id: '1', name: 'Nguyễn Văn A', role: 'Senior Stylist', avatar: '/avatars/01.png' },
  { id: '2', name: 'Trần Thị B', role: 'Massage Therapist', avatar: '/avatars/02.png' },
  { id: '3', name: 'Lê Văn C', role: 'Junior Stylist', avatar: '/avatars/03.png' },
  { id: '4', name: 'Phạm Thị D', role: 'Nail Artist', avatar: '/avatars/04.png' },
  { id: '5', name: 'Hoàng Văn E', role: 'Skin Care Expert', avatar: '/avatars/05.png' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    customerId: 'cust-1',
    customerName: 'Chị Lan',
    serviceId: 'srv-1',
    serviceName: 'Gội đầu dưỡng sinh',
    resourceId: '1',
    startTime: setMinutes(setHours(today, 9), 0), // 9:00 Sáng
    endTime: setMinutes(setHours(today, 10), 0), // 10:00 Sáng
    status: 'completed',
    notes: 'Khách thích nước ấm',
  },
  {
    id: 'apt-2',
    customerId: 'cust-2',
    customerName: 'Anh Minh',
    serviceId: 'srv-2',
    serviceName: 'Cắt tóc Nam',
    resourceId: '1',
    startTime: setMinutes(setHours(today, 10), 30), // 10:30
    endTime: setMinutes(setHours(today, 11), 15), // 11:15
    status: 'serving',
  },
  {
    id: 'apt-3',
    customerId: 'cust-3',
    customerName: 'Chị Hoa',
    serviceId: 'srv-3',
    serviceName: 'Massage Body Đá Nóng',
    resourceId: '2',
    startTime: setMinutes(setHours(today, 10), 0), // 10:00
    endTime: setMinutes(setHours(today, 12), 0), // 12:00
    status: 'confirmed',
  },
  {
    id: 'apt-4',
    customerId: 'cust-4',
    customerName: 'Chị Mai',
    serviceId: 'srv-4',
    serviceName: 'Làm Nail Full Set',
    resourceId: '4',
    startTime: setMinutes(setHours(today, 14), 0), // 14:00
    endTime: setMinutes(setHours(today, 16), 0), // 16:00
    status: 'pending',
  },
  {
    id: 'apt-5',
    customerId: 'cust-5',
    customerName: 'Anh Tuấn',
    serviceId: 'srv-5',
    serviceName: 'Trị liệu da mặt',
    resourceId: '5',
    startTime: setMinutes(setHours(today, 11), 0), // 11:00
    endTime: setMinutes(setHours(today, 12), 30), // 12:30
    status: 'cancelled',
  },
];
