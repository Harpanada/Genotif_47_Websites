import Link from "next/link";
export default function GalletyCard({
  imageSrc,
  cardTtl,
  cardSbttl,
  cardYear,
  linkDoc,
}: any) {
  return (
    <div
      className={`h-46 w-72 rounded-4xl border shadow-lg border-[#E3AD4B] overflow-hidden `}>
      <div className="flex flex-col absolute p-4 w-72  h-20 gap-12 ">
        <div className="z-10 flex justify-between">
          <h3 className=" text-xs  text-[#00354E] w-12 h-6  flex justify-center items-center font-black  font-['poppins-light'] bg-white/80 backdrop-blur-sm rounded-full p-2    ">
            {cardYear}
          </h3>
          <Link
            href={linkDoc}
            className="after:content-['_↗'] text-xs  text-[#00354E]  h-6  flex justify-center items-center font-black   font-['poppins-light'] bg-white/80 backdrop-blur-sm rounded-full p-2">
            {" "}
            SEE DETAILS
          </Link>
        </div>

        <div className="z-10 text-shadow-xs text-[#E3AD4B]  ">
          <h1 className=" font-['Telma-Bold'] text-2xl  ">{cardTtl}</h1>
          <p className=" text-sm   font-['poppins-light'] font-bold ">
            {cardSbttl}
          </p>
        </div>
      </div>

      <img
        className=" h-full w-full rounded-4xl brightness-80 object-cover   hover:scale-125 transition-all ease-in duration-300"
        src={imageSrc}
        alt="Containt"
      />
      <div className="absolute z-0 -translate-y-14  w-72 h-14 bg-linear-to-b from-transparent to-[#00354E]   rounded-b-4xl"></div>
    </div>
  );
}
