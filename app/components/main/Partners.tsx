export default function Partners() {
  const sponsors = [
    "./partners/sponsors/0.svg",
    "./partners/sponsors/1.svg",
    "./partners/sponsors/2.svg",
  ];
  const medpart = [
    "./partners/medpart/6.svg",
    "./partners/medpart/7.svg",
    "./partners/medpart/8.svg",
  ];
  const tenants = [
    "./partners/tenants/3.svg",
    "./partners/tenants/4.svg",
    "./partners/tenants/5.svg",
  ];

  return (
    <section className="w-full min-h-screen flex flex-col items-center overflow-hidden bg-transparent">
      {/* Sponsors */}
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-3xl p-5 text-shadow-lg whitespace-nowrap">
        Sponsors
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
      {/* Medpart */}
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-3xl p-5 text-shadow-lg whitespace-nowrap">
        Media Partner
      </h1>
      <div className="flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Track 1 */}
        <div className="animate-marquee flex items-center gap-20 shrink-0 pr-2 h-36">
          {medpart.map((item, index) => (
            <img
              key={`1-${index}`}
              className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg whitespace-nowrap h-72"
              src={item}></img>
          ))}
        </div>

        {/* Track 2 (Duplikat untuk efek seamless/tanpa putus) */}
        <div
          className="animate-marquee flex items-center gap-20 shrink-0 pr-20 h-36"
          aria-hidden="true">
          {medpart.map((item, index) => (
            <img
              key={`2-${index}`}
              className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg whitespace-nowrap h-72"
              src={item}></img>
          ))}
        </div>
      </div>
      {/* Tenants */}
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-3xl p-5 text-shadow-lg whitespace-nowrap">
        Tenants
      </h1>
      <div className="flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Track 1 */}
        <div className="animate-marquee flex items-center gap-20 shrink-0 pr-2 h-36">
          {tenants.map((item, index) => (
            <img
              key={`1-${index}`}
              className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg whitespace-nowrap h-72"
              src={item}></img>
          ))}
        </div>

        {/* Track 2 (Duplikat untuk efek seamless/tanpa putus) */}
        <div
          className="animate-marquee flex items-center gap-20 shrink-0 pr-20 h-36"
          aria-hidden="true">
          {tenants.map((item, index) => (
            <img
              key={`2-${index}`}
              className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg whitespace-nowrap h-72"
              src={item}></img>
          ))}
        </div>
      </div>
    </section>
  );
}
