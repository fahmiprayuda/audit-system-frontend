import Navbar from "@/components/Navbar";
import NavbarTesla from "@/components/NavbarTesla";
import Footer from "@/components/Footer";
import About from "@/components/About";
import Menu from "@/components/Menu";
import Contact from "@/components/Contact";
import Trust from "@/components/Trust";
import Gallery from "@/components/Gallery";
import HeroApple from "@/components/HeroApple";
import HeroTesla from "@/components/HeroTesla";
import HeroNike from "@/components/HeroNike";

export default function Home() {
  return (
    <>
      <NavbarTesla />
      <HeroApple />
      <Trust />
      <About />
      <Menu/>
      <Gallery />
      <Contact/>
      <Footer />
    </>
  );
}
