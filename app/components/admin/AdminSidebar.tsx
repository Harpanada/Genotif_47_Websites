"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/components/admin/LogoutButton";
import { useState } from "react";
import LinkNav from "@/app/components/main/nav/LinkNav";
import { motion } from "motion/react";
import Image from "next/image";
import AnimatedSection from "@/app/components/animation/AnimatedSection";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "▦",
    duration: 0.6,
  },
  {
    label: "Pendaftaran",
    href: "/admin/pendaftaran",
    icon: "♙",
    duration: 0.7,
  },
  {
    label: "Pembayaran",
    href: "/admin/pembayaran",
    icon: "▤",
    duration: 0.8,
  },
];

// export default function AdminSidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="flex w-64 flex-col bg-[#00354E] text-white  h-screen fixed translate-full ">
//       <div className="border-b border-white/10 px-6 py-7">
//         <p className="text-xl font-bold tracking-wide">GENOTIF</p>
//         <p className="mt-1 text-xs text-white/60">Administration Panel</p>
//       </div>

//       <nav className="flex-1 space-y-2 px-3 py-6">
//         <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
//           Menu Utama
//         </p>

//         {navigation.map((item) => {
//           const active =
//             item.href === "/admin"
//               ? pathname === "/admin"
//               : pathname.startsWith(item.href);

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
//                 active
//                   ? "bg-[#30B5D8] text-[#00354E]"
//                   : "text-white/75 hover:bg-white/10 hover:text-white"
//               }`}>
//               <span className="w-5 text-center text-lg" aria-hidden="true">
//                 {item.icon}
//               </span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>
//       <LogoutButton />
//       <div className="border-t border-white/10 p-5">
//         <p className="text-xs text-white/50">Genotif · Admin</p>
//         <p className="mt-1 text-xs text-white/40">SMA Negeri 1 Ciranjang</p>
//       </div>
//     </aside>
//   );
// }

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50  p-5  shadow-sm  h-20   flex flex-row  justify-between items-center transition-all ease-in-out duration-200 bg-[#00354E] `}>
        <div
          className={` transition-all duration-300 ease-in-out ${isOpen ? " " : ""}`}>
          <Image
            width={50}
            height={50}
            alt="logo-G47"
            src={"/icon/g47Logo.png"}></Image>
          {/* <h1 className=" text-xl md:text-2xl text-[#00354E] font-extrabold font-['Telma-Medium']">
                Genotif
              </h1> */}
        </div>{" "}
        <div className=" hidden lg:flex justify-center items-center text-lg gap-10 mr-5   text-white font-['body-regular'] font-bold">
          {navigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-[#30B5D8] text-[#00354E]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}>
                <span className="w-5 text-center text-lg" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
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

      {/* Menu Mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`z-40 bg-[#00354E] w-2/3 p-3 fixed h-screen transition-all ease-in-ou duration-500 shadow-2xl ${isOpen ? "right-0" : "-right-full"} `}>
        {navigation.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <motion.div
              key={item.duration}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 100 }}
              transition={{ duration: item.duration, ease: "easeOut" }}
              className={`justify-center flex items-center gap-5  rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#30B5D8] text-[#00354E]"
                  : "text-white hover:bg-white/10 hover:text-white"
              }`}>
              <Link key={item.href} href={item.href}>
                <span className="w-5 text-center text-lg" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
        <div className="flex items-end justify-center  h-2/3">
          <div className="">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Overllay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`z-30 w-full h-screen fixed top-0 transition-all ease-in-out  duration-1000  ${isOpen ? "" : "hidden"}`}></div>
    </>
  );
}
