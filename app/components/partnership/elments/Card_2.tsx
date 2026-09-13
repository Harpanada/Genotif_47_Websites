import { linkGc } from "next/dist/client/app-link-gc";
import Link from "next/link";
export default function CardTwo({
  cardTtl,
  give,
  recieve,
  platfrom,
  cardLink = "",
}: any) {
  return (
    <section className=" flex flex-col gap-4 justify-center bg-white w-72 h-64 p-5 rounded-2xl border  shadow-lg shadow-[#94E5FF]  border-[#E3AD4B] text-[#00354E] font-['poppins-light'] ">
      {" "}
      <div className=" flex justify-between items-center gap-1.5">
        <h1 className="font-['Telma-medium'] text-shadow-2xs text-3xl">
          {cardTtl}
        </h1>{" "}
        <h5 className=" text-center text-xs bg-[#93e195b6]  p-1 rounded-2xl text-[#156F41] font-bold ">
          {platfrom}
        </h5>
      </div>{" "}
      <div className="">
        <h2 className="font-black">You give</h2>
        <h3 className="text-sm">{give}</h3>
      </div>
      <div className="">
        <h2 className="font-black">You receive</h2>
        <h3 className="text-sm">{recieve}</h3>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link
          className="text-xs bg-white/50 backdrop-blur-2xl font-bold shadow-lg rounded-full  flex justify-center items-center w-60 h-8 ring ring-[#00354E]"
          href={cardLink}>
          PORPOSE A PARTNERSHIP
        </Link>
      </div>
    </section>
  );
}
