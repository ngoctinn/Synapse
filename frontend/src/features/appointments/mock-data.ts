import { addDays, setHours, setMinutes, startOfToday } from 'date-fns';
import { Appointment, Resource } from './types';

const today = startOfToday();

// Resources (Derived from Staff Mock Data for consistency)
// Focusing on Technicians who perform services
export const MOCK_RESOURCES: Resource[] = [
  {
    id: '4',
    name: 'Phạm Văn Kỹ Thuật 1',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv1'
  },
  {
    id: '5',
    name: 'Hoàng Thị Kỹ Thuật 2',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv2'
  },
  {
    id: '6',
    name: 'Vũ Văn Kỹ Thuật 3',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv3'
  },
  {
    id: '8',
    name: 'Bùi Văn Kỹ Thuật 5',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv5'
  },
  {
    id: '9',
    name: 'Ngô Thị Kỹ Thuật 6',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv6'
  },
  {
    id: '10',
    name: 'Đỗ Văn Kỹ Thuật 7',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv7'
  },
  {
    id: '12',
    name: 'Hồ Văn Kỹ Thuật 9',
    role: 'Kỹ thuật viên',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ktv9'
  }
];

// Helper to create date
const createDate = (hour: number, minute: number, dayOffset: number = 0) => {
  let date = addDays(today, dayOffset);
  date = setHours(date, hour);
  date = setMinutes(date, minute);
  return date;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  // Today's Appointments
  {
    id: 'apt-1',
    customerId: 'cust-1',
    customerName: 'Nguyễn Thị Lan',
    serviceId: 'srv-facial-01',
    serviceName: 'Chăm sóc da mặt chuyên sâu',
    resourceId: '4', // KTV 1
    startTime: createDate(9, 0),
    endTime: createDate(10, 30),
    status: 'completed',
    notes: 'Khách da nhạy cảm, sử dụng sản phẩm dòng A.',
    color: '#10B981', // Emerald
  },
  {
    id: 'apt-2',
    customerId: 'cust-2',
    customerName: 'Trần Văn Minh',
    serviceId: 'srv-body-02',
    serviceName: 'Massage Body Thụy Điển',
    resourceId: '5', // KTV 2
    startTime: createDate(9, 30),
    endTime: createDate(11, 0),
    status: 'serving',
    color: '#3B82F6', // Blue
  },
  {
    id: 'apt-3',
    customerId: 'cust-3',
    customerName: 'Lê Thị Hoa',
    serviceId: 'srv-acne-01',
    serviceName: 'Liệu trình trị mụn chuẩn y khoa',
    resourceId: '6', // KTV 3
    startTime: createDate(10, 0),
    endTime: createDate(11, 30),
    status: 'confirmed',
    notes: 'Khách hẹn trễ 15p đã báo trước.',
    color: '#8B5CF6', // Violet
  },
  {
    id: 'apt-4',
    customerId: 'cust-4',
    customerName: 'Phạm Thu Hương',
    serviceId: 'srv-laser-01',
    serviceName: 'Triệt lông toàn thân',
    resourceId: '4', // KTV 1 - Next slot
    startTime: createDate(11, 0),
    endTime: createDate(12, 30),
    status: 'pending',
    color: '#F59E0B', // Amber
  },
  {
    id: 'apt-5',
    customerId: 'cust-5',
    customerName: 'Hoàng Văn Nam',
    serviceId: 'srv-neck-01',
    serviceName: 'Massage Cổ Vai Gáy',
    resourceId: '8', // KTV 5
    startTime: createDate(13, 0),
    endTime: createDate(14, 0),
    status: 'confirmed',
    color: '#6366F1', // Indigo
  },
  {
    id: 'apt-6',
    customerId: 'cust-6',
    customerName: 'Đặng Thị Thảo',
    serviceId: 'srv-peel-01',
    serviceName: 'Peel da sinh học',
    resourceId: '9', // KTV 6
    startTime: createDate(14, 30),
    endTime: createDate(15, 30),
    status: 'no-show', // Khách không đến
    color: '#EF4444', // Red
  },
   {
    id: 'apt-7',
    customerId: 'cust-7',
    customerName: 'Võ Thị Hằng',
    serviceId: 'srv-shampoo-01',
    serviceName: 'Gội đầu dưỡng sinh Trung Hoa',
    resourceId: '10', // KTV 7
    startTime: createDate(15, 0),
    endTime: createDate(16, 0),
    status: 'confirmed',
    color: '#EC4899', // Pink
  },

  // Future Appointments (Tomorrow)
  {
    id: 'apt-8',
    customerId: 'cust-8',
    customerName: 'Nguyễn Văn Tuấn',
    serviceId: 'srv-body-02',
    serviceName: 'Massage Body Đá Nóng',
    resourceId: '5', // KTV 2
    startTime: createDate(10, 0, 1),
    endTime: createDate(11, 30, 1),
    status: 'confirmed',
  },

  // Cancelled Appointment
  {
    id: 'apt-9',
    customerId: 'cust-9',
    customerName: 'Trần Thị Bích',
    serviceId: 'srv-whitening-01',
    serviceName: 'Tắm trắng phi thuyền',
    resourceId: '12', // KTV 9
    startTime: createDate(16, 0),
    endTime: createDate(17, 30),
    status: 'cancelled',
    notes: 'Khách bận đột xuất xin hủy.',
    color: '#9CA3AF', // Gray
  },

  // Overlapping/Busy Slot Scenario
  {
    id: 'apt-10',
    customerId: 'cust-10',
    customerName: 'Lê Văn Khang',
    serviceId: 'srv-neck-01',
    serviceName: 'Massage Cổ Vai Gáy',
    resourceId: '6', // KTV 3
    startTime: createDate(13, 30),
    endTime: createDate(14, 30),
    status: 'confirmed',
  },
];
