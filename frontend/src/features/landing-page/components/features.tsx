import { Badge } from "@/shared/ui/badge";
import {
  BarChart3,
  Calendar,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Đặt lịch thông minh",
    description:
      "Tự động hóa quy trình đặt lịch, tránh trùng lặp và tối ưu nguồn lực.",
  },
  {
    icon: Users,
    title: "Quản lý khách hàng",
    description:
      "Lưu trữ hồ sơ, lịch sử liệu trình và chăm sóc khách hàng cá nhân hóa.",
  },
  {
    icon: BarChart3,
    title: "Báo cáo chi tiết",
    description:
      "Theo dõi doanh thu, hiệu suất nhân viên và xu hướng kinh doanh.",
  },
  {
    icon: Sparkles,
    title: "Marketing tự động",
    description:
      "Gửi tin nhắn nhắc lịch, chúc mừng sinh nhật và khuyến mãi tự động.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật tuyệt đối",
    description: "Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế.",
  },
  {
    icon: Zap,
    title: "Hiệu năng cao",
    description:
      "Hoạt động mượt mà trên mọi thiết bị, từ điện thoại đến máy tính.",
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16 animate-fade-in">
        <Badge variant="soft">Tại sao chọn chúng tôi</Badge>
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
          Tính năng vượt trội
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Mọi thứ bạn cần để vận hành Spa trơn tru, từ đặt lịch đến báo cáo
          doanh thu.
        </p>
      </div>

      <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-6xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg surface-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
