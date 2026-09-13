import List from "./elments/List";
import CardOne from "./elments/Card_1";

const stallBenf = ["1.5 × 1.5 m booth", "1 vendor pass", "Map listin"];
const pavBenef = ["2 × 2 m corner booth", "2 vendor passes", "Social feature"];
const guildBenef = [
  "3 × 3 m tent",
  "4 vendor passes",
  "Stage shout-out",
  "Banner logo",
];
export default function Tenant() {
  return (
    <section className="flex flex-col items-center gap-10">
      {" "}
      <div className="flex flex-col gap-2 text-balance text-[#00354E]">
        <h1 className="font-['Telma-Medium'] text-5xl  text-shadow-lg ">
          Become A Tenant
        </h1>
        <p className="text-md font-['poppins-light'] font-bold">
          Join GENOTIF as a tenant and reach over 1000 SMAN 1 Ciranjang
          students. Get a strategic spot, promotional support, and a lively
          atmosphere to grow your business.
        </p>
        <div className="text-sm ml-7 flex flex-col w-full  ">
          <List txtContain="Booth space at Genotif" />
          <List txtContain="Guest passes for your representatives" />
          <List txtContain="Stage recognition during opening and closing ceremonies" />
          <List txtContain="Direct access to 1,500+ students," />
        </div>
      </div>
      <CardOne
        tier="Market Stall"
        price="Rp 750K"
        benefits={stallBenf}
        link="/"
        linkTitle="RESERVE A BOOTH"></CardOne>
      <CardOne
        tier="Corner Pavilion"
        price="Rp 1.5M"
        benefits={pavBenef}
        link="/"
        linkTitle="RESERVE A BOOTH"></CardOne>
      <CardOne
        tier="Guild Tent"
        price="Rp 3M"
        benefits={guildBenef}
        link="/"
        linkTitle="RESERVE A BOOTH"></CardOne>
    </section>
  );
}
