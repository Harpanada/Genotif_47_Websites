import Link from "next/link";
export default function About() {
  return (
    <section className="-translate-y-10 rounded-t-4xl bg-linear-to-b   bg-white w-full  flex flex-col p-5  items-center text-center">
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg">
        More About Genotif
      </h1>
      <p className="text-[#00354E] text-sm  font-['poppins-light'] text-shadow-xs p-5">
        Genotif aims to provide a platform for students at SMA Negeri 1
        Ciranjang to develop their talents and creative ideas, which are
        showcased in the school's largest annual event—an event that
        consistently demonstrates innovation from year to year.
      </p>
      <p className="text-[#00354E] text-sm  font-['poppins-light'] text-shadow-xs p-5">
        This 47th genotype takes the ABCD theme. to blah blah blah
      </p>
      <div className="flex flex-col gap-4">
        <Link
          href="/components/gallery"
          className="after:content-['_↗'] font-['poppins-medium'] text-sm flex bg-[#00354E] backdrop-blur-md border shadow-sm ring-[#BAE0E2] w-44 h-12 text-center items-center justify-center p-2 text-white rounded-full">
          VISIT THE GALLERY
        </Link>
        <Link
          href={"/"}
          className="font-['poppins-medium'] text-xs flex bg-white/60 backdrop-blur-md border shadow-sm border-[#BAE0E2] w-44 h-12 text-center items-center justify-center p-2 text-[#00354E] rounded-full">
          THEME
        </Link>
      </div>
    </section>
  );
}
