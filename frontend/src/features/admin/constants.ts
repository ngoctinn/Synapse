import {
  Box,
  Calendar,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Scissors,
  Settings,
  ShieldCheck,
  Star,
  User,
  Users,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  items?: {
    title: string;
    href: string;
  }[];
};

export type SidebarGroup = {
  group: string;
  items: SidebarItem[];
};

export const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Quản trị",
  overview: "Tổng quan",
  dashboard: "Báo cáo",
  workspace: "Làm việc",
  appointments: "Lịch hẹn",
  staff: "Nhân sự",
  permissions: "Phân quyền",
  schedule: "Lịch làm việc",
  skills: "Kỹ năng",
  services: "Dịch vụ",
  messages: "Tin nhắn",
  notifications: "Thông báo",
  components: "Thành phần",
  settings: "Cài đặt",
  "operating-hours": "Thời gian hoạt động",
  resources: "Tài nguyên",
  customers: "Khách hàng",
  waitlist: "Danh sách chờ",
  billing: "Thanh toán",
  treatments: "Liệu trình",
  warranty: "Bảo hành",
  "audit-logs": "Nhật ký hệ thống",
  packages: "Gói dịch vụ",
  reviews: "Đánh giá",
  "customer-info": "Thông tin khách hàng", // Sửa từ 'payment'
};

// Hàm lấy title cho breadcrumb với fallback thông minh
export const getBreadcrumbTitle = (segment: string): string => {
  if (BREADCRUMB_MAP[segment]) return BREADCRUMB_MAP[segment];

  // Suy luận từ slug (ví dụ: user-profile -> User profile)
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    group: "Bảng điều khiển",
    items: [
      {
        title: "Làm việc (KTV)",
        href: "/admin/workspace",
        icon: LayoutDashboard,
      },
      {
        title: "Báo cáo (Quản lý)",
        href: "/admin/dashboard",
        icon: FileText,
      },
    ],
  },
  {
    group: "Vận hành",
    items: [
      {
        title: "Lịch hẹn",
        href: "/admin/appointments",
        icon: Calendar,
      },
      {
        title: "Danh sách chờ",
        href: "/admin/waitlist",
        icon: CalendarClock,
      },
      {
        title: "Hóa đơn & Billing",
        href: "/admin/billing",
        icon: CreditCard,
      },
    ],
  },
  {
    group: "Quản lý khách hàng",
    items: [
      {
        title: "Khách hàng",
        href: "/admin/customers",
        icon: Users,
      },
      {
        title: "Liệu trình dịch vụ",
        href: "/admin/treatments",
        icon: ClipboardList,
      },
      {
        title: "Gói dịch vụ",
        href: "/admin/packages",
        icon: Package,
      },
      {
        title: "Bảo hành",
        href: "/admin/warranty",
        icon: ShieldCheck,
      },
      {
        title: "Đánh giá",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    group: "Nguồn lực & Nhân sự",
    items: [
      {
        title: "Đội ngũ nhân viên",
        href: "/admin/staff",
        icon: User,
      },
      {
        title: "Dịch vụ & Menu",
        href: "/admin/services",
        icon: Scissors,
      },
      {
        title: "Gói tài nguyên",
        href: "/admin/resources",
        icon: Box,
      },
    ],
  },
  {
    group: "Hệ thống",
    items: [
      {
        title: "Nhật ký hệ thống",
        href: "/admin/audit-logs",
        icon: FileText,
      },
      {
        title: "Cài đặt chung",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

// Giữ lại để không làm hỏng các component cũ đang import SIDEBAR_ITEMS (sẽ refactor sau)
export const SIDEBAR_ITEMS: SidebarItem[] = SIDEBAR_GROUPS.flatMap(g => g.items);
