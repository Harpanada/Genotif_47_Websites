"use client";
import { useState } from "react";
import LinkNav from "@/app/components/main/nav/LinkNav";
import { motion } from "motion/react";
import AnimatedSection from "@/app/components/animation/AnimatedSection";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AnimatedSection ease={"easeInOut"} duration={0.8} direction_y={-20}>
        <nav
          className={`fixed top-0 right-0 left-0 z-50  border-white  h-16 m-6  rounded-full flex flex-row p-8 justify-between items-center transition-all ease-in-out duration-200  ${isOpen ? "" : " bg-white/50 border backdrop-blur-xs shadow-xs   "} `}>
          <div
            className={`transition-all duration-300 ease-in-out ${isOpen ? "opacity-0 " : ""}`}>
            <h1 className=" text-xl md:text-2xl text-[#00354E] font-extrabold font-['Telma-Medium']">
              Genotif
            </h1>
          </div>{" "}
          <ul className=" hidden lg:flex justify-center items-center text-lg gap-10 mr-5   text-[#00354E] font-['poppins-light'] font-bold">
            <LinkNav contain={"Home"} linkInput="/"></LinkNav>
            <LinkNav contain={"Theme"} linkInput="/"></LinkNav>
            <LinkNav contain={"Gallery"} linkInput="/gallery"></LinkNav>
            <LinkNav contain={"Merch"} linkInput="/"></LinkNav>
            <LinkNav contain={"Partnership"} linkInput="/partnership"></LinkNav>
            <LinkNav contain={"Contact"} linkInput="/contact"></LinkNav>
          </ul>
          {/*  Hamburger Button */}
          <div
            className={` lg:hidden w-18 h-8 rounded-full p-2 flex items-center justify-center ${isOpen ? " " : "bg-[#00354E] "} `}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="hamburgerBtn"
              className={`z-50 flex w-6 flex-col gap-1 hover:cursor-pointer  ${isOpen ? "relative z-20" : ""}`}>
              {/* Line 1 */}
              <span
                className={`h-0.5 w-full origin-left rounded-full bg-white transition-all duration-500 ${isOpen ? "rotate-45 translate-x-1.25 -translate-y-px" : ""}`}></span>
              {/* Line 2 */}
              <span
                className={`h-0.5 w-full rounded-full bg-white transition-all duration-500 ${isOpen ? "opacity-0 scale-x-0" : ""}`}></span>
              {/* Line 3 */}
              <span
                className={`h-0.5 w-full origin-left rounded-full bg-white transition-all duration-500 ${isOpen ? "-rotate-45 translate-x-1.25 translate-y-1" : ""}`}></span>
            </button>
          </div>
        </nav>
      </AnimatedSection>
      {/* Menu Mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`z-40 bg-[#00354E] w-2/3  fixed min-h-screen transition-all ease-in-ou duration-500 shadow-2xl ${isOpen ? "right-0" : "-right-full"} `}>
        <ul className=" flex flex-col p-20 mt-8 gap-8  items-center text-white font-['poppins-light'] font-extrabold">
          <motion.button
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}>
            <LinkNav contain={"Home"} linkInput="/"></LinkNav>
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}>
            <LinkNav contain={"Theme"} linkInput="/"></LinkNav>
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <LinkNav contain={"Gallery"} linkInput="/gallery"></LinkNav>
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 70 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}>
            <LinkNav contain={"Merch"} linkInput="/"></LinkNav>
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 90 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}>
            <LinkNav contain={"Partnership"} linkInput="/partnership"></LinkNav>
          </motion.button>
          <motion.button
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <LinkNav contain={"Contact"} linkInput="/contact"></LinkNav>
          </motion.button>
        </ul>
      </div>

      {/* Overllay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`z-30 w-full h-screen bg-black/45 fixed top-0 transition-all ease-in-out  duration-1000  ${isOpen ? "" : "hidden"}`}></div>
    </>
  );
}
