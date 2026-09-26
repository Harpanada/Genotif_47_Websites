"use client";
import GalleryCard from "./GalleryCard";
import { motion } from "motion/react";
interface GalleryItem {
  link: string;
  img: string;
  ttl: string;
  year: string;
  sbttl: string;
}
const contain: GalleryItem[] = [
  {
    link: "https://drive.google.com/drive/folders/14C0H54EksHj0yO8LBqGRSlrsiEjFE4Dw",
    img: "/gallery/g1.jpg",
    ttl: "Genotif 40",
    year: "2020",
    sbttl:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur.",
  },
  {
    link: "https://drive.google.com/drive/folders/1oB3odQI-eB0DNv1WzcEn3y2SBQdQM-Sv",
    img: "/gallery/g6.jpg",
    ttl: "Genotif 42",
    year: "2022",
    sbttl:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur.",
  },
  {
    link: "https://drive.google.com/drive/folders/1TM2Ko8GItiM4_C9aCMWZJjVrn3jyxsQk",
    img: "/gallery/g5.jpg",
    ttl: "Genotif 43",
    year: "2023",
    sbttl:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur.",
  },
  {
    link: "https://drive.google.com/drive/folders/1BiGD6mRnmM0FwkZgu51RN049nZgc3Im9",
    img: "/gallery/g4.jpg",
    ttl: "Genotif 44",
    year: "2024",
    sbttl:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur.",
  },
  {
    link: "https://drive.google.com/drive/folders/1iXHE3W4APDb3zPFIVCE__Ma4OY4rB-8x",
    img: "/gallery/g3.jpg",
    ttl: "Genotif 45",
    year: "2025",
    sbttl:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur.",
  },
  {
    link: "https://drive.google.com/drive/folders/1cr_079m7Qy6J8sSKVXbkEJm-siaq3BUu",
    img: "/gallery/g2.jpg",
    ttl: "Genotif 46",
    year: "2026",
    sbttl:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, consequuntur.",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
};
const item_animation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function GallerySection() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center  justify-center mt-20 mb-10">
      <motion.div
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}>
        {contain
          .slice()
          .reverse()
          .map((item) => (
            <motion.div key={item.link} variants={item_animation}>
              <GalleryCard
                linkDoc={item.link}
                imageSrc={item.img}
                cardTtl={item.ttl}
                cardYear={item.year}
                cardSbttl={item.sbttl}
              />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
}
