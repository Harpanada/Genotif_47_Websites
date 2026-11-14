export interface PhilosophyColor {
  id: string;
  name: string;
  description: string;
  hex: string;
}

export interface PhilosophyElement {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  colors?: PhilosophyColor[];
}

export const philosophyElements: PhilosophyElement[] = [
  {
    id: "edelweiss",
    number: "01",
    title: "Edelweiss",
    subtitle: "Symbol of Growth & Everlasting Memories",
    description:
      "Edelweis menjadi elemen utama karena mempresentasikan perjalanan Genotif 47 yang penuh proses, tantangan, dan pertumbuhan.",
    color: "#FFFFFF",
  },
  {
    id: "petals",
    number: "02",
    title: "Seven Petals",
    subtitle: "Seven Steps, One Journey",
    description:
      "Representasi tujuh tahapan perjalanan yang beragam dari setiap individu, namun tetap menyatu dalam satu tujuan.",
    color: "#30B5D8",
  },
  {
    id: "blade",
    number: "03",
    title: "The Blade",
    subtitle: "Courage to Move Forward",
    description:
      "Simbol keberanian, keteguhan prinsip, dan tekad untuk terus bergerak maju menghadapi berbagai tantangan.",
    color: "#713A83",
  },
  {
    id: "flow",
    number: "04",
    title: "The Flow",
    subtitle: "The Current of Change",
    description:
      "Gambaran dinamika perubahan dan fase-fase kehidupan yang mengalir dalam satu kesatuan perjalanan yang utuh.",
    color: "#E98A54",
  },
  {
    id: "center",
    number: "05",
    title: "The Center",
    subtitle: "Four Cores, One Foundation",
    description:
      "Titik temu dari empat fondasi utama, yaitu nilai, keberanian, kebersamaan, dan kenangan yang menjaga keutuhan identitas tiga generasi.",
    color: "#F0AC2D",
  },
  {
    id: "colors",
    number: "06",
    title: "The Colors",
    subtitle: "A Spectrum of the Journey",
    description:
      "Spektrum warna yang merepresentasikan kehangatan, martabat, dan transformasi dari setiap suasana perjalanan.",
    color: "#30B5D8",
    colors: [
      {
        id: "amber",
        name: "Amber",
        description:
          "Melambangkan kehangatan, kebijaksanaan, optimisme, dan kewaspadaan yang memberikan energi matang serta nyaman.",
        hex: "#F0AC2D",
      },
      {
        id: "imperial-purple",
        name: "Imperial Purple",
        description:
          "Menjadi simbol kemewahan, martabat, dan ambisi yang dahulu identik dengan kaum bangsawan tertinggi.",
        hex: "#713A83",
      },
      {
        id: "cyan",
        name: "Cyan",
        description:
          "Merepresentasikan transformasi, kejernihan batin, dan kebebasan sebagai titik temu antara luasnya wawasan dan pembaruan jiwa.",
        hex: "#30B5D8",
      },
    ],
  },
];

export const coreFoundations = [
  { id: "values", number: "01", title: "Nilai" },
  { id: "courage", number: "02", title: "Keberanian" },
  { id: "togetherness", number: "03", title: "Kebersamaan" },
  { id: "memories", number: "04", title: "Kenangan" },
] as const;

export const philosophyIdentity = {
  title: "The Enchanted Edelweiss",
  tagline: "Three Generations. One Journey. Everlasting Memories.",
  description:
    "GENOTIF 47 direpresentasikan melalui perpaduan bunga edelweis, bilah, kelopak, serta gelombang warna sebagai simbol perubahan, keberanian, pertumbuhan, dan kebersamaan yang menjadi kenangan abadi.",
};
