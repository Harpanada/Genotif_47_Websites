"use client";
import Link from "next/link";
import AnimatedSection from "@/app/components/animation/AnimatedSection";
import AnimatedButton from "@/app/components/animation/AnimatedButton";
export default function Hero() {
  return (
    <section className="p-6 flex flex-col text-center gap-14 items-center justify-center w-screen bg-cover bg-center h-screen bg-no-repeat bg-fixed  bg-[url(/content/hero-edelweiss.webp)]  ">
      <div className="flex flex-col text-center gap-14 items-center justify-center w-full h-full">
        <div className="flex flex-col gap-5 justify-center items-center  ">
          <AnimatedSection direction_y={40} ease={"easeOut"} duration={0.5}>
            <h1 className="font-['Telma-Bold'] mt-10 md:mt-0 md:text-7xl lg:text-8xl xl:text-9xl text-7xl text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]">
              {" "}
              Genotif 47
            </h1>{" "}
          </AnimatedSection>
          <AnimatedSection
            customStyle="text-[#00354E] text-balance text-md md:text-lg lg:text-xl xl:text-2xl md:max-w-3/5  font-['poppins-light'] font-bold text-shadow-lg "
            direction_y={20}
            duration={0.8}
            ease={"easeInOut"}>
            <p className=" ">
              Genotif is an acronym for{" "}
              <q className="italic">
                {" "}
                Generasi Orang-Orang Kreatif dan Inovatif
              </q>
              , or in English it means a Generation of Creative and Innovative
              People.
            </p>
          </AnimatedSection>
        </div>
        <div className=" flex flex-col gap-3">
          <AnimatedSection ease={"easeOut"} direction_x={100} duration={0.8}>
            <AnimatedButton
              link="/"
              customStyle="font-['poppins-light'] font-bold text-xs md:text-sm lg:text-lg flex bg-[#00354E] shadow-sm w-44 h-12  lg:w-64 lg:h-16 text-center items-center justify-center p-2 text-white rounded-full">
              SEE THE DAY'S TALE
            </AnimatedButton>
          </AnimatedSection>
          <AnimatedSection ease={"easeOut"} direction_x={-100} duration={0.8}>
            <AnimatedButton
              link="/components/partnership"
              customStyle="font-['poppins-light'] font-bold text-xs md:text-sm lg:text-lg flex bg-white/60 backdrop-blur-md border shadow-sm lg:w-64 lg:h-16 border-[#BAE0E2] w-44 h-12 text-center items-center justify-center p-2 text-[#00354E] rounded-full">
              BECOME A PARTNERS
            </AnimatedButton>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
