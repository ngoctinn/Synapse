import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section id="contact" className="container mx-auto px-4 py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-24 text-center shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-fade-in">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground tracking-tight">
            Sẵn sàng nâng tầm Spa của bạn?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Tham gia cùng hàng trăm chủ Spa khác đang sử dụng Synapse. Không cần
            thẻ tín dụng, dùng thử 14 ngày miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-lg rounded-full w-full sm:w-auto font-semibold transition-transform hover:scale-105 shadow-lg"
              >
                Bắt đầu dùng thử miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-lg rounded-full w-full sm:w-auto text-primary-foreground hover:bg-primary-foreground/10 transition-transform hover:scale-105"
              >
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
