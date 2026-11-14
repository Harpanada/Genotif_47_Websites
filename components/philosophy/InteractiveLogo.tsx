"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { philosophyElements } from "@/data/philosopy";
import PhilosophyDetail from "./PhilosophyDetail";

// ======================================================
// PHILOSOPHY CONFIGURATION
// ======================================================

const philosophyOptions = [
  { id: "edelweiss", label: "Edelweiss" },
  { id: "petals", label: "Seven Petals" },
  { id: "blade", label: "The Blade" },
  { id: "flow", label: "The Flow" },
  { id: "center", label: "The Center" },
  { id: "colors", label: "The Colors" },
] as const;

type PhilosophyId = (typeof philosophyOptions)[number]["id"];

// ======================================================
// LOGO LAYERS CONFIGURATION
// ======================================================

type LogoLayer = {
  id: string;
  name: string;

  // Masukkan path gambar di sini
  src: string;

  // Filosofi yang berhubungan dengan layer ini
  philosophies: PhilosophyId[];

  // Urutan penumpukan gambar
  zIndex: number;
};

const logoLayers: LogoLayer[] = [
  {
    id: "layer-01",
    name: "Logo Layer 01",
    src: "/content/philosophy/enchanted-edelweiss.png", // TODO: Masukkan path gambar
    philosophies: ["edelweiss"],
    zIndex: 1,
  },
  {
    id: "layer-02",
    name: "Logo Layer 02",
    src: "/content/philosophy/branch1.png",
    philosophies: ["edelweiss", "blade", "colors"],
    zIndex: 2,
  },
  {
    id: "layer-03",
    name: "Logo Layer 03",
    src: "/content/philosophy/branch2.png",
    philosophies: ["blade", "edelweiss"],
    zIndex: 3,
  },
  {
    id: "layer-04",
    name: "Logo Layer 04",
    src: "/content/philosophy/petals1.png",
    philosophies: ["petals", "edelweiss"],
    zIndex: 4,
  },
  {
    id: "layer-05",
    name: "Logo Layer 05",
    src: "/content/philosophy/blade_1.png",
    philosophies: ["blade", "edelweiss"],
    zIndex: 5,
  },
  {
    id: "layer-06",
    name: "Logo Layer 06",
    src: "/content/philosophy/blade_2.png",
    philosophies: ["blade", "edelweiss", "flow", "colors"],
    zIndex: 6,
  },
  {
    id: "layer-07",
    name: "Logo Layer 07",
    src: "/content/philosophy/petals2.png",
    philosophies: ["edelweiss", "petals", "colors"],
    zIndex: 7,
  },
  {
    id: "layer-08",
    name: "Logo Layer 08",
    src: "/content/philosophy/petals3.png",
    philosophies: ["petals", "edelweiss"],
    zIndex: 8,
  },
  {
    id: "layer-09",
    name: "Logo Layer 09",
    src: "/content/philosophy/petals4.png",
    philosophies: ["petals", "edelweiss"],
    zIndex: 9,
  },
  {
    id: "layer-10",
    name: "Logo Layer 10",
    src: "/content/philosophy/center.png",
    philosophies: ["center", "edelweiss"],
    zIndex: 10,
  },
  {
    id: "layer-11",
    name: "Logo Layer 11",
    src: "/content/philosophy/petals5.png",
    philosophies: ["petals", "edelweiss"],
    zIndex: 11,
  },
  {
    id: "layer-12",
    name: "Logo Layer 12",
    src: "/content/philosophy/petals6.png",
    philosophies: ["petals", "edelweiss"],
    zIndex: 12,
  },
  {
    id: "layer-13",
    name: "Logo Layer 13",
    src: "/content/philosophy/petals7.png",
    philosophies: ["petals", "edelweiss"],
    zIndex: 12,
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function InteractiveLogo() {
  const [selectedId, setSelectedId] = useState<PhilosophyId>("edelweiss");

  const reduceMotion = useReducedMotion();

  const selectedElement = philosophyElements.find(
    (element) => element.id === selectedId,
  );

  if (!selectedElement) return null;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
      {/* ================================================
          INTERACTIVE LOGO
      ================================================= */}

      <div className="mx-auto w-full max-w-162.5">
        {/* LOGO CANVAS */}

        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#073B57]">
          {logoLayers.map((layer) => {
            const active = layer.philosophies.includes(selectedId);

            // Skip image rendering until a source is provided
            if (!layer.src) return null;

            return (
              <motion.div
                key={layer.id}
                className="absolute inset-0"
                style={{
                  zIndex: layer.zIndex,
                }}
                initial={false}
                animate={{
                  filter: active ? "brightness(1)" : "brightness(0.3)",
                  opacity: active ? 1 : 0.65,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}>
                <Image
                  src={layer.src}
                  alt={layer.name}
                  fill
                  priority={layer.zIndex === 1}
                  sizes="(max-width: 1024px) 100vw, 650px"
                  className="object-contain p-3"
                />
              </motion.div>
            );
          })}
        </div>

        {/* INSTRUCTION */}

        <p className="mt-4 text-center text-xs font-[body-medium] uppercase tracking-[.18em] text-[#638195]">
          Select an element to explore its meaning
        </p>

        {/* PHILOSOPHY SELECTOR */}

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {philosophyOptions.map((option) => {
            const active = selectedId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-xs font-[body-medium] transition ${
                  active
                    ? "border-[#087EAC] bg-[#087EAC] text-white"
                    : "border-[#BDD8E4] bg-white text-[#315B72] hover:bg-[#E5F5FB]"
                }`}>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================
          PHILOSOPHY DETAIL
      ================================================= */}

      <div>
        <PhilosophyDetail element={selectedElement} />
      </div>
    </div>
  );
}
