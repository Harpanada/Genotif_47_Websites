import Navbar from "@/app/components/main/Navbar";
import Footer from "@/app/components/main/Footer";
import Sponsor from "./Sponsor";
import Tenant from "./Tenant";
import MedPart from "./MedPart";
export default function Partnership() {
  return (
    <section className="scroll-smooth flex flex-col  min-w-screen bg-[#e4f3f6] min-h-screen   overflow-hidden ">
      <Navbar />
      <div className="absolute top-44 z-10 p-5 flex flex-col justify-center text-center items-center gap-3">
        <h1 className=" font-['Telma-Bold']  w-full text-5xl text-center text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]  ">
          Partnership
        </h1>
        <p className="text-[#00354E] text-md text-shadow-2xs text-balance font-['poppins-light'] font-bold  ">
          Pledge Your Banner, open a stall in the magic market or lend your
          voice as a media partner. Every alliance strengthens the kingdom.
        </p>
      </div>
      <div className="bg-[url(/content/hero-partnershipb.jpg)] brightness-80 min-h-screen bg-no-repeat w-auto bg-cover bg-center z-0 bg-fixed"></div>
      <div className="absolute bottom-0 left-0 w-full h-32  bg-linear-to-b from-transparent to-[#e4f3f6] pointer-events-none "></div>
      <div className="p-5 flex flex-col gap-20 ">
        <Sponsor />
        <Tenant />
        <MedPart />
      </div>

      <Footer />
    </section>
  );
}
