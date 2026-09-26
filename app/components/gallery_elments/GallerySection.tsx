import GalleryCard from "./GalleryCard";
export default function GallerySection() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center  justify-center mt-20 mb-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1cr_079m7Qy6J8sSKVXbkEJm-siaq3BUu"
          imageSrc={"/gallery/g2.jpg"}
          cardTtl="Genotif 46"
          cardYear="2026"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1iXHE3W4APDb3zPFIVCE__Ma4OY4rB-8x"
          imageSrc={"/gallery/g3.jpg"}
          cardTtl="Genotif 45"
          cardYear="2025"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1BiGD6mRnmM0FwkZgu51RN049nZgc3Im9"
          imageSrc={"/gallery/g4.jpg"}
          cardTtl="Genotif 44"
          cardYear="2024"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1TM2Ko8GItiM4_C9aCMWZJjVrn3jyxsQk"
          imageSrc={"/gallery/g5.jpg"}
          cardTtl="Genotif 43"
          cardYear="2023"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/1oB3odQI-eB0DNv1WzcEn3y2SBQdQM-Sv"
          imageSrc={"/gallery/g6.jpg"}
          cardTtl="Genotif 42"
          cardYear="2022"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
        <GalleryCard
          linkDoc="https://drive.google.com/drive/folders/14C0H54EksHj0yO8LBqGRSlrsiEjFE4Dw"
          imageSrc={"/gallery/g1.jpg"}
          cardTtl="Genotif 40"
          cardYear="2020"
          cardSbttl="Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur."
        />
      </div>
    </div>
  );
}
