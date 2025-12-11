"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Card, CardContent } from "@/shared/ui/card"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Nguyễn Thu Hà",
    role: "Chủ Spa Lotus",
    content: "Synapse đã thay đổi hoàn toàn cách tôi quản lý spa. Từ việc đặt lịch đến quản lý nhân viên, mọi thứ đều trở nên dễ dàng và chuyên nghiệp hơn.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ha",
    initials: "NH"
  },
  {
    name: "Trần Minh Tuấn",
    role: "Quản lý Aura Beauty",
    content: "Giao diện đẹp, dễ sử dụng. Khách hàng của tôi rất thích tính năng đặt lịch online. Doanh thu tăng 30% sau 2 tháng sử dụng.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Tuan",
    initials: "MT"
  },
  {
    name: "Lê Thị Mai",
    role: "CEO Mai Spa",
    content: "Đội ngũ hỗ trợ rất nhiệt tình. Hệ thống báo cáo chi tiết giúp tôi nắm bắt tình hình kinh doanh mọi lúc mọi nơi.",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mai",
    initials: "LM"
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="container mx-auto px-4 py-16 md:py-24 relative">
       {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background -z-10" />

      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
          Khách hàng nói gì về chúng tôi
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Được tin dùng bởi hơn 500+ Spa và thẩm mỹ viện trên toàn quốc.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col gap-6 h-full">
                <Quote className="h-10 w-10 text-primary/40" />
                <p className="text-muted-foreground leading-relaxed flex-1 italic relative z-10">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
