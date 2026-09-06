export default function Hero() {
  return (
    <section className="p-5 flex flex-col text-center gap-5  justify-center w-full bg-cover bg-center h-screen bg-no-repeat bg-fixed   bg-[url(/content/hero-edelweiss.jpg)]  ">
      <h1 className="font-['Telma-Bold'] -mt-72 text-6xl text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]">
        {" "}
        Genotif 47
      </h1>{" "}
      <p className="text-[#00354E]  text-balance">
        Genotif is the acronym for{" "}
        <q className="italic"> Generasi Orang-Orang Kreatif dan Inovatif</q>, or
        in English it means Creative and Innovative People Generation.
      </p>
    </section>
  );
}
