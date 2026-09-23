import Link from "next/link";
import AnimatedButton from "@/app/components/main/animation/AnimatedButton";
export default function About() {
  return (
    <section className="-translate-y-10  rounded-t-4xl  bg-white w-full  flex flex-col p-5 min-h-screen  items-center text-center shadow-lg">
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-4xl md:text-5xl lg:8xl p-5 text-shadow-lg">
        More About Genotif
      </h1>
      <p className="text-[#00354E] text-md md:text-lg lg:text-xl  font-['poppins-light'] text-balance text-shadow-xs p-5 md:max-w-3/4">
        Genotif aims to provide a platform for students at SMA Negeri 1
        Ciranjang to develop their talents and creative ideas, which are
        showcased in the school's largest annual event—an event that
        consistently demonstrates innovation from year to year.
      </p>
      <div className="flex flex-col gap-4">
        <AnimatedButton
          link="/components/gallery"
          customStyle="after:content-['_↗'] font-['poppins-light'] font-black text-sm md:text-lg flex bg-[#00354E] backdrop-blur-md border shadow-sm ring-[#BAE0E2] w-44 h-12 md:w-52 md:h-14  text-center items-center justify-center p-2  text-white rounded-full">
          VISIT THE GALLERY
        </AnimatedButton>
        <AnimatedButton
          href="/"
          customStyle="font-['poppins-light'] font-bold  text-sm md:text-lg flex bg-white/60 backdrop-blur-md border shadow-sm border-[#BAE0E2] w-44 h-12 md:w-52 md:h-14 text-center items-center justify-center p-2 text-[#00354E] rounded-full">
          THEME
        </AnimatedButton>
      </div>
    </section>
  );
}
