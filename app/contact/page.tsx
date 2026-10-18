import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import Card from "../components/contact_elements/card";
import AnimatedSection from "@/app/components/animation/AnimatedSection";
import GlobalHero from "@/app/components/global/GlobalHero";

const getWALink = (phone: string, text: string) => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
const cpData = {
  mediaPartner: {
    phone: "6289630681954",
    msg: "Halo Coordinator Media Partner Genotif 47, saya [Nama] dari [Nama Media/Instansi]. Saya ingin berdiskusi mengenai penawaran kerja sama Media Partner untuk acara Genotif 47. Mohon informasinya, terima kasih!",
  },
  sponsor: {
    phone: "6285846083395",
    msg: "Halo Coordinator Sponsorship Genotif 47, saya [Nama] dari [Nama Perusahaan/Brand]. Saya tertarik untuk mengetahui lebih lanjut terkait proposal dan paket sponsorship acara Genotif 47. Mohon informasinya, terima kasih!",
  },
  tenant: {
    phone: "6285545071795",
    msg: "Halo Coordinator Tenant Genotif 47, saya [Nama] dari [Nama Stand/Brand Usaha]. Saya ingin menanyakan informasi pendaftaran booth/tenant untuk acara Genotif 47. Mohon informasinya, terima kasih!",
  },
};
export default function Contact() {
  return (
    <section className="bg-[#e4f3f6] ">
      <Navbar />
      <GlobalHero
        ttl="Contact Person"
        desc="Punya pertanyaan seputar GENOTIF, atau tertarik untuk bergabung sebagai
    sponsor, tenant, atau media partner? Jangan ragu untuk menghubungi kami! 
Panitia GENOTIF siap membantu memberikan informasi lebih lanjut, mulai
dari detail kerja sama dan persyaratan pendaftaran hingga jadwal
acara."
        bgSrc="/content/contact_page.webp"
      />
      <div className="min-h-screen  flex flex-col gap-5 mb-10 items-center justify-center ">
        <h2 className="text-[#00354E] font-['Telma-Bold'] mt-10 text-center text-shadow-2xs  text-5xl md:text-6xl   ">
          Who to Call
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
          {" "}
          <Card
            cardTtl="SPONSORSHIP COORDINATOR"
            person="Afina"
            cardLink={getWALink(cpData.sponsor.phone, cpData.sponsor.msg)}
            contact="+62 858-4608-3395"
          />
          <Card
            cardTtl="MEDIA-PARTNER COORDINATOR"
            person="Kaisar"
            cardLink={getWALink(
              cpData.mediaPartner.phone,
              cpData.mediaPartner.msg,
            )}
            contact="+62 0896-3068-1954"
          />
          <Card
            cardTtl="TENANT COORDINATOR"
            person="Rendi"
            cardLink={getWALink(cpData.tenant.phone, cpData.tenant.msg)}
            contact="+62 855-4507-1795"
          />
          <Card
            cardTtl="KRITIK DAN SARAN"
            person="Official Genotif E-Mail"
            cardLink="/"
            contact="genotifsmancir@gmail.com"
          />
        </div>
      </div>
      <Footer />
    </section>
  );
}
