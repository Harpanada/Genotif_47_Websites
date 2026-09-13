import Link from "next/link";
export default function Card({ cardTitle, cardSubtitle, cardImg }: any) {
  return (
    <div className="w-72 h-72 flex flex-col border text-left  items-center  border-[#E3AD4B]  rounded-2xl bg-white/50  shadow-lg overflow-hidden">
      <img className=" h-1/2 object-cover w-full " src={cardImg} alt="cfd" />
      <hr className="w-full text-[#E3AD4B] " />
      <div className="p-2.5 flex flex-col justify-center">
        <Link
          href={"/"}
          className="text-lg font-['poppins-light'] font-bold text-[#00354E] after:content-['_↗']">
          {cardTitle}
        </Link>
        <p className="text-xs text-shadow-xs font-['poppins-light'] font-medium text-[#00354E] ">
          {cardSubtitle}
        </p>
      </div>
    </div>
  );
}
