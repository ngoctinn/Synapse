
export const APPOINTMENT_STATUS_CONFIG: Record<
    string,
    { label: string; color: "amber" | "blue" | "indigo" | "emerald" | "slate" | "rose" }
> = {
    pending: { label: "Chờ xác nhận", color: "amber" },
    confirmed: { label: "Đã xác nhận", color: "blue" },
    serving: { label: "Đang phục vụ", color: "indigo" },
    completed: { label: "Hoàn thành", color: "emerald" },
    cancelled: { label: "Đã hủy", color: "slate" },
    "no-show": { label: "Không đến", color: "rose" },
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
