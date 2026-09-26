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
    "Logo placement across event banners, print, and social assets",
    "Guest passes for your representatives",
    "Stage recognition during opening and closing ceremonies",
    "Direct access to 1,500+ students,",
  ];
  const tenant_benefit = [
    "Booth space at Genotif",
    "Guest passes for your representatives",
    "Stage recognition during opening and closing ceremonies",
    "Direct access to 1,500+ students",
  ];
  const medpart_benefit = [
    "Official media partner badge on all print & digital assets",
    "Press access to opening and stage performances",
    "Co-branded content across GENOTIF social channels",
    "Priority updates and behind-the-scenes coverage",
  ];
  return (
    <section className="scroll-smooth flex flex-col  min-w-screen bg-[#e4f3f6] min-h-screen overflow-hidden ">
      <Navbar />
      <GlobalHero
        ttl="Partnership"
        desc=" Pledge Your Banner, open a stall in the magic market or lend your voice as a media partner. Every alliance strengthens the kingdom."
        bgSrc="/content/hero-partnershipb.jpg"
      />
      <div className="flex flex-col p-5 justify-center items-center gap-20 mt-20 ">
        <div className="md:w-3/4">
          <Title
            ttl="Become A Sponsor "
            paragraph=" Sponsors keep the tents standing and the lanterns lit. Choose a rank and be named among the founders of the realm."
            lst={sponsor_benefit}></Title>
          <Sponsor />
        </div>
        <div className="md:w-3/4">
          <Title
            ttl="Become A Tenant "
            paragraph=" Join GENOTIF as a tenant and reach over 1000 SMAN 1 Ciranjang students. Get a strategic spot, promotional support, and a lively atmosphere to grow your business."
            lst={tenant_benefit}></Title>
          <Tenant />
        </div>
        <div className="md:w-3/4">
          <Title
            ttl="Media Partner "
            paragraph="Help carry the news of GENOTIF 47 across the realm. In return, your brand rides alongside the festival on banners, posts, and the main stage."
            lst={medpart_benefit}></Title>
          <MedPart />
        </div>
      </div>

      <Footer />
    </section>
  );
}
