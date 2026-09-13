import Link from "next/link";
export default function CardOne({
  tier,
  price,
  benefits,
  link,
  linkTitle,
  customCls = "",
}: any) {
  return (
    <section
      className={`flex flex-col  gap-4 p-4 w-64 min-h-64 rounded-2xl border  ${customCls} border-[#E3AD4B] bg-white shadow-lg shadow-[#94E5FF] `}>
      <div className="font-['Telma-medium'] text-shadow-2xs ">
        {" "}
        <h1 className="text-4xl text-[#00354E]">{tier}</h1>
        <h2 className="text-3xl text-[#E3AD4B]">{price}</h2>
      </div>

      <ul className="flex flex-col  w-full text-left gap-1">
        {benefits.map((benefit: any, index: any) => (
          <li
            key={index}
            className="font-[poppins-light] text-[#74EEEE] text-sm list-disc ml-5 text-shadow-2xs">
            <p className="text-[#00354E] ">{benefit}</p>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center w-full text-white font-['poppins-light'] font-black mb-3">
        <Link
          className=" flex items-center justify-center text-center bg-[#00354E] rounded-full w-56 h-9 p-5 text-sm"
          href={link}>
          {linkTitle}
        </Link>
      </div>
    </section>
  );
}
