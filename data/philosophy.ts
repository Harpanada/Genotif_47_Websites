export const philosophyElements = [
  {
    id: "edelweiss",
    number: "01",
    title: "Edelweiss",
    subtitle: "Growth & Everlasting Memories",
    description:
      "Edelweiss menjadi simbol perjalanan Genotif 47 yang penuh proses, tantangan, dan pertumbuhan. Bunga ini merepresentasikan kenangan yang tetap hidup setelah setiap perjalanan selesai.",
    color: "#8EDDF3",
  },
  {
    id: "center",
    number: "02",
    title: "The Center",
    subtitle: "Four Cores, One Foundation",
    description:
      "Titik temu dari empat fondasi utama: nilai, keberanian, kebersamaan, dan kenangan. Keempatnya menjaga keutuhan identitas dari satu generasi ke generasi berikutnya.",
    color: "#F0AC2D",
  },
  {
    id: "petals",
    number: "03",
    title: "Seven Petals",
    subtitle: "Seven Steps, One Journey",
    description:
      "Tujuh kelopak merepresentasikan tahapan perjalanan yang beragam. Setiap individu memiliki prosesnya sendiri, tetapi semuanya tetap menyatu dalam satu tujuan.",
    color: "#30B5D8",
  },
  {
    id: "amber",
    number: "04",
    title: "Amber",
    subtitle: "Warmth, Wisdom & Optimism",
    description:
      "Warna amber melambangkan kehangatan, kebijaksanaan, optimisme, dan kewaspadaan. Energinya memberi kesan matang sekaligus nyaman dalam perjalanan.",
    color: "#F0AC2D",
  },
  {
    id: "blade",
    number: "05",
    title: "The Blade",
    subtitle: "Courage to Move Forward",
    description:
      "Bentuk bilah menjadi simbol keberanian, keteguhan prinsip, dan tekad untuk terus bergerak maju ketika menghadapi berbagai tantangan.",
    color: "#713A83",
  },
  {
    id: "flow",
    number: "06",
    title: "The Flow",
    subtitle: "The Current of Change",
    description:
      "Aliran bentuk menggambarkan dinamika perubahan dan fase-fase kehidupan yang bergerak dalam satu kesatuan perjalanan yang utuh.",
    color: "#E98A54",
  },
  {
    id: "purple",
    number: "07",
    title: "Imperial Purple",
    subtitle: "Dignity, Ambition & Legacy",
    description:
      "Imperial Purple menjadi simbol kemewahan, martabat, dan ambisi. Warna ini dahulu identik dengan kaum bangsawan dan merepresentasikan cita-cita yang tinggi.",
    color: "#713A83",
  },
  {
    id: "cyan",
    number: "08",
    title: "Cyan",
    subtitle: "Transformation & Clarity",
    description:
      "Cyan merepresentasikan transformasi, kejernihan batin, dan kebebasan. Ia menjadi titik temu antara luasnya wawasan dan pembaruan jiwa.",
    color: "#30B5D8",
  },
] as const;

export type PhilosophyElementId = (typeof philosophyElements)[number]["id"];
