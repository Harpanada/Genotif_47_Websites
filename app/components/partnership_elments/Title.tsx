export default function Title({ ttl, paragraph, lst }: any) {
  return (
    <div className="flex flex-col   gap-2 text-balance text-[#00354E] p-5">
      <h1 className="font-['Telma-Medium'] text-4xl md:text-5xl  text-shadow-lg ">
        {ttl}
      </h1>
      <p className="font-['poppins-light'] text-sm font-bold md:text-xl md:w-3/4  ">
        {paragraph}
      </p>
      <div className="ml-7 flex flex-col w-full ">
        <ul className="flex flex-col  w-full text-left gap-1">
          {lst.map((benefit: any, index: any) => (
            <li
              key={index}
              className="font-[poppins-light] text-[#74EEEE] text-sm list-disc ml-5 text-shadow-2xs">
              <p className="text-[#00354E] ">{benefit}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
