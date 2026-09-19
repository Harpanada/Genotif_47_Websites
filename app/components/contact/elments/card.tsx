import Link from "next/link";
export default function Card({ cardTtl, person, cardLink, contact }: any) {
  return (
    <section className=" w-72 md:w-80    min-h-30 flex flex-col justify-center gap-2 bg-white p-5 rounded-2xl shadow-lg shadow-[#94E5FF] ring ring-[#E3AD4B] font-['poppins-light'] font-black">
      <h1 className="  text-[#E3AD4B] font-black text-sm md:text-lg">
        {cardTtl}
      </h1>

      <div className=" text-[#00354E]">
        <h2 className="text-sm md:text-[18px]">{person}</h2>
        <h3 className=" text-sm md:text-[18px]  text-[#00354E]">{contact}</h3>
      </div>
      <div className="flex flex-col items-end ">
        <Link
          href={cardLink}
          className="text-sm md:text-[18px] bg-[#00354E] p-1 h-8 md:h-10 md:w-28 font-bold w-24 text-white  flex justify-center items-center rounded-4xl  ">
          Contact
        </Link>
      </div>
    </section>
  );
}
