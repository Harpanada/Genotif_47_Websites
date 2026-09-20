"use client";
import Navbar from "@/app/components/main/Navbar";
import Footer from "@/app/components/main/Footer";
import Hero from "@/app/components/main/Hero";
import About from "@/app/components/main/About";
import News from "@/app/components/main/News";
import Partners from "@/app/components/main/Partners";
import Map from "@/app/components/main/Map";
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
