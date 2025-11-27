import { Footer, Header } from "@/features/layout";
import { Button } from "@/shared/ui/button";
import { BarChart3, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-24 md:pb-12 md:pt-32 lg:py-40">
          <div className="container mx-auto px-4 flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
              🚀 Phiên bản Beta đã sẵn sàng
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
              Quản lý Spa chuyên nghiệp <br /> Đơn giản hóa vận hành
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Synapse giúp bạn quản lý lịch hẹn, khách hàng và nhân viên một cách hiệu quả.
              Tập trung vào trải nghiệm khách hàng, để công nghệ lo phần còn lại.
            </p>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" className="h-11 px-8">
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="h-11 px-8">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 rounded-3xl">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Tính năng vượt trội
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Mọi thứ bạn cần để vận hành Spa trơn tru, từ đặt lịch đến báo cáo doanh thu.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Calendar className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Đặt lịch thông minh</h3>
                  <p className="text-sm text-muted-foreground">
                    Tự động hóa quy trình đặt lịch, tránh trùng lặp và tối ưu nguồn lực.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Users className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Quản lý khách hàng</h3>
                  <p className="text-sm text-muted-foreground">
                    Lưu trữ hồ sơ, lịch sử liệu trình và chăm sóc khách hàng cá nhân hóa.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BarChart3 className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Báo cáo chi tiết</h3>
                  <p className="text-sm text-muted-foreground">
                    Theo dõi doanh thu, hiệu suất nhân viên và xu hướng kinh doanh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
