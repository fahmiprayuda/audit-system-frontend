import Navbar from "@/components/Navbar";
import NavbarTesla from "@/components/NavbarTesla";
import Footer from "@/components/Footer";
import {CTASection} from "@/components/CTASection";
import About from "@/components/About";
import Service from "@/components/Service";
import Contact from "@/components/Contact";
import Trust from "@/components/Trust";
import Portfolio from "@/components/Portfolio";
import HeroApple from "@/components/HeroApple";
import HeroTesla from "@/components/HeroTesla";
import HeroNike from "@/components/HeroNike";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import DoctorsPreview from "@/components/DoctorsPreview";

export default function Home() {
  return (
    <>
      <HeroApple />
      <About />
      <Trust />
      <Service />
      <DoctorsPreview />
      <Portfolio />
      <Contact/>
      <CTASection />
      <StickyWhatsApp />
    </>
  );
}
