
export const APPOINTMENT_STATUS_CONFIG: Record<
    string,
    {
        label: string;
        color: "amber" | "blue" | "indigo" | "emerald" | "slate" | "rose";
        badgeVariant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
        styles: {
            card: string;
            indicator: string;
        };
    }
> = {
    pending: {
        label: "Chờ xác nhận",
        color: "amber",
        badgeVariant: "warning",
        styles: {
            card: "bg-status-pending border-status-pending-border text-status-pending-foreground hover:bg-status-pending/90",
            indicator: "bg-status-pending-foreground",
        },
    },
    confirmed: {
        label: "Đã xác nhận",
        color: "blue",
        badgeVariant: "info",
        styles: {
            card: "bg-status-confirmed border-status-confirmed-border text-status-confirmed-foreground hover:bg-status-confirmed/90",
            indicator: "bg-status-confirmed-foreground",
        },
    },
    serving: {
        label: "Đang phục vụ",
        color: "emerald",
        badgeVariant: "success",
        styles: {
            card: "bg-status-serving border-status-serving-border text-status-serving-foreground hover:bg-status-serving/90 shadow-[0_0_10px_rgba(var(--status-serving),0.3)]",
            indicator: "bg-status-serving-foreground",
        },
    },
    completed: {
        label: "Hoàn thành",
        color: "slate",
        badgeVariant: "secondary",
        styles: {
            card: "bg-status-completed border-status-completed-border text-status-completed-foreground hover:bg-status-completed/90",
            indicator: "bg-status-completed-foreground",
        },
    },
    cancelled: {
        label: "Đã hủy",
        color: "rose",
        badgeVariant: "destructive",
        styles: {
            card: "bg-status-cancelled border-status-cancelled-border text-status-cancelled-foreground hover:bg-status-cancelled/90 opacity-80",
            indicator: "bg-status-cancelled-foreground",
        },
    },
    "no-show": {
        label: "Không đến",
        color: "rose",
        badgeVariant: "destructive",
        styles: {
            card: "bg-status-noshow border-status-noshow-border text-status-noshow-foreground hover:bg-status-noshow/90",
            indicator: "bg-status-noshow-foreground",
        },
    },
};

export const APPOINTMENT_STATUSES = Object.entries(APPOINTMENT_STATUS_CONFIG).map(([value, config]) => ({
    value,
    ...config,
}));

// Mock data staff - Should be replaced with API data
export const API_STAFF_OPTIONS = [
    { id: "1", name: "Nguyễn Văn A", role: "Senior Stylist" },
    { id: "2", name: "Trần Thị B", role: "Junior Stylist" },
    { id: "3", name: "Lê Văn C", role: "Trainee" },
];

// Mock data services - Should be replaced with API data
export const API_SERVICE_OPTIONS = [
    { id: "s1", name: "Cắt tóc Nam/Nữ", duration: 30, price: 150000 },
    { id: "s2", name: "Gội đầu Dưỡng sinh", duration: 45, price: 200000 },
    { id: "s3", name: "Massage Body Đá nóng", duration: 60, price: 450000 },
    { id: "s4", name: "Lấy nhân mụn chuẩn Y khoa", duration: 90, price: 350000 },
    { id: "s5", name: "Tẩy tế bào chết toàn thân", duration: 45, price: 250000 },
];
