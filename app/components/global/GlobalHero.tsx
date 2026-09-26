import AnimatedSection from "@/app/components/animation/AnimatedSection";
export default function GlobalHero({ bgSrc, ttl, desc }: any) {
  return (
    <div
      style={{ backgroundImage: `url(${bgSrc})` }}
      className={` mask-b-from-90% to-100% bg-cover bg-center  w-screen  h-screen bg-no-repeat  z-0 bg-fixed`}>
      <div className="z-10  absolute top-44 md:top-52 lg:top-60 w-full  ">
        <div className="p-5 text-center flex justify-center flex-col items-center w-full  ">
          <AnimatedSection direction_y={-40} ease={"easeOut"} duration={0.5}>
            <h1 className="font-['Telma-Bold'] text-6xl  text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]  md:text-6xl lg:text-8xl   ">
              {ttl}
            </h1>
          </AnimatedSection>
          <AnimatedSection direction_y={40} ease={"easeOut"} duration={0.5}>
            <p className="text-[#00354E] text-balance text-lg md:text-lg lg:text-xl xl:text-2xl md:max-w-3/5  font-['poppins-light'] font-bold text-shadow-lg ">
              {desc}
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
