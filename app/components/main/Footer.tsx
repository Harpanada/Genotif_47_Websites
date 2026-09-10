import LinkNav from "@/app/components/main/nav/LinkNav";
export default function Footer() {
  return (
    <footer className="min-w-screen bg-[#00354E] flex flex-col justify-center items-center p-10 gap-4  shadow-lg">
      <h1 className="text-white font-['Telma-Regular'] text-2xl">Genotif 47</h1>
      <section className="flex gap-3">
        <div className="flex w-10 rounded-full h-10 bg-white p-2.5">
          <img src="/icon//Instagram_Glyph_Black.svg" alt="" />
        </div>
        <div className="flex w-10 rounded-full h-10 bg-white p-1.5">
          <img src="/icon/TIKTOK_SIMPLIFIED_NOTE_BLACK.svg" alt="" />
        </div>
        <div className=" w-10 rounded-full h-10 bg-white p-0.5 ">
          <img
            className="translate-y-0.5"
            src="/icon//yt_icon_almostblack_digital.png"
            alt=""
          />
        </div>
      </section>
      <hr className="w-3/4 text-white" />
      <nav className="flex flex-col  justify-center items-center text-center">
        <ul className=" flex  gap-4  text-white font-light">
          <LinkNav contain={"Home"} linkInput="/"></LinkNav>
          <LinkNav contain={"Theme"} linkInput="/"></LinkNav>
          <LinkNav contain={"Merch"} linkInput="/"></LinkNav>
          <LinkNav contain={"Contact"} linkInput="/"></LinkNav>
        </ul>
      </nav>

      <div className="text-white justify-center flex flex-col items-center text-center">
        <small className=" ">
          ©Copyright 2026 GENOTIF 47, part of
          <a
            href="https://sman1ciranjang.sch.id/#"
            className="underline underline-offset-4 after:content-['_↗']">
            {" "}
            SMAN 1 CIRANJANG
          </a>
        </small>
        <small className="text-[10px]">
          {" "}
          Designed & Developed by Liyovan Harpanada | DKD 47
        </small>
      </div>
    </footer>
  );
}
