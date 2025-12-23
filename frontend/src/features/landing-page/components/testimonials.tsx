import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thu Hà",
    role: "Chủ Spa Lotus",
    content:
      "Synapse đã thay đổi hoàn toàn cách tôi quản lý spa. Từ việc đặt lịch đến quản lý nhân viên, mọi thứ đều trở nên dễ dàng và chuyên nghiệp hơn.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ha",
    initials: "NH",
  },
  {
    name: "Trần Minh Tuấn",
    role: "Quản lý Aura Beauty",
    content:
      "Giao diện đẹp, dễ sử dụng. Khách hàng của tôi rất thích tính năng đặt lịch online. Doanh thu tăng 30% sau 2 tháng sử dụng.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Tuan",
    initials: "MT",
  },
  {
    name: "Lê Thị Mai",
    role: "CEO Mai Spa",
    content:
      "Đội ngũ hỗ trợ rất nhiệt tình. Hệ thống báo cáo chi tiết giúp tôi nắm bắt tình hình kinh doanh mọi lúc mọi nơi.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mai",
    initials: "LM",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="container relative mx-auto px-4 py-16 md:py-24"
    >
      {/* Background gradient for depth */}
      <div className="from-muted/30 to-background absolute inset-0 -z-10 bg-gradient-to-b" />

      <div className="animate-fade-in mx-auto mb-16 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <Badge variant="soft">Nhận xét của khách hàng</Badge>
        <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Khách hàng nói gì về chúng tôi
        </h2>
        <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Được tin dùng bởi hơn 500+ Spa và thẩm mỹ viện trên toàn quốc.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="surface-card h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="flex h-full flex-col gap-6 p-8">
              <Quote className="text-primary/40 h-8 w-8" />
              <p className="text-muted-foreground relative z-10 flex-1 italic leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="border-border/50 flex items-center gap-4 border-t pt-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
