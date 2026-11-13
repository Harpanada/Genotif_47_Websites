import type { Metadata } from "next";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import PhilosophyExperience from "@/components/philosophy/PhilosophyExperience";

export const metadata: Metadata = {
  title: "The Enchanted Edelweiss | GENOTIF 47",
  description:
    "Discover the philosophy behind GENOTIF 47. Three Generations. One Journey. Everlasting Memories.",
};

export default function PhilosophyPage() {
  return (
    <>
      <Navbar />

      <main>
        <PhilosophyExperience />
      </main>

      <Footer />
    </>
  );
}
