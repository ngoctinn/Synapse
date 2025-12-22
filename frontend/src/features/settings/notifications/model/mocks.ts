import { NotificationChannel, NotificationEvent } from "./types";

export const MOCK_CHANNELS: NotificationChannel[] = [
  {
    id: "zalo",
    name: "Zalo OA",
    description: "Gửi tin nhắn thông báo qua Zalo Official Account.",
    isConnected: true,
    icon: "message-circle",
    config: {
      oaId: "1234567890",
      accessToken: "****************",
    },
  },
  {
    id: "sms",
    name: "SMS Brandname",
    description: "Gửi tin nhắn văn bản SMS với tên thương hiệu.",
    isConnected: false,
    icon: "smartphone",
    config: {},
  },
  {
    id: "email",
    name: "Email (SMTP)",
    description: "Gửi email thông báo xác nhận và nhắc nhở.",
    isConnected: true,
    icon: "mail",
    config: {
      host: "smtp.gmail.com",
      port: 587,
      user: "spa@synapse.com",
    },
  },
];

export const MOCK_EVENTS: NotificationEvent[] = [
  {
    id: "evt_booking_success",
    name: "Đặt lịch thành công",
    description: "Gửi thông báo khi khách hàng đặt lịch hẹn mới thành công.",
    group: "customer",
    channels: {
      zalo: true,
      sms: false,
      email: true,
    },
    templates: {
      zalo: {
        content: "Xin chào {{customer_name}}, lịch hẹn của bạn lúc {{time}} ngày {{date}} đã được xác nhận. Mã đặt lịch: {{booking_id}}.",
        variables: ["customer_name", "time", "date", "booking_id", "service_name"],
      },
      email: {
        subject: "Xác nhận đặt lịch hẹn - Synapse Spa",
        content: "<p>Kính gửi {{customer_name}},</p><p>Chúng tôi đã nhận được lịch hẹn của bạn...</p>",
        variables: ["customer_name", "time", "date", "booking_id", "location"],
      },
    },
  },
  {
    id: "evt_reminder_2h",
    name: "Nhắc lịch trước 2h",
    description: "Tự động nhắc khách hàng trước khi đến giờ hẹn 2 tiếng.",
    group: "customer",
    channels: {
      zalo: true,
      sms: true,
      email: false,
    },
    templates: {
      zalo: {
        content: "Nhắc nhở: Bạn có lịch hẹn tại Synapse Spa vào lúc {{time}} hôm nay. Vui lòng đến đúng giờ nhé!",
        variables: ["customer_name", "time", "service_name"],
      },
      sms: {
        content: "Synapse Spa nhac: Ban co lich hen luc {{time}}. LH: 1900xxxx.",
        variables: ["time"],
      },
    },
  },
  {
    id: "evt_staff_new_booking",
    name: "Có lịch đặt mới",
    description: "Thông báo cho nhân viên khi được chỉ định vào lịch hẹn mới.",
    group: "staff",
    channels: {
      zalo: true,
      sms: false,
      email: false,
    },
    templates: {
      zalo: {
        content: "Bạn có lịch hẹn mới với khách hàng {{customer_name}} vào lúc {{time}}.",
        variables: ["customer_name", "time", "service_name"],
      },
    },
  },
   {
    id: "evt_booking_cancelled",
    name: "Lịch hẹn bị hủy",
    description: "Thông báo xác nhận khi lịch hẹn bị hủy.",
    group: "customer",
    channels: {
      zalo: true,
      sms: false,
      email: true,
    },
     templates: {
      zalo: {
        content: "Lịch hẹn {{booking_id}} của bạn đã hủy thành công.",
        variables: ["booking_id"],
      },
    },
  },
];
