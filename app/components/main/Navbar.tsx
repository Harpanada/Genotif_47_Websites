"use client";

import { useState } from "react";
import LinkNav from "./nav/LinkNav";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50  border-white  h-16 m-6  rounded-full flex flex-row p-8 justify-between items-center   transition-all ease-in-out duration-200  ${isOpen ? "" : " bg-white/50 border backdrop-blur-xs shadow-xs   "} `}>
        <div className="">
          <h1 className=" text-xl text-[#00354E] font-extrabold font-['Telma-Regular']">
            Genotif
          </h1>
        </div>
        {/*  Hamburger Button */}

        <div
          className={`w-18 h-8 rounded-full p-2 flex items-center justify-center ${isOpen ? " " : "bg-[#00354E]"} `}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="hamburgerBtn"
            className={`z-50 flex w-6 flex-col gap-1 hover:cursor-pointer md:hidden ${isOpen ? "relative z-20" : ""}`}>
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
      {/* Menu Mobile */}
      <div
        className={` z-40 bg-[#00354E] w-2/3  fixed min-h-screen transition-all ease-in-ou duration-500 shadow-2xl ${isOpen ? "right-0" : "-right-full"} `}>
        <ul className=" flex flex-col p-20 mt-5 gap-8 items-center text-white">
          <LinkNav contain={"Home"} linkInput="/"></LinkNav>
          <LinkNav contain={"Theme"} linkInput="/"></LinkNav>
          <LinkNav contain={"Merch"} linkInput="/"></LinkNav>
          <LinkNav contain={"Contact"} linkInput="/"></LinkNav>
        </ul>
      </div>
      {/* Overllay */}
      <div
        className={`z-30 w-full h-screen bg-black/45 fixed top-0 transition-all ease-in-out  duration-1000  ${isOpen ? "" : "hidden"}`}></div>
    </>
  );
}
