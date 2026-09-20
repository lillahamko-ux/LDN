import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import Venues from "@/components/Venues";
import Reviews from "@/components/Reviews";
import GetInvolved from "@/components/GetInvolved";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <WhySection />
      <Venues />
      <Reviews />
      <GetInvolved />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
