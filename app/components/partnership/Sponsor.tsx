import List from "./elments/List";
import CardOne from "./elments/Card_1";
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
    <section className=" flex flex-col items-center gap-10">
      <div className="flex flex-col gap-2 text-balance text-[#00354E]">
        <h1 className="font-['Telma-Medium'] text-5xl  text-shadow-lg ">
          Become A Sponsor
        </h1>
        <p className="text-md font-['poppins-light'] font-bold">
          Sponsors keep the tents standing and the lanterns lit. Choose a rank
          and be named among the founders of the realm.
        </p>
        <div className="text-sm ml-7 flex flex-col w-full  ">
          <List txtContain="Logo placement across event banners, print, and social assets" />
          <List txtContain="Guest passes for your representatives" />
          <List txtContain="Stage recognition during opening and closing ceremonies" />
          <List txtContain="Direct access to 1,500+ students," />
        </div>
      </div>
      <CardOne
        tier="The Squire"
        price="Rp 2.5M"
        benefits={squire_benefits}
        link="/"
        linkTitle="SEND A RAVEN"></CardOne>
      <CardOne
        tier="The Knight"
        price="Rp 7.5M"
        benefits={knight_benefits}
        link="/"
        linkTitle="SEND A RAVEN"></CardOne>

      <CardOne
        tier="The Sovereign"
        price="Rp 15M"
        benefits={sovereign_benefits}
        link="/"
        linkTitle="SEND A RAVEN"
        customCls="border-3"></CardOne>
    </section>
  );
}
