"use client";

import { motion } from "motion/react";

export default function PhilosophyExperience() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#EAF6FC] text-[#00354E]">
      {/* HERO */}
      <section
        id="hero"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D9F0FF] via-[#EAF6FC] to-[#EAF6FC]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10">
          <h1 className="font-['Telma-Bold'] text-5xl text-[#30B5D8] sm:text-7xl md:text-9xl">
            FILOSOFI
          </h1>

          <h2 className="mt-2 font-['Telma-Bold'] text-2xl tracking-widest text-[#D69A35] md:text-4xl">
            GENOTIF 47
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#315B72] md:text-lg">
            Three Generations. One Journey. Everlasting Memories.
          </p>
        </motion.div>

        <a
          href="#story"
          className="relative z-10 mt-12 rounded-full border border-[#7BBBD4] px-6 py-3 text-sm font-bold text-[#176487] transition hover:bg-white/70">
          Discover Our Story ↓
        </a>
      </section>

      {/* STORY */}
      <section id="story" className="min-h-[70vh] px-6 py-28 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#D69A35]">
            01 / Our Identity
          </p>

          <h2 className="mt-5 max-w-3xl font-['Telma-Bold'] text-4xl text-[#087EAC] md:text-6xl">
            The Enchanted Edelweiss
          </h2>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#42677B]">
            GENOTIF 47 direpresentasikan melalui perpaduan bunga edelweis,
            bilah, kelopak, serta gelombang warna sebagai simbol perubahan,
            keberanian, pertumbuhan, dan kebersamaan yang menjadi kenangan
            abadi.
          </p>
        </div>
      </section>

      {/* INTERACTIVE LOGO */}
      <section
        id="logo"
        className="min-h-screen bg-white/60 px-6 py-28 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#D69A35]">
            02 / Logo Anatomy
          </p>

          <h2 className="mt-5 font-['Telma-Bold'] text-4xl text-[#087EAC] md:text-6xl">
            Every Element Has A Story
          </h2>

          <p className="mt-5 max-w-2xl text-[#527489]">
            Explore the philosophy behind every element of the Genotif 47 logo.
          </p>

          {/* Interactive logo will be implemented here */}
          <div className="mt-16 flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-[#91BFD1]">
            <p className="text-center text-sm text-[#6C95A8]">
              Interactive Logo Component
              <br />
              Coming in the next stage
            </p>
          </div>
        </div>
      </section>

      {/* FOUR FOUNDATIONS */}
      <section id="foundation" className="min-h-[70vh] px-6 py-28 md:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#D69A35]">
            03 / The Foundation
          </p>

          <h2 className="mt-5 font-['Telma-Bold'] text-4xl text-[#087EAC] md:text-6xl">
            Four Cores, One Foundation
          </h2>
        </div>
      </section>

      {/* CLOSING */}
      <section
        id="closing"
        className="flex min-h-[65vh] items-center justify-center bg-[#073B57] px-6 py-28 text-center text-white">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#8EDDF3]">
            GENOTIF 47
          </p>

          <h2 className="mt-8 font-['Telma-Bold'] text-4xl leading-tight md:text-6xl">
            Three Generations.
            <br />
            One Journey.
            <br />
            Everlasting Memories.
          </h2>
        </div>
      </section>
    </div>
  );
}
