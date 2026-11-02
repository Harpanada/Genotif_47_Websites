import List from "./List";
import CardOne from "./Card_1";

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
    <section className="flex flex-col md:flex-row gap-6 justify-center items-center">
      <div className="">
        <CardOne
          tier="Market Stall"
          price="Rp 750K"
          customCls="gap-9"
          benefits={stallBenf}
          link="/"
          linkTitle="RESERVE A BOOTH"></CardOne>
      </div>
      <div className="">
        {" "}
        <CardOne
          tier="Corner Pavilion"
          price="Rp 1.5M"
          benefits={pavBenef}
          link="/"
          linkTitle="RESERVE A BOOTH"></CardOne>
      </div>
      <div className="">
        <CardOne
          tier="Guild Tent"
          price="Rp 3M"
          customCls="gap-6 border-3"
          benefits={guildBenef}
          link="/"
          linkTitle="RESERVE A BOOTH"></CardOne>
      </div>
    </section>
  );
}
