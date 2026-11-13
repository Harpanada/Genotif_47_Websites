"use client";

import { motion, AnimatePresence } from "motion/react";
import type { PhilosophyElement } from "@/data/philosopy";

interface PhilosophyDetailProps {
  element: PhilosophyElement;
}

export default function PhilosophyDetail({ element }: PhilosophyDetailProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={element.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-live="polite"
        className="rounded-3xl border border-[#D7EAF2] bg-white p-7 shadow-[0_20px_60px_rgba(18,91,122,.08)] sm:p-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-[.2em] text-[#91B5C5]">
            {element.number}
          </span>

          <span className="h-px flex-1 bg-[#D7EAF2]" />

          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: element.color }}
          />
        </div>

        <h3 className="mt-8 font-['Telma-Bold'] text-4xl text-[#00354E] sm:text-5xl">
          {element.title}
        </h3>

        <p className="mt-3 text-sm font-[body-bold] uppercase tracking-[.12em] text-[#D39A3C]">
          {element.subtitle}
        </p>

        <p className="mt-7 font-[body-medium] leading-8 text-[#42677B]">
          {element.description}
        </p>

        {element.colors && (
          <div className="mt-9 space-y-4">
            <h4 className="text-xs font-[body-bold] uppercase tracking-[.2em] text-[#7595A5]">
              Explore the spectrum
            </h4>

            <div className="grid gap-3 sm:grid-cols-3">
              {element.colors.map((color) => (
                <div
                  key={color.id}
                  className="rounded-2xl border border-[#E1EDF2] p-4">
                  <div
                    className="mb-4 h-2 w-full rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />

                  <h5 className="font-[body-bold] text-[#174F6A]">
                    {color.name}
                  </h5>

                  <p className="mt-2 font-[body-medium] text-sm leading-6 text-[#638195]">
                    {color.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.article>
    </AnimatePresence>
  );
}
