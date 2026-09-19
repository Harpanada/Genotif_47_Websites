export default function Partners() {
  const sponsors = [
    "./partners/sponsors/0.svg",
    "./partners/sponsors/1.svg",
    "./partners/sponsors/2.svg",
    "./partners/medpart/6.svg",
    "./partners/medpart/7.svg",
    "./partners/medpart/8.svg",
    "./partners/tenants/3.svg",
    "./partners/tenants/4.svg",
    "./partners/tenants/5.svg",
  ];

  return (
    <section className="w-full  flex flex-col items-center overflow-hidden  p-5 gap-6 mt-10 ">
      {/* Sponsors */}
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-4xl md:text-5xl p-5 text-shadow-lg whitespace-nowrap">
        Our Partners
      </h1>
      <div className="flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Track 1 */}
        <div
          className="animate-marquee flex items-center gap-20 shrink-0 pr-20 h-36
        ">
          {sponsors.map((item, index) => (
            <img
              key={`1-${index}`}
              className="text-[#00354E] font-['Telma-Medium'] text-3xl p-5 text-shadow-lg whitespace-nowrap h-72"
              src={item}></img>
          ))}
        </div>

        {/* Track 2 (Duplikat untuk efek seamless/tanpa putus) */}
        <div
          className="animate-marquee flex items-center gap-20 shrink-0 pr-20 h-36"
          aria-hidden="true">
          {sponsors.map((item, index) => (
            <img
              key={`2-${index}`}
              className="text-[#00354E] font-['Telma-Medium'] text-3xl p-5 text-shadow-lg whitespace-nowrap h-72"
              src={item}></img>
          ))}
        </div>
      </div>
      <div className="w-full shadow-2xl bg-[#e4f3f6] h-5"></div>
    </section>
  );
}
