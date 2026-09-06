import Navbar from "./components/main/Navbar";
import Footer from "./components/main/Footer";
import Hero from "./components/main/Hero";
import About from "./components/main/About";
import News from "./components/main/News";
export default function Home() {
  return (
    <div className="scroll-smooth bg-white min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <News />
      <div className="w-full min-h-screen"></div>
      <Footer />
    </div>
  );
}
