import Link from "next/link";
import AnimatedButton from "@/app/components/animation/AnimatedButton";
export default function About() {
  return (
    <section className="-translate-y-10 h-11/12 rounded-t-4xl   bg-linear-to-b from-white via-white to-[#e4f3f6]  w-full  flex flex-col p-5  items-center text-center">
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-4xl md:text-5xl lg:8xl p-5 text-shadow-lg">
        More About Genotif
      </h1>
      <p className="text-[#00354E] text-md md:text-lg lg:text-xl  font-['body-regular'] text-balance text-shadow-xs p-5 md:max-w-3/4">
        Genotif merupakan sebuah akronim dari{" "}
        <b>Generasi Orang-Orang Kreatif dan Inovatif </b> . Genotif bertujuan
        menyediakan wadah bagi siswa SMA Negeri 1 Ciranjang untuk mengembangkan
        bakat dan gagasan kreatif mereka, yang ditampilkan dalam acara tahunan
        terbesar di sekolah—sebuah acara yang secara konsisten menunjukkan
        inovasi dari tahun ke tahun.
      </p>
      <div className="flex flex-col gap-4">
        <AnimatedButton
          link="/gallery"
          customStyle="after:content-['_↗'] font-['body-regular'] font-black text-sm md:text-lg flex bg-[#00354E] backdrop-blur-md border shadow-sm ring-[#BAE0E2] w-44 h-12 md:w-52 md:h-14  text-center items-center justify-center p-2  text-white rounded-full"
        >
          VISIT THE GALLERY
        </AnimatedButton>
        <AnimatedButton
          href="/"
          customStyle="font-['body-regular']  font-bold  text-sm md:text-lg flex bg-white/60 backdrop-blur-md border shadow-sm border-[#BAE0E2] w-44 h-12 md:w-52 md:h-14 text-center items-center justify-center p-2 text-[#00354E] rounded-full"
        >
          THEME
        </AnimatedButton>
      </div>
    </section>
  );
}
