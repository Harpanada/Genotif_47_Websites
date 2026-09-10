import Navbar from "@/app/components/main/Navbar";
import Footer from "@/app/components/main/Footer";
import GalleryCard from "./GalleryCard";
export default function Gallery() {
  return (
    <section className="scroll-smooth flex flex-col  min-w-screen bg-[#e4f3f6] min-h-screen   overflow-hidden ">
      <Navbar />
      <h1 className="absolute top-44 font-['Telma-Bold']  w-full text-5xl text-center text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3] z-10 p-5">
        Hall of Memories
      </h1>
      <div className="bg-[url(/content/hero-edelweiss.jpg)] min-h-screen bg-no-repeat w-auto bg-cover bg-center z-0 bg-fixed"></div>
      <div className="absolute bottom-0 left-0 w-full h-32  bg-linear-to-b from-transparent to-[#e4f3f6] pointer-events-none "></div>
      <div className="w-full min-h-screen flex flex-col items-center gap-5 justify-center mt-20 mb-10">
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1cr_079m7Qy6J8sSKVXbkEJm-siaq3BUu"
          imageSrc={"/gallery/gallery2.jpg"}
          cardTtl="Genotif 46"
          cardYear="2026"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1iXHE3W4APDb3zPFIVCE__Ma4OY4rB-8x"
          imageSrc={"/gallery/gallery3.jpg"}
          cardTtl="Genotif 45"
          cardYear="2025"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1BiGD6mRnmM0FwkZgu51RN049nZgc3Im9"
          imageSrc={"/gallery/gallery4.jpg"}
          cardTtl="Genotif 44"
          cardYear="2024"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1TM2Ko8GItiM4_C9aCMWZJjVrn3jyxsQk"
          imageSrc={"/gallery/gallery5.jpg"}
          cardTtl="Genotif 43"
          cardYear="2023"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1oB3odQI-eB0DNv1WzcEn3y2SBQdQM-Sv"
          imageSrc={"/gallery/gallery6.jpg"}
          cardTtl="Genotif 42"
          cardYear="2022"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/14C0H54EksHj0yO8LBqGRSlrsiEjFE4Dw"
          imageSrc={"/gallery/gallery1.jpg"}
          cardTtl="Genotif 40"
          cardYear="2020"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
      </div>

      <Footer />
    </section>
  );
}
