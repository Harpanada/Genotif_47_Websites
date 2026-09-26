import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import GallerySection from "@/app/components/gallery_elments/GallerySection";
import GlobalHero from "@/app/components/global/GlobalHero";
export default function Gallery() {
  return (
    <section className="scroll-smooth min-w-screen min-h-screen bg-[#e4f3f6]">
      <Navbar />
      <GlobalHero
        bgSrc="/content/hero-edelweiss.webp"
        ttl=" Hall of Memories"
        desc="  Genotif is more than a one-day event. It's a long process, born
              from thousands of small moments, woven together by the entire
              school community along the way. We've gathered all those memories
              here, to be remembered forever."
      />
      <GallerySection />
      <Footer />
    </section>
  );
}
