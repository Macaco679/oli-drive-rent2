import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { HowToRent } from "@/components/landing/HowToRent";
import { DailyRental } from "@/components/landing/DailyRental";
import { CarsCarousel } from "@/components/landing/CarsCarousel";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";

export default function Home() {
  return (
    <div className="min-h-screen font-landing">
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <HowToRent />
        <DailyRental />
        <CarsCarousel />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
