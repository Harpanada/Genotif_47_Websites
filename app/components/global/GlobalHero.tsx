import AnimatedSection from "@/app/components/animation/AnimatedSection";
import { image } from "motion/react-client";

interface GlobalHeroProps {
  bgSrc: string;
  ttl: string;
  desc: string;
}
export default function GlobalHero({ bgSrc, ttl, desc }: GlobalHeroProps) {
  return (
    <section className="relative flex flex-col justify-between">
      <div
        style={{ backgroundImage: `url(${bgSrc})` }}
        className={`  bg-cover bg-center  w-screen  h-screen bg-no-repeat  z-0 bg-fixed p-6 flex flex-col text-center gap-14 items-center justify-center   `}
      >
        <div className="z-10  absolute top-44 md:top-52 lg:top-60 w-full  ">
          <div className="p-5 text-center flex justify-center flex-col items-center w-full  ">
            <AnimatedSection direction_y={-40} ease={"easeOut"} duration={0.5}>
              <h1 className="font-['Telma-Bold'] text-6xl  text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]  md:text-6xl lg:text-8xl   ">
                {ttl}
              </h1>
            </AnimatedSection>
            <AnimatedSection
              direction_y={40}
              ease={"easeOut"}
              duration={0.5}
              customStyle="flex flex-col justify-center items-center "
            >
              <p className="text-[#00354E] text-balance text-lg md:text-lg lg:text-xl xl:text-2xl md:max-w-3/5  font-['body-regular'] font-bold text-shadow-lg ">
                {desc}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-[#e4f3f6] to-transparent pointer-events-none"></div>
    </section>
  );
}
