import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section id="contact" className="container mx-auto px-4 py-16 md:py-24">
      <div className="bg-primary relative overflow-hidden rounded-lg px-6 py-16 text-center shadow-2xl md:px-16 md:py-24">
        <div className="animate-fade-in relative z-10 mx-auto max-w-3xl space-y-6">
          <h2 className="font-heading text-primary-foreground text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Sẵn sàng nâng tầm Spa của bạn?
          </h2>
          <p className="text-primary-foreground/80 mx-auto max-w-2xl text-lg md:text-xl">
            Tham gia cùng hàng trăm chủ Spa khác đang sử dụng Synapse. Không cần
            thẻ tín dụng, dùng thử 14 ngày miễn phí.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full rounded-full px-8 text-lg font-semibold shadow-lg transition-transform hover:scale-105 sm:w-auto"
              >
                Bắt đầu dùng thử miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 h-12 w-full rounded-full px-8 text-lg transition-transform hover:scale-105 sm:w-auto"
              >
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>
    </section>
  );
}
