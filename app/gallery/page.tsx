import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import GallerySection from "@/app/components/gallery_elments/GallerySection";
import GlobalHero from "@/app/components/global/GlobalHero";
export default function Gallery() {
  return (
    <section className="scroll-smooth min-w-screen min-h-screen bg-[#e4f3f6] overflow-hidden">
      <Navbar />
      <GlobalHero
        bgSrc={"/content/hero-edelweiss.webp"}
        ttl=" Hall of Memories"
        desc="Genotif adalah sebuah proses panjang yang lahir dari ribuan momen kecil, 
        yang dirajut bersama oleh seluruh warga sekolah sepanjang perjalanannya. 
        Kami telah mengumpulkan semua kenangan tersebut di sini, untuk dikenang selamanya."
      />
      <GallerySection />
      <Footer />
    </section>
  );
}
