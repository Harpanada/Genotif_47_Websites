"use client";
import { motion } from "motion/react";
import Link from "next/link";
export default function AnimatedButton({
  children,
  customStyle,
  stiffness = 250,
  dampling = 15,
  link = "/",
}: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: stiffness, damping: dampling }}
      className={customStyle}>
      <Link href={link}>{children}</Link>
    </motion.button>
  );
}
