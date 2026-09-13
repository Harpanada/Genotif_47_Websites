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
    <section className="flex flex-col items-center gap-10">
      {" "}
      <div className="flex flex-col gap-2 text-balance text-[#00354E]">
        <h1 className="font-['Telma-Medium'] text-5xl  text-shadow-lg ">
          Media Partner
        </h1>
        <p className="text-md font-['poppins-light'] font-bold">
          Help carry the news of GENOTIF 47 across the realm. In return, your
          brand rides alongside the festival on banners, posts, and the main
          stage.
        </p>
        <div className="text-sm ml-7 flex flex-col w-full  ">
          <List
            txtContain="Official media partner badge on all print & digital assets
"
          />
          <List
            txtContain="Press access to opening and stage performances
"
          />
          <List txtContain="Co-branded content across GENOTIF social channels" />
          <List txtContain="Priority updates and behind-the-scenes coverage" />
        </div>
      </div>
      <CardTwo
        cardTtl="Town Crier"
        cardLink="/"
        give="3 feed posts + 5 stories"
        receive="Logo on digital flyer, 1 press pass"
        platfrom="Social Media"
      />
      <CardTwo
        cardTtl="Royal Scribe"
        cardLink="/"
        give="1 pre-event article + 1 recaps"
        receive="Logo on website, 2 press passes, interview slot"
        platfrom="Blog / Online Magazine"
      />
      <CardTwo
        cardTtl="Kingdom Herald"
        cardLink="/"
        give="On-air mentions + event coverage"
        receive="Title media partner credit, stage logo, 4 press passes"
        platfrom="Youtube Live / Podcast / Video"
      />
    </section>
  );
}
