import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Hero from "@/components/main/Hero";
import About from "@/components/main/About";
import News from "@/components/main/News";
import Partners from "@/components/main/Partners";
import Map from "@/components/main/Map";

export default function Home() {
  return (
    <main className="scroll-smooth min-w-screen  min-h-screen bg-[#e4f3f6]">
      <Navbar />
      <Hero />
      <About />
      <News />
      <Map />
      <Partners />
      <Footer />
    </main>
  );
}
