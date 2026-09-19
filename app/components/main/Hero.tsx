import Link from "next/link";

export default function Hero() {
  return (
    <section className="p-6 flex flex-col text-center gap-14 items-center justify-center w-full bg-cover bg-center h-screen bg-no-repeat bg-fixed  bg-[url(/content/hero-edelweiss.jpg)]  ">
      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="font-['Telma-Bold'] mt-10 md:mt-0 md:text-7xl lg:text-8xl xl:text-9xl text-6xl text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]">
          {" "}
          Genotif 47
        </h1>{" "}
        <p className="text-[#00354E] text-balance text-md md:text-lg lg:text-xl xl:text-2xl md:max-w-3/5  font-['poppins-light'] font-bold text-shadow-lg ">
          Genotif is an acronym for{" "}
          <q className="italic"> Generasi Orang-Orang Kreatif dan Inovatif</q>,
          or in English it means a Generation of Creative and Innovative People.
        </p>
      </div>
      <div className=" flex flex-col gap-3">
        <Link
          href={"/"}
          className="font-['poppins-light'] font-bold text-xs md:text-sm lg:text-lg flex bg-[#00354E] shadow-sm w-44 h-12  lg:w-64 lg:h-16 text-center items-center justify-center p-2 text-white rounded-full">
          SEE THE DAY'S TALE
        </Link>
        <Link
          href={"/components/partnership"}
          className="font-['poppins-light'] font-bold text-xs md:text-sm lg:text-lg flex bg-white/60 backdrop-blur-md border shadow-sm lg:w-64 lg:h-16 border-[#BAE0E2] w-44 h-12 text-center items-center justify-center p-2 text-[#00354E] rounded-full">
          BECOME A PARTNERS
        </Link>
      </div>
    </section>
  );
}
