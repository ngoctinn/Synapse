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
      <div className="animate-fade-in mx-auto mb-16 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <Badge variant="soft">Tại sao chọn chúng tôi</Badge>
        <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Tính năng vượt trội
        </h2>
        <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Mọi thứ bạn cần để vận hành Spa trơn tru, từ đặt lịch đến báo cáo
          doanh thu.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="surface-card group relative flex h-full flex-col justify-between overflow-hidden rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
