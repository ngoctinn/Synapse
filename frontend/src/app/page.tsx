import { CTASection } from "@/features/landing-page/components/cta-section";
import { Features } from "@/features/landing-page/components/features";
import { Hero } from "@/features/landing-page/components/hero";
import { Testimonials } from "@/features/landing-page/components/testimonials";
import { Footer, Header } from "@/features/layout";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
