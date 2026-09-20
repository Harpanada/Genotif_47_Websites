import List from "./elments/List";
import CardTwo from "./elments/Card_2";
import Link from "next/link";
import Card from "../main/news/Card";
const stallBenf = ["1.5 × 1.5 m booth", "1 vendor pass", "Map listin"];
const pavBenef = ["2 × 2 m corner booth", "2 vendor passes", "Social feature"];
const guildBenef = [
  "3 × 3 m tent",
  "4 vendor passes",
  "Stage shout-out",
  "Banner logo",
];
export default function MedPart() {
  return (
    <section className="flex flex-col md:flex-row gap-6 justify-center items-center">
      <CardTwo
        cardTtl="Town Crier"
        cardLink="/"
        give="3 feed posts + 5 stories"
        recieve="Logo on digital flyer, 1 press pass"
        platfrom="Social Media"
      />
      <CardTwo
        cardTtl="Royal Scribe"
        cardLink="/"
        give="1 pre-event article + 1 recaps"
        recieve="Logo on website, 2 press passes, interview slot "
        platfrom="Blog / Online Magazine"
      />
      <CardTwo
        cardTtl="Kingdom Herald"
        cardLink="/"
        give="On-air mentions + event coverage"
        recieve="Title media partner credit, stage logo, 4 press passes"
        platfrom="Youtube Live / Podcast / Video"
      />
    </section>
  );
}
