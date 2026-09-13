import Link from "next/link";

export default function Hero() {
  return (
    <section className="p-6 flex flex-col text-center gap-14 items-center justify-center w-full bg-cover bg-center h-screen bg-no-repeat bg-fixed  bg-[url(/content/hero-edelweiss.jpg)]  ">
      <div className="flex flex-col gap-5">
        <h1 className="font-['Telma-Bold']  text-6xl text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]">
          {" "}
          Genotif 47
        </h1>{" "}
        <p className="text-[#00354E] text-md  font-['poppins-light'] font-bold text-shadow-lg ">
          Genotif is an acronym for{" "}
          <q className="italic"> Generasi Orang-Orang Kreatif dan Inovatif</q>,
          or in English it means a Generation of Creative and Innovative People.
        </p>
      </div>
      <div className=" flex flex-col gap-3">
        <Link
          href={"/"}
          className="font-['poppins-light'] font-extrabold text-xs flex bg-[#00354E] shadow-sm w-44 h-12 text-center items-center justify-center p-2 text-white rounded-full">
          SEE THE DAY'S TALE
        </Link>
        <Link
          href={"/components/partnership"}
          className="font-['poppins-light'] font-extrabold text-xs flex bg-white/60 backdrop-blur-md border shadow-sm border-[#BAE0E2] w-44 h-12 text-center items-center justify-center p-2 text-[#00354E] rounded-full">
          BECOME A PARTNERS
        </Link>
      </div>
    </section>
  );
}
