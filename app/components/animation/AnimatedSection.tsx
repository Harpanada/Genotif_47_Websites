"use client";
import { motion } from "motion/react";

export default function AnimatedSection({
  children,
  ease = "easeIn",
  duration = 0,
  direction_y = 0,
  direction_x = 0,
  customStyle = "",
}: any) {
  return (
    <motion.section
      className={customStyle}
      initial={{ opacity: 0, y: direction_y, x: direction_x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: duration, ease: ease }}
      viewport={{ once: true }}>
      {children}
    </motion.section>
  );
}
