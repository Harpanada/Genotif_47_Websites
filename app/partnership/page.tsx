import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import Sponsor from "@/app/components/partnership_elments/Sponsor";
import Tenant from "@/app/components/partnership_elments/Tenant";
import MedPart from "@/app/components/partnership_elments/MedPart";
import Title from "@/app/components/partnership_elments/Title";
import AnimatedSection from "@/app/components/animation/AnimatedSection";
import GlobalHero from "@/app/components/global/GlobalHero";
export default function Partnership() {
  const sponsor_benefit = [
    "Penempatan logo pada spanduk acara, materi cetak, dan aset media sosial",
    "Tiket masuk bagi perwakilan Anda",
    "Penyebutan nama/apresiasi di panggung selama upacara pembukaan dan penutupan",
    "Akses langsung ke lebih dari 1.000 siswa,",
  ];
  const tenant_benefit = [
    "Ruang stan di Genotif",
    "Tiket tamu untuk perwakilan Anda",
    "Pengakuan di panggung selama upacara pembukaan dan penutupan",
    "Akses langsung ke lebih dari 1.500 mahasiswa",
  ];
  const medpart_benefit = [
    "Lencana mitra media resmi pada semua materi cetak & digital",
    "Akses pers untuk acara pembukaan dan pertunjukan panggung",
    "Konten *co-branding* di seluruh kanal media sosial GENOTIF",
    "Pembaruan prioritas dan liputan di balik layar",
  ];
  return (
    <section className="scroll-smooth flex flex-col  min-w-screen bg-[#e4f3f6] min-h-screen overflow-hidden ">
      <Navbar />
      <GlobalHero
        bgSrc="/content/hero.webp"
        ttl="Partnership"
        desc="Tunjukkan dukunganmu, buka stan di magic market, atau berikan suaramu sebagai media partner. Setiap aliansi memperkuat kerajaan."
      />
      <div className="flex flex-col p-5 justify-center items-center gap-20 mt-20 ">
        <div className="md:w-3/4">
          <Title
            ttl="Become A Sponsor "
            paragraph=" Sponsors keep the tents standing and the lanterns lit. Choose a rank and be named among the founders of the realm."
            lst={sponsor_benefit}
          ></Title>
          <Sponsor />
        </div>
        <div className="md:w-3/4">
          <Title
            ttl="Become A Tenant "
            paragraph=" Join GENOTIF as a tenant and reach over 1000 SMAN 1 Ciranjang students. Get a strategic spot, promotional support, and a lively atmosphere to grow your business."
            lst={tenant_benefit}
          ></Title>
          <Tenant />
        </div>
        <div className="md:w-3/4">
          <Title
            ttl="Media Partner "
            paragraph="Help carry the news of GENOTIF 47 across the realm. In return, your brand rides alongside the festival on banners, posts, and the main stage."
            lst={medpart_benefit}
          ></Title>
          <MedPart />
        </div>
      </div>
      <Footer />
    </section>
  );
}
