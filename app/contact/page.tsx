import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import Card from "../components/contact_elements/card";
import AnimatedSection from "@/app/components/animation/AnimatedSection";
import GlobalHero from "@/app/components/global/GlobalHero";
export default function Contact() {
  return (
    <section className="bg-[#e4f3f6] ">
      <Navbar />
      <GlobalHero
        ttl="Contact Person"
        desc="Have questions about GENOTIF, or interested in joining as a
              sponsor, tenant, or media partner? Don't hesitate to reach out!
              The GENOTIF committee is ready to help with more information, from
              partnership details and registration requirements to the event
              schedule."
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
          <Card
            cardTtl="CRITISM AND SUGGESTION"
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
