import Link from "next/link";
import Image from "next/image";
export default function Card({ cardTitle, cardSubtitle, cardImg }: any) {
  return (
    <div className=" w-72 h-72 lg:w-80 lg:h-80 flex flex-col border text-left  items-center  border-[#E3AD4B]  rounded-2xl bg-white/50  shadow-lg overflow-hidden">
      <div className="h-1/2 w-full relative">
        <Image fill src={cardImg} alt={cardTitle} className="object-cover   " />
      </div>
      <hr className="w-full text-[#E3AD4B] " />
      <div className="p-2.5 flex flex-col justify-center">
        <Link
          href={"/"}
          className="text-lg font-['body-medium'] font-bold text-[#00354E] after:content-['_↗'] lg:text-xl"
        >
          {cardTitle}
        </Link>
        <p className="text-xs text-shadow-xs font-['body-regular'] font-medium text-[#00354E] lg:text-sm">
          {cardSubtitle}
        </p>
      </div>
    </div>
  );
}
