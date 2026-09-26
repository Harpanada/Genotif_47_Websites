import List from "./List";
import CardOne from "./Card_1";
export default function Sponsor() {
  const squire_benefits = [
    "Logo on the event banner",
    "Social media mention",
    "2 guest passes",
  ];
  const knight_benefits = [
    "Booth at the magic market",
    "Logo on all print media",
    "Stage shout-outs",
    "6 guest passes",
  ];
  const sovereign_benefits = [
    "Title sponsor naming",
    "Main stage backdrop",
    "Opening ceremony speech",
    "15 guest passes",
  ];
  return (
    <section className=" flex flex-col md:flex-row gap-6 justify-center items-center ">
      <div className=" ">
        <CardOne
          tier="The Squire"
          customCls="gap-7"
          price="Rp 2.5M"
          benefits={squire_benefits}
          link="/"
          linkTitle="SEND A RAVEN"></CardOne>
      </div>
      <div className=" ">
        <CardOne
          tier="The Knight"
          price="Rp 7.5M"
          benefits={knight_benefits}
          link="/"
          linkTitle="SEND A RAVEN"></CardOne>
      </div>
      <div className=" ">
        <CardOne
          tier="The Sovereign"
          price="Rp 15M"
          benefits={sovereign_benefits}
          link="/"
          linkTitle="SEND A RAVEN"
          customCls="border-3"></CardOne>
      </div>
    </section>
  );
}
