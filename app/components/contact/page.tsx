import Navbar from "@/app/components/main/Navbar";
import Footer from "@/app/components/main/Footer";
import Card from "./elments/card";
export default function Contact() {
  return (
    <section className="bg-[#e4f3f6]">
      <Navbar />
      <div className="min-h-screen  bg-cover bg-center  w-screen mask-b-from-10% mask-b-to-100%  bg-[url(/content/contact_page.jpg)]  "></div>
      <div className=" absolute flex flex-col  justify-center items-center p-7 top-30 gap-2">
        <h1 className="font-['Telma-Bold']  w-full text-5xl text-center text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3] ">
          Contact Person
        </h1>
        <p className="text-sm text-center text-[#00354E] text-md text-shadow-2xs  font-['poppins-light'] font-bold ">
          Have questions about GENOTIF, or interested in joining as a sponsor,
          tenant, or media partner? Don't hesitate to reach out! The GENOTIF
          committee is ready to help with more information, from partnership
          details and registration requirements to the event schedule.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-[#00354E] font-['Telma-Bold'] mt-10 text-center text-shadow-2xs  text-4xl ">
          Who to Call
        </h2>

        <div className="min-h-screen flex flex-col items-center gap-5">
          {" "}
          <Card
            cardTtl="SPONSORSHIP COORDINATOR"
            person="Someone"
            cardLink="/"
            contact="+62 856-1029-9765"
          />
          <Card
            cardTtl="MEDIA-PARTNER COORDINATOR"
            person="Someone"
            cardLink="/"
            contact="+62 856-1029-9765"
          />
          <Card
            cardTtl="TENANT COORDINATOR"
            person="Someone"
            cardLink="/"
            contact="+62 856-1029-9765"
          />
        </div>
      </div>

      <Footer />
    </section>
  );
}
