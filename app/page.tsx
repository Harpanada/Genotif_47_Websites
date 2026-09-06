import Navbar from "./components/main/Navbar";
import Footer from "./components/main/Footer";
import Hero from "./components/main/Hero";
export default function Home() {
  return (
    <div className="bg-linear-to-b from-[#94E5FF] via-white to-[#FFF5D0] min-h-screen">
      <Navbar />
      <Hero />
      <div className="w-full min-h-screen"></div>
      <Footer />
    </div>
  );
}
