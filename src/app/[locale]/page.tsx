import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ModelsSection from "@/components/ModelsSection";
import ComingSoonSection from "@/components/ComingSoonSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ModelsSection />
        <ComingSoonSection />
      </main>
      <Footer />
    </>
  );
}
