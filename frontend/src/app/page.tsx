import { CTASection, Features, Hero, ServicesSection, Testimonials } from "@/features/landing-page";
import { Footer, Header } from "@/shared/components/layout";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/50">
        <Hero />

        <ServicesSection />
        <Features />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
