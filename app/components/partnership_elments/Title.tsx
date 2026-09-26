"use client";

import { motion } from "motion/react";
import { hidden } from "next/dist/lib/picocolors";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Title({ ttl, paragraph, lst }: any) {
  return (
    <div className="flex flex-col   gap-2 text-balance text-[#00354E] p-5">
      <motion.h1
        className="font-['Telma-Medium'] text-4xl md:text-5xl  text-shadow-lg "
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}>
        {ttl}
      </motion.h1>
      <motion.p
        className="font-['poppins-light'] text-sm font-bold md:text-xl md:w-3/4  "
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        viewport={{ once: true }}>
        {paragraph}
      </motion.p>
      <div className="ml-7 flex flex-col w-full ">
        <motion.ul
          className="flex flex-col  w-full text-left gap-1"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {lst.map((benefit: any, index: any) => (
            <motion.li
              key={index}
              className="font-[poppins-light] text-[#74EEEE] text-sm list-disc ml-5 text-shadow-2xs"
              variants={item}>
              <p className="text-[#00354E] ">{benefit}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
