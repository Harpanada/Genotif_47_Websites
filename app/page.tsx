"use client";
import Navbar from "@/app/components/main/Navbar";
import Footer from "@/app/components/main/Footer";
import Hero from "@/app/components/main/Hero";
import About from "@/app/components/main/About";
import News from "@/app/components/main/News";
import Partners from "@/app/components/main/Partners";
import dynamic from "next/dynamic";
import { useMemo } from "react";
export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/main/Map"), {
        loading: () => <p className="p-4 text-center">Memuat peta...</p>,
        ssr: false, // MATIKAN SSR untuk komponen peta
      }),
    [],
  );
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
