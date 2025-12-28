import Navigation from "@/components/Navigation";
import WaveHeader from "@/components/WaveHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import AllFeaturesSection from "@/components/AllFeaturesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Wave Header */}
      <WaveHeader className="h-0" />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* All Features Section */}
      <AllFeaturesSection />

      {/* Contact Section */}
      <ContactSection />

      

      {/* Footer */}
      <Footer />
    </div>
  );
}
