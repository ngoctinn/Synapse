import {
  LayoutGrid,
  Calendar,
  Clock,
  CreditCard,
  Users,
  ClipboardList,
  Box,
  ShieldCheck,
  Star,
  User,
  Scissors,
  FileText,
  Archive,
  Settings,
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
  staff: "Nhân viên",
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
  billing: "Hóa đơn",
  treatments: "Liệu trình",
  warranty: "Bảo hành",
  "audit-logs": "Nhật ký",
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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    group: "Bảng điều khiển",
    items: [
      {
        title: "Làm việc",
        href: "/admin/workspace",
        icon: LayoutGrid,
      },
      {
        title: "Báo cáo",
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
        icon: Clock,
      },
      {
        title: "Hóa đơn",
        href: "/admin/billing",
        icon: CreditCard,
      },
    ],
  },
  {
    group: "Khách hàng",
    items: [
      {
        title: "Danh sách",
        href: "/admin/customers",
        icon: Users,
      },
      {
        title: "Liệu trình",
        href: "/admin/treatments",
        icon: ClipboardList,
      },
      {
        title: "Gói dịch vụ",
        href: "/admin/packages",
        icon: Archive,
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
    group: "Nhân sự & Menu",
    items: [
      {
        title: "Nhân viên",
        href: "/admin/staff",
        icon: User,
      },
      {
        title: "Dịch vụ",
        href: "/admin/services",
        icon: Scissors,
      },
      {
        title: "Tài nguyên",
        href: "/admin/resources",
        icon: Box,
      },
    ],
  },
  {
    group: "Hệ thống",
    items: [
      {
        title: "Nhật ký",
        href: "/admin/audit-logs",
        icon: FileText,
      },
      {
        title: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

// Giữ lại để không làm hỏng các component cũ đang import SIDEBAR_ITEMS (sẽ refactor sau)
export const SIDEBAR_ITEMS: SidebarItem[] = SIDEBAR_GROUPS.flatMap(
  (g) => g.items
);
