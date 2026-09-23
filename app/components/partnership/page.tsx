import Navbar from "@/app/components/main/Navbar";
import Footer from "@/app/components/main/Footer";
import Sponsor from "./Sponsor";
import Tenant from "./Tenant";
import MedPart from "./MedPart";
import Title from "./elments/Title";
import AnimatedSection from "@/app/components/main/animation/AnimatedSection";
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
      <div className="absolute top-44 z-10  w-full">
        <AnimatedSection>
          <div className="p-5 flex flex-col justify-center text-center items-center gap-3">
            <h1 className=" font-['Telma-Bold']  w-full text-6xl text-center text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3] md:text-6xl lg:text-8xl ">
              Partnership
            </h1>
            <p className="text-[#00354E] text-lg md:text-lg lg:text-xl text-shadow-2xs text-balance text-center font-['poppins-light'] font-bold w-11/12  ">
              Pledge Your Banner, open a stall in the magic market or lend your{" "}
              <br />
              voice as a media partner. Every alliance strengthens the kingdom.
            </p>
          </div>
        </AnimatedSection>
      </div>
      <div className="mask-b-from-35% mask-b-to-100% bg-[url(/content/hero-partnershipb.jpg)] brightness-80 min-h-screen bg-no-repeat w-auto bg-cover bg-center z-0 bg-fixed"></div>
      {/* <div className="absolute bottom-0 left-0 w-full h-32  bg-linear-to-b from-transparent to-[#e4f3f6] pointer-events-none "></div> */}
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
